-- ////////// Drop tables if they already exist: /////////////////

DROP TABLE IF EXISTS instructor CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS student CASCADE;
DROP TABLE IF EXISTS exam CASCADE;
DROP TABLE IF EXISTS solution CASCADE;
DROP TABLE IF EXISTS enrollment CASCADE;
DROP TABLE IF EXISTS studentResults CASCADE;
DROP TABLE IF EXISTS scannedExam CASCADE;
DROP TABLE IF EXISTS report CASCADE;
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


-- ////////// Create ENUM type for report status: /////////////////

CREATE TYPE report_status AS ENUM ('Closed', 'Pending');

CREATE TABLE report (
    report_id serial primary key,
    exam_id int not null,
    student_id text not null,
    report_text text not null,
    report_time TIMESTAMP DEFAULT NOW(),
    reply_text text, -- This field will store the instructor's reply
    status report_status DEFAULT 'Pending', -- Column to track report status
    foreign key (exam_id) references exam(exam_id)
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
    ('1', 'auth0|669eca4940b5ccd84d81caa2', 'stu.example0@gmail.com', 'Nelson Mirza'),
    ('2', 'auth0|669ecaa440b5ccd84d81caa3', 'stu.example1@gmail.com', 'Bennett Al-Yaqubi'),
    ('3', 'auth0|669ecaa440b5ccd84d81caa4', 'ahmad@example.com', 'Ahmad Ngumo'),
    ('4', 'auth0|669ecaa440b5ccd84d81caa5', 'omar@example.com', 'Omar Witt');

INSERT INTO classes (instructor_id, course_id, course_name, active) VALUES
    ('auth0|6696d634bec6c6d1cc3e2274', 'COSC304', 'Introduction to Database', true),
    ('auth0|6696d634bec6c6d1cc3e2274', 'BIOL265', 'Principles of Genetics', true);

INSERT INTO exam (class_id, exam_title, total_questions, total_marks, graded, viewing_options) VALUES
    (1,'Midterm 1', 50, 50, true, '{"canViewExam": true, "canViewAnswers": false}'),
    (1, 'Midterm 2', 50, 100, true, '{"canViewExam": false, "canViewAnswers": false}'),
    (2, 'Midterm', 50, 50, true, '{"canViewExam": false, "canViewAnswers": true}'),  -- Exams for TEST200
    (2, 'Final', 100, 100, true, '{"canViewExam": true, "canViewAnswers": true}');  -- Exams for TEST200

INSERT INTO solution (exam_id) VALUES
    (1),
    (2);

INSERT INTO enrollment (class_id, student_id) VALUES 
    (1, 1),
    (1, 2),
    (1, 3), 
    (1, 4),
    (2, 1),
    (2, 2),
    (2, 3),
    (2, 4);

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
(3, 1, '[
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
(4, 1, '[
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
]', 85),
(3, 2, '[
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
(4, 2, '[
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

-- Insert values into the report table:
INSERT INTO report (exam_id, student_id, report_text, reply_text, status) VALUES 
(1, '1', 'I think Q5 is incorrectly marked.', 'I reviewed your answer for Q5. The marking is correct according to the scheme. Please refer to the marking guide.', 'Closed'),
(2, '2', 'Can you explain the grading for the final exam?', 'Sure, the grading is based on the rubric provided in class.', 'Closed');

INSERT INTO admins (auth0_id, email, name) VALUES (
    'auth0|6697fe650e143a8cede3ec08', 'sys.controller0@gmail.com', 'Admin'
);
