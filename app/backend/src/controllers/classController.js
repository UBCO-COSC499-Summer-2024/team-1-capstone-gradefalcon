const pool = require('../utils/db');

// Display classes
const displayClasses = async (req, res, next) => {
  try {
    console.log("dipshit",req.auth);
    const instructorAuth0Id = req.auth.sub; // Get the instructor ID from the JWT
    console.log("Instructor Auth0 ID:", instructorAuth0Id); // Log the instructor ID
    const result = await pool.query("SELECT * FROM classes WHERE instructor_id = $1", [instructorAuth0Id]);
    console.log("Classes Data:", result.rows); // Log the retrieved classes
    res.json(result.rows); // Send the list of classes as JSON
  } catch (err) {
    console.error("Error in displayClasses:", err); // Log any errors
    next(err);
  }
};

// Get Specific Class Name
const getClassNameById = async (req, res, next) => {
  try {
    const { classId } = req.params; // Get the class ID from the request parameters

    const result = await pool.query(
      "SELECT course_name FROM classes WHERE class_id = $1",
      [classId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Class not found" });
    }

    res.json({ course_name: result.rows[0].course_name }); // Send the class name as JSON
  } catch (err) {
    next(err);
  }
};

// Display students enrolled, exam grades too
const displayClassManagement = async (req, res, next) => {
  try {
    const { class_id } = req.params; // Get the class ID from the request parameters
    const result = await pool.query("SELECT student_id, name FROM enrollment JOIN student USING (auth0_id) WHERE class_id = $1", [class_id]);
    const classData = result.rows;

    const examResults = classData.map(student =>
      pool.query("SELECT exam_id, grade FROM studentResults WHERE student_id = $1", [student.auth0_id])
      .then(result => ({
        student_id: student.auth0_id,
        name: student.name,
        exams: result.rows,  // This will be an array of exam results
      }))
    );

    // Wait for all promises to resolve
    const combinedResults = await Promise.all(examResults);
    // Now let's get the course code and course name given class_id
    const courseQuery = await pool.query("SELECT course_id, course_name FROM classes WHERE class_id = $1", [class_id]);
    const courseDetails = courseQuery.rows;
    // Combine the students info and course details
    res.json({ studentInfo: combinedResults, courseDetails });
  } catch (error) {
    next(error);
  }
};

// Import class
const importClass = async (req, res) => {
  const { students, courseName, courseId } = req.body;
  const instructorId = req.auth.sub; // Retrieve instructor ID from JWT

  if (!instructorId) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    let classQuery = await pool.query("SELECT class_id FROM classes WHERE course_id = $1 AND instructor_id = $2", [courseId, instructorId]);

    let classId;
    if (classQuery.rows.length === 0) {
      const newClassQuery = await pool.query("INSERT INTO classes (course_id, instructor_id, course_name) VALUES ($1, $2, $3) RETURNING class_id", [courseId, instructorId, courseName]);
      classId = newClassQuery.rows[0].class_id;
    } else {
      classId = classQuery.rows[0].class_id;
    }

    const insertPromises = students.map(async (student) => {
      const { studentID, studentName } = student;
      if (!studentID || !studentName) {
        throw new Error("Invalid student data: studentID and studentName are required");
      }

      let studentQuery = await pool.query("SELECT auth0_id FROM student WHERE auth0_id = $1", [studentID]);
      if (studentQuery.rows.length === 0) {
        await pool.query("INSERT INTO student (auth0_id, name) VALUES ($1, $2)", [studentID, studentName]);
      }

      return pool.query("INSERT INTO enrollment (class_id, student_id) VALUES ($1, $2)", [classId, studentID]);
    });

    await Promise.all(insertPromises);
    res.status(201).json({ message: "Class imported successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error importing class" });
  }
};

module.exports = { displayClasses, displayClassManagement, importClass, getClassNameById };
