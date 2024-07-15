import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ExamBoard from '../Instructor/Examboard';

// Mock fetch globally
global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
  console.error = jest.fn(); // Mock console.error to avoid polluting test output
});

test('renders ExamBoard component with fetched data', async () => {
  // Mock fetch response with data
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      classes: [
        {
          course_id: 'TEST100',
          course_name: 'Database Test',
          exam_title: 'Midterm',
          class_id: '1',
        },
        {
          course_id: 'TEST100',
          course_name: 'Database Test',
          exam_title: 'Final',
          class_id: '1',
        },
        {
          course_id: 'TEST200',
          course_name: 'Database Test 2',
          exam_title: 'Midterm',
          class_id: '2',
        },
      ],
    }),
  });

  render(
    <MemoryRouter>
      <ExamBoard />
    </MemoryRouter>
  );

 

  // Ensure the list of classes and exams is displayed
  await waitFor(() => {
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('course-TEST100')).toBeInTheDocument();
    expect(screen.getByTestId('course-header-TEST100')).toHaveTextContent('TEST100 Database Test');
    expect(screen.getByTestId('exam-0-TEST100')).toHaveTextContent('Midterm');
    expect(screen.getByTestId('exam-1-TEST100')).toHaveTextContent('Final');
    expect(screen.getByTestId('course-TEST200')).toBeInTheDocument();
    expect(screen.getByTestId('course-header-TEST200')).toHaveTextContent('TEST200 Database Test 2');
    expect(screen.getByTestId('exam-0-TEST200')).toHaveTextContent('Midterm');
  });
});

test('displays message when no exams are available', async () => {
  // Mock fetch response with no data
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      classes: [],
    }),
  });

  render(
    <MemoryRouter>
      <ExamBoard />
    </MemoryRouter>
  );

  // Ensure the message is displayed
  await waitFor(() => {
    expect(screen.getByTestId('no-exams')).toBeInTheDocument();
  });
});

test('handles fetch failure and displays error message', async () => {
  // Mock fetch to fail
  fetch.mockResolvedValueOnce({
    ok: false,
  });

  render(
    <MemoryRouter>
      <ExamBoard />
    </MemoryRouter>
  );

  // Ensure the error message is displayed
  await waitFor(() => {
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByTestId('error-message')).toHaveTextContent(`Error fetching class data: Cannot read properties of undefined (reading 'ok')`);
  });
});
