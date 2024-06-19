import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NotificationPreferences from '../Instructor/NotificationPreferences';

describe('NotificationPreferences Component', () => {
  test('toggle switch for "Email Notifications" works correctly', () => {
    render(<NotificationPreferences />);
    const toggleSwitch = screen.getByTestId('toggle-email-notifications');

    expect(toggleSwitch).not.toBeChecked(); // Default switch off
    expect(toggleSwitch.checked).toBe(false);

    fireEvent.click(toggleSwitch); // Toggles switch ON

    expect(toggleSwitch).toBeChecked();
    expect(toggleSwitch.checked == false).toBe(false);

    fireEvent.click(toggleSwitch); // Toggles switch OFF

    expect(toggleSwitch).not.toBeChecked();
    expect(toggleSwitch.checked).toBe(false);
  });

  test('toggle switch for "SMS Notifications" works correctly', () => {
    render(<NotificationPreferences />);
    const toggleSwitch = screen.getByTestId('toggle-sms-notifications');

    expect(toggleSwitch).not.toBeChecked(); // Default switch off
    expect(toggleSwitch.checked).toBe(false);

    fireEvent.click(toggleSwitch); // Toggles switch ON

    expect(toggleSwitch).toBeChecked();
    expect(toggleSwitch.checked == false).toBe(false);

    fireEvent.click(toggleSwitch); // Toggles switch OFF

    expect(toggleSwitch).not.toBeChecked();
    expect(toggleSwitch.checked).toBe(false);
  });

  test('toggle switch for "Push Notifications" works correctly', () => {
    render(<NotificationPreferences />);
    const toggleSwitch = screen.getByTestId('toggle-push-notifications');

    expect(toggleSwitch).not.toBeChecked(); // Default switch off
    expect(toggleSwitch.checked).toBe(false);

    fireEvent.click(toggleSwitch); // Toggles switch ON

    expect(toggleSwitch).toBeChecked();
    expect(toggleSwitch.checked == false).toBe(false);

    fireEvent.click(toggleSwitch); // Toggles switch OFF

    expect(toggleSwitch).not.toBeChecked();
    expect(toggleSwitch.checked).toBe(false);
  });
});
