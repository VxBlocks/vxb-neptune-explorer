package api

import (
	"context"
	"models"
	"strconv"
	"timescale"
)

// GetSearch implements StrictServerInterface.
func (s *Server) GetSearch(ctx context.Context, request GetSearchRequestObject) (GetSearchResponseObject, error) {
	if height, err := strconv.ParseInt(*request.Params.Q, 10, 64); err == nil {
		var block Blockitem
		if err := timescale.GetPostgresGormTypedDB(ctx, &models.Block{}).
			Select(
				"height as block", "digest as block_hash", "coinbase_amount as coinbase_reward", "fee",
				"num_inputs as inputs", "num_outputs as outputs", "difficulty as proof_target", "time",
			).
			Where("height = ?", height).Take(&block).Error; err == nil {
			return GetSearch200JSONResponse{
				Block: &block,
			}, nil
		}
	}

	if len(*request.Params.Q) == 80 {
		var block Blockitem
		if err := timescale.GetPostgresGormTypedDB(ctx, &models.Block{}).
			Select(
				"height as block", "digest as block_hash", "coinbase_amount as coinbase_reward", "fee",
				"num_inputs as inputs", "num_outputs as outputs", "difficulty as proof_target", "time",
			).
			Where("digest = ?", *request.Params.Q).Take(&block).Error; err == nil {
			return GetSearch200JSONResponse{
				Block: &block,
			}, nil
		}

		var tx TransactionListItem
		if err := timescale.GetPostgresGormTypedDB(ctx, &models.MemPoolTransaction{}).Where("id = ?", *request.Params.Q).Take(&tx).Error; err == nil {
			return GetSearch200JSONResponse{
				Transaction: &tx,
			}, nil
		}

		var txo Txo

		if err := timescale.GetPostgresGormTypedDB(ctx, &models.Outputs{}).Where("id = ?", *request.Params.Q).Take(&txo).Error; err == nil {
			return GetSearch200JSONResponse{
				Output: &txo,
			}, nil
		}

		if err := timescale.GetPostgresGormTypedDB(ctx, &models.Inputs{}).Where("id = ?", *request.Params.Q).Take(&txo).Error; err == nil {
			return GetSearch200JSONResponse{
				Input: &txo,
			}, nil
		}
	}

	return GetSearch200JSONResponse{}, nil
}
