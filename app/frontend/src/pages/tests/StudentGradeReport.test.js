import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import StudentGradeReport from '../Student/StudentGradeReport';
import { downloadCSV } from '../../utils/csvUtils';

// Mock the downloadCSV function
jest.mock('../../utils/csvUtils', () => ({
  downloadCSV: jest.fn(),
}));

beforeAll(() => {
  global.fetch = jest.fn();
  global.console.error = jest.fn();
  global.alert = jest.fn();
});

afterAll(() => {
  global.fetch.mockRestore();
  global.console.error.mockRestore();
  global.alert.mockRestore();
});

beforeEach(() => {
  global.fetch.mockClear();
  global.console.error.mockClear();
  global.alert.mockClear();
  jest.clearAllMocks();
});

test('renders StudentGradeReport component', () => {
  render(
    <MemoryRouter>
      <StudentGradeReport />
    </MemoryRouter>
  );

  expect(screen.getByText('Grade Report')).toBeInTheDocument();
  expect(screen.getByText('Loading courses...')).toBeInTheDocument();
});

test('fetches and displays courses', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [
      { class_id: '1', course_name: 'Math 101' },
      { class_id: '2', course_name: 'Science 102' },
    ],
  });

  render(
    <MemoryRouter>
      <StudentGradeReport />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('Math 101')).toBeInTheDocument();
    expect(screen.getByText('Science 102')).toBeInTheDocument();
  });
});

test('fetches and displays grades', async () => {
  fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [{ class_id: '1', course_name: 'Math 101' }],
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { title: 'Midterm', status: 'submitted', score: 85, total: 100 },
        { title: 'Final', status: 'missing', score: 0, total: 100 },
      ],
    });

  render(
    <MemoryRouter>
      <StudentGradeReport />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('Midterm')).toBeInTheDocument();
    expect(screen.getByText('submitted')).toBeInTheDocument();
    expect(screen.getByText('85 / 100')).toBeInTheDocument();
    expect(screen.getByText('Final')).toBeInTheDocument();
    expect(screen.getByText('missing')).toBeInTheDocument();
    expect(screen.getByText('0 / 100')).toBeInTheDocument();
  });
});

test('exports grades to CSV', async () => {
  fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [{ class_id: '1', course_name: 'Math 101' }],
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { title: 'Midterm', status: 'submitted', score: 85, total: 100 },
        { title: 'Final', status: 'missing', score: 0, total: 100 },
      ],
    });

  render(
    <MemoryRouter>
      <StudentGradeReport />
    </MemoryRouter>
  );

  const exportButton = await screen.findByText('Export Grades');

  fireEvent.click(exportButton);

  await waitFor(() => {
    expect(downloadCSV).toHaveBeenCalledWith(expect.any(String), 'grade_report.csv');
  });
});

test('handles error while fetching courses', async () => {
  fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

  render(
    <MemoryRouter>
      <StudentGradeReport />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(console.error).toHaveBeenCalledWith('Error fetching courses:', expect.any(Error));
  });
});

test('handles error while fetching grades', async () => {
  fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [{ class_id: '1', course_name: 'Math 101' }],
    })
    .mockRejectedValueOnce(new Error('Failed to fetch'));

  render(
    <MemoryRouter>
      <StudentGradeReport />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(console.error).toHaveBeenCalledWith('Error fetching grades:', expect.any(Error));
  });
});

test('handles grade details modal', async () => {
  fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [{ class_id: '1', course_name: 'Math 101' }],
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { title: 'Midterm', status: 'submitted', score: 85, total: 100 },
        { title: 'Final', status: 'missing', score: 0, total: 100 },
      ],
    });

  render(
    <MemoryRouter>
      <StudentGradeReport />
    </MemoryRouter>
  );

  const gradeRow = await screen.findByText('Midterm');
  fireEvent.click(gradeRow);

  await waitFor(() => {
    expect(screen.getByText('Grade Details')).toBeInTheDocument();
    expect(screen.getByText('Examination:')).toBeInTheDocument();
    expect(screen.getByText('Status:')).toBeInTheDocument();
    expect(screen.getByText('Score:')).toBeInTheDocument();
  });

  const closeButton = screen.getByText('×');
  fireEvent.click(closeButton);

  await waitFor(() => {
    expect(screen.queryByText('Grade Details')).not.toBeInTheDocument();
  });
});

