const fetch = require('node-fetch');
describe('AuthController Login', () => {
  
  jest.setTimeout(30000);

 //Assumptions:
 //1) all inputs passed to authController are stringified because authController.js rejects others
 //2) only one way that jsob body login requests get submitted as defined in login.js
  test('Successful login as Instructor', async () => {
    try {
      const email = 'instructor@ubc.ca';
      const password = 'instructor';
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        expect(data.role).toBe('instructor');
        expect(data.message).toBe("Login successful");
      } else {
        console.error("Login failed");
        expect(true).toBe(false); // test fail clause due to incorrect info
      }
    } catch (error) {
      console.error("Error:", error);
      expect(true).toBe(false); // test fail clause due to database error
    }
  });

  test('Successful login as Student', async () => {
    try {
      const email = 'student@ubc.ca';
      const password = 'student';
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        expect(data.role).toBe('student');
        expect(data.message).toBe("Login successful");
      } else {
        console.error("Login failed");
        expect(true).toBe(false); // test fail clause due to incorrect info
      }
    } catch (error) {
      console.error("Error:", error);
      expect(true).toBe(false); // test fail clause due to database error
    }
  });

  test('Successful login as Admin', async () => {
    try {
      const email = 'admin@ubc.ca';
      const password = 'admin';
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        expect(data.role).toBe('admin');
        expect(data.message).toBe("Login successful");
      } else {
        console.error("Login failed");
        expect(true).toBe(false); // test fail clause due to incorrect info
      }
    } catch (error) {
      console.error("Error:", error);
      expect(true).toBe(false); // test fail clause due to database error
    }
  });

  test('Invalid login credentials', async () => {
    try {
      const email = 'invalid@ubc.ca';
      const password = 'wrongpassword';
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (response.ok) {
        console.error("Login succeeded unexpectedly");
        expect(true).toBe(false); // test fail clause due to unexpected success
      } else {
        const data = await response.json();
        expect(response.status).toBe(401);
        expect(data.message).toBe("Invalid credentials");
      }
    } catch (error) {
      console.error("Error:", error);
      expect(true).toBe(false); // test fail clause due to database error
    }
  });

  test('Missing email field', async () => {
    try {
      const password = 'student';
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
        credentials: 'include',
      });

      if (response.ok) {
        console.error("Login succeeded unexpectedly");
        expect(true).toBe(false); // test fail clause due to unexpected success
      } else {
        const data = await response.json();
        expect(response.status).toBe(400);
        expect(data.message).toBe("Invalid input types");
      }
    } catch (error) {
      console.error("Error:", error);
      expect(true).toBe(false); // test fail clause due to database error
    }
  });

  test('Missing password field', async () => {
    try {
      const email = 'student@ubc.ca';
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });

      if (response.ok) {
        console.error("Login succeeded unexpectedly");
        expect(true).toBe(false); // test fail clause due to unexpected success
      } else {
        const data = await response.json();
        expect(response.status).toBe(400);
        expect(data.message).toBe("Invalid input types");
      }
    } catch (error) {
      console.error("Error:", error);
      expect(true).toBe(false); // test fail clause due to unintended database error
    }
  });

  test('Empty email and password fields', async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: '', password: '' }),
        credentials: 'include',
      });

      if (response.ok) {
        console.error("Login succeeded unexpectedly");
        expect(true).toBe(false); // test fail clause due to unexpected success
      } else {
        const data = await response.json();
        expect(response.status).toBe(401);
        expect(data.message).toBe("Invalid credentials");
      }
    } catch (error) {
      console.error("Error:", error);
      expect(true).toBe(false); // test fail clause due to unintended database error
    }
  });

  test('SQL Injection attempt', async () => {
    try {
      const email = 'admin@ubc.ca';
      const password = "' OR '1'='1";
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (response.ok) {
        console.error("Login succeeded unexpectedly");
        expect(true).toBe(false); // test fail clause due to unexpected success
      } else {
        const data = await response.json();
        expect(response.status).toBe(401);
        expect(data.message).toBe("Invalid credentials");
      }
    } catch (error) {
      console.error("Error:", error);
      expect(true).toBe(false); // test fail clause due to no database error
    }
  });

test('Login attempt with incorrect variable types', async () => { 
  const email = 12345; // Incorrect type: should be a string
  const password = true; // Incorrect type: should be a string

  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: { email, password }, // Incorrect JSON form otherwise stringified body will work
      credentials: 'include',
    });

    // Check if the response is not OK
    if (!response.ok) {
      // Try to parse the response JSON to handle the error message
      const data = await response.json();
    } else {
      console.error("Login succeeded unexpectedly");
      expect(true).toBe(false); // Test fail clause due to unexpected success
    }
  } catch (error) {
    // Handle the FetchError specifically
    if (error.name === 'FetchError' && error.message.includes("Unexpected token")) {
      expect(error.message).toContain("Unexpected token '<'"); //we expect the json body to be rejected
    } else {
      // Rethrow the error if it's not the expected one
      throw error;
    }
  }
});
});