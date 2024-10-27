"use client";
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import SideBar from "./components/SideBar";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserProvider } from "./lib/UserContext";

const noSidebarPaths = {
  folders: ["/pages/mobilePages"],
  pages: ["/pages/LoginPage", "/pages/SignupPage", "/pages/ForgotPass"],
};

const noAuthPaths = [
  ...noSidebarPaths.pages,
  "/pages/mobilePages", // Add the mobile pages path here
];

export default function ClientLayout({ children, user }) {
  const pathname = usePathname();
  const router = useRouter();

  // Function to determine if a page should have a sidebar
  const shouldHaveSidebar = () => {
    const inExcludedFolder = noSidebarPaths.folders.some((folder) =>
      pathname.startsWith(folder)
    );
    const isExcludedPage = noSidebarPaths.pages.includes(pathname);
    return !inExcludedFolder && !isExcludedPage;
  };

  // Check if the current path requires authentication
  const isAuthRequired = () => {
    return !noAuthPaths.some((path) => pathname.startsWith(path));
  };

  // Check if the page is a mobile-specific page
  const isMobilePage = () => {
    return pathname.startsWith("/pages/mobilePages");
  };

  // Check if the current page is the main login page
  const isMainLoginPage = () => {
    return pathname === "/pages/LoginPage";
  };

  // Check if the current page is the mobile login page
  const isMobileLoginPage = () => {
    return pathname === "/pages/mobilePages/mobileLogIn";
  };

  // Check if the user role is authorized based on the current page
  const isAuthorizedRole = (user) => {
    const role = user?.user_metadata?.role;
    if (isMainLoginPage()) {
      return role === "NURSE" || role === "BHW";
    } else if (isMobileLoginPage()) {
      return role === "mother";
    }
    return role === "NURSE" || role === "BHW" || role === "mother";
  };

  // Redirect logic based on authentication and role
  useEffect(() => {
    if (!user && isAuthRequired()) {
      router.push("/pages/LoginPage");
    } else if (user && !isAuthorizedRole(user)) {
      alert("This account is not authorized for this page");
      if (isMobileLoginPage()) {
        // If on main login page and not authorized, redirect to mobile login
        router.push("/pages/mobilePages/mobileLogIn");
      } else if (isMainLoginPage()) {
        // If on mobile login page and not authorized, redirect to main login
        router.push("/pages/LoginPage");
      } else {
        // For other pages, redirect to appropriate login based on role
        const role = user?.user_metadata?.role;
        if (role === "mother") {
          router.push("/pages/mobilePages/mobileLogIn");
        } else {
          router.push("/pages/LoginPage");
        }
      }
    }
  }, [user, pathname, router]);

  // Render nothing while redirecting to avoid flashing content
  if (!user && isAuthRequired()) {
    return null; // Or a loading spinner
  }

  const renderContent = () => {
    if (isMobilePage()) {
      return (
        <UserProvider value={user}>
          <ProtectedRoute>{children}</ProtectedRoute>
        </UserProvider>
      );
    } else if (shouldHaveSidebar()) {
      return (
        <UserProvider value={user}>
          <SideBar user={user}>{children}</SideBar>;
        </UserProvider>
      );
    } else {
      return children;
    }
  };

  return <>{renderContent()}</>;
}
