"use client";

import { GenericProfile } from "@/components/profile/GenericProfile";
import { AgencySidebar } from "@/components/layout/agency-sidebar";

export default function AgencyProfile() {
  return <GenericProfile role="agency" sidebarComponent={AgencySidebar} />;
}
