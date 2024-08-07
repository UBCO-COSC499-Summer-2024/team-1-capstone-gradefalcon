const pool = require("../utils/db"); // Database connection pool
const axios = require("axios"); // HTTP client for making requests
const auth0Domain = process.env.REACT_APP_AUTH0_DOMAIN; // Auth0 domain from environment variables
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID; // Auth0 client ID from environment variables
const clientSecret = process.env.REACT_APP_AUTH0_CLIENT_SECRET; // Auth0 client secret from environment variables
const audience = `https://${auth0Domain}/api/v2/`; // Auth0 Management API audience

const generateRandomPassword = () => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
};

const getManagementApiAccessToken = async () => {
  const options = {
    method: "POST",
    url: `https://${auth0Domain}/oauth/token`,
    headers: { "content-type": "application/x-www-form-urlencoded" },
    data: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      audience: audience,
      scope: "create:users read:users",
    }),
  };

  try {
    const response = await axios.request(options);
    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching Auth0 Management API token:", error);
    throw new Error("Error fetching Auth0 Management API token");
  }
};

const displayClasses = async (req, res, next) => {
  try {
    const instructorAuth0Id = req.auth.sub;
    const result = await pool.query("SELECT * FROM classes WHERE instructor_id = $1 ORDER BY active DESC", [instructorAuth0Id]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error in displayClasses:", err);
    next(err);
  }
};

const getClassNameById = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const result = await pool.query("SELECT course_name FROM classes WHERE class_id = $1", [classId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.json({ course_name: result.rows[0].course_name });
  } catch (err) {
    next(err);
  }
};

const displayClassManagement = async (req, res, next) => {
  try {
    const { class_id } = req.params;
    const result = await pool.query("SELECT student_id, name FROM enrollment JOIN student USING (student_id) WHERE class_id = $1", [
      class_id,
    ]);
    const classData = result.rows;

    const examResults = classData.map((student) =>
      pool.query("SELECT exam_id, grade FROM studentResults WHERE student_id = $1", [student.student_id]).then((result) => ({
        student_id: student.student_id,
        name: student.name,
        exams: result.rows,
      }))
    );

    const combinedResults = await Promise.all(examResults);
    const courseQuery = await pool.query("SELECT course_id, course_name FROM classes WHERE class_id = $1", [class_id]);
    const courseDetails = courseQuery.rows;
    res.json({ studentInfo: combinedResults, courseDetails });
  } catch (error) {
    next(error);
  }
};

const displayClassWithExams = async (req, res, next) => {
  try {
    const { class_id } = req.params;
    const studentResult = await pool.query(
      "SELECT student_id, name FROM enrollment JOIN student USING (student_id) WHERE class_id = $1",
      [class_id]
    );
    const students = studentResult.rows;

    const examsResult = await pool.query(
      "SELECT exam_id, exam_title FROM exam WHERE class_id = $1",
      [class_id]
    );
    const exams = examsResult.rows;

    const courseQuery = await pool.query(
      "SELECT course_id, course_name FROM classes WHERE class_id = $1",
      [class_id]
    );
    const courseDetails = courseQuery.rows;

    const examResultsPromises = students.map(student =>
      pool.query(
        "SELECT exam_id, grade FROM studentResults WHERE student_id = $1",
        [student.student_id]
      ).then(result => ({
        student_id: student.student_id,
        name: student.name,
        exams: result.rows,
      }))
    );

    const studentInfo = await Promise.all(examResultsPromises);
    res.json({ studentInfo, courseDetails, exams });
  } catch (error) {
    console.error("Error in displayClassWithExams:", error);
    next(error);
  }
};

const getUnreadMessages = async (req, res, next) => {
  try {
    const instructorAuth0Id = req.auth.sub;
    const result = await pool.query(`
      SELECT m.message_id, m.sender_id, m.receiver_id, m.exam_id, m.message_text, m.message_time, e.class_id
      FROM messages m
      JOIN exam e ON m.exam_id = e.exam_id
      JOIN classes c ON e.class_id = c.class_id
      WHERE m.receiver_id = $1 AND m.read = false
    `, [instructorAuth0Id]);

    res.json(result.rows);
  } catch (err) {
    console.error("Error in getUnreadMessages:", err);
    next(err);
  }
};

const importClass = async (req, res) => {
  const { students, courseName, courseId } = req.body;
  const instructorId = req.auth.sub;

  if (!instructorId) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  if (students.length > 500) {
    return res.status(400).json({ message: "Cannot import more than 500 students at once" });
  }

  try {
    const managementApiToken = await getManagementApiAccessToken();

    let classQuery = await pool.query("SELECT class_id FROM classes WHERE course_id = $1 AND instructor_id = $2", [
      courseId,
      instructorId,
    ]);

    let classId;
    if (classQuery.rows.length === 0) {
      const newClassQuery = await pool.query("INSERT INTO classes (course_id, instructor_id, course_name, active) VALUES ($1, $2, $3, $4) RETURNING class_id", [courseId, instructorId, courseName, true]);
      classId = newClassQuery.rows[0].class_id;
    } else {
      classId = classQuery.rows[0].class_id;
    }

    const auth0Promises = students.map(async (student) => {
      const password = generateRandomPassword();
      const userData = {
        email: student.studentEmail,
        password,
        connection: "Username-Password-Authentication",
        user_metadata: {
          studentID: student.studentID,
          name: student.studentName,
        },
      };

      let auth0User;
      try {
        const userResponse = await axios.post(`https://${auth0Domain}/api/v2/users`, userData, {
          headers: { Authorization: `Bearer ${managementApiToken}` },
        });
        auth0User = userResponse.data;
      } catch (error) {
        console.error(`Error creating user ${student.studentEmail}:`, error.response.data || error.message);
        const existingUsersResponse = await axios.get(`https://${auth0Domain}/api/v2/users-by-email`, {
          params: { email: student.studentEmail },
          headers: { Authorization: `Bearer ${managementApiToken}` },
        });

        auth0User = existingUsersResponse.data[0];
        if (!auth0User) return null;
      }

      const studentQuery = await pool.query("SELECT * FROM student WHERE student_id = $1", [student.studentID]);
      if (studentQuery.rows.length === 0) {
        await pool.query("INSERT INTO student (student_id, auth0_id, email, name) VALUES ($1, $2, $3, $4)", [
          student.studentID,
          auth0User.user_id,
          student.studentEmail,
          student.studentName,
        ]);
      }

      return { ...student, auth0_id: auth0User.user_id };
    });

    const auth0Users = await Promise.all(auth0Promises);
    const successfulUsers = auth0Users.filter((user) => user !== null);

    const enrollmentPromises = successfulUsers.map(async (student) => {
      const enrollmentQuery = await pool.query("SELECT * FROM enrollment WHERE class_id = $1 AND student_id = $2", [
        classId,
        student.studentID,
      ]);
      if (enrollmentQuery.rows.length === 0) {
        return pool.query("INSERT INTO enrollment (class_id, student_id) VALUES ($1, $2)", [classId, student.studentID]);
      }
      return null;
    });

    await Promise.all(enrollmentPromises);

    res.status(201).json({ message: "Class imported successfully" });
  } catch (err) {
    console.error("Error importing class:", err);
    res.status(500).json({ message: "Error importing class" });
  }
};

const getAllCourses = async (req, res, next) => {
  const auth0_id = req.auth.sub;
  try {
    const result = await pool.query("SELECT class_id, course_id, course_name FROM classes WHERE instructor_id = $1", [auth0_id]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

const archiveCourse = async (req, res, next) => {
  const auth0_id = req.auth.sub;
  const { class_id } = req.body;

  try {
    const result = await pool.query(
      "UPDATE classes SET active = false WHERE class_id = $1 AND instructor_id = $2 RETURNING *",
      [class_id, auth0_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Course not found or you do not have permission to archive this course." });
    }

    res.json({ message: "Course archived successfully", course: result.rows[0] });
  } catch (err) {
    console.error("Error archiving course:", err);
    next(err);
  }
};

const unarchiveCourse = async (req, res, next) => {
  const auth0_id = req.auth.sub;
  const { class_id } = req.body;

  try {
    const result = await pool.query(
      "UPDATE classes SET active = true WHERE class_id = $1 AND instructor_id = $2 RETURNING *",
      [class_id, auth0_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Course not found or you do not have permission to unarchive this course." });
    }

    res.json({ message: "Course unarchived successfully", course: result.rows[0] });
  } catch (err) {
    console.error("Error unarchiving course:", err);
    next(err);
  }
};

const deleteCourse = async (req, res, next) => {
  const auth0_id = req.auth.sub;
  const { class_id } = req.body;

  try {
    const courseVerificationResult = await pool.query(
      "SELECT class_id FROM classes WHERE class_id = $1 AND instructor_id = $2",
      [class_id, auth0_id]
    );

    if (courseVerificationResult.rowCount === 0) {
      return res.status(403).json({ message: "Course not found or you do not have permission to delete this course." });
    }

    await pool.query('BEGIN');
    await pool.query("DELETE FROM enrollment WHERE class_id = $1", [class_id]);
    await pool.query(`
      DELETE FROM studentResults 
      WHERE exam_id IN (SELECT exam_id FROM exam WHERE class_id = $1)`, 
      [class_id]
    );
    await pool.query(`
      DELETE FROM scannedExam 
      WHERE exam_id IN (SELECT exam_id FROM exam WHERE class_id = $1)`, 
      [class_id]
    );
    await pool.query(`
      DELETE FROM solution 
      WHERE exam_id IN (SELECT exam_id FROM exam WHERE class_id = $1)`, 
      [class_id]
    );
    await pool.query("DELETE FROM exam WHERE class_id = $1", [class_id]);
    const classDeleteResult = await pool.query(
      "DELETE FROM classes WHERE class_id = $1 AND instructor_id = $2 RETURNING *",
      [class_id, auth0_id]
    );

    if (classDeleteResult.rowCount === 0) {
      throw new Error("Course not found or you do not have permission to delete this course.");
    }

    await pool.query('COMMIT');
    res.json({ message: "Course and related exams deleted successfully" });

  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error deleting course:", err);
    next(err);
  }
};

const getStudentCourses = async (req, res, next) => {
  try {
    const studentAuth0Id = req.auth.sub;
    console.log(`Fetching courses for student_id: ${studentAuth0Id}`);
    const result = await pool.query(
      `
      SELECT student_id, class_id, course_id, course_name 
      FROM enrollment 
      JOIN classes USING (class_id) 
      JOIN student USING (student_id)
      WHERE auth0_id = $1;
    `,
      [studentAuth0Id]
    );
    console.log(`Courses fetched: ${JSON.stringify(result.rows)}`);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching student courses:", err);
    next(err);
  }
};

module.exports = {
  displayClasses,
  displayClassManagement,
  importClass,
  getClassNameById,
  getAllCourses,
  archiveCourse,
  unarchiveCourse,
  deleteCourse,
  getStudentCourses,
  displayClassWithExams,
  getUnreadMessages
};
