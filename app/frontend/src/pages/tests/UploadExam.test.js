import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import UploadExams from '../Instructor/UploadExams';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    state: { className: 'Test Class', userName: 'Test User', userID: '1', examTitle: 'Test Exam', examID: '123' }
  })
}));

beforeEach(() => {
  global.URL.createObjectURL = jest.fn();
  global.alert = jest.fn();
  global.fetch = jest.fn();
});

describe('UploadExams Component', () => {
  test('renders UploadExams component', () => {
    render(
      <BrowserRouter>
        <UploadExams />
      </BrowserRouter>
    );

    expect(screen.getByText(/Upload the exam with all student submissions as a PDF file./i)).toBeInTheDocument();
  });

  test('file upload and preview', async () => {
    render(
      <BrowserRouter>
        <UploadExams />
      </BrowserRouter>
    );

    const fileInput = screen.getByLabelText(/Click to browse or drag and drop your files/i).closest('input');
    const file = new File(['dummy content'], 'Exam (2).pdf', { type: 'application/pdf' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByTitle(/PDF Preview/i)).toBeInTheDocument();
    });
  });

  test('submits the form with file', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(
      <BrowserRouter>
        <UploadExams />
      </BrowserRouter>
    );

    const fileInput = screen.getByLabelText(/Click to browse or drag and drop your files/i).closest('input');
    const file = new File(['dummy content'], 'Exam (2).pdf', { type: 'application/pdf' });

    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(screen.getByText(/Confirm/i));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith('/api/upload/uploadExam', expect.any(Object));
    });

    expect(screen.getByTitle(/PDF Preview/i)).toBeInTheDocument();
  });
});
