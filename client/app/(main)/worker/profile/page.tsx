"use client";

import { GenericProfile } from "@/components/profile/GenericProfile";
import { WorkerSidebar } from "@/components/layout/worker-sidebar";

export default function WorkerProfile() {
  return <GenericProfile role="worker" sidebarComponent={WorkerSidebar} />;
}
