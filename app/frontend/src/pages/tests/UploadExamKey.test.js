import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import fetchMock from 'jest-fetch-mock';
import UploadExamKey from '../Instructor/UploadExamKey';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    state: { className: 'Test Class', userName: 'Test User', userID: '1', examTitle: 'Test Exam', examID: '123' },
  }),
}));

beforeEach(() => {
  fetchMock.resetMocks();
});

describe('UploadExamKey Component', () => {
  test('renders UploadExamKey component', () => {
    render(
      <BrowserRouter>
        <UploadExamKey />
      </BrowserRouter>
    );

    expect(screen.getByText(/Upload the exam answer key as a PDF file./i)).toBeInTheDocument();
  });

  test('file upload and preview', () => {
    render(
      <BrowserRouter>
        <UploadExamKey />
      </BrowserRouter>
    );

    const fileInput = screen.getByText(/Click to browse or drag and drop your files/i).closest('div');
    const file = new File(['dummy content'], 'Exam (2).pdf', { type: 'application/pdf' });

    fireEvent.change(fileInput.querySelector('file-input'), { target: { files: [file] } });

    expect(screen.getByTitle(/PDF Preview/i)).toBeInTheDocument();
  });

  test('submits the form with file', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }), { status: 200 });

    render(
      <BrowserRouter>
        <UploadExamKey />
      </BrowserRouter>
    );

    const fileInput = screen.getByText(/Click to browse or drag and drop your files/i).closest('div');
    const file = new File(['dummy content'], 'Exam (2).pdf', { type: 'application/pdf' });

    fireEvent.change(fileInput.querySelector('file-input'), { target: { files: [file] } });
    fireEvent.click(screen.getByText(/Confirm/i));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
      expect(fetchMock).toHaveBeenCalledWith('/api/upload/uploadExamKey', expect.any(Object));
    });

    expect(screen.getByTitle(/PDF Preview/i)).toBeInTheDocument();
  });
});
