package main

import (
	"app/api"
	"encoding/json"
	"io"
	"log"
	"logger"
	"os"

	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

//go:generate go tool github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen --config=api/config.yaml api/api.yaml
func main() {
	gin.SetMode(gin.ReleaseMode)
	server := api.NewServer()

	r := gin.New()

	//f, _ := os.Create("gin.log")
	//gin.DefaultWriter = io.MultiWriter(f, os.Stdout)
	gin.DefaultWriter = io.Writer(os.Stdout)

	r.Use(gin.Logger())
	// cors
	corsConf := cors.DefaultConfig()
	corsConf.AllowCredentials = true
	corsConf.AllowOrigins = []string{"*"}
	corsConf.AllowHeaders = []string{"x-requested-with", "content-type", "authorization", "cache-control"}

	r.Use(cors.New(corsConf))

	r.Use(func(c *gin.Context) {
		c.Next()
		if len(c.Errors) != 0 {
			c.Header("Content-Type", "application/json")
			json.NewEncoder(c.Writer).Encode(gin.H{
				"success": false,
				"message": c.Errors.String(),
			})
			c.Abort()
		}
	})

	r.GET("/api/block/ws", api.BlockWebsocketHandler)
	go api.SubscribeBlock()
	go api.SubscribeMempool()

	api.RegisterHandlersWithOptions(r, api.NewStrictHandler(&server, nil), api.GinServerOptions{
		BaseURL: "/api",
		ErrorHandler: func(c *gin.Context, err error, statusCode int) {
			c.JSON(statusCode, gin.H{
				"success": false,
				"message": err.Error(),
			})
			c.Abort()
		},
	})

	// And we serve HTTP until the world ends.

	const addr = "0.0.0.0:8080"
	s := &http.Server{
		Handler: r,
		Addr:    addr,
	}

	logger.Info("starting server", "listen", addr)

	// And we serve HTTP until the world ends.
	log.Fatal(s.ListenAndServe())
}
