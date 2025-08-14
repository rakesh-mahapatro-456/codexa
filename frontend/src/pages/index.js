import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

export default function IndexPage() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/home");
    } else {
      router.replace("/landingPage");
    }
  }, [isAuthenticated, router]);

  return null; // or loading spinner
}
