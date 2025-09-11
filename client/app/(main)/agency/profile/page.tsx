"use client";

import { GenericProfile } from "@/components/profile/GenericProfile";
import { UnifiedSidebar } from "@/components/layout/unified-sidebar";

const AgencySidebarAdapter = () => <UnifiedSidebar userRole="agency" />;

export default function AgencyProfile() {
  return (
    <GenericProfile role="agency" sidebarComponent={AgencySidebarAdapter} />
  );
}
