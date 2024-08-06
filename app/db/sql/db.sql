-- ////////// Drop tables if they already exist: /////////////////

DROP TABLE IF EXISTS instructor CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS student CASCADE;
DROP TABLE IF EXISTS exam CASCADE;
DROP TABLE IF EXISTS solution CASCADE;
DROP TABLE IF EXISTS enrollment CASCADE;
DROP TABLE IF EXISTS studentResults CASCADE;
DROP TABLE IF EXISTS scannedExam CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;

-- ////////// Create tables: /////////////////

CREATE TABLE instructor (
    auth0_id text primary key,
    email text not null,
    name text not null
);

CREATE TABLE classes (
    class_id serial primary key,
    instructor_id text,
    course_id text,
    course_name text,
    active boolean,
    unique (instructor_id, course_id)
);

CREATE TABLE student (
    student_id text primary key,
    auth0_id text NOT NULL unique,
    email text unique,
    name text
);

CREATE TABLE exam (
    exam_id serial primary key,
    class_id int not null,
    exam_title text, 
    total_questions int,
    total_marks int,
    template text,
    mean double precision,
    high double precision,
    low double precision,
    upper_quartile double precision,
    lower_quartile double precision,
    page_count int,
    viewing_options JSONB,
    graded boolean default false,
    foreign key (class_id) references classes(class_id)
);

CREATE TABLE solution (
    solution_id serial primary key,
    exam_id int not null,
    answers text[],
    filepath text,
    marking_schemes JSONB,
    foreign key (exam_id) references exam(exam_id)
);

CREATE TABLE enrollment (
    enrollment_id serial primary key,
    class_id int,
    student_id text,
    foreign key (class_id) references classes(class_id),
    foreign key (student_id) references student(student_id)
);

CREATE TABLE studentResults (
    sheet_int serial primary key,
    student_id text not null,
    exam_id int not null,
    chosen_answers text[],
    grade int,
    grade_changelog text[],
    foreign key (exam_id) references exam(exam_id),
    foreign key (student_id) references student(student_id)
);

CREATE TABLE scannedExam (
    scan_id serial primary key,
    exam_id int not null,
    page_count int,
    filepath text,
    foreign key (exam_id) references exam(exam_id)
);

-- Drop the messages table if it exists
DROP TABLE IF EXISTS messages;

-- Create the new messages table
CREATE TABLE messages (
    message_id serial primary key,
    sender_id text not null,
    sender_type text not null, -- 'student' or 'instructor'
    receiver_id text not null,
    receiver_type text not null, -- 'student' or 'instructor'
    exam_id int not null,
    message_text text not null,
    message_time timestamp not null,
    read boolean default false, -- Column to track read status
    foreign key (exam_id) references exam(exam_id)
);

CREATE TABLE admins (
    auth0_id text primary key,
    email text not null,
    name text not null
);

CREATE TABLE "session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid");

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

-- ////////// Test value insertion: /////////////////

-- Insert instructor
INSERT INTO instructor (auth0_id, email, name) VALUES (
    'auth0|6696d634bec6c6d1cc3e2274', 'edu.instructor1@gmail.com', 'Instructor'
);

-- Insert students
INSERT INTO student (student_id, auth0_id, email, name) VALUES 
    ('1', 'auth0|669eca4940b5ccd84d81caa2', 'stu.example0@gmail.com', 'Student A'),
    ('2', 'auth0|669ecaa440b5ccd84d81caa3', 'stu.example1@gmail.com', 'Student B'),
    ('3', 'auth0|669eca440b5ccd84d81caa4', 'stu.example2@gmail.com', 'Student C'),
    ('4', 'auth0|669eca440b5ccd84d81caa5', 'stu.example3@gmail.com', 'Student D'),
    ('5', 'auth0|669eca440b5ccd84d81caa6', 'stu.example4@gmail.com', 'Student E');

-- Insert classes
INSERT INTO classes (instructor_id, course_id, course_name) VALUES
    ('auth0|6696d634bec6c6d1cc3e2274', 'TEST100', 'Database Test'),
    ('auth0|6696d634bec6c6d1cc3e2274', 'TEST200', 'Database Test 2'),
    ('auth0|6696d634bec6c6d1cc3e2274', 'TEST300', 'Algorithms'),
    ('auth0|6696d634bec6c6d1cc3e2274', 'TEST400', 'Data Structures');

