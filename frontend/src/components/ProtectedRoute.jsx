"use client";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user, loading, token } = useSelector((state) => state.auth);
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Ensure we wait for Redux hydration
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || loading) return;

    // Case 1: No token and not authenticated → redirect
    if (!token && !isAuthenticated) {
      setIsRedirecting(true);
      router.replace("/landingPage");
      return;
    }

    // Case 2: Token exists but user not loaded → redirect
    if (token && !user && !isAuthenticated) {
      setIsRedirecting(true);
      router.replace("/landingPage");
    }
  }, [hydrated, isAuthenticated, user, loading, token, router]);

  // Don't render until hydration completes
  if (!hydrated || loading || isRedirecting) {
    return null; // or loader
  }

  // Still not authenticated after hydration
  if (!isAuthenticated || !user) {
    return null;
  }

  return children;
}
