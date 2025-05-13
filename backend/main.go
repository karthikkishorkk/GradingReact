package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"time"
)

func main() {
	InitDB()
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Routes
	r.POST("/events", CreateEvent)
	r.GET("/events", ListEvents)
	r.POST("/assign", AssignTeacherToRole)
	r.GET("/top-teachers", GetTopTeachers)
	r.POST("/teachers", CreateTeacher)
	r.GET("/events/:id", GetEventByID)
	r.PUT("/events/:id", UpdateEvent)
	r.POST("/roles", CreateRole)
	r.GET("/teachers", ListTeachers)
	r.GET("/roles/:id", GetRolesByEventID)

	r.POST("/signup", Signup)
	r.POST("/login", Login)

	r.Run(":8085")
}
