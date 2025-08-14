"use client";
import { NavbarLogo, NavbarButton } from "@/components/ui/resizable-navbar";
import { ThemeToggle } from "../theme/ThemeToggle";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function NavbarLanding() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignupClick = () => {
    router.push('/signup');
  };

  return (
    <div className="relative w-full">
      <div className="fixed inset-x-0 top-0 z-40 w-full">
        <div
          className={`
            mx-auto flex w-full max-w-7xl items-center justify-between 
            px-4 py-2 transition-all duration-500 ease-in-out rounded-full
            ${scrolled 
              ? 'bg-white/80 dark:bg-neutral-950/80 shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] backdrop-blur-[10px] mt-5' 
              : 'bg-transparent'
            }
          `}
        >
          <NavbarLogo />
          <div className="flex items-center gap-4">
            <NavbarButton variant="primary" onClick={handleSignupClick}>
              Signup
            </NavbarButton>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}