package api

import (
	"bytes"
	"context"
	_ "embed"
)

//go:embed api.json
var ApiJson []byte

// GetSwaggerJson implements StrictServerInterface.
func (s *Server) GetSwaggerJson(ctx context.Context, request GetSwaggerJsonRequestObject) (GetSwaggerJsonResponseObject, error) {
	body := bytes.NewBuffer(ApiJson)
	return GetSwaggerJson200AsteriskResponse{
		Body:          body,
		ContentType:   "application/json",
		ContentLength: int64(body.Len()),
	}, nil
}
