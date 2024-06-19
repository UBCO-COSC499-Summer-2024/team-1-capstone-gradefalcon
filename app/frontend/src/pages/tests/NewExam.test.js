// NewExam.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NewExam from '../Instructor/NewExam';

describe('NewExam Component', () => {
  test('upload answer key button takes you to the correct location', () => {
    render(<NewExam />);
    const uploadAnswerKeyButton = screen.getByTestId('upload-answer-key-btn');
    expect(uploadAnswerKeyButton).toHaveAttribute('href', './UploadExamKey');
  });

  test('manually select answers button takes you to the correct location', () => {
    render(<NewExam />);
    const manualAnswerKeyButton = screen.getByTestId('manual-answer-key-btn');
    expect(manualAnswerKeyButton).toHaveAttribute('href', './ManualExamKey');
  });

  test('exam title input prevents SQL injection characters', () => {
    render(<NewExam />);
    const examTitleInput = screen.getByTestId('exam-title-input');
    fireEvent.change(examTitleInput, { target: { value: 'Graphic; DROP \'\"TABLE NotaTable;' } });
    expect(examTitleInput).toHaveValue('Graphic DROP TABLE NotaTable'); //proof of conncept, test file is not co
  });
});
 test('correct input for \"exam title\"', () => {
    render(<NewExam/>);
    const examTitleInput = screen.getByTestId('exam-title-input');
    fireEvent.change(examTitleInput, { target: { value: 'Graphic; DROP \'\"TABLE NotaTable;' } });



 });
