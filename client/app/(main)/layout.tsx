import type React from "react";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/lib/theme-provider";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Jobza - Connect with Trusted Domestic Workers",
  description:
    "Find reliable housekeepers, nannies, cooks, and caregivers. Professional domestic worker marketplace connecting families with verified workers and agencies.",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`font-sans ${dmSans.variable} antialiased`}>
      <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
    </div>
  );
}
