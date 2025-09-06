"use client";

import { GenericProfile } from "@/components/profile/GenericProfile";
import { EmployerSidebar } from "@/components/layout/employer-sidebar";

export default function EmployerProfile() {
  return <GenericProfile role="employer" sidebarComponent={EmployerSidebar} />;
}
