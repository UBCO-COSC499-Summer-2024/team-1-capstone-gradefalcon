import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from '../../../src/pages/Instructor/Login'; 
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

test('renders login form', () => {
  render(
    <Router>
      <Login />
    </Router>
  );

  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});

test('submits login form successfully', async () => {
  fetch.mockResponseOnce(JSON.stringify({ token: 'fake-token' }), { status: 200 });

  render(
    <Router>
      <Login />
    </Router>
  );

  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });

  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/login', expect.any(Object));

  // Assuming navigation to '/dashboard' happens on successful login
  await screen.findByText('Navigated to /dashboard'); // Replace this line with appropriate check for successful navigation
});

test('handles login failure', async () => {
  fetch.mockResponseOnce(JSON.stringify({ message: 'Login failed' }), { status: 401 });

  render(
    <Router>
      <Login />
    </Router>
  );

  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong-password' } });

  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/login', expect.any(Object));

  // Check that login failure is handled (you may want to add specific error messages or state updates in the component to verify)
  // Here we assume that "Login failed" is logged to console
  await screen.findByText('Login failed'); // Replace this line with appropriate check for login failure
});
