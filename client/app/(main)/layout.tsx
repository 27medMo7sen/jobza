"use client";
import type React from "react";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/lib/theme-provider";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUser } from "@/lib/slices/authSlice";
import { RootState } from "@/lib/store";
import { useHttp } from "@/hooks/use-http";

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
  const { get } = useHttp();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          dispatch(setUser(JSON.parse(userStr)));
        }
        if (!userStr) {
          const hydrateUser = async () => {
            const resp: any = await get("/auth/authenticate");
            if (resp) {
              dispatch(setUser(resp));
            }
          };
          hydrateUser();
        }
        const token = localStorage.getItem("token");
        if (token) {
          dispatch(setToken(token));
        }
      } catch (error) {
        console.warn("Error reading auth data from localStorage:", error);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    const hydrateUser = async () => {
      const hasLocalUser =
        typeof window !== "undefined" && localStorage.getItem("user");
      const hasReduxUser = !!user;
      if (!hasLocalUser && !hasReduxUser) {
        try {
          const resp: any = await get("/auth/authenticate");
          if (resp) {
            localStorage.setItem("user", JSON.stringify(resp));
            dispatch(setUser(resp));
          }
        } catch (e) {
          // ignore
        }
      }
    };
    hydrateUser();
  }, [user, dispatch, get]);

  return (
    <div className={`font-sans  antialiased`}>
      <ThemeProvider>{children}</ThemeProvider>
    </div>
  );
}
