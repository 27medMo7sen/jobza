"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { clearAuth } from "@/lib/slices/authSlice";
import { clearFiles } from "@/lib/slices/filesSlice";
import { RootState } from "@/lib/store";

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Check if user is authenticated
    if (!user || !token) {
      dispatch(clearAuth());
      dispatch(clearFiles());
      router.push("/auth");
      return;
    }

    // Check if user has access to messages (worker, employer, agency)
    const canAccessMessages = ["worker", "employer", "agency"].includes(
      user.role
    );
    if (!canAccessMessages) {
      // Redirect to appropriate dashboard based on role
      if (user.role === "superadmin") {
        router.push("/superadmin/dashboard");
      } else {
        router.push(`/${user.role}/dashboard`);
      }
      return;
    }
  }, [user, token, dispatch, router]);

  // Don't render children if user doesn't have access or not authenticated
  if (
    !user ||
    !token ||
    !["worker", "employer", "agency"].includes(user.role)
  ) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
