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
import { usePathname, useRouter } from "next/navigation";
import { clearAuth } from "@/lib/slices/authSlice";
import { clearFiles } from "@/lib/slices/filesSlice";
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
  const { user, token } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          dispatch(setUser(JSON.parse(userStr)));
        }
        if (!userStr && pathname !== "/") {
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
  }, [dispatch, pathname]);

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

  // Basic navigation guard - handle auth page and root redirects only
  useEffect(() => {
    const isAuthRoute = pathname === "/auth";
    const userRole = user?.role;

    // If user is authenticated and trying to access auth page, redirect to dashboard
    if (isAuthRoute && user && token) {
      const userRole = user.role || "worker";
      if (userRole === "superadmin") {
        router.push("/superadmin/dashboard");
      } else {
        router.push(`/${userRole}/dashboard`);
      }
      return;
    }

    // If user is authenticated and trying to access root, redirect to dashboard
    if (pathname === "/" && user && token) {
      const userRole = user.role || "worker";
      if (userRole === "superadmin") {
        router.push("/superadmin/dashboard");
      } else {
        router.push(`/${userRole}/dashboard`);
      }
      return;
    }
  }, [pathname, user, token, dispatch, router]);

  return (
    <div className={`font-sans  antialiased`}>
      <ThemeProvider>{children}</ThemeProvider>
    </div>
  );
}
