"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  Book,
  Users,
  LogOut,
  Home as HomeIcon,
  Settings,
} from "lucide-react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../theme/ThemeToggle";
import { Dock, DockIcon } from "../../components/magicui/dock";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";
import { useDispatch } from "react-redux";
import { logout } from "../../store/feature/auth/authSlice";

const NavBar = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleNavigate = (path) => {
    router.push(path);
  };

  // const handleLogout = async () => {
  //   try {
  //     // Dispatch logout action to clear Redux state
  //     dispatch(logout());
      
  //     // Force navigate to login/landing page
  //     router.push("/landingPage");
      
  //     // Optional: Force a complete page reload to ensure clean state
  //     // This helps clear any remaining component state or cached data
  //     setTimeout(() => {
  //       window.location.href = "/landingPage";
  //     }, 100);
      
  //   } catch (error) {
  //     console.error("Logout error:", error);
  //     // Fallback: Force navigation even if there's an error
  //     window.location.href = "/landingPage";
  //   }
  // };

  const handleLogout = () => {
    // 1️⃣ Dispatch logout to clear Redux state
    dispatch(logout());
  
    // 2️⃣ Redirect to landing page safely
    router.replace("/landingPage");
  };

  return (
    <Dock
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 backdrop-blur-sm bg-white/60 dark:bg-neutral-900/60"
      iconSize={40}
      iconMagnification={60}
      iconDistance={140}
      direction="middle"
    >
      {/* Home */}
      <DockIcon>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => handleNavigate("/home")}
                variant="ghost"
                size="icon"
                aria-label="Home"
              >
                <HomeIcon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Home</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DockIcon>

      {/* DSA */}
      <DockIcon>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => handleNavigate("/DSA")}
                variant="ghost"
                size="icon"
                aria-label="DSA"
              >
                <Book className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>DSA</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DockIcon>

      {/* Party */}
      <DockIcon>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => handleNavigate("/party")}
                variant="ghost"
                size="icon"
                aria-label="Party"
              >
                <Users className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Party</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DockIcon>

      {/* Settings */}
      <DockIcon>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => handleNavigate("/settings")}
                variant="ghost"
                size="icon"
                aria-label="Settings"
              >
                <Settings className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DockIcon>

      {/* Logout */}
      <DockIcon>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="icon"
                aria-label="Logout"
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Logout</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DockIcon>

      {/* Theme Toggle */}
      <DockIcon>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <ThemeToggle />
            </TooltipTrigger>
            <TooltipContent>Theme</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DockIcon>
    </Dock>
  );
};

export default NavBar;