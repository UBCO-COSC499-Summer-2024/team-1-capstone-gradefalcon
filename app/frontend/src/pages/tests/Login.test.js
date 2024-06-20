import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Instructor/Login';
import fetchMock from 'jest-fetch-mock'; // Import fetchMock

// Mock the useNavigate hook
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

beforeEach(() => {
  fetchMock.resetMocks(); // Reset fetch mocks
  mockedNavigate.mockReset(); // Reset mockedNavigate if necessary
});

describe('Login Component', () => {
  test('renders login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  test('accepts input values', () => {
    render(
      <BrowserRouter>
        <Login/>
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

//   test('submits the form with entered values', async () => {
//     fetchMock.mockResponseOnce(JSON.stringify({ token: '12345' }), { status: 200 }); // Mock fetch response

//     render(
//       <BrowserRouter>
//         <Login />
//       </BrowserRouter>
//     );

//     const emailInput = screen.getByLabelText(/Email/i);
//     const passwordInput = screen.getByLabelText(/Password/i);
//     const loginButton = screen.getByText(/Login/i);

//     fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
//     fireEvent.change(passwordInput, { target: { value: 'password123' } });

//     fireEvent.click(loginButton);

//     await waitFor(() => {
//       expect(fetchMock).toHaveBeenCalled(); // Check if fetch was called
//       expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/api/login", expect.objectContaining({ // Updated to use fetchMock
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: 'test@example.com',
//           password: 'password123'
//         }),
//         credentials: 'include',
//       }));
//     });
//   });
});