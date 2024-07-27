import { Link } from "react-router-dom";
import { ClipboardCheck, Home, BookOpen, Users, Settings } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "./ui/dropdown-menu";

export default function Sidebar({ handleLogout }) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <ClipboardCheck className="h-6 w-6" />
        <span className="ml-2">GradeFalcon</span>
      </div>
      <nav className="flex flex-col gap-3 py-12">
        <Link to="/Dashboard" className="nav-item" data-tooltip="Dashboard">
          <Home className="icon" />
          <span>Dashboard</span>
        </Link>
        <Link to="/Examboard" className="nav-item" data-tooltip="Exam Board">
          <BookOpen className="icon" />
          <span>Exam Board</span>
        </Link>
        <Link to="/Classes" className="nav-item" data-tooltip="Courses">
          <Users className="icon" />
          <span>Courses</span>
        </Link>
      </nav>
      <div className="mt-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="nav-item" data-tooltip="My Account" data-testid="my-account-button">
              <Settings className="icon" />
              <span>My Account</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/AccountSettings">Account Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/NotificationPreferences">Notification Preferences</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild onClick={handleLogout}>
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
