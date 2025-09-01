package types

import (
	"encoding/json"
	"fmt"
	"math"
	"math/big"
	"testing"

	"github.com/ysmood/got"
)

func TestBigTextUnMarshal(t *testing.T) {
	g := got.New(t)

	randint := int64(g.RandInt(1, math.MaxInt))

	bigNumber := big.NewInt(0).Add(big.NewInt(0).SetUint64(math.MaxUint64), big.NewInt(0).SetInt64(randint))

	tests := []struct {
		name    string
		want    Big
		args    string
		wantErr bool
	}{
		{
			name:    "zero",
			want:    Big{big.NewInt(0)},
			args:    "0",
			wantErr: false,
		},
		{
			name:    "null",
			want:    Big{},
			args:    `<nil>`,
			wantErr: false,
		},
		{
			name:    "number",
			want:    Big{big.NewInt(randint)},
			args:    fmt.Sprint(randint),
			wantErr: false,
		},
		{
			name:    "big number",
			want:    Big{bigNumber},
			args:    bigNumber.String(),
			wantErr: false,
		},
	}
	for _, tt := range tests {
		g.Run(tt.name, func(t got.G) {
			var b Big
			err := b.UnmarshalText([]byte(tt.args))
			g.Nil(err)
			g.Eq(tt.want, b)

			marshal, err := b.MarshalText()
			g.Nil(err)
			g.Eq(tt.args, marshal)
		})
	}
}

func TestBig_UnmarshalJSON(t *testing.T) {
	g := got.New(t)

	randint := int64(g.RandInt(1, math.MaxInt))

	bigNumber := big.NewInt(0).Add(big.NewInt(0).SetUint64(math.MaxUint64), big.NewInt(0).SetInt64(randint))

	tests := []struct {
		name    string
		want    Big
		args    []byte
		wantErr bool
	}{
		{
			name:    "zero",
			want:    Big{big.NewInt(0)},
			args:    []byte(`"0"`),
			wantErr: false,
		},
		{
			name:    "null",
			want:    Big{},
			args:    []byte(`null`),
			wantErr: false,
		},
		{
			name:    "number",
			want:    Big{big.NewInt(randint)},
			args:    []byte(fmt.Sprintf(`"%d"`, randint)),
			wantErr: false,
		},
		{
			name:    "big number",
			want:    Big{bigNumber},
			args:    []byte(fmt.Sprintf(`"%s"`, bigNumber.String())),
			wantErr: false,
		},
	}
	for _, tt := range tests {
		g.Run(tt.name, func(t got.G) {
			var b Big
			err := json.Unmarshal(tt.args, &b)
			g.Nil(err)
			g.Eq(tt.want, b)

			marshal, err := json.Marshal(b)
			g.Nil(err)
			g.Eq(tt.args, marshal)
		})
	}
}
