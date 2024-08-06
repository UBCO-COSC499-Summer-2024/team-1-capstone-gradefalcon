import React from 'react';
import '@fontsource/inter/latin.css'; // Import the font
import '../css/App.css'; // Import global styles
import { useLocation, Link } from "react-router-dom";
import { useNavigate} from "react-router-dom";
import { ClipboardCheck, Settings, LogOut, Flag } from "lucide-react"; // Import Flag icon
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '../components/ui/breadcrumb';
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "../components/ui/button";

const StudentLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth0();
  const handleLogout = async () => {
    try {
      // Perform the Auth0 logout
      logout({ logoutParams: { returnTo: window.location.origin } });

      // Optionally navigate to a different page after logout
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const generateBreadcrumbItems = () => {
    const pathnames = location.pathname.split('/').filter(x => x);
    // Always start with the dashboard breadcrumb item.
    const breadcrumbItems = [{ href: "/StudentDashboard", label: "Dashboard" }];
    pathnames.forEach((value, index) => {
      const href = `/${pathnames.slice(0, index + 1).join('/')}`;
      const label = value.charAt(0).toUpperCase() + value.slice(1);
      breadcrumbItems.push({ href, label });
    });
    return breadcrumbItems;
  };

  const breadcrumbItems = generateBreadcrumbItems();

  return (
    <div 
      lang="en" 
      className="antialiased h-full"
      style={{ 
        '--font-heading': 'Inter', 
        '--font-body': 'Inter' 
      }}
    >
      <nav className="bg-[hsl(var(--primary))] p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-6 w-6 text-white" />
          <span className="font-bold text-2xl text-white">GradeFalcon</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/StudentAccountSettings">
            <Button variant="ghost" className="p-2 hover:bg-transparent text-white flex items-center hover:text-white">
              <Settings className="h-6 w-6 text-white mr-2" />
              Account Settings
            </Button>
          </Link>
          <Link to="/StudentReportsSubmitted">
            <Button variant="ghost" className="p-2 hover:bg-transparent text-white flex items-center hover:text-white">
              <Flag className="h-6 w-6 text-white mr-2" />
              Reports
            </Button>
          </Link>
          <Button onClick={handleLogout} variant="ghost" className="p-2 hover:bg-transparent text-white flex items-center hover:text-white">
            <LogOut className="h-6 w-6 text-white mr-2" />
            Logout
          </Button>
        </div>
      </nav>
      <div className="p-8 bg-gradient-to-r from-gradient-start to-gradient-end">
        <div className="flex justify-between">
          <div className="py-4">
            <Breadcrumb>
              <BreadcrumbList className="text-lg"> {/* Increase the font size here */}
                {breadcrumbItems.map((item, index) => (
                  <BreadcrumbItem key={index}>
                    <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                    {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default StudentLayout;
