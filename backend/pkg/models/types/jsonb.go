package types

import (
	"database/sql/driver"
	"encoding/json"
)

type JsonSlice []any

func (p JsonSlice) Value() (driver.Value, error) {
	if p == nil {
		return "", nil
	}
	valueString, err := json.Marshal(p)
	return string(valueString), err
}

func (p *JsonSlice) Scan(value any) error {
	if err := json.Unmarshal(value.([]byte), p); err != nil {
		return err
	}
	return nil
}
