import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ClassManagement from '../Instructor/ClassManagement';

beforeAll(() => {
  global.fetch = jest.fn();
  global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/fake-url');
  global.URL.revokeObjectURL = jest.fn();
});

afterAll(() => {
  global.fetch.mockRestore();
  global.URL.createObjectURL.mockRestore();
  global.URL.revokeObjectURL.mockRestore();
});

const mockClassData = {
  courseDetails: [{ course_id: 'CS101', course_name: 'Intro to Computer Science' }],
  studentInfo: [
    { student_id: '123', name: 'John Doe', exams: [{ grade: 90 }, { grade: 85 }] },
    { student_id: '456', name: 'Jane Smith', exams: [{ grade: 88 }] }
  ]
};

test('renders ClassManagement component', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockClassData,
  });

  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/classManagement/CS101']}>
        <Routes>
          <Route path="/classManagement/:class_id" element={<ClassManagement />} />
        </Routes>
      </MemoryRouter>
    );
  });

  // Ensure course details are displayed
  await waitFor(() => {
    expect(screen.getByText('CS101')).toBeInTheDocument();
    expect(screen.getByText('Intro to Computer Science')).toBeInTheDocument();
  });

  // Ensure student data is displayed
  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  expect(screen.getByText('90')).toBeInTheDocument();
  expect(screen.getByText('85')).toBeInTheDocument();
  expect(screen.getByText('88')).toBeInTheDocument();
});

test('handles fetch failure', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: false,
  });

  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/classManagement/CS101']}>
        <Routes>
          <Route path="/classManagement/:class_id" element={<ClassManagement />} />
        </Routes>
      </MemoryRouter>
    );
  });

  await waitFor(() => {
    expect(screen.getByText('Failed to fetch class data')).toBeInTheDocument();
    expect(screen.queryByText('CS101')).not.toBeInTheDocument();
    expect(screen.queryByText('Intro to Computer Science')).not.toBeInTheDocument();
  });
});

test('exports CSV file', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockClassData,
  });

  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/classManagement/CS101']}>
        <Routes>
          <Route path="/classManagement/:class_id" element={<ClassManagement />} />
        </Routes>
      </MemoryRouter>
    );
  });

  await waitFor(() => {
    expect(screen.getByText('CS101')).toBeInTheDocument();
    expect(screen.getByText('Intro to Computer Science')).toBeInTheDocument();
  });

  // Mock the link click
  const clickMock = jest.fn();
  const linkMock = {
    setAttribute: jest.fn(),
    click: clickMock,
    style: {},
  };
  jest.spyOn(document, 'createElement').mockReturnValue(linkMock);

  // Trigger CSV export
  fireEvent.click(screen.getByText('Export'));

  // Define the expected CSV content
  const expectedCSVContent = `Student ID,Student Name,Exam 1,Exam 2\r\n123,John Doe,90,85\r\n456,Jane Smith,88,-\r\n`;

  // Check that the URL.createObjectURL was called with a Blob containing the expected CSV content
  const createObjectURLMock = global.URL.createObjectURL;
  const blob = createObjectURLMock.mock.calls[0][0];
  const text = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsText(blob);
  });
  expect(text).toBe(expectedCSVContent);

  // Clean up by revoking the object URL
  URL.revokeObjectURL(blob);
});
