const React = require('react');
const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
require('@testing-library/jest-dom/extend-expect');
const { BrowserRouter } = require('react-router-dom');
const fetchMock = require('jest-fetch-mock');
const UploadExams = require('../Instructor/UploadExams'); // Ensure this path is correct

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    state: { className: 'Test Class', userName: 'Test User', userID: '1', examTitle: 'Test Exam', examID: '123' }
  })
}));

beforeEach(() => {
  fetchMock.resetMocks();
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

  test('file upload and preview', () => {
    render(
      <BrowserRouter>
        <UploadExams />
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
        <UploadExams />
      </BrowserRouter>
    );

    const fileInput = screen.getByText(/Click to browse or drag and drop your files/i).closest('div');
    const file = new File(['dummy content'], 'Exam (2).pdf', { type: 'application/pdf' });

    fireEvent.change(fileInput.querySelector('file-input'), { target: { files: [file] } });
    fireEvent.click(screen.getByText(/Confirm/i));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
      expect(fetchMock).toHaveBeenCalledWith('/api/upload/uploadExam', expect.any(Object));
    });

    expect(screen.getByTitle(/PDF Preview/i)).toBeInTheDocument();
  });
});
