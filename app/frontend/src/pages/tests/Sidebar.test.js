import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../../components/Sidebar'; // Ensure this path is correct
import '@testing-library/jest-dom/extend-expect';

// Mock the lucide-react icons
jest.mock('lucide-react', () => ({
  ClipboardCheck: () => <svg data-testid="ClipboardCheck" />,
  Home: () => <svg data-testid="Home" />,
  BookOpen: () => <svg data-testid="BookOpen" />,
  Users: () => <svg data-testid="Users" />,
  Settings: () => <svg data-testid="Settings" />,
}));

// Mock the DropdownMenu components
jest.mock('../../components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }) => <div>{children}</div>,
  DropdownMenuLabel: ({ children }) => <div>{children}</div>,
  DropdownMenuSeparator: () => <div />,
  DropdownMenuItem: ({ children, onClick }) => <div onClick={onClick}>{children}</div>,
}));

describe('Sidebar', () => {
  const handleLogoutMock = jest.fn();

  beforeEach(() => {
    render(
      <MemoryRouter>
        <Sidebar handleLogout={handleLogoutMock} />
      </MemoryRouter>
    );
  });

  it('should render the logo', () => {
    expect(screen.getByTestId('ClipboardCheck')).toBeInTheDocument();
    expect(screen.getByText('GradeFalcon')).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Exam Board')).toBeInTheDocument();
    expect(screen.getByText('Courses')).toBeInTheDocument();
  });

  it('should render the My Account dropdown menu', async () => {
    const myAccountButton = screen.getByTestId('my-account-button');
    expect(myAccountButton).toBeInTheDocument();

    // Click to open the dropdown
    fireEvent.click(myAccountButton);

    // Check if the dropdown menu items are in the document
    expect(await screen.findByText('Account Settings')).toBeInTheDocument();
    expect(await screen.findByText('Notification Preferences')).toBeInTheDocument();
    expect(await screen.findByText('Logout')).toBeInTheDocument();
  });

  it('should call handleLogout when Logout is clicked', async () => {
    const myAccountButton = screen.getByTestId('my-account-button');

    // Click to open the dropdown
    fireEvent.click(myAccountButton);

    const logoutButton = await screen.findByText('Logout');
    fireEvent.click(logoutButton);

    expect(handleLogoutMock).toHaveBeenCalledTimes(1);
  });
});
