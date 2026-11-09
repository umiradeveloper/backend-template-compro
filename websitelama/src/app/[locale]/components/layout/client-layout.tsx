"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

import Header from "./header";
import Footer from "./footer";
import ScrollToTop from "../scroll-to-top";

const EXCLUDED_ROUTES = ["/signin", "/signup", "/forgot-password", "/documentation"];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    const checkIfNotFound = async () => {
      try {
        const res = await fetch(pathname, { method: "HEAD" });
        setIsNotFound(res.status === 404);
      } catch {
        setIsNotFound(false);
      }
    };
    checkIfNotFound();
  }, [pathname]);

  const shouldHideLayout = EXCLUDED_ROUTES.includes(pathname) || isNotFound;

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        {!shouldHideLayout && <Header />}
        {children}
        {!shouldHideLayout && <Footer />}
        <ScrollToTop />
      </ThemeProvider>
    </SessionProvider>
  );
}
