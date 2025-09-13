"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { clearAuth } from "@/lib/slices/authSlice";
import { clearFiles } from "@/lib/slices/filesSlice";
import { RootState } from "@/lib/store";
import { UnifiedSidebar } from "@/components/layout/unified-sidebar";
import { GenericProfile } from "@/components/profile/GenericProfile";

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!user || !token) {
      dispatch(clearAuth());
      dispatch(clearFiles());
      router.push("/auth");
      return;
    }

    // Check if user has employer role
    if (user.role !== "employer") {
      // Redirect to appropriate dashboard based on role
      if (user.role === "superadmin") {
        router.push("/superadmin/dashboard");
      } else {
        router.push(`/${user.role}/dashboard`);
      }
      return;
    }
  }, [user, token, dispatch, router]);

  // Don't render children if user is not an employer or not authenticated
  if (!user || !token || user.role !== "employer") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Check if we're on the profile page
  const isProfilePage = pathname === "/employer/profile";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <UnifiedSidebar
        userRole={user.role}
        userName={user.name || user.fullName}
        userEmail={user.email}
        userAvatar={user.profilePicture}
        onCollapsedChange={setSidebarCollapsed}
      />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {isProfilePage ? (
          <div className="p-6">
            <GenericProfile />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
