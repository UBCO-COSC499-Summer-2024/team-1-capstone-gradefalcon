// src/Instructor/AccountSettings.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AccountSettings from '../Instructor/AccountSettings';

test('renders Account Settings component', () => {
  const { getByTestId } = render(<AccountSettings />);
  expect(getByTestId('header')).toBeInTheDocument();
  expect(getByTestId('username-input')).toBeInTheDocument();
  expect(getByTestId('old-password-input')).toBeInTheDocument();
  expect(getByTestId('new-password-input')).toBeInTheDocument();
  expect(getByTestId('confirm-password-input')).toBeInTheDocument();
});

test('prevents SQL injection in username input', () => {
  const { getByTestId } = render(<AccountSettings />);
  const usernameInput = getByTestId('username-input');

  fireEvent.change(usernameInput, { target: { value: "String() Break \"Attempt;" } }); //attempt to enter string breaking input simulating SQL injection
                                                                                       //SQL injection will be prevented in the handling anyway, its just an extra layer
  expect(usernameInput.value).toBe('String Break Attempt');
});

test('password match validation', () => {
  const { getByTestId } = render(<AccountSettings />);
  const newPasswordInput = getByTestId('new-password-input');
  const confirmPasswordInput = getByTestId('confirm-password-input');
  const saveButton = getByTestId('save-changes-btn');

  fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
  fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword123' } });

  fireEvent.click(saveButton);
  expect(window.alert).toHaveBeenCalledWith('New passwords do not match');
});

// Mock window.alert
beforeAll(() => {
  window.alert = jest.fn();
});
