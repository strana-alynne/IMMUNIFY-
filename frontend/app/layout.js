import { Inter } from "next/font/google";
import "./globals.css";
import Theme from "./theme";
import ClientLayout from "./ClientLayout";
import { getUser } from "./lib/auth";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

const APP_NAME = "Immunify";
const APP_DEFAULT_TITLE = "Immunify";
const APP_TITLE_TEMPLATE = "%s - PWA App";
const APP_DESCRIPTION = "App for monitoring baby's immunization";

export const metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // Add these for better iOS support
    startupImage: [
      {
        url: "/logo.svg",
        media:
          "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)",
      },
      // Add more sizes as needed
    ],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  // Add these meta tags
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16", type: "image/x-icon" },
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
    ],
    apple: [
      {
        url: "/icon512_rounded.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/icon512_rounded.svg",
      },
    ],
  },
};

export const viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  // Add these for better mobile experience
  userScalable: false,
  viewportFit: "cover",
};

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {});
}

export default async function RootLayout({ children }) {
  const user = await getUser();
  return (
    <html lang="en">
      <head>
        {/* Add these meta tags for iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Add theme-color meta tag */}
        <meta name="theme-color" content="#FFFFFF" />
      </head>
      <Theme>
        <body className={inter.className}>
          <ClientLayout user={user}>{children}</ClientLayout>
          <Analytics />
        </body>
      </Theme>
    </html>
  );
}
