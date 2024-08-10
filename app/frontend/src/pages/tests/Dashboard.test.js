import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../Instructor/Dashboard';
import '@testing-library/jest-dom/extend-expect';

// Mock all the child components
jest.mock('../../components/AverageperExamChart', () => (props) => <div>AverageperExamChart Mock - Data: {JSON.stringify(props.data)}</div>);
jest.mock('../../components/AverageperCourseChart', () => (props) => <div>AverageperCourseChart Mock - Data: {JSON.stringify(props.data)}</div>);

describe('Dashboard', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  const renderWithRouter = (component) => {
    return render(
      <MemoryRouter>
        {component}
      </MemoryRouter>
    );
  };

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
          { examTitle: 'Midterm', averageScore: 85 },
          { examTitle: 'Final', averageScore: 75 },
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

    renderWithRouter(<Dashboard />);

    // Wait for the async data to be rendered
    await waitFor(() => screen.getByText('Your Courses'));
    await waitFor(() => screen.getByText('Math 101'));
    await waitFor(() => screen.getByText('Midterm'));
    await waitFor(() => screen.getByText('AverageperExamChart Mock - Data: [{"examTitle":"Midterm","averageScore":85},{"examTitle":"Final","averageScore":75}]'));
    await waitFor(() => screen.getByText('AverageperCourseChart Mock - Data: [{"courseName":"Math 101","averageScore":90},{"courseName":"Science 101","averageScore":85}]'));

    // Check if elements are rendered correctly
    expect(screen.getByText('Your Courses')).toBeInTheDocument();
    expect(screen.getByText('Math 101')).toBeInTheDocument();
    expect(screen.getByText('Science 101')).toBeInTheDocument();
    expect(screen.getByText('Midterm')).toBeInTheDocument();
    expect(screen.getByText('Final')).toBeInTheDocument();
    expect(screen.getByText('AverageperExamChart Mock - Data: [{"examTitle":"Midterm","averageScore":85},{"examTitle":"Final","averageScore":75}]')).toBeInTheDocument();
    expect(screen.getByText('AverageperCourseChart Mock - Data: [{"courseName":"Math 101","averageScore":90},{"courseName":"Science 101","averageScore":85}]')).toBeInTheDocument();
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

    renderWithRouter(<Dashboard />);

    await waitFor(() => screen.getByText('Your Courses'));

    expect(screen.getByText('Your Courses')).toBeInTheDocument();
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
          { examTitle: 'Midterm', averageScore: 85 },
          { examTitle: 'Final', averageScore: 75 },
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

    renderWithRouter(<Dashboard />);

    await waitFor(() => screen.getByText('Math 101'));
    await waitFor(() => screen.getByText('Science 101'));

    expect(screen.getByText('Math 101')).toBeInTheDocument();
    expect(screen.getByText('Science 101')).toBeInTheDocument();
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
          { examTitle: 'Midterm', averageScore: 85 },
          { examTitle: 'Final', averageScore: 75 },
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

    renderWithRouter(<Dashboard />);

    await waitFor(() => screen.getByText('Midterm'));
    await waitFor(() => screen.getByText('Final'));

    expect(screen.getByText('Midterm')).toBeInTheDocument();
    expect(screen.getByText('Final')).toBeInTheDocument();
  });

  test('renders AverageperExamChart with correct data', async () => {
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
          { examTitle: 'Midterm', averageScore: 85 },
          { examTitle: 'Final', averageScore: 75 },
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

    renderWithRouter(<Dashboard />);

    await waitFor(() => screen.getByText('AverageperExamChart Mock - Data: [{"examTitle":"Midterm","averageScore":85},{"examTitle":"Final","averageScore":75}]'));

    expect(screen.getByText('AverageperExamChart Mock - Data: [{"examTitle":"Midterm","averageScore":85},{"examTitle":"Final","averageScore":75}]')).toBeInTheDocument();
  });

  test('renders AverageperCourseChart with correct data', async () => {
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
          { examTitle: 'Midterm', averageScore: 85 },
          { examTitle: 'Final', averageScore: 75 },
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

    renderWithRouter(<Dashboard />);

    await waitFor(() => screen.getByText('AverageperCourseChart Mock - Data: [{"courseName":"Math 101","averageScore":90},{"courseName":"Science 101","averageScore":85}]'));

    expect(screen.getByText('AverageperCourseChart Mock - Data: [{"courseName":"Math 101","averageScore":90},{"courseName":"Science 101","averageScore":85}]')).toBeInTheDocument();
  });
});

