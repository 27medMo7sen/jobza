"use client";

import { GenericProfile } from "@/components/profile/GenericProfile";
import { UnifiedSidebar } from "@/components/layout/unified-sidebar";

const AdminSidebarAdapter = () => <UnifiedSidebar userRole="admin" />;

export default function AdminProfile() {
  return <GenericProfile role="admin" sidebarComponent={AdminSidebarAdapter} />;
}
