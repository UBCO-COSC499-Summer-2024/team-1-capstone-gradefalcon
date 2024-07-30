import fs from 'fs';
import path from 'path';
import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NewClass from '../Instructor/NewClass';

// Read the CSV file content
const csvFilePath = path.resolve(__dirname, 'ExampleClass.csv');
const csvFileContent = fs.readFileSync(csvFilePath, 'utf-8');

beforeAll(() => {
  global.alert = jest.fn();
  console.error = jest.fn();
  console.log = jest.fn();
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve({ success: true }),
    })
  );
});

afterAll(() => {
  global.alert.mockRestore();
  console.error.mockRestore();
  console.log.mockRestore();
  global.fetch.mockRestore();
});

test('renders form inputs and table correctly', () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <NewClass />
    </MemoryRouter>
  );

  expect(getByTestId('courseName')).toBeInTheDocument();
  expect(getByTestId('courseId')).toBeInTheDocument();
  expect(getByTestId('csvFile')).toBeInTheDocument();
  expect(getByTestId('uploadButton')).toBeInTheDocument();
  expect(getByTestId('tableBody')).toBeInTheDocument();
});

test('handles form input changes correctly', () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <NewClass />
    </MemoryRouter>
  );
  const courseNameInput = getByTestId('courseName');
  const courseIdInput = getByTestId('courseId');

  fireEvent.change(courseNameInput, { target: { value: 'Test Course' } });
  fireEvent.change(courseIdInput, { target: { value: '12345' } });

  expect(courseNameInput.value).toBe('Test Course');
  expect(courseIdInput.value).toBe('12345');
});

test('handles file change and parses CSV correctly', async () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <NewClass />
    </MemoryRouter>
  );
  const csvFileInput = getByTestId('csvFile');
  const file = new File(['Student Name,Student ID\nJohn Doe,12345\nJane Smith,67890'], 'test.csv', { type: 'text/csv' });

  fireEvent.change(csvFileInput, { target: { files: [file] } });

  await waitFor(() => {
    const rows = getByTestId('tableBody').querySelectorAll('tr');
    expect(rows).toHaveLength(2);
    expect(rows[0].textContent).toBe('John Doe12345');
    expect(rows[1].textContent).toBe('Jane Smith67890');
  });
});

test('shows error and clears file input when form is submitted with missing fields', async () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <NewClass />
    </MemoryRouter>
  );
  const uploadButton = getByTestId('uploadButton');
  const csvFileInput = getByTestId('csvFile');

  fireEvent.click(uploadButton);

  await waitFor(() => {
    expect(global.alert).toHaveBeenCalledWith("Please provide a course name, course ID, and a CSV file:");
    expect(csvFileInput.value).toBe('');
  });
});

test('shows error and clears file input when file is not CSV', async () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <NewClass />
    </MemoryRouter>
  );
  const csvFileInput = getByTestId('csvFile');
  const file = new File(['invalid content'], 'test.txt', { type: 'text/plain' });

  fireEvent.change(csvFileInput, { target: { files: [file] } });

  await waitFor(() => {
    expect(global.alert).toHaveBeenCalledWith("Please upload a valid CSV file.");
    expect(csvFileInput.value).toBe('');
  });
});

test('shows error and clears file input when CSV file is empty', async () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <NewClass />
    </MemoryRouter>
  );
  const csvFileInput = getByTestId('csvFile');
  const file = new File([''], 'empty.csv', { type: 'text/csv' });

  fireEvent.change(csvFileInput, { target: { files: [file] } });

  await waitFor(() => {
    expect(global.alert).toHaveBeenCalledWith("CSV file is empty or improperly formatted.");
    expect(csvFileInput.value).toBe('');
  });
});

test('shows error and clears file input when CSV file has too many columns', async () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <NewClass />
    </MemoryRouter>
  );
  const csvFileInput = getByTestId('csvFile');
  const file = new File(['Student Name,Student ID,Extra Column\nJohn Doe,12345,extra'], 'invalid.csv', { type: 'text/csv' });

  fireEvent.change(csvFileInput, { target: { files: [file] } });

  await waitFor(() => {
    expect(global.alert).toHaveBeenCalledWith("CSV file should contain exactly two columns: Student Name and Student ID.");
    expect(csvFileInput.value).toBe('');
  });
});

test('shows error and clears file input when CSV file has invalid data types', async () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <NewClass />
    </MemoryRouter>
  );
  const csvFileInput = getByTestId('csvFile');
  const file = new File(['Student Name,Student ID\nJohn Doe,invalidID'], 'invalid.csv', { type: 'text/csv' });

  fireEvent.change(csvFileInput, { target: { files: [file] } });

  await waitFor(() => {
    expect(global.alert).toHaveBeenCalledWith("CSV file contains invalid data. Please ensure Student ID is a number with length between 1 and 12, and Student Name is a non-empty string.\n\nRow 2: [John Doe, invalidID] is invalid.");
    expect(csvFileInput.value).toBe('');
  });
});

test('handles file upload correctly', async () => {
  global.fetch.mockImplementationOnce(() =>
    Promise.resolve({
      json: () => Promise.resolve({ success: true }),
    })
  );
  const { getByTestId, findByText } = render(
    <MemoryRouter>
      <NewClass />
    </MemoryRouter>
  );
  const courseNameInput = getByTestId('courseName');
  const courseIdInput = getByTestId('courseId');
  const csvFileInput = getByTestId('csvFile');
  const uploadButton = getByTestId('uploadButton');

  fireEvent.change(courseNameInput, { target: { value: 'Test Course' } });
  fireEvent.change(courseIdInput, { target: { value: '12345' } });
  const file = new File([csvFileContent], 'ExampleClass.csv', { type: 'text/csv' });
  
  await act(async () => {
    fireEvent.change(csvFileInput, { target: { files: [file] } });
  });

  // Ensure the parsed data is displayed in the table
  await findByText('John Doe');
  await findByText('Jane Smith');

  fireEvent.click(uploadButton);

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith('/api/class/import-class', expect.objectContaining({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        courseName: 'Test Course',
        courseId: '12345',
        students: [
          { studentID: '12345', studentName: 'John Doe' },
          { studentID: '67890', studentName: 'Jane Smith' }
        ],
      }),
    }));
  });
});

test('simulates backend API call for file upload', async () => {
  global.fetch.mockImplementationOnce(() =>
    Promise.resolve({
      json: () => Promise.resolve({ success: true }),
    })
  );

  const { getByTestId, findByText } = render(
    <MemoryRouter>
      <NewClass />
    </MemoryRouter>
  );
  const courseNameInput = getByTestId('courseName');
  const courseIdInput = getByTestId('courseId');
  const csvFileInput = getByTestId('csvFile');
  const uploadButton = getByTestId('uploadButton');

  fireEvent.change(courseNameInput, { target: { value: 'Test Course' } });
  fireEvent.change(courseIdInput, { target: { value: '12345' } });
  const file = new File([csvFileContent], 'ExampleClass.csv', { type: 'text/csv' });
  
  await act(async () => {
    fireEvent.change(csvFileInput, { target: { files: [file] } });
  });

  // Ensure the parsed data is displayed in the table
  await findByText('John Doe');
  await findByText('Jane Smith');

  fireEvent.click(uploadButton);

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith('/api/class/import-class', expect.objectContaining({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        courseName: 'Test Course',
        courseId: '12345',
        students: [
          { studentID: '12345', studentName: 'John Doe' },
          { studentID: '67890', studentName: 'Jane Smith' }
        ],
      }),
    }));
  });
});
