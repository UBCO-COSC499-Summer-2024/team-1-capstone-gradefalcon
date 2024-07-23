import React from 'react';
import '@fontsource/inter/latin.css'; // Import the font
import '../css/App.css'; // Import global styles
import Sidebar from '../components/Sidebar';
import { useLocation, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '../components/ui/breadcrumb';

const Layout = ({ children }) => {
  const location = useLocation();
  const shouldDisplayNavBar = location.pathname !== "/" && location.pathname !== "/*" && location.pathname !== "/login" 
    && location.pathname !== "/signup" && location.pathname !== "/AdminDashboard" 
    && location.pathname !== "/userManagement" && location.pathname !== "/Logout";

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        alert("Logged out");
        window.location.href = "/";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const generateBreadcrumbItems = () => {
    const pathnames = location.pathname.split('/').filter(x => x);
    // Always start with the dashboard breadcrumb item.
    const breadcrumbItems = [{ href: "/dashboard", label: "Dashboard" }];
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
      className="antialiased"
      style={{ 
        '--font-heading': 'Inter', 
        '--font-body': 'Inter' 
      }}
    >
      {shouldDisplayNavBar && <Sidebar handleLogout={handleLogout} />}
      <div className={shouldDisplayNavBar ? "main-content flex-1 p-8 bg-gradient-to-r from-gradient-start to-gradient-end" : ""}>
        {shouldDisplayNavBar && (
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
        )}
        {children}
      </div>
    </div>
  );
};

export default Layout;
