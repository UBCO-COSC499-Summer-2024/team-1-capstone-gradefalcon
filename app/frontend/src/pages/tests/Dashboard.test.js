import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../Instructor/Dashboard';
import '@testing-library/jest-dom/extend-expect';

// Mock all the child components
jest.mock('../../components/StandardAverageChart', () => (props) => <div>StandardAverageChart Mock - Data: {JSON.stringify(props.data)}</div>);
jest.mock('../../components/PerformanceBarChart', () => (props) => <div>PerformanceBarChart Mock - Data: {JSON.stringify(props.data)}</div>);

describe('Dashboard', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('renders the dashboard with user info, courses, exams, and charts', async () => {
    // Mock API responses
    fetch.mockResponses(
      [
        JSON.stringify({ userName: 'John Doe' }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ],
      [
        JSON.stringify([
          { course_name: 'Math 101', course_id: 'MATH101' },
          { course_name: 'Science 101', course_id: 'SCI101' },
        ]),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ],
      [
        JSON.stringify({
          classes: [
            { exam_title: 'Midterm', course_id: 'MATH101' },
            { exam_title: 'Final', course_id: 'SCI101' },
          ],
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ],
      [
        JSON.stringify([
          { examDate: '2023-01-01', averageScore: 85 },
          { examDate: '2023-02-01', averageScore: 75 },
        ]),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ],
      [
        JSON.stringify([
          { courseName: 'Math 101', averageScore: 90 },
          { courseName: 'Science 101', averageScore: 85 },
        ]),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ]
    );

    render(<Dashboard />);

    // Wait for the async data to be rendered
    await waitFor(() => screen.getByText('Welcome, John Doe!'));
    await waitFor(() => screen.getByText('Math 101 - MATH101'));
    await waitFor(() => screen.getByText('Midterm'));
    await waitFor(() => screen.getByText('StandardAverageChart Mock - Data: [{"examDate":"2023-01-01","averageScore":85},{"examDate":"2023-02-01","averageScore":75}]'));
    await waitFor(() => screen.getByText('PerformanceBarChart Mock - Data: [{"courseName":"Math 101","averageScore":90},{"courseName":"Science 101","averageScore":85}]'));

    // Check if elements are rendered correctly
    expect(screen.getByText('Welcome, John Doe!')).toBeInTheDocument();
    expect(screen.getByText('Math 101 - MATH101')).toBeInTheDocument();
    expect(screen.getByText('Science 101 - SCI101')).toBeInTheDocument();
    expect(screen.getByText('Midterm')).toBeInTheDocument();
    expect(screen.getByText('Final')).toBeInTheDocument();
    expect(screen.getByText('StandardAverageChart Mock - Data: [{"examDate":"2023-01-01","averageScore":85},{"examDate":"2023-02-01","averageScore":75}]')).toBeInTheDocument();
    expect(screen.getByText('PerformanceBarChart Mock - Data: [{"courseName":"Math 101","averageScore":90},{"courseName":"Science 101","averageScore":85}]')).toBeInTheDocument();
  });

  test('displays "Guest" when userName is not available', async () => {
    fetch.mockResponses(
      [
        JSON.stringify({ userName: '' }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ],
      [
        JSON.stringify([]),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ],
      [
        JSON.stringify({ classes: [] }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ],
      [
        JSON.stringify([]),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ],
      [
        JSON.stringify([]),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ]
    );

    render(<Dashboard />);

    await waitFor(() => screen.getByText('Welcome, Guest!'));

    expect(screen.getByText('Welcome, Guest!')).toBeInTheDocument();
  });

  test('renders course cards with correct data', async () => {
    fetch.mockResponses(
      [
        JSON.stringify({ userName: 'John Doe' }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ],
      [
        JSON.stringify([
          { course_name: 'Math 101', course_id: 'MATH101' },
          { course_name: 'Science 101', course_id: 'SCI101' },
        ]),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ],
      [
        JSON.stringify({
          classes: [
            { exam_title: 'Midterm', course_id: 'MATH101' },
            { exam_title: 'Final', course_id: 'SCI101' },
          ],
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ],
      [
        JSON.stringify([
          { examDate: '2023-01-01', averageScore: 85 },
          { examDate: '2023-02-01', averageScore: 75 },
        ]),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ],
      [
        JSON.stringify([
          { courseName: 'Math 101', averageScore: 90 },
          { courseName: 'Science 101', averageScore: 85 },
        ]),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ]
    );

    render(<Dashboard />);

    await waitFor(() => screen.getByText('Math 101 - MATH101'));
    await waitFor(() => screen.getByText('Science 101 - SCI101'));

    expect(screen.getByText('Math 101 - MATH101')).toBeInTheDocument();
    expect(screen.getByText('Science 101 - SCI101')).toBeInTheDocument();
  });

  test('renders exam table with correct data', async () => {
    fetch.mockResponses(
      [
        JSON.stringify({ userName: 'John Doe' }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ],
      [
        JSON.stringify([
          { course_name: 'Math 101', course_id: 'MATH101' },
          { course_name: 'Science 101', course_id: 'SCI101' },
        ]),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ],
      [
        JSON.stringify({
          classes: [
            { exam_title: 'Midterm', course_id: 'MATH101' },
            { exam_title: 'Final', course_id: 'SCI101' },
          ],
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ],
      [
        JSON.stringify([
          { examDate: '2023-01-01', averageScore: 85 },
          { examDate: '2023-02-01', averageScore: 75 },
        ]),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ],
      [
        JSON.stringify([
          { courseName: 'Math 101', averageScore: 90 },
          { courseName: 'Science 101', averageScore: 85 },
        ]),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ]
    );

    render(<Dashboard />);

    await waitFor(() => screen.getByText('Midterm'));
    await waitFor(() => screen.getByText('Final'));

    expect(screen.getByText('Midterm')).toBeInTheDocument();
    expect(screen.getByText('Final')).toBeInTheDocument();
  });

  test('renders StandardAverageChart with correct data', async () => {
    fetch.mockResponses(
      [
        JSON.stringify({ userName: 'John Doe' }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ],
      [
        JSON.stringify([
          { course_name: 'Math 101', course_id: 'MATH101' },
          { course_name: 'Science 101', course_id: 'SCI101' },
        ]),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ],
      [
        JSON.stringify({
          classes: [
            { exam_title: 'Midterm', course_id: 'MATH101' },
            { exam_title: 'Final', course_id: 'SCI101' },
          ],
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ],
      [
        JSON.stringify([
          { examDate: '2023-01-01', averageScore: 85 },
          { examDate: '2023-02-01', averageScore: 75 },
        ]),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ],
      [
        JSON.stringify([
          { courseName: 'Math 101', averageScore: 90 },
          { courseName: 'Science 101', averageScore: 85 },
        ]),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ]
    );

    render(<Dashboard />);

    await waitFor(() => screen.getByText('StandardAverageChart Mock - Data: [{"examDate":"2023-01-01","averageScore":85},{"examDate":"2023-02-01","averageScore":75}]'));

    expect(screen.getByText('StandardAverageChart Mock - Data: [{"examDate":"2023-01-01","averageScore":85},{"examDate":"2023-02-01","averageScore":75}]')).toBeInTheDocument();
  });

  test('renders PerformanceBarChart with correct data', async () => {
    fetch.mockResponses(
      [
        JSON.stringify({ userName: 'John Doe' }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ],
      [
        JSON.stringify([
          { course_name: 'Math 101', course_id: 'MATH101' },
          { course_name: 'Science 101', course_id: 'SCI101' },
        ]),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ],
      [
        JSON.stringify({
          classes: [
            { exam_title: 'Midterm', course_id: 'MATH101' },
            { exam_title: 'Final', course_id: 'SCI101' },
          ],
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ],
      [
        JSON.stringify([
          { examDate: '2023-01-01', averageScore: 85 },
          { examDate: '2023-02-01', averageScore: 75 },
        ]),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ],
      [
        JSON.stringify([
          { courseName: 'Math 101', averageScore: 90 },
          { courseName: 'Science 101', averageScore: 85 },
        ]),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ]
    );

    render(<Dashboard />);

    await waitFor(() => screen.getByText('PerformanceBarChart Mock - Data: [{"courseName":"Math 101","averageScore":90},{"courseName":"Science 101","averageScore":85}]'));

    expect(screen.getByText('PerformanceBarChart Mock - Data: [{"courseName":"Math 101","averageScore":90},{"courseName":"Science 101","averageScore":85}]')).toBeInTheDocument();
  });
});
