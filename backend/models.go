package main

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
	ID        int    `json:"id"`
	Name      string `json:"name"`
	Point     int    `json:"point"`
	HeadCount int    `json:"head_count"`
	EventID   int    `json:"event_id"`
}

type Teacher struct {
	ID           int    `json:"teacher_id"`
	Name         string `json:"teacher_name"`
	Email        string `json:"email"`
	Department   string `json:"department"`
	Position     string `json:"position"`
	ProfilePhoto string `json:"profile_photo"`
}

type Assignment struct {
	EventID   int `json:"event_id"`
	TeacherID int `json:"teacher_id"`
	RoleID    int `json:"role_id"`
}
