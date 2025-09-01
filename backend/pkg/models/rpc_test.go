package models

import (
	"math"
	"rpc_client"
	"testing"

	"github.com/ysmood/got"
)

func TestGetBlockByHeightNull(t *testing.T) {
	g := got.New(t)
	client := &NeptuneClient{
		client: rpc_client.NewRestRpcClient("http://127.0.0.1:9800"),
	}
	block, err := client.GetBlockByHeight(g.Context(), math.MaxInt64)
	if err != nil {
		panic(err)
	}
	g.Eq(block, nil)
}

func TestGetBlockByHeight(t *testing.T) {
	g := got.New(t)
	client := &NeptuneClient{
		client: rpc_client.NewRestRpcClient("http://127.0.0.1:9800"),
	}
	block, err := client.GetBlockByHeight(g.Context(), 1)
	if err != nil {
		panic(err)
	}
	g.Eq(block.Height, int64(1))
}

func TestGetUtxoDigestNull(t *testing.T) {
	g := got.New(t)
	client := &NeptuneClient{
		client: rpc_client.NewRestRpcClient("http://127.0.0.1:9800"),
	}
	utxo, err := client.GetUtxoDigest(g.Context(), math.MaxInt64)
	if err != nil {
		panic(err)
	}
	g.Eq(utxo, "")
}
