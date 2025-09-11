"use client";

import { GenericProfile } from "@/components/profile/GenericProfile";
import { UnifiedSidebar } from "@/components/layout/unified-sidebar";

const WorkerSidebarAdapter = () => <UnifiedSidebar userRole="worker" />;

export default function WorkerProfile() {
  return (
    <GenericProfile role="worker" sidebarComponent={WorkerSidebarAdapter} />
  );
}
