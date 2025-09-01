package types

import (
	"bytes"
	"database/sql/driver"
	"io"

	"github.com/icza/huffman/hufio"
)

type Compressed []byte

func Compress(input []byte) ([]byte, error) {
	buf := &bytes.Buffer{}
	w := hufio.NewWriter(buf)
	_, err := w.Write(input)
	if err != nil {
		return nil, err
	}
	err = w.Close()
	if err != nil {
		return nil, err
	}
	return buf.Bytes(), nil

}

func Decompress(input []byte) ([]byte, error) {
	r := hufio.NewReader(bytes.NewReader(input))
	res, err := io.ReadAll(r)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func (c Compressed) Value() (driver.Value, error) {
	return Compress(c)
}

func (c *Compressed) Scan(value interface{}) error {

	restored, err := Decompress(value.([]byte))
	if err != nil {
		return err
	}
	*c = restored

	return nil
}
