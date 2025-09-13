"use client";

import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { GenericProfile } from "@/components/profile/GenericProfile";

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { user } = useSelector((state: RootState) => state.auth);

  // Determine if viewing someone else's profile
  const isViewingOther = user?.userName !== username;

  return <GenericProfile username={username} isViewingOther={isViewingOther} />;
}
