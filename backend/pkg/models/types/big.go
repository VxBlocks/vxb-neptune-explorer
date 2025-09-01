package types

import (
	"database/sql"
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"math/big"
)

type Big struct {
	value *big.Int
}

// MarshalJSON implements json.Marshaler.
func (b Big) MarshalJSON() ([]byte, error) {
	if b.value == nil {
		return []byte("null"), nil
	}
	return json.Marshal(b.value.String())
}

// UnmarshalJSON implements json.Unmarshaler.
func (b *Big) UnmarshalJSON(data []byte) error {
	if string(data) == "null" {
		b.value = nil
		return nil
	}

	var str string
	err := json.Unmarshal(data, &str)
	if err != nil {
		return err
	}
	b.value = new(big.Int)
	b.value.SetString(str, 10)
	return nil
}

func NewBigInt(integer *big.Int) Big {
	return Big{
		value: integer,
	}
}

func NewBigIntFromInt(value int64) Big {
	return Big{
		value: big.NewInt(value),
	}
}

// Scan implements the sql.Scanner interface for database deserialization.
func (b *Big) Scan(value any) error {
	return scanBigInt(value, &b.value)
}

// Value implements the driver.Valuer interface for database serialization.
func (b Big) Value() (driver.Value, error) {
	if b.value == nil {
		return sql.NullString{}, nil
	}
	return b.value.String(), nil
}

func (b Big) String() string {
	if b.value == nil {
		return "null"
	}
	return b.value.String()
}

func (b Big) Big() *big.Int {
	return b.value
}

func (b Big) Neg() Big {
	return Big{value: new(big.Int).Neg(b.value)}
}

var _ json.Marshaler = Big{}
var _ json.Unmarshaler = (*Big)(nil)

// UnmarshalText implements the encoding.TextUnmarshaler interface for XML
// deserialization.
func (b *Big) UnmarshalText(text []byte) error {
	b.value = new(big.Int)
	return b.value.UnmarshalText(text)
}

// MarshalText implements the encoding.TextMarshaler interface for XML
// serialization.
func (b Big) MarshalText() (text []byte, err error) {
	return b.value.MarshalText()
}

func NewU64(value *big.Int) uint64 {
	if value == nil {
		return 0
	}
	return value.Uint64()
}

func NewI64(value *big.Int) int64 {
	if value == nil {
		return 0
	}
	return value.Int64()
}

func scanBigInt(value any, b **big.Int) error {
	// first try to see if the data is stored in database as a Numeric datatype
	switch v := value.(type) {

	case float32:
		*b = big.NewInt(int64(v))
		return nil
	case float64:
		*b = big.NewInt(int64(v))
		return nil
	case int64:
		*b = big.NewInt(v)
		return nil
	case string:
		*b = new(big.Int)
		if _, ok := (*b).SetString(v, 10); !ok {
			return fmt.Errorf("unable to convert %s to big.Int", v)
		}
		return nil
	case []byte:
		*b = new(big.Int)
		(*b).SetBytes(v)
		return nil
	case nil:
		*b = nil
		return nil
	default:
		return fmt.Errorf("unsupported type %T", value)
	}
}
