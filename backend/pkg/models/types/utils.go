package types

import (
	"fmt"
	"math/big"
	"strconv"
	"strings"
)

func HexaStringToI64(hexa string) (int64, error) {
	numberStr := strings.Replace(hexa, "0X", "", -1)
	numberStr = strings.Replace(numberStr, "0x", "", -1)
	t, err := strconv.ParseInt(numberStr, 16, 64)
	if err != nil {
		return 0, fmt.Errorf("parse hexa: %w", err)
	}
	return t, nil
}

func Deref[T any](s *T) T {
	if s == nil {
		return *new(T)
	}
	return *s
}

func Ptr[T any](s T) *T {
	return &s
}

func BigToInt(b *big.Int) int64 {
	if b == nil {
		return 0
	}
	return b.Int64()
}
