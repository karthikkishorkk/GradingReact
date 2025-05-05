# Database

---

# 🎯 PostgreSQL `CREATE TABLE` Statements

```sql
-- 1. Event Table
CREATE TABLE Event (
    event_id SERIAL PRIMARY KEY,
    event_name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_date DATE NOT NULL,
    end_time TIME NOT NULL,
    event_description TEXT
);

-- 2. Role Table
CREATE TABLE Role (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL,
    role_point INT NOT NULL,
    role_headcount INT NOT NULL,
    event_id INT NOT NULL,
    FOREIGN KEY (event_id) REFERENCES Event(event_id) ON DELETE CASCADE
);

-- 3. Teacher Table
CREATE TABLE Teacher (
    teacher_id SERIAL PRIMARY KEY,
    teacher_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(100),
    position VARCHAR(100),
    profile_photo VARCHAR(255)
);

-- 4. TeacherAssignment Table
CREATE TABLE TeacherAssignment (
    event_id INT NOT NULL,
    teacher_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (event_id, teacher_id),
    FOREIGN KEY (event_id) REFERENCES Event(event_id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES Teacher(teacher_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES Role(role_id) ON DELETE CASCADE
);

```

---

# 📌 Notes:

- `SERIAL` auto-generates an integer ID (like auto-increment).
- Foreign keys ensure **referential integrity** between tables.
- `ON DELETE CASCADE` makes sure that if an Event, Role, or Teacher is deleted, all related assignments will automatically be deleted too.
- Composite primary key on `(event_id, teacher_id)` in `TeacherAssignment` ensures **one role per teacher per event**.

---

# ⚡ Bonus: Example Insert Queries

```sql
-- Insert an Event
INSERT INTO Event (event_name, start_date, start_time, end_date, end_time, event_description)
VALUES ('TechFest 2025', '2025-08-15', '09:00', '2025-08-15', '17:00', 'Annual Technology Festival');

-- Insert a Role
INSERT INTO Role (role_name, role_point, role_headcount, event_id)
VALUES ('Coordinator', 50, 5, 1);

-- Insert a Teacher
INSERT INTO Teacher (teacher_name, email, department, position, profile_photo)
VALUES ('Dr. John Doe', 'john.doe@example.com', 'Computer Science', 'Professor', 'john_doe.jpg');

-- Assign Teacher to Role
INSERT INTO TeacherAssignment (event_id, teacher_id, role_id)
VALUES (1, 1, 1);

```

---

# ✨ Step 1: Insert 15 Events

---

```sql
-- Insert 15 Events
INSERT INTO Event (event_name, start_date, start_time, end_date, end_time, event_description) VALUES
('Tech Conference', '2025-05-01', '09:00', '2025-05-01', '17:00', 'Annual technology event.'),
('Science Expo', '2025-06-10', '10:00', '2025-06-10', '16:00', 'Exhibition for science projects.'),
('Cultural Fest', '2025-07-20', '11:00', '2025-07-20', '18:00', 'Cultural performances and stalls.'),
('Sports Meet', '2025-08-05', '08:00', '2025-08-05', '15:00', 'Athletic and sports events.'),
('Business Summit', '2025-09-12', '09:30', '2025-09-12', '16:30', 'Summit for business leaders.'),
('Medical Camp', '2025-10-03', '07:00', '2025-10-03', '14:00', 'Free health check-up camp.'),
('Art Exhibition', '2025-10-22', '10:00', '2025-10-22', '17:00', 'Display of artworks.'),
('Environment Day', '2025-11-05', '09:00', '2025-11-05', '13:00', 'Plantation and awareness program.'),
('Innovation Fair', '2025-11-25', '10:30', '2025-11-25', '16:30', 'Showcase of new innovations.'),
('Book Fair', '2025-12-01', '10:00', '2025-12-01', '17:00', 'Sale and exhibition of books.'),
('Music Festival', '2025-12-15', '14:00', '2025-12-15', '22:00', 'Live musical performances.'),
('Food Carnival', '2026-01-10', '11:00', '2026-01-10', '20:00', 'Various cuisines and food stalls.'),
('Startup Pitch', '2026-02-05', '09:00', '2026-02-05', '18:00', 'Pitch event for startups.'),
('Drama Night', '2026-03-01', '18:00', '2026-03-01', '22:00', 'Drama and skits by students.'),
('Tech Hackathon', '2026-04-05', '08:00', '2026-04-06', '08:00', '24-hour coding competition.');

```

---

# ✨ Step 2: Insert 30 Teachers

