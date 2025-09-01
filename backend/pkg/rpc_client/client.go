package rpc_client

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/ybbus/jsonrpc/v3"
)

func CallJsonRpc[T any](rpcClient jsonrpc.RPCClient, ctx context.Context, method string, args ...any) (T, error) {
	var result T
	res, err := rpcClient.Call(ctx, method, args...)
	if err != nil {
		return result, fmt.Errorf("call rpc %s: %w", method, err)
	}
	err = res.GetObject(&result)
	if err != nil {
		return result, fmt.Errorf("get rpc result: %w", err)
	}
	return result, nil
}

type RestRpcClient struct {
	client  http.Client
	BaseUrl string
}

func NewRestRpcClient(baseUrl string) *RestRpcClient {
	return &RestRpcClient{
		client:  http.Client{},
		BaseUrl: baseUrl,
	}
}

func (c *RestRpcClient) Call(ctx context.Context, path string, result any) error {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, c.BaseUrl+path, nil)
	if err != nil {
		return err
	}

	resp, err := c.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("status code: %d", resp.StatusCode)
	}

	return json.NewDecoder(resp.Body).Decode(result)
}
