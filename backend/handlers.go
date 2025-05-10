package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

func CreateEvent(c *gin.Context) {
	var event Event
	if err := c.ShouldBindJSON(&event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	query := `INSERT INTO Event (event_name, start_date, start_time, end_date, end_time, event_description)
              VALUES ($1, $2, $3, $4, $5, $6) RETURNING event_id`
	err := db.QueryRow(query, event.Name, event.StartDate, event.StartTime, event.EndDate, event.EndTime, event.Description).Scan(&event.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, event)
}

func ListEvents(c *gin.Context) {
	rows, err := db.Query(`SELECT event_id, event_name, start_date, start_time, end_date, end_time, event_description FROM Event`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var events []Event
	for rows.Next() {
		var event Event
		if err := rows.Scan(&event.ID, &event.Name, &event.StartDate, &event.StartTime, &event.EndDate, &event.EndTime, &event.Description); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		events = append(events, event)
	}

	c.JSON(http.StatusOK, events)
}

// GET /events/:id
func GetEventByID(c *gin.Context) {
	id := c.Param("id")
	var event Event
	err := db.QueryRow(`SELECT event_id, event_name, start_date, start_time, end_date, end_time, event_description FROM Event WHERE event_id = $1`, id).Scan(
		&event.ID, &event.Name, &event.StartDate, &event.StartTime, &event.EndDate, &event.EndTime, &event.Description)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Event not found"})
		return
	}
	c.JSON(http.StatusOK, event)
}

// PUT /events/:id
func UpdateEvent(c *gin.Context) {
	id := c.Param("id")
	var event Event
	if err := c.ShouldBindJSON(&event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := db.Exec(`UPDATE Event SET event_name=$1, start_date=$2, start_time=$3, end_date=$4, end_time=$5, event_description=$6 WHERE event_id=$7`,
		event.Name, event.StartDate, event.StartTime, event.EndDate, event.EndTime, event.Description, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Event updated successfully"})
}

func AssignTeacherToRole(c *gin.Context) {
	var assignment Assignment
	if err := c.ShouldBindJSON(&assignment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	query := `INSERT INTO TeacherAssignment (event_id, teacher_id, role_id)
              VALUES ($1, $2, $3)`
	_, err := db.Exec(query, assignment.EventID, assignment.TeacherID, assignment.RoleID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "Teacher assigned successfully"})
}

func GetTopTeachers(c *gin.Context) {
	query := `
        SELECT 
            t.teacher_id, 
            t.teacher_name,
            COALESCE(SUM(r.role_point), 0) as total_points
        FROM Teacher t
        LEFT JOIN TeacherAssignment ta ON t.teacher_id = ta.teacher_id
        LEFT JOIN Role r ON ta.role_id = r.role_id
        GROUP BY t.teacher_id, t.teacher_name
        ORDER BY total_points DESC
        LIMIT 10;
    `

	rows, err := db.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	type TopTeacher struct {
		ID     int    `json:"id"`
		Name   string `json:"teacher_name"`
		Points int    `json:"points"`
	}

	var teachers []TopTeacher

	for rows.Next() {
		var t TopTeacher
		if err := rows.Scan(&t.ID, &t.Name, &t.Points); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		teachers = append(teachers, t)
	}

	c.JSON(http.StatusOK, teachers)
}

func CreateTeacher(c *gin.Context) {
	var teacher Teacher
	if err := c.ShouldBindJSON(&teacher); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	query := `INSERT INTO Teacher (teacher_name, email, department, position, profile_photo)
              VALUES ($1, $2, $3, $4, $5) RETURNING teacher_id`
	var teacherID int
	err := db.QueryRow(query, teacher.Name, teacher.Email, teacher.Department, teacher.Position, teacher.ProfilePhoto).Scan(&teacherID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	teacher.ID = teacherID
	c.JSON(http.StatusOK, teacher)
}

func CreateRole(c *gin.Context) {
	var role Role
	if err := c.ShouldBindJSON(&role); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	query := `INSERT INTO Role (role_name, role_point, role_headcount, event_id)
			  VALUES ($1, $2, $3, $4) RETURNING role_id`

	err := db.QueryRow(query, role.Name, role.Point, role.HeadCount, role.EventID).Scan(&role.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, role)
}

func ListTeachers(c *gin.Context) {
	rows, err := db.Query(`SELECT teacher_id, teacher_name, email, department, position, profile_photo FROM Teacher`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var teachers []Teacher
	for rows.Next() {
		var t Teacher
		if err := rows.Scan(&t.ID, &t.Name, &t.Email, &t.Department, &t.Position, &t.ProfilePhoto); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		teachers = append(teachers, t)
	}

	c.JSON(http.StatusOK, teachers)
}

func GetRolesByEventID(c *gin.Context) {
	eventID := c.Param("id") // expects route /roles/:id
	if eventID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "event_id is required"})
		return
	}

	rows, err := db.Query(`SELECT role_id, role_name, role_point, role_headcount FROM Role WHERE event_id = $1`, eventID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var roles []Role
	for rows.Next() {
		var role Role
		if err := rows.Scan(&role.ID, &role.Name, &role.Point, &role.HeadCount); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		roles = append(roles, role)
	}

	c.JSON(http.StatusOK, roles)
}
