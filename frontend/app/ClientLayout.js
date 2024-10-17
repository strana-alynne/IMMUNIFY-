"use client";

import { usePathname, useRouter } from "next/navigation";
import SideBar from "./components/SideBar";
import { useEffect } from "react";

const noSidebarPaths = {
  folders: ["/pages/mobilePages"], // This matches the actual path structure
  pages: ["/pages/LoginPage", "/pages/SignupPage", "/pages/ForgotPass"],
};

export default function ClientLayout({ children, user }) {
  const pathname = usePathname();
  const router = useRouter();

  const shouldHaveSidebar = () => {
    // Check if the path starts with any of the excluded folders
    const inExcludedFolder = noSidebarPaths.folders.some((folder) =>
      pathname.startsWith(folder)
    );

    // Check if the path exactly matches any of the excluded pages
    const isExcludedPage = noSidebarPaths.pages.includes(pathname);

    return !inExcludedFolder && !isExcludedPage;
  };

  useEffect(() => {
    if (!user && !noSidebarPaths.pages.includes(pathname)) {
      router.push("/pages/LoginPage");
    }
  }, [user, pathname, router]);

  if (!user && !noSidebarPaths.pages.includes(pathname)) {
    return null; // or a loading spinner
  }

  return (
    <>
      {shouldHaveSidebar() ? (
        <SideBar user={user}>{children}</SideBar>
      ) : (
        children
      )}
      <footer
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100px",
        }}
      >
        @BalsomoPagueVillacis 2024
      </footer>
    </>
  );
}
