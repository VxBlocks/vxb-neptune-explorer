package timescale

import "fmt"

func ToJsTime(field, tofield string) string {
	return fmt.Sprintf("to_char(%s, 'Dy, DD Mon YYYY HH24:MI:SS TZ') as %s", field, tofield)
}
