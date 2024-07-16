// UploadExamKey.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";
import ConfirmExamKey from "../Instructor/ConfirmExamKey"; // Adjust the import path as necessary
import { BrowserRouter } from "react-router-dom";

describe("ConfirmExamKey Component", () => {
  test("formats the csv file correctly", () => {
    render(
      <BrowserRouter>
        <ConfirmExamKey />
      </BrowserRouter>
    );

    const dataCsv = {
      file_id: "page_1.png",
      input_path: "inputs/converted_images/page_1.png",
      output_path: "outputs/CheckedOMRs/page_1.png",
      q1: "A",
      q2: "B",
      q3: "C",
      q4: "D",
      q5: "E",
      q6: "",
      q7: "",
      q8: "",
      q9: "",
      q10: "",
    };
  });
});
