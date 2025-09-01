package main

import (
	"fetch"
	"fmt"
	"models"
	"os"
	"timescale"
)

func main() {
	if len(os.Args) > 1 && os.Args[1] == "drop" {
		drop_tables()
		return
	}
	chain := models.NewEthChain()
	// fetch.FetchBlock(&chain, 1361633, 1361643, false)
	fetch.RunLiveSource(&chain)
	fetch.ConcurrentFetchBlock(&chain, 0, -1, false)
}

func drop_tables() {

	var tables []struct {
		Tablename string `gorm:"column:tablename"`
	}
	err := timescale.GetPostgresGormDB().Table("pg_tables").Where("schemaname = 'public'").Scan(&tables).Error
	if err != nil {
		panic(err)
	}

	for _, table := range tables {
		drop(table.Tablename)
	}

}

func drop(table string) {
	err := timescale.GetPostgresGormDB().Exec(fmt.Sprintf(`DROP TABLE IF EXISTS "%s"`, table)).Error
	if err != nil {
		panic(err)
	}
}
