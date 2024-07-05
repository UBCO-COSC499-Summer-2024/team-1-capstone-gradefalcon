const fetch = require('node-fetch');
const express = require('express');
const session = require('express-session');
const { login, logout } = require('../authController');

const app = express();

app.use(express.json());

app.use(session({
    secret: 'test_secret',
    resave: false,
    saveUninitialized: true,
}));

app.post('/api/auth/login', login);
app.post('/api/auth/logout', logout);

describe('AuthController Logout as Instructor', () => {
    jest.setTimeout(30000);

    it('should log in as instructor, verify session exists, log out, and verify session is destroyed', async () => {
        const email = 'instructor@ubc.ca';
        const password = 'instructor';

        // Simulate login as instructor
        let response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
        });

        let cookies = response.headers.raw()['set-cookie'];
        if (response.ok) {
            const data = await response.json();
            expect(data.role).toBe('instructor');
            expect(data.message).toBe('Login successful');
        } else {
            console.error("Login failed");
            expect(true).toBe(false); // test fail clause due to incorrect info
        }

        // Verify session exists by checking cookies
        expect(cookies).toBeDefined();

        // Test logout
        response = await fetch("http://localhost:3000/api/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
        });
        if (response.ok) {
            const data = await response.json();
            expect(data.message).toBe('Logout successful');
        } else {
            console.error("Logout failed");
            expect(true).toBe(false); // test fail clause due to logout failure
        }
        expect(cookies).toBe.undefined;

    });
    it('attempt logout without logging in, should just send to login page', async () => {
        // Verify session is destroyed by attempting to log out again
        response = await fetch("http://localhost:3000/api/auth/logout", {
            method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
        if (response.status === 200) {
            const data = await response.json();
            expect(data.message).toBe('Logout successful');
        } else {
            console.log(response.status);
            console.error("Logout threw an error unexpectedly");
            expect(true).toBe(false); // test fail clause due to session destruction verification failure
        }
    });


    it('should handle session destroy error', async () => {
        const email = 'instructor@ubc.ca';
        const password = 'instructor';

        // Simulate login as instructor
        let response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
        });

        let cookies = response.headers.raw()['set-cookie'];
        if (response.ok) {
            const data = await response.json();
            expect(data.role).toBe('instructor');
            expect(data.message).toBe('Login successful');
        } else {
            console.error("Login failed");
            expect(true).toBe(false); // test fail clause due to incorrect info
        }

        // Override destroy method to simulate error
        app.use((req, res, next) => {
            req.session.destroy = (callback) => {
                callback(new Error('Session destroy error'));
            };
            next();
        });

        response = await fetch("http://localhost:3000/api/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Cookie': cookies.join(';'),
            },
            credentials: 'include',
        });

        if (response.status === 200) {
            const data = await response.json();
            expect(data.message).toBe('Logout successful');
        } else {
            console.error("Logout error handling failed");
            expect(true).toBe(false); // test fail clause due to logout error handling failure
        }
    });
});
