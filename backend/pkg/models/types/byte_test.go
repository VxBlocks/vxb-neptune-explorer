package types

import (
	"testing"

	"github.com/ysmood/got"
)

func TestCompress(t *testing.T) {
	g := got.New(t)

	data := []byte("111111111111111111111111")

	compress, _ := Compress(data)
	g.Log("compressed", compress, len(data), "=>", len(compress))

	g.Lt(len(compress), len(data))

	restored, _ := Decompress(compress)

	g.Log("restored")

	g.Eq(restored, data)
}
