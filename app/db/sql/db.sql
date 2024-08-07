-- ////////// Drop tables if they already exist: /////////////////

DROP TABLE IF EXISTS instructor CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS student CASCADE;
DROP TABLE IF EXISTS exam CASCADE;
DROP TABLE IF EXISTS solution CASCADE;
DROP TABLE IF EXISTS enrollment CASCADE;
DROP TABLE IF EXISTS studentResults CASCADE;
DROP TABLE IF EXISTS scannedExam CASCADE;
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TYPE IF EXISTS feedback_status CASCADE;

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
CREATE TABLE enrollment(
    enrollment_id serial primary key,
    class_id int,
    student_id text,
    foreign key (class_id) references classes(class_id),
    foreign key (student_id) references student(student_id)
);

CREATE TABLE studentResults(
    sheet_int serial primary key,
    student_id text not null,
    exam_id int not null,
    chosen_answers JSONB,
    grade int,
    grade_changelog text[],
    foreign key (exam_id) references exam(exam_id),
    foreign key (student_id) references student(student_id)
);

CREATE TABLE scannedExam(
    scan_id serial primary key,
    exam_id int not null,
    page_count int,
    filepath text,
    foreign key (exam_id) references exam(exam_id)
);

CREATE TYPE feedback_status as enum ('Not Done', 'Done', 'In Progress');

CREATE TABLE feedback(
    feedback_id serial primary key,
    sheet_id int not null,
    student_id text not null,
    feedback_text text not null,
    feedback_time timestamp not null,
    status feedback_status not null,
    foreign key (student_id) references student(student_id)
);

