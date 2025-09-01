package api

import (
	"config"
	"context"
	"encoding/json"
	"fmt"
	"math/big"
	"models"
	"net/http"
	"time"
	"timescale"

	"gorm.io/gorm"
)

type Server struct {
	rpc models.NeptuneClient
}

// GetTransactionByHeightHeight implements StrictServerInterface.
func (s *Server) GetTransactionByHeightHeight(ctx context.Context, request GetTransactionByHeightHeightRequestObject) (GetTransactionByHeightHeightResponseObject, error) {
	var txs []TransactionListItem

	err := timescale.GetPostgresGormTypedDB(ctx, &models.MemPoolTransaction{}).
		Where("height = ?", request.Height).
		Scan(&txs).Error

	if err != nil {
		return nil, err
	}

	return GetTransactionByHeightHeight200JSONResponse{
		Success: true,
		Txs:     txs,
	}, nil

}

func NewServer() Server {
	return Server{
		rpc: *models.NewNepTuneClient(config.C.NeptuneRpc),
	}
}

var _ StrictServerInterface = (*Server)(nil)

type RpcBlockResp struct {
	block *models.Block
}

func (r RpcBlockResp) VisitGetRpcBlockHeightOrHashResponse(w http.ResponseWriter) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)

	return json.NewEncoder(w).Encode(r.block)
}

// GetRpcBlockHeight implements StrictServerInterface.
func (s *Server) GetRpcBlockHeightOrHash(ctx context.Context, request GetRpcBlockHeightOrHashRequestObject) (GetRpcBlockHeightOrHashResponseObject, error) {

	block, err := models.GetNeptuneClient().GetBlockByHash(ctx, request.HeightOrHash)
	if err != nil {
		return nil, err
	}
	return RpcBlockResp{block: models.BlockFromRpcType(block)}, nil
}

// GetBlockHeight implements StrictServerInterface.
func (s *Server) GetBlockHeight(ctx context.Context, request GetBlockHeightRequestObject) (GetBlockHeightResponseObject, error) {
	var block models.Block
	err := timescale.GetPostgresGormTypedDB(ctx, &models.Block{}).Where("height = ?", request.Height).Take(&block).Error
	if err != nil {
		return GetBlockHeight200JSONResponse{
			Success: false,
			Message: "Block not found",
		}, err
	}

	return GetBlockHeight200JSONResponse{
		Success: true,
		Detail: Blockcommon{
			Block:               block.Height,
			BlockCoinbaseReward: block.CoinbaseAmount.String(),
			BlockGas:            block.Fee.String(),
			BlockHash:           block.Digest,
			IsCanonical:         block.IsCanonical,
			Target:              block.Difficulty.String(),
			Time:                block.Time,
		},
	}, nil
}

// GetBlocks implements StrictServerInterface.
func (s *Server) GetBlocks(ctx context.Context, request GetBlocksRequestObject) (GetBlocksResponseObject, error) {

	var blocks []Blockitem
	var count int64

	err := timescale.GetPostgresGormTypedDB(ctx, &models.Block{}).
		Scopes(models.ScopeIsCanonical).
		Count(&count).
		Select(
			"height as block", "digest as block_hash", "coinbase_amount as coinbase_reward", "fee",
			"num_inputs as inputs", "num_outputs as outputs", "difficulty as proof_target", "time",
		).
		Scopes(ScopePagination(request.Params.Page, request.Params.PageSize)).
		Order("height desc").
		Find(&blocks).Error

	if err != nil {
		return nil, err
	}

	return GetBlocks200JSONResponse{
		Success: true,
		Blocks:  blocks,
		Count:   count,
	}, nil

}

