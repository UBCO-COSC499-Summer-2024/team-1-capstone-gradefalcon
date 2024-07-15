import React from 'react';
import '../css/App.css';
import { Link, useNavigate } from "react-router-dom";
import { ClipboardCheck, Home, BookOpen, LineChart, Users, Settings } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "../components/ui/dropdown-menu";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "../components/ui/alert-dialog";

export default function NavBar() {

    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
          const response = await fetch("/api/auth/logout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.ok) {
            navigate("/");
          } else {
            console.error("Logout failed");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };

    return (
 <div>
    </div>
    );
  };