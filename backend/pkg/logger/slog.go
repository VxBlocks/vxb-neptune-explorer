package logger

import (
	"log/slog"
	"os"

	"github.com/charmbracelet/log"
)

func init() {
	Debug("logger initializing")
	logger := log.Default()
	if level, err := log.ParseLevel(os.Getenv("GOLOG")); err == nil {
		logger.SetLevel(level)
	}
	log.SetDefault(logger)
	slog.SetDefault(slog.New(logger))
	Debug("logger initialized")
}

func Debug(msg string, args ...any) {
	log.Debug(msg, args...)
}

func Error(msg string, args ...any) {
	log.Error(msg, args...)
}

func Info(msg string, args ...any) {
	log.Info(msg, args...)
}

func Warn(msg string, args ...any) {
	log.Warn(msg, args...)
}

func Fatal(msg string, args ...any) {
	log.Fatal(msg, args...)
}
