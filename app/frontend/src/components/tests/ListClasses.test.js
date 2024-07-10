import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ListClasses from '../ListClasses';

// Mock fetch globally
global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
  console.error = jest.fn(); // Mock console.error to avoid polluting test output
});

test('renders ListClasses component with fetched data', async () => {
  // Mock fetch response with data
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [
      { course_id: 'TEST100', course_name: 'Database Test', class_id: '1' },
      { course_id: 'TEST200', course_name: 'Database Test 2', class_id: '2' },
    ],
  });

  render(<ListClasses />);

  // Ensure the list of classes is displayed
  await waitFor(() => {
    expect(screen.getByText('TEST100')).toBeInTheDocument();
    expect(screen.getByText('Database Test')).toBeInTheDocument();
    expect(screen.getByText('TEST200')).toBeInTheDocument();
    expect(screen.getByText('Database Test 2')).toBeInTheDocument();
  });
});

test('displays message when no classes are available', async () => {
  // Mock fetch response with no data
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [],
  });

  render(<ListClasses />);

  // Ensure the no classes message is displayed
  await waitFor(() => {
    expect(screen.getByText('No classes available')).toBeInTheDocument();
  });
});

test('handles fetch failure and displays error message', async () => {
  // Mock fetch to fail
  fetch.mockResolvedValueOnce({
    ok: false,
  });

  render(<ListClasses />);

  // Ensure the error message is displayed
  await waitFor(() => {
    expect(screen.getByTestId('list-classes-error')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch classes')).toBeInTheDocument();
  });
});

test('handles fetch error and displays error message', async () => {
  // Mock fetch to throw an error
  fetch.mockRejectedValueOnce(new Error('Network error'));

  render(<ListClasses />);

  // Ensure the error message is displayed
  await waitFor(() => {
    expect(screen.getByTestId('list-classes-error')).toBeInTheDocument();
    expect(screen.getByText(/Error fetching classes/)).toBeInTheDocument();
  });
});