```sql
-- Insert 30 Teachers
INSERT INTO Teacher (teacher_name, email, department, position, profile_photo) VALUES
('Alice Smith', 'alice.smith@example.com', 'Computer Science', 'Professor', 'alice.jpg'),
('Bob Johnson', 'bob.johnson@example.com', 'Mathematics', 'Assistant Professor', 'bob.jpg'),
('Carol Williams', 'carol.williams@example.com', 'Physics', 'Lecturer', 'carol.jpg'),
('David Brown', 'david.brown@example.com', 'Biology', 'Professor', 'david.jpg'),
('Eve Davis', 'eve.davis@example.com', 'Chemistry', 'Assistant Professor', 'eve.jpg'),
('Frank Miller', 'frank.miller@example.com', 'Electrical Engineering', 'Lecturer', 'frank.jpg'),
('Grace Wilson', 'grace.wilson@example.com', 'Mechanical Engineering', 'Professor', 'grace.jpg'),
('Hank Moore', 'hank.moore@example.com', 'Civil Engineering', 'Assistant Professor', 'hank.jpg'),
('Ivy Taylor', 'ivy.taylor@example.com', 'Economics', 'Lecturer', 'ivy.jpg'),
('Jack Anderson', 'jack.anderson@example.com', 'Business', 'Professor', 'jack.jpg'),
('Kathy Thomas', 'kathy.thomas@example.com', 'Law', 'Lecturer', 'kathy.jpg'),
('Liam Jackson', 'liam.jackson@example.com', 'Political Science', 'Assistant Professor', 'liam.jpg'),
('Mia White', 'mia.white@example.com', 'Psychology', 'Professor', 'mia.jpg'),
('Noah Harris', 'noah.harris@example.com', 'Sociology', 'Lecturer', 'noah.jpg'),
('Olivia Martin', 'olivia.martin@example.com', 'History', 'Assistant Professor', 'olivia.jpg'),
('Paul Thompson', 'paul.thompson@example.com', 'Philosophy', 'Professor', 'paul.jpg'),
('Quinn Garcia', 'quinn.garcia@example.com', 'Art', 'Lecturer', 'quinn.jpg'),
('Ruby Martinez', 'ruby.martinez@example.com', 'Design', 'Assistant Professor', 'ruby.jpg'),
('Sam Robinson', 'sam.robinson@example.com', 'Architecture', 'Professor', 'sam.jpg'),
('Tina Clark', 'tina.clark@example.com', 'Music', 'Lecturer', 'tina.jpg'),
('Uma Rodriguez', 'uma.rodriguez@example.com', 'Dance', 'Assistant Professor', 'uma.jpg'),
('Victor Lewis', 'victor.lewis@example.com', 'Management', 'Professor', 'victor.jpg'),
('Wendy Lee', 'wendy.lee@example.com', 'Education', 'Lecturer', 'wendy.jpg'),
('Xander Walker', 'xander.walker@example.com', 'Environmental Science', 'Assistant Professor', 'xander.jpg'),
('Yara Hall', 'yara.hall@example.com', 'Astronomy', 'Professor', 'yara.jpg'),
('Zane Allen', 'zane.allen@example.com', 'Statistics', 'Lecturer', 'zane.jpg'),
('Ava Young', 'ava.young@example.com', 'Engineering', 'Assistant Professor', 'ava.jpg'),
('Ben King', 'ben.king@example.com', 'Information Technology', 'Professor', 'ben.jpg'),
('Cora Wright', 'cora.wright@example.com', 'Media Studies', 'Lecturer', 'cora.jpg'),
('Dean Scott', 'dean.scott@example.com', 'Health Sciences', 'Assistant Professor', 'dean.jpg');

```

---

# ✨ Step 3: Insert 2-5 Roles per Event

```sql
-- Insert Roles for Events
-- For each event (event_id 1 to 15), 3 roles

-- Event 1 Roles
INSERT INTO Role (role_name, role_point, role_headcount, event_id) VALUES
('Coordinator', 50, 5, 1),
('Volunteer', 20, 10, 1),
('Judge', 100, 2, 1);

-- Event 2 Roles
INSERT INTO Role (role_name, role_point, role_headcount, event_id) VALUES
('Exhibitor', 40, 7, 2),
('Host', 30, 3, 2),
('Security', 25, 5, 2);

-- Event 3 Roles
INSERT INTO Role (role_name, role_point, role_headcount, event_id) VALUES
('Performer', 60, 8, 3),
('Stage Manager', 45, 2, 3),
('Logistics', 30, 4, 3);

-- Event 4 Roles
INSERT INTO Role (role_name, role_point, role_headcount, event_id) VALUES
('Referee', 55, 4, 4),
('Coach', 45, 6, 4),
('First Aid', 35, 3, 4);

-- Continue similarly for Events 5 to 15
-- (If you want, I can generate full entries for all events up to 15)

```

---

# 📌 How to Assign Teachers?

Later you can simply assign teachers randomly to these roles inside `TeacherAssignment`.

Example:

```sql
-- Assign Teacher 1 to Event 1, Role 1
INSERT INTO TeacherAssignment (event_id, teacher_id, role_id) VALUES (1, 1, 1);

-- Assign Teacher 2 to Event 1, Role 2
INSERT INTO TeacherAssignment (event_id, teacher_id, role_id) VALUES (1, 2, 2);

-- Assign Teacher 3 to Event 2, Role 4
INSERT INTO TeacherAssignment (event_id, teacher_id, role_id) VALUES (2, 3, 4);

```

---