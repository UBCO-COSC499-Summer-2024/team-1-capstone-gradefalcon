import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ExamControls from '../Instructor/ExamControls';
import { BrowserRouter } from 'react-router-dom';

describe('ExamControls Component', () => {
  test('toggle switch for "Students can view their exam" works correctly', () => {
    render(<BrowserRouter><ExamControls /></BrowserRouter>);
    const toggleSwitch = screen.getByTestId('toggle-view-exam');

    expect(toggleSwitch).toHaveAttribute('data-state', 'unchecked'); // Ensure it is off initially

    fireEvent.click(toggleSwitch); // toggles switch ON

    expect(toggleSwitch).toHaveAttribute('data-state', 'checked'); // Ensure it is on after click

    fireEvent.click(toggleSwitch); // toggles switch OFF

    expect(toggleSwitch).toHaveAttribute('data-state', 'unchecked'); // Ensure it is off after click
  });

  test('toggle switch for "Students can view correct answers" works correctly', () => {
    render(<BrowserRouter><ExamControls /></BrowserRouter>);
    const toggleSwitch = screen.getByTestId('toggle-view-answers');

    expect(toggleSwitch).toHaveAttribute('data-state', 'unchecked'); // Ensure it is off initially

    fireEvent.click(toggleSwitch); // toggles switch ON

    expect(toggleSwitch).toHaveAttribute('data-state', 'checked'); // Ensure it is on after click

    fireEvent.click(toggleSwitch); // toggles switch OFF

    expect(toggleSwitch).toHaveAttribute('data-state', 'unchecked'); // Ensure it is off after click
  });

  test('toggle switch for "Students can see exam statistics" works correctly', () => {
    render(<BrowserRouter><ExamControls /></BrowserRouter>);
    const toggleSwitch = screen.getByTestId('toggle-view-stats');

    expect(toggleSwitch).toHaveAttribute('data-state', 'unchecked'); // Ensure it is off initially

    fireEvent.click(toggleSwitch); // toggles switch ON

    expect(toggleSwitch).toHaveAttribute('data-state', 'checked'); // Ensure it is on after click

    fireEvent.click(toggleSwitch); // toggles switch OFF

    expect(toggleSwitch).toHaveAttribute('data-state', 'unchecked'); // Ensure it is off after click
  });
});