// GetForks implements StrictServerInterface.
func (s *Server) GetForks(ctx context.Context, request GetForksRequestObject) (GetForksResponseObject, error) {

	var blocks []Blockitem
	var count int64

	err := timescale.GetPostgresGormTypedDB(ctx, &models.Block{}).
		Scopes(models.ScopeIsFork).
		Count(&count).
		Select(
			"height as block", "digest as block_hash", "coinbase_amount as coinbase_reward", "fee",
			"num_inputs as inputs", "num_outputs as outputs", "difficulty as proof_target", "time",
		).
		Scopes(ScopePagination(request.Params.Page, request.Params.PageSize)).
		Order("height desc").
		Find(&blocks).Error

	if err != nil {
		return nil, err
	}

	return GetForks200JSONResponse{
		Success: true,
		Blocks:  blocks,
		Count:   count,
	}, nil

}

// GetOverview implements StrictServerInterface.
func (s *Server) GetOverview(ctx context.Context, request GetOverviewRequestObject) (GetOverviewResponseObject, error) {

	var block models.Block
	err := timescale.GetPostgresGormTypedDB(ctx, &models.Block{}).Order("height desc").Limit(1).Take(&block).Error
	if err != nil {
		return nil, fmt.Errorf("get latest block: %w", err)
	}

	reward, err := models.ReadSum(timescale.GetPostgresGormDB(), models.SumKeyReward)
	if err != nil {
		return nil, fmt.Errorf("get reward sum: %w", err)
	}

	fee, err := models.ReadSum(timescale.GetPostgresGormDB(), models.SumKeyFee)
	if err != nil {
		return nil, fmt.Errorf("get fee sum: %w", err)
	}

	var block_144_ago models.Block
	var dist_144 int64 = 144
	if block.Height < dist_144 {
		dist_144 = block.Height
	}

	err = timescale.GetPostgresGormTypedDB(ctx, &models.Block{}).Where("height = ?", block.Height-dist_144).Take(&block_144_ago).Error
	if err != nil {
		return nil, fmt.Errorf("get latest block: %w", err)
	}

	day_speed := big.NewInt(0).Sub(block.CumulativeProofOfWork.Big(), block_144_ago.CumulativeProofOfWork.Big())
	day_speed = day_speed.Div(day_speed, big.NewInt(block.Time.Unix()-block_144_ago.Time.Unix()))
	block_time := float64(block.Time.Unix()-block_144_ago.Time.Unix()) / float64(dist_144-1)

	var utxo_count int64

	if err := timescale.GetPostgresGormTypedDB(ctx, &models.UtxoDigest{}).Count(&utxo_count).Error; err != nil {
		return nil, fmt.Errorf("get utxo count: %w", err)
	}

	var dayReward struct {
		Reward string
		Fee    string
	}

	if err := timescale.GetPostgresGormTypedDB(ctx, &models.Block{}).
		Scopes(models.ScopeIsCanonical).
		Select("sum(coinbase_amount) as reward", "sum(fee) as fee").
		Where("time > ?", timescale.HoursAgo(time.Now(), 24)).
		Take(&dayReward).Error; err != nil {
		return nil, fmt.Errorf("get day reward: %w", err)
	}

	var txcount int64
	if err := timescale.GetPostgresGormTypedDB(ctx, &models.MemPoolTransaction{}).Where("height != 0").Count(&txcount).Error; err != nil {
		return nil, fmt.Errorf("get utxo count: %w", err)
	}

	return GetOverview200JSONResponse{
		Overview: Overview{
			BlockHash:             block.Digest,
			Height:                block.Height,
			ProofTarget:           block.Difficulty.String(),
			Timestamp:             block.Time.Format(time.RFC1123),
			TotalReward:           reward.String(),
			TotalFee:              fee.String(),
			NetworkSpeed24h:       day_speed.String(),
			AverageBlockTime:      float32(block_time),
			UtxoCount:             utxo_count,
			DayReward:             dayReward.Reward,
			DayFee:                dayReward.Fee,
			CumulativeProofOfWork: block.CumulativeProofOfWork.String(),
			TxCount:               txcount,
		},
	}, nil
}

func ScopePagination(page, pageSize int) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		if pageSize == 0 {
			pageSize = 10
		}
		if pageSize > 100 {
			pageSize = 100
		}

		return db.Offset(pageSize * page).Limit(pageSize)
	}
}
