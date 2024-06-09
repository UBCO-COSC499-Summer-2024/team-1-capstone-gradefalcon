DROP TABLE IF EXISTS teacher CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS student CASCADE;
DROP TABLE IF EXISTS exam CASCADE;
DROP TABLE IF EXISTS solution CASCADE;
DROP TABLE IF EXISTS studentResults CASCADE;
DROP TABLE IF EXISTS scannedExam CASCADE;
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TYPE IF EXISTS feedback_status CASCADE;

CREATE TABLE teacher (
	teacher_id serial primary key,
	email text not null,
	password text not null,
	name text not null
);

CREATE TABLE classes (
	class_id serial primary key,
	teacher_id int,
	course_id text,
	foreign key (teacher_id) references teacher(teacher_id)
);

CREATE TABLE student (
	student_id serial primary key,
	email text,
	password text,
	name text
);

CREATE TABLE exam (
	exam_id serial primary key,
	class_id int not null, 
	total_questions int,
	total_marks int,
	mean double precision,
	high double precision,
	low double precision,
	upper_quartile double precision,
	lower_quartile double precision,
	page_count int,
	file_size int,
	foreign key (class_id) references classes(class_id)
);

CREATE TABLE solution (
	solution_id serial primary key,
	exam_id int not null,
	answers text[],
	filepath text,
	foreign key (exam_id) references exam(exam_id)
);

CREATE TABLE studentResults(
	sheet_int serial primary key,
	student_id int not null,
	exam_id int not null,
	grade int,
	filepath text,
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
	student_id int not null,
	feedback_text text not null,
	feedback_time timestamp not null,
	status feedback_status not null
);

CREATE TABLE admins(
	admin_id serial primary key,
	email text not null,
	password text not null,
	name text not null
)
