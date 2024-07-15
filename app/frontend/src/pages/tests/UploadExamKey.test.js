// UploadExamKey.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";
import UploadExamKey from "../Instructor/UploadExamKey"; // Adjust the import path as necessary
import { BrowserRouter } from "react-router-dom";

fetchMock.enableMocks();

// Helper function to create a file
const createFile = (name, size, type) => {
  const file = new File([], name, { type });
  Object.defineProperty(file, "size", {
    get() {
      return size;
    },
  });
  return file;
};

// Mock URL.createObjectURL
beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => "mock-file-url");
});

beforeEach(() => {
  fetchMock.resetMocks();
  fetchMock.mockResponseOnce(JSON.stringify({ success: true })); // Mock response for the first fetch call
  fetchMock.mockResponseOnce(JSON.stringify({ success: true })); // Mock response for the second fetch call
});

describe("UploadExamKey Component", () => {
  test("renders upload instructions", () => {
    render(
      <BrowserRouter>
        <UploadExamKey />
      </BrowserRouter>
    );
    expect(
      screen.getByText(/Upload the exam answer key as a PDF file./i)
    ).toBeInTheDocument();
  });

  test("only upload pdf files", async () => {
    render(
      <BrowserRouter>
        <UploadExamKey />
      </BrowserRouter>
    );

    // Simulate file input selection
    const fileInput = screen.getByTestId("file-input");
    const pdfFile = createFile("test.pdf", 1024, "application/pdf");
    Object.defineProperty(fileInput, "files", {
      value: [pdfFile],
    });
    fireEvent.change(fileInput);

    // Check if the PDF iframe is displayed after uploading a PDF file
    const pdfIframe = await screen.findByTitle("PDF Preview");
    expect(pdfIframe).toBeInTheDocument();
  });

  test("reset upload clears the file input", async () => {
    render(
      <BrowserRouter>
        <UploadExamKey />
      </BrowserRouter>
    );

    // Simulate file input selection
    const fileInput = screen.getByTestId("file-input");
    const pdfFile = createFile("test.pdf", 1024, "application/pdf");
    Object.defineProperty(fileInput, "files", {
      value: [pdfFile],
    });
    fireEvent.change(fileInput);

    // Click the reset button
    fireEvent.click(screen.getByText(/Reset/i));

    // Check if the upload-area div style is set to display: block
    const uploadArea = document.querySelector(".upload-area");
    expect(uploadArea).toHaveStyle("display: block");
  });

  it("should call saveExamKey and copyTemplate APIs on file upload", async () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <UploadExamKey />
      </BrowserRouter>
    );
    const fileInput = getByTestId("file-input");
    const file = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(screen.getByText(/Import/i));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenCalledWith(
        "/api/exam/saveExamKey",
        expect.anything()
      );
      expect(fetch).toHaveBeenCalledWith(
        "/api/exam/copyTemplate",
        expect.anything()
      );
    });
  });
});
