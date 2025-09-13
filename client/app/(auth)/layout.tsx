"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const localToken = localStorage.getItem("token");
      const localUser = localStorage.getItem("user");

      if (localToken && localUser) {
        try {
          const parsedUser = JSON.parse(localUser);
          router.push(`/${parsedUser.role}/dashboard`);
          return;
        } catch (error) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    }
  }, [router]);

  // Also check localStorage for immediate protection
  if (typeof window !== "undefined") {
    const localToken = localStorage.getItem("token");
    const localUser = localStorage.getItem("user");

    if (localToken && localUser) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
          </div>
        </div>
      );
    } else return <div>{children}</div>;
  }
}
