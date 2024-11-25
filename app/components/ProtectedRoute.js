"use client"; // Enables client-side hooks

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname(); // Get current path to avoid redirect loops
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session && pathname !== "/pages/mobilePages/MobileLogIn") {
        router.push("/pages/mobilePages/MobileLogIn"); // Redirect if not logged in
      } else {
        setLoading(false); // Session exists, render content
      }
    };

    checkSession();
  }, [router, pathname]);

  if (loading) {
    return <p>Loading...</p>; // Show loading while checking auth
  }

  return <>{children}</>;
}
