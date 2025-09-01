package api

import (
	"context"
	"models"
	"timescale"
)

// GetUtxoList implements StrictServerInterface.
func (s *Server) GetUtxoList(ctx context.Context, request GetUtxoListRequestObject) (GetUtxoListResponseObject, error) {

	var digests []UtxoDigest
	var count int64

	err := timescale.GetPostgresGormTypedDB(ctx, &models.UtxoDigest{}).
		Count(&count).
		Select("id", "digest").
		Scopes(ScopePagination(request.Params.Page, request.Params.PageSize)).
		Order("id desc").
		Find(&digests).Error

	if err != nil {
		return nil, err
	}

	return GetUtxoList200JSONResponse{
		Success: true,
		Utxos:   digests,
		Count:   count,
	}, nil
}

// GetTxList implements StrictServerInterface.
func (s *Server) GetTxList(ctx context.Context, request GetTxListRequestObject) (GetTxListResponseObject, error) {
	var txs []TransactionListItem
	var count int64

	err := timescale.GetPostgresGormTypedDB(ctx, &models.MemPoolTransaction{}).
		Count(&count).
		Scopes(ScopePagination(request.Params.Page, request.Params.PageSize)).
		Order("time desc").
		Find(&txs).Error

	if err != nil {
		return nil, err
	}

	return GetTxList200JSONResponse{
		Success: true,
		Txs:     txs,
		Count:   count,
	}, nil
}

// GetTxTxid implements StrictServerInterface.
func (s *Server) GetTxTxid(ctx context.Context, request GetTxTxidRequestObject) (GetTxTxidResponseObject, error) {
	var tx Transaction

	if err := timescale.GetPostgresGormTypedDB(ctx, &models.MemPoolTransaction{}).
		Where("id = ?", request.Txid).
		Take(&tx).Error; err != nil {
		return nil, err
	}

	if err := timescale.GetPostgresGormTypedDB(ctx, &models.Inputs{}).
		Where("txid = ?", request.Txid).
		Pluck("id", &tx.Inputs).Error; err != nil {
		return nil, err
	}

	if err := timescale.GetPostgresGormTypedDB(ctx, &models.Outputs{}).
		Where("txid = ?", request.Txid).
		Pluck("id", &tx.Outputs).Error; err != nil {
		return nil, err
	}

	return GetTxTxid200JSONResponse{
		Success: true,
		Tx:      tx,
	}, nil
}
