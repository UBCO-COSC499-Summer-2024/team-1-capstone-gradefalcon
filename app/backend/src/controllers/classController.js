const pool = require('../utils/db'); // Database connection pool
const axios = require('axios'); // HTTP client for making requests
const auth0Domain = process.env.REACT_APP_AUTH0_DOMAIN; // Auth0 domain from environment variables
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID; // Auth0 client ID from environment variables
const clientSecret = process.env.REACT_APP_AUTH0_CLIENT_SECRET; // Auth0 client secret from environment variables
const audience = `https://${auth0Domain}/api/v2/`; // Auth0 Management API audience

// Generates a random password with a specified character set
const generateRandomPassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
};

// Retrieves an access token for the Auth0 Management API
const getManagementApiAccessToken = async () => {
  const options = {
    method: 'POST',
    url: `https://${auth0Domain}/oauth/token`,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      audience: audience,
      scope: "create:users read:users" // Scopes required for creating and reading users
    })
  };

  try {
    const response = await axios.request(options);
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching Auth0 Management API token:', error);
    throw new Error('Error fetching Auth0 Management API token');
  }
};

// Displays classes for the authenticated instructor
const displayClasses = async (req, res, next) => {
  try {
    const instructorAuth0Id = req.auth.sub; // Get the instructor ID from the JWT
    const result = await pool.query("SELECT * FROM classes WHERE instructor_id = $1 ORDER BY active DESC", [instructorAuth0Id]);
    res.json(result.rows); // Send the list of classes as JSON
  } catch (err) {
    console.error("Error in displayClasses:", err); // Log any errors
    next(err);
  }
};

// Retrieves the name of a specific class by its ID
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

// Displays students enrolled in a class along with their exam grades
const displayClassManagement = async (req, res, next) => {
  try {
    const { class_id } = req.params; // Get the class ID from the request parameters
    const result = await pool.query("SELECT student_id, name FROM enrollment JOIN student USING (student_id) WHERE class_id = $1", [class_id]);
    const classData = result.rows;

    const examResults = classData.map(student =>
      pool.query("SELECT exam_id, grade FROM studentResults WHERE student_id = $1", [student.student_id])
        .then(result => ({
          student_id: student.student_id,
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

// Imports a class and its students
const importClass = async (req, res) => {
  const { students, courseName, courseId } = req.body;
  const instructorId = req.auth.sub; // Retrieve instructor ID from JWT

  if (!instructorId) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  if (students.length > 500) {
    return res.status(400).json({ message: "Cannot import more than 500 students at once" });
  }

  try {
    const managementApiToken = await getManagementApiAccessToken();

    let classQuery = await pool.query("SELECT class_id FROM classes WHERE course_id = $1 AND instructor_id = $2", [courseId, instructorId]);

    let classId;
    if (classQuery.rows.length === 0) {
      const newClassQuery = await pool.query("INSERT INTO classes (course_id, instructor_id, course_name, active) VALUES ($1, $2, $3, $4) RETURNING class_id", [courseId, instructorId, courseName, true]);
      classId = newClassQuery.rows[0].class_id;
    } else {
      classId = classQuery.rows[0].class_id;
    }

    // Create users in Auth0 and insert them into the database if they don't exist
    const auth0Promises = students.map(async (student) => {
      const password = generateRandomPassword(); // Generate a random password
      const userData = {
        email: student.studentEmail,
        password,
        connection: 'Username-Password-Authentication',
        user_metadata: {
          studentID: student.studentID,
          name: student.studentName
        }
      };

      let auth0User;
      try {
        const userResponse = await axios.post(`https://${auth0Domain}/api/v2/users`, userData, {
          headers: { Authorization: `Bearer ${managementApiToken}` }
        });
        auth0User = userResponse.data;
      } catch (error) {
        console.error(`Error creating user ${student.studentEmail}:`, error.response.data || error.message);
        const existingUsersResponse = await axios.get(`https://${auth0Domain}/api/v2/users-by-email`, {
          params: { email: student.studentEmail },
          headers: { Authorization: `Bearer ${managementApiToken}` }
        });

        auth0User = existingUsersResponse.data[0];
        if (!auth0User) return null;
      }

      const studentQuery = await pool.query("SELECT * FROM student WHERE student_id = $1", [student.studentID]);
      if (studentQuery.rows.length === 0) {
        await pool.query("INSERT INTO student (student_id, auth0_id, email, name) VALUES ($1, $2, $3, $4)", [student.studentID, auth0User.user_id, student.studentEmail, student.studentName]);
      }

      return { ...student, auth0_id: auth0User.user_id };
    });

    const auth0Users = await Promise.all(auth0Promises);

    // Filter out unsuccessful Auth0 user creations
    const successfulUsers = auth0Users.filter(user => user !== null);

    // Insert enrollments
    const enrollmentPromises = successfulUsers.map(async (student) => {
      const enrollmentQuery = await pool.query("SELECT * FROM enrollment WHERE class_id = $1 AND student_id = $2", [classId, student.studentID]);
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
// Fetch all courses
const getAllCourses = async (req, res, next) => {
  const auth0_id = req.auth.sub; // Retrieve instructor ID from JWT
  try {
    const result = await pool.query("SELECT class_id, course_id, course_name FROM classes WHERE instructor_id = $1", [auth0_id]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};
const archiveCourse = async (req, res, next) => {
  const auth0_id = req.auth.sub; // Retrieve instructor ID from JWT
  const { class_id } = req.body; // Get class ID from request body

  try {
    // Update the active status of the course to false (archived)
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
  const auth0_id = req.auth.sub; // Retrieve instructor ID from JWT
  const { class_id } = req.body; // Get class ID from request body

  try {
    // Update the active status of the course to true (unarchived)
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

module.exports = { displayClasses, displayClassManagement, importClass, getClassNameById, getAllCourses, archiveCourse, unarchiveCourse };
