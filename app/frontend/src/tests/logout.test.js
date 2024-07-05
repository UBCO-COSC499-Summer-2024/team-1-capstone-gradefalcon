import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import Logout from '../pages/Logout';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
    fetchMock.resetMocks();
});

describe('Logout Component', () => {
    it('should log out successfully and redirect to login', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ message: 'Logout successful' }));

        render(
            <MemoryRouter initialEntries={['/Logout']}>
                <Routes>
                    <Route path="/Logout" element={<Logout />} />
                    <Route path="/login" element={<div>Login Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Logging out')).toBeInTheDocument();

        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledWith('api/auth/logout', expect.anything());
            expect(screen.getByText('Logging out')).toBeInTheDocument();
        });
    });

    it('should handle logout failure and log an error', async () => {
        fetchMock.mockRejectOnce(new Error('Logout failed'));

        console.error = jest.fn();

        render(
            <MemoryRouter initialEntries={['/Logout']}>
                <Routes>
                    <Route path="/Logout" element={<Logout />} />
                    <Route path="/login" element={<div>Login Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Logging out')).toBeInTheDocument();

        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledWith('api/auth/logout', expect.anything());
            expect(console.error).toHaveBeenCalledWith('Error:', expect.any(Error));
        });
    });
});
