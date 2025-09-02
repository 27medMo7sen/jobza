"use client";
import type React from "react";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/lib/theme-provider";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "@/lib/slices/authSlice";

// const dmSans = DM_Sans({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-dm-sans",
//   weight: ["400", "500", "600", "700"],
// });

// export const metadata: Metadata = {
//   title: "Jobza - Connect with Trusted Domestic Workers",
//   description:
//     "Find reliable housekeepers, nannies, cooks, and caregivers. Professional domestic worker marketplace connecting families with verified workers and agencies.",
//   generator: "v0.app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch = useDispatch();
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      dispatch(setUser(JSON.parse(user)));
    }
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setToken(token));
    }
  }, []);
  return (
    <div className={`font-sans  antialiased`}>
      <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
    </div>
  );
}
