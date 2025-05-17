package main

import (
	"database/sql"
	_ "github.com/lib/pq"
	"log"
)

var db *sql.DB

func InitDB() {
	var err error
	db, err = sql.Open("postgres", "host=localhost port=5432 user=postgres password=postgres dbname=PdfGeneration sslmode=disable")
	if err != nil {
		log.Fatal("Error connecting to database:", err)
	}

	if err = db.Ping(); err != nil {
		log.Fatal("Database unreachable:", err)
	}

	log.Println("Database connected successfully")
}
