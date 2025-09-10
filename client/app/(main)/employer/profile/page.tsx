"use client";

import { GenericProfile } from "@/components/profile/GenericProfile";
import { UnifiedSidebar } from "@/components/layout/unified-sidebar";

const EmployerSidebarAdapter = () => <UnifiedSidebar userRole="employer" />;

export default function EmployerProfile() {
  return <GenericProfile role="employer" sidebarComponent={EmployerSidebarAdapter} />;
}
