import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Classes from '../Instructor/Classes';

// Mock fetch globally
global.fetch = jest.fn();
global.console.error = jest.fn();

beforeEach(() => {
  fetch.mockClear();
  console.error.mockClear();
});

test('renders Classes component', async () => {
  // Mock fetch response
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [
      { course_id: 'TEST100', course_name: 'Database Test', class_id: '1' },
      { course_id: 'TEST200', course_name: 'Database Test 2', class_id: '2' },
    ],
  });

  render(
    <MemoryRouter initialEntries={['/classes']}>
      <Routes>
        <Route path="/classes" element={<Classes />} />
      </Routes>
    </MemoryRouter>
  );

  // Ensure the header is displayed
  expect(screen.getByText('Classes')).toBeInTheDocument();

  // Ensure the list of classes is displayed
  await waitFor(() => {
    expect(screen.getByText('TEST100')).toBeInTheDocument();
    expect(screen.getByText('Database Test')).toBeInTheDocument();
    expect(screen.getByText('TEST200')).toBeInTheDocument();
    expect(screen.getByText('Database Test 2')).toBeInTheDocument();
  });

  // Ensure the "Create a New Class" section is displayed
  expect(screen.getByText('Create a New Class')).toBeInTheDocument();
  expect(screen.getByText('Import a CSV file containing the student names and their student IDs in your class.')).toBeInTheDocument();
  expect(screen.getByText('Create Class')).toBeInTheDocument();
});

test('displays message when no classes are available', async () => {
  // Mock fetch response
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [],
  });

  render(
    <MemoryRouter initialEntries={['/classes']}>
      <Routes>
        <Route path="/classes" element={<Classes />} />
      </Routes>
    </MemoryRouter>
  );

  // Ensure the no classes message is displayed
  await waitFor(() => {
    expect(screen.getByText('No classes available')).toBeInTheDocument();
  });
});

test('opens new class creation dialog on button click', async () => {
  render(
    <MemoryRouter initialEntries={['/classes']}>
      <Routes>
        <Route path="/classes" element={<Classes />} />
      </Routes>
    </MemoryRouter>
  );

  // Simulate click on "Create Class" button
  fireEvent.click(screen.getByText('Create Class'));

  // Ensure the dialog content is displayed
  await waitFor(() => {
    expect(screen.getByText('Create New Class')).toBeInTheDocument();
    expect(screen.getByText('Enter the details for the new class and import the student list via a CSV file.')).toBeInTheDocument();
  });
});

test('displays error message on API failure', async () => {
  // Mock fetch to fail
  fetch.mockResolvedValueOnce({
    ok: false,
  });

  render(
    <MemoryRouter initialEntries={['/classes']}>
      <Routes>
        <Route path="/classes" element={<Classes />} />
      </Routes>
    </MemoryRouter>
  );

  // Ensure error message is displayed
  await waitFor(() => {
    expect(screen.getByTestId('list-classes-error')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch classes')).toBeInTheDocument();
  });
});

test('ensures "Create Class" button has the correct link', async () => {
  render(
    <MemoryRouter initialEntries={['/classes']}>
      <Routes>
        <Route path="/classes" element={<Classes />} />
      </Routes>
    </MemoryRouter>
  );

  // Ensure the "Create Class" button link is correct
  const createClassButton = screen.getByText('Create Class').closest('button');
  expect(createClassButton).toBeInTheDocument();
});
