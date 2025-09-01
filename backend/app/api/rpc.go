package api

import (
	"context"
	"fmt"
	"models"
	"net/http"
)

// GetRpcPowPuzzle implements StrictServerInterface.
func (s *Server) GetRpcPowPuzzle(ctx context.Context, request GetRpcPowPuzzleRequestObject) (GetRpcPowPuzzleResponseObject, error) {
	body, err := http.Get(fmt.Sprintf("%s/rpc/pow_puzzle", models.GetNeptuneClient().BaseUrl()))

	return GetRpcPowPuzzle200AsteriskResponse{
		Body:          body.Body,
		ContentType:   "application/json",
		ContentLength: body.ContentLength,
	}, err
}
