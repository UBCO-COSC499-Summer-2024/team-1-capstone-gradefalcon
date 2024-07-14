import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NewExam from '../Instructor/NewExam';
import { BrowserRouter } from 'react-router-dom';

describe('NewExam Component', () => {
  test('upload answer key button takes you to the correct location', () => {
    render(<BrowserRouter><NewExam /></BrowserRouter>);
    const examTitleInput = screen.getByTestId('exam-title-input');
    fireEvent.change(examTitleInput, { target: { value: 'Dummy input' } });
    const uploadAnswerKeyButton = screen.getByTestId('upload-answer-key-btn');
    fireEvent.click(uploadAnswerKeyButton); // simulate the click event
    expect(uploadAnswerKeyButton.closest('a')).toHaveAttribute('href', '/UploadExamKey');
  });

  test('manually select answers button takes you to the correct location', () => {
    render(<BrowserRouter><NewExam /></BrowserRouter>);
    const examTitleInput = screen.getByTestId('exam-title-input');
    fireEvent.change(examTitleInput, { target: { value: 'Dummy input' } });
    const manualAnswerKeyButton = screen.getByTestId('manual-answer-key-btn');
    expect(manualAnswerKeyButton.closest('a')).toHaveAttribute('href', expect.stringMatching(/^\/ManualExamKey/));
  });

  test('manually select answers button disables when there is no title', () => {
    render(<BrowserRouter><NewExam /></BrowserRouter>);
    const manualAnswerKeyButton = screen.getByTestId('manual-answer-key-btn');
    expect(manualAnswerKeyButton.closest('a')).toHaveAttribute('href', expect.stringMatching('/'));
  });

  test('exam title input prevents SQL injection characters', () => {
    render(<BrowserRouter><NewExam /></BrowserRouter>);
    const examTitleInput = screen.getByTestId('exam-title-input');
    fireEvent.change(examTitleInput, { target: { value: 'String; Break \'\"Attempt;' } });
    expect(examTitleInput).toHaveValue('String Break Attempt'); //SQL injection will be prevented in the handling anyway, its just an extra layer 
  });

  test('correct input for "exam title"', () => {
    render(<BrowserRouter><NewExam /></BrowserRouter>);
    const examTitleInput = screen.getByTestId('exam-title-input');
    fireEvent.change(examTitleInput, { target: { value: 'Graphic; DROP \'\"TABLE NotaTable;' } });
    expect(examTitleInput).toHaveValue('Graphic DROP TABLE NotaTable'); //SQL injection will be prevented in the handling anyway, its just an extra layer 
  });
});
