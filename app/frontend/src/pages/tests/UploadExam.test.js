import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import UploadExams from '../Instructor/UploadExams';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    state: { className: 'Test Class', userName: 'Test User', userID: '1', examTitle: 'Test Exam', examID: '123', courseID: '456', classID: '789' }
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

    expect(screen.getByText(/Upload Exam/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload the exam as a PDF file./i)).toBeInTheDocument();
  });

  test('file upload and preview', async () => {
    render(
      <BrowserRouter>
        <UploadExams />
      </BrowserRouter>
    );

    const fileInput = screen.getByTestId('file-input');
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

    const fileInput = screen.getByTestId('file-input');
    const file = new File(['dummy content'], 'Exam (2).pdf', { type: 'application/pdf' });

    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(screen.getByText(/Import/i));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith('/api/exam/UploadExam', expect.any(Object));
      expect(global.fetch).toHaveBeenCalledWith('/api/exam/GenerateEvaluation', expect.any(Object));
      expect(global.fetch).toHaveBeenCalledWith('/api/exam/copyTemplate', expect.any(Object));
    });

    expect(screen.getByTitle(/PDF Preview/i)).toBeInTheDocument();
  });
});
