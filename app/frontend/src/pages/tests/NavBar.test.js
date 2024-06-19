import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NavBar from '../../NavBar';

test('renders Dashboard link', () => {
    render(React.createElement(NavBar));
    const linkElement = screen.getByText(/Dashboard/i);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.closest('a')).toHaveAttribute('href', '/Dashboard');
});

test('renders Schedule link', () => {
    render(React.createElement(NavBar));
    const linkElement = screen.getByText(/Schedule/i);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.closest('a')).toHaveAttribute('href', '/Schedule');
});

test('renders Exam Board link', () => {
    render(React.createElement(NavBar));
    const linkElement = screen.getByText(/Exam Board/i);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.closest('a')).toHaveAttribute('href', '/ExamBoard');
});

test('renders Grade Report link', () => {
    render(React.createElement(NavBar));
    const linkElement = screen.getByText(/Grade Report/i);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.closest('a')).toHaveAttribute('href', '/GradeReport');
});

test('renders Classes link', () => {
    render(React.createElement(NavBar));
    const linkElement = screen.getByText(/Classes/i);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.closest('a')).toHaveAttribute('href', '/Classes');
});

test('renders Account Settings link', () => {
    render(React.createElement(NavBar));
    const linkElement = screen.getByText(/Account Settings/i);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.closest('a')).toHaveAttribute('href', '/AccountSettings');
});

test('renders Notification Preferences link', () => {
    render(React.createElement(NavBar));
    const linkElement = screen.getByText(/Notification Preferences/i);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.closest('a')).toHaveAttribute('href', '/NotificationPreferences');
});

test('renders Logout link', () => {
    render(React.createElement(NavBar));
    const linkElement = screen.getByText(/Logout/i);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.closest('a')).toHaveAttribute('href', '/Logout');
});
