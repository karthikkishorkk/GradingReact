package main

type Department struct {
	ID   int    `json:"department_id"`
	Name string `json:"department_name"`
}

type User struct {
	ID       int    `json:"user_id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

type Teacher struct {
	ID           int    `json:"teacher_id"`
	Name         string `json:"teacher_name"`
	Email        string `json:"email"`
	DepartmentID int    `json:"department_id"`
	ProfilePhoto string `json:"profile_photo"`
	UserID       int    `json:"user_id"`
}

type Event struct {
	ID          int    `json:"event_id"`
	Name        string `json:"event_name"`
	StartDate   string `json:"start_date"`
	StartTime   string `json:"start_time"`
	EndDate     string `json:"end_date"`
	EndTime     string `json:"end_time"`
	Description string `json:"event_description"`
}

type Role struct {
	ID        int    `json:"role_id"`
	Name      string `json:"role_name"`
	Point     int    `json:"role_point"`
	HeadCount int    `json:"role_headcount"`
	EventID   int    `json:"event_id"`
}

type Assignment struct {
	EventID   int `json:"event_id"`
	TeacherID int `json:"teacher_id"`
	RoleID    int `json:"role_id"`
}
