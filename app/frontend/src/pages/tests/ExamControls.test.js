import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ExamControls from '../Instructor/ExamControls';


//While its against convetion to have repedtive code, by seperating it any issues might be easier/faster to isolate

describe('ExamControls Component', () => {
  test('toggle switch for "Students can view their exam" works correctly', () => {
    render(<ExamControls />);
    const toggleSwitch = screen.getByTestId('toggle-view-exam');

    expect(toggleSwitch).not.toBeChecked(); //default switch off first time visiting page, ASSERT(NOT SELECTED)->true
    expect(toggleSwitch.checked).toBe(false); //ASSERT(SELECTED)->false

    fireEvent.click(toggleSwitch); //toggles switch ON

    expect(toggleSwitch).toBeChecked(); //ASSERT(SELECTED)->true
    expect(toggleSwitch.checked == false).toBe(false); //ASSERT(NOT SELECTED)->false

    fireEvent.click(toggleSwitch); //toggles switch OFF

    expect(toggleSwitch).not.toBeChecked(); //ASSERT(NOT SELECTED)->true
    expect(toggleSwitch.checked).toBe(false); //ASSERT(SELECTED)->false
});
test('toggle switch for "Students can view their exam" works correctly', () => {
    render(<ExamControls />);
    const toggleSwitch = screen.getByTestId('toggle-view-answers');

    expect(toggleSwitch).not.toBeChecked(); //default switch off first time visiting page, ASSERT(NOT SELECTED)->true
    expect(toggleSwitch.checked).toBe(false); //ASSERT(SELECTED)->false

    fireEvent.click(toggleSwitch); //toggles switch ON

    expect(toggleSwitch).toBeChecked(); //ASSERT(SELECTED)->true
    expect(toggleSwitch.checked == false).toBe(false); //ASSERT(NOT SELECTED)->false

    fireEvent.click(toggleSwitch); //toggles switch OFF

    expect(toggleSwitch).not.toBeChecked(); //ASSERT(NOT SELECTED)->true
    expect(toggleSwitch.checked).toBe(false); //ASSERT(SELECTED)->false
});
test('toggle switch for "Students can view their exam" works correctly', () => {
    render(<ExamControls />);
    const toggleSwitch = screen.getByTestId('toggle-view-stats');

    expect(toggleSwitch).not.toBeChecked(); //default switch off first time visiting page, ASSERT(NOT SELECTED)->true
    expect(toggleSwitch.checked).toBe(false); //ASSERT(SELECTED)->false

    fireEvent.click(toggleSwitch); //toggles switch ON

    expect(toggleSwitch).toBeChecked(); //ASSERT(SELECTED)->true
    expect(toggleSwitch.checked == false).toBe(false); //ASSERT(NOT SELECTED)->false

    fireEvent.click(toggleSwitch); //toggles switch OFF

    expect(toggleSwitch).not.toBeChecked(); //ASSERT(NOT SELECTED)->true
    expect(toggleSwitch.checked).toBe(false); //ASSERT(SELECTED)->false
});
});