CREATE TABLE admins(
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

INSERT INTO instructor (auth0_id, email, name) VALUES (
    'auth0|6696d634bec6c6d1cc3e2274', 'edu.instructor1@gmail.com', 'Instructor'
);

INSERT INTO student (student_id, auth0_id, email, name) VALUES 
    ('1', 'auth0|669eca4940b5ccd84d81caa2', 'stu.example0@gmail.com', 'Student'),
    ('2', 'auth0|669ecaa440b5ccd84d81caa3', 'stu.example1@gmail.com', 'Student II');

INSERT INTO classes (instructor_id, course_id, course_name) VALUES
    ('auth0|6696d634bec6c6d1cc3e2274', 'TEST100', 'Database Test'),
    ('auth0|6696d634bec6c6d1cc3e2274', 'TEST200', 'Database Test 2');

INSERT INTO exam (class_id, exam_title, total_questions, total_marks, graded, viewing_options) VALUES
    (1,'Midterm', 50, 50, true, '{"canViewExam": true, "canViewAnswers": false}'),
    (1, 'Final', 5, 100, true, '{"canViewExam": false, "canViewAnswers": false}'),
    (2, 'Midterm - 200', 50, 50, true, '{"canViewExam": false, "canViewAnswers": true}'),  -- Exams for TEST200
    (2, 'Final - 200', 100, 100, true, '{"canViewExam": true, "canViewAnswers": true}');  -- Exams for TEST200

INSERT INTO solution (exam_id) VALUES
    (1),
    (2);

INSERT INTO enrollment (class_id, student_id) VALUES 
    (1, 1),
    (1, 2),
    (2, 1),  -- Enrollments for TEST200
    (2, 2);  -- Enrollments for TEST200

INSERT INTO studentResults (student_id, exam_id, chosen_answers, grade) VALUES
(1, 1, '[
    {"q1": "A"}, {"q2": "B"}, {"q3": "C"}, {"q4": "D"}, {"q5": "A"},
    {"q6": "C"}, {"q7": "B"}, {"q8": "D"}, {"q9": "A"}, {"q10": "B"},
    {"q11": "C"}, {"q12": "D"}, {"q13": "A"}, {"q14": "B"}, {"q15": "C"},
    {"q16": "D"}, {"q17": "A"}, {"q18": "B"}, {"q19": "C"}, {"q20": "D"},
    {"q21": "A"}, {"q22": "B"}, {"q23": "C"}, {"q24": "D"}, {"q25": "A"},
    {"q26": "B"}, {"q27": "C"}, {"q28": "D"}, {"q29": "A"}, {"q30": "B"},
    {"q31": "C"}, {"q32": "D"}, {"q33": "A"}, {"q34": "B"}, {"q35": "C"},
    {"q36": "D"}, {"q37": "A"}, {"q38": "B"}, {"q39": "C"}, {"q40": "D"},
    {"q41": "A"}, {"q42": "B"}, {"q43": "C"}, {"q44": "D"}, {"q45": "A"},
    {"q46": "B"}, {"q47": "C"}, {"q48": "D"}, {"q49": "A"}, {"q50": "B"}
]', 50),
(2, 1, '[
    {"q1": "B"}, {"q2": "C"}, {"q3": "D"}, {"q4": "A"}, {"q5": "B"},
    {"q6": "D"}, {"q7": "C"}, {"q8": "A"}, {"q9": "B"}, {"q10": "D"},
    {"q11": "C"}, {"q12": "A"}, {"q13": "B"}, {"q14": "D"}, {"q15": "C"},
    {"q16": "A"}, {"q17": "B"}, {"q18": "D"}, {"q19": "C"}, {"q20": "A"},
    {"q21": "B"}, {"q22": "D"}, {"q23": "C"}, {"q24": "A"}, {"q25": "B"},
    {"q26": "D"}, {"q27": "C"}, {"q28": "A"}, {"q29": "B"}, {"q30": "D"},
    {"q31": "C"}, {"q32": "A"}, {"q33": "B"}, {"q34": "D"}, {"q35": "C"},
    {"q36": "A"}, {"q37": "B"}, {"q38": "D"}, {"q39": "C"}, {"q40": "A"},
    {"q41": "B"}, {"q42": "D"}, {"q43": "C"}, {"q44": "A"}, {"q45": "B"},
    {"q46": "D"}, {"q47": "C"}, {"q48": "A"}, {"q49": "B"}, {"q50": "D"}
]', 11),
(1, 2, '[
    {"q1": "D"}, {"q2": "B"}, {"q3": "C"}, {"q4": "A"}, {"q5": "D"},
    {"q6": "A"}, {"q7": "B"}, {"q8": "C"}, {"q9": "D"}, {"q10": "A"},
    {"q11": "B"}, {"q12": "C"}, {"q13": "D"}, {"q14": "A"}, {"q15": "B"},
    {"q16": "C"}, {"q17": "D"}, {"q18": "A"}, {"q19": "B"}, {"q20": "C"},
    {"q21": "D"}, {"q22": "A"}, {"q23": "B"}, {"q24": "C"}, {"q25": "D"},
    {"q26": "A"}, {"q27": "B"}, {"q28": "C"}, {"q29": "D"}, {"q30": "A"},
    {"q31": "B"}, {"q32": "C"}, {"q33": "D"}, {"q34": "A"}, {"q35": "B"},
    {"q36": "C"}, {"q37": "D"}, {"q38": "A"}, {"q39": "B"}, {"q40": "C"},
    {"q41": "D"}, {"q42": "A"}, {"q43": "B"}, {"q44": "C"}, {"q45": "D"},
    {"q46": "A"}, {"q47": "B"}, {"q48": "C"}, {"q49": "D"}, {"q50": "A"}
]', 69),
(2, 2, '[
    {"q1": "A"}, {"q2": "A"}, {"q3": "B"}, {"q4": "C"}, {"q5": "D"},
    {"q6": "A"}, {"q7": "B"}, {"q8": "C"}, {"q9": "D"}, {"q10": "A"},
    {"q11": "B"}, {"q12": "C"}, {"q13": "D"}, {"q14": "A"}, {"q15": "B"},
    {"q16": "C"}, {"q17": "D"}, {"q18": "A"}, {"q19": "B"}, {"q20": "C"},
    {"q21": "D"}, {"q22": "A"}, {"q23": "B"}, {"q24": "C"}, {"q25": "D"},
    {"q26": "A"}, {"q27": "B"}, {"q28": "C"}, {"q29": "D"}, {"q30": "A"},
    {"q31": "B"}, {"q32": "C"}, {"q33": "D"}, {"q34": "A"}, {"q35": "B"},
    {"q36": "C"}, {"q37": "D"}, {"q38": "A"}, {"q39": "B"}, {"q40": "C"},
    {"q41": "D"}, {"q42": "A"}, {"q43": "B"}, {"q44": "C"}, {"q45": "D"},
    {"q46": "A"}, {"q47": "B"}, {"q48": "C"}, {"q49": "D"}, {"q50": "A"}
]', 85);


INSERT INTO scannedExam (exam_id) VALUES (
    1
);

INSERT INTO feedback (sheet_id, student_id, feedback_text, feedback_time, status) VALUES (
    1, '1', 'Q5 is incorrectly marked', CURRENT_TIMESTAMP, 'Not Done'
);

INSERT INTO admins (auth0_id, email, name) VALUES (
    'auth0|6697fe650e143a8cede3ec08', 'sys.controller0@gmail.com', 'Admin'
);
