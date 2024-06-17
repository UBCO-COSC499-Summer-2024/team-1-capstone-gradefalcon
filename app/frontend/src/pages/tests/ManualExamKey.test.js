import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ManualExamKey from '../../../src/pages/Instructor/ManualExamKey'; 

test('displays correct number of questions and options', () => {
  render(<ManualExamKey />);

  const numQuestionsInput = screen.getByTestId('num-questions-input');
  const numOptionsInput = screen.getByTestId('num-options-input');

  // Change number of questions to 5 and options to 4
  fireEvent.change(numQuestionsInput, { target: { value: 5 } });
  fireEvent.change(numOptionsInput, { target: { value: 4 } });

  const bubbleGrid = screen.getByTestId('bubble-grid');
  const questions = bubbleGrid.querySelectorAll('.question');

  expect(questions.length).toBe(5);
  questions.forEach(question => {
    const options = question.querySelectorAll('.option');
    expect(options.length).toBe(4);
  });

  // Reverse verification: ensure that 4 questions do not show up
  expect(questions.length).not.toBe(4);
  // Reverse verification: ensure that 3 options do not show up
  questions.forEach(question => {
    const options = question.querySelectorAll('.option');
    expect(options.length).not.toBe(3);
  });
});

test('reverse verification: ensure wrong number of questions does not show up', () => {
  render(<ManualExamKey />);

  const numQuestionsInput = screen.getByTestId('num-questions-input');

  // Set number of questions to 5 and check that 4 questions are not displayed
  fireEvent.change(numQuestionsInput, { target: { value: 5 } });
  const bubbleGrid = screen.getByTestId('bubble-grid');
  const questions = bubbleGrid.querySelectorAll('.question');

  expect(questions.length).toBe(5);
  expect(questions.length).not.toBe(4);
});

test('reverse verification: ensure wrong number of options does not show up', () => {
  render(<ManualExamKey />);

  const numQuestionsInput = screen.getByTestId('num-questions-input');
  const numOptionsInput = screen.getByTestId('num-options-input');

  // Change number of questions to 5 and options to 4
  fireEvent.change(numQuestionsInput, { target: { value: 5 } });
  fireEvent.change(numOptionsInput, { target: { value: 4 } });

  const bubbleGrid = screen.getByTestId('bubble-grid');
  const questions = bubbleGrid.querySelectorAll('.question');

  questions.forEach(question => {
    const options = question.querySelectorAll('.option');
    expect(options.length).toBe(4);
    expect(options.length).not.toBe(3);
  });
});

// Base case: default number of questions and options
test('base case: displays default number of questions and options', () => {
  render(<ManualExamKey />);

  const bubbleGrid = screen.getByTestId('bubble-grid');
  const questions = bubbleGrid.querySelectorAll('.question');

  // Default values are 80 questions and 5 options
  expect(questions.length).toBe(80);
  questions.forEach(question => {
    const options = question.querySelectorAll('.option');
    expect(options.length).toBe(5);
  });
});

// Base case: handles minimum number of questions and options
test('base case: handles minimum number of questions and options', () => {
  render(<ManualExamKey />);

  const numQuestionsInput = screen.getByTestId('num-questions-input');
  const numOptionsInput = screen.getByTestId('num-options-input');

  // Set to minimum values
  fireEvent.change(numQuestionsInput, { target: { value: 1 } });
  fireEvent.change(numOptionsInput, { target: { value: 1 } });

  const bubbleGrid = screen.getByTestId('bubble-grid');
  const questions = bubbleGrid.querySelectorAll('.question');

  expect(questions.length).toBe(1);
  questions.forEach(question => {
    const options = question.querySelectorAll('.option');
    expect(options.length).toBe(1);
  });
});

// Base case: handles maximum number of questions and options
test('base case: handles maximum number of questions and options', () => {
  render(<ManualExamKey />);

  const numQuestionsInput = screen.getByTestId('num-questions-input');
  const numOptionsInput = screen.getByTestId('num-options-input');

  // Set to maximum values
  fireEvent.change(numQuestionsInput, { target: { value: 300 } });
  fireEvent.change(numOptionsInput, { target: { value: 26 } });

  const bubbleGrid = screen.getByTestId('bubble-grid');
  const questions = bubbleGrid.querySelectorAll('.question');

  expect(questions.length).toBe(300);
  questions.forEach(question => {
    const options = question.querySelectorAll('.option');
    expect(options.length).toBe(26);
  });
});