-- Insert exams
INSERT INTO exam (class_id, exam_title, total_questions, total_marks, graded, viewing_options) VALUES
    (1, 'Midterm', 50, 50, true, '{"canViewExam": true, "canViewAnswers": false}'),
    (1, 'Final', 5, 100, true, '{"canViewExam": false, "canViewAnswers": false}'),
    (2, 'Midterm - 200', 50, 50, true, '{"canViewExam": false, "canViewAnswers": true}'),
    (2, 'Final - 200', 100, 100, true, '{"canViewExam": true, "canViewAnswers": true}'),
    (3, 'Midterm - 300', 50, 50),
    (3, 'Final - 300', 100, 100),
    (4, 'Midterm - 400', 50, 50),
    (4, 'Final - 400', 100, 100);

-- Insert solutions
INSERT INTO solution (exam_id) VALUES
    (1),
    (2),
    (3),
    (4),
    (5),
    (6),
    (7),
    (8);

-- Insert enrollments
INSERT INTO enrollment (class_id, student_id) VALUES 
    (1, '1'),
    (1, '2'),
    (1, '3'),
    (2, '1'),
    (2, '2'),
    (2, '4'),
    (3, '3'),
    (3, '5'),
    (4, '2'),
    (4, '4'),
    (4, '5');

-- Insert student results
INSERT INTO studentResults (student_id, exam_id, grade) VALUES
    ('1', 1, 50),
    ('2', 1, 11),
    ('3', 1, 69),
    ('1', 2, 85),
    ('2', 2, 90),
    ('4', 2, 78),
    ('1', 3, 88),
    ('2', 3, 77),
    ('3', 3, 95),
    ('5', 4, 80),
    ('4', 5, 70),
    ('2', 5, 68),
    ('4', 6, 92),
    ('5', 6, 83),
    ('1', 7, 89),
    ('2', 7, 75),
    ('5', 8, 91);

-- Insert scanned exams
INSERT INTO scannedExam (exam_id, page_count, filepath) VALUES
    (1, 10, 'path/to/scanned/exam1.pdf'),
    (2, 15, 'path/to/scanned/exam2.pdf'),
    (3, 12, 'path/to/scanned/exam3.pdf'),
    (4, 8, 'path/to/scanned/exam4.pdf'),
    (5, 14, 'path/to/scanned/exam5.pdf'),
    (6, 20, 'path/to/scanned/exam6.pdf'),
    (7, 18, 'path/to/scanned/exam7.pdf'),
    (8, 22, 'path/to/scanned/exam8.pdf');

-- Insert messages
INSERT INTO messages (sender_id, sender_type, receiver_id, receiver_type, exam_id, message_text, message_time, read) VALUES
    ('1', 'student', 'auth0|6696d634bec6c6d1cc3e2274', 'instructor', 1, 'I think Q5 is incorrectly marked.', CURRENT_TIMESTAMP, false),
    ('auth0|6696d634bec6c6d1cc3e2274', 'instructor', '1', 'student', 1, 'I reviewed your answer for Q5. The marking is correct according to the scheme. Please refer to the marking guide.', CURRENT_TIMESTAMP, true),
    ('2', 'student', 'auth0|6696d634bec6c6d1cc3e2274', 'instructor', 2, 'Can you explain the grading for the final exam?', CURRENT_TIMESTAMP, false),
    ('auth0|6696d634bec6c6d1cc3e2274', 'instructor', '2', 'student', 2, 'Sure, the grading is based on the rubric provided in class.', CURRENT_TIMESTAMP, true),
    ('3', 'student', 'auth0|6696d634bec6c6d1cc3e2274', 'instructor', 3, 'I need clarification on Q3 of the midterm.', CURRENT_TIMESTAMP, false),
    ('auth0|6696d634bec6c6d1cc3e2274', 'instructor', '3', 'student', 3, 'Q3 was about dynamic programming. Please check the lecture notes for more details.', CURRENT_TIMESTAMP, true),
    ('4', 'student', 'auth0|6696d634bec6c6d1cc3e2274', 'instructor', 4, 'I have an issue with the grading of Q2.', CURRENT_TIMESTAMP, false),
    ('auth0|6696d634bec6c6d1cc3e2274', 'instructor', '4', 'student', 4, 'I will review Q2 and get back to you shortly.', CURRENT_TIMESTAMP, true),
    ('5', 'student', 'auth0|6696d634bec6c6d1cc3e2274', 'instructor', 5, 'Can you provide feedback on my final exam?', CURRENT_TIMESTAMP, false),
    ('auth0|6696d634bec6c6d1cc3e2274', 'instructor', '5', 'student', 5, 'Yes, I will provide detailed feedback by the end of the week.', CURRENT_TIMESTAMP, true);

-- Insert admin
INSERT INTO admins (auth0_id, email, name) VALUES (
    'auth0|6697fe650e143a8cede3ec08', 'sys.controller0@gmail.com', 'Admin'
);
