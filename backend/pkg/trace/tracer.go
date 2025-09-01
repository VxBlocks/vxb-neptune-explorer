package trace

import (
	"context"
	"os"

	"github.com/gin-gonic/gin"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	"go.opentelemetry.io/otel/trace"
)

var Tracer = otel.Tracer("")

var EnableTrace = false

func init() {
	if os.Getenv("OTEL_EXPORTER_OTLP_ENDPOINT") != "" {
		EnableTrace = true
		ConfigureOpentelemetry(context.Background())
	}
}
func ConfigureOpentelemetry(ctx context.Context) {
	provider := sdktrace.NewTracerProvider()
	otel.SetTracerProvider(provider)

	exp, err := otlptracehttp.New(ctx)
	if err != nil {
		panic(err)
	}

	bsp := sdktrace.NewBatchSpanProcessor(exp)
	provider.RegisterSpanProcessor(bsp)

}

func StartTrace(c *gin.Context) (context.Context, Endable) {
	if !EnableTrace {
		return c, noopSpan{}
	}

	return Tracer.Start(c, c.FullPath())
}

type Endable interface {
	End(options ...trace.SpanEndOption)
}

type noopSpan struct {
}

func (noopSpan) End(options ...trace.SpanEndOption) {
}
