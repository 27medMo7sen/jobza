"use client";

import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { GenericProfile } from "@/components/profile/GenericProfile";
import { UnifiedSidebar } from "@/components/layout/unified-sidebar";

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { user } = useSelector((state: RootState) => state.auth);

  // Determine if viewing someone else's profile
  const isViewingOther = user?.userName !== username;

  // Create a sidebar adapter that uses the current user's role
  const UnifiedSidebarAdapter = () => (
    <UnifiedSidebar
      userRole={user?.role || "worker"}
      userName={user?.name}
      userEmail={user?.email}
    />
  );

  return (
    <GenericProfile
      username={username}
      isViewingOther={isViewingOther}
      sidebarComponent={UnifiedSidebarAdapter}
    />
  );
}
