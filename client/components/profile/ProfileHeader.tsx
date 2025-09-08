"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Camera } from "lucide-react";
import Link from "next/link";
import { ProfileData } from "@/types/profile";

interface ProfileHeaderProps {
  profileData: ProfileData;
  onProfilePhotoUpload: (file: File | null) => void;
}

export function ProfileHeader({
  profileData,
  onProfilePhotoUpload,
}: ProfileHeaderProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "worker":
        return "bg-blue-100 text-blue-800";
      case "employer":
        return "bg-green-100 text-green-800";
      case "agency":
        return "bg-purple-100 text-purple-800";
      case "admin":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "worker":
        return "👷";
      case "employer":
        return "🏠";
      case "agency":
        return "🏢";
      case "admin":
        return "⚙️";
      default:
        return "👤";
    }
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Profile Photo */}
          <div className="relative group">
            <Avatar className="w-24 h-24">
              {profileData?.profilePicture?.url ? (
                <AvatarImage
                  src={profileData.profilePicture.url}
                  alt={profileData.name || "Profile"}
                />
              ) : (
                <AvatarFallback className="text-2xl">
                  {(profileData?.name && profileData?.name !== ""
                    ? profileData?.name
                    : "U"
                  )
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  onProfilePhotoUpload(e.target.files?.[0] || null)
                }
                className="hidden"
                id="profilePhoto"
              />
              <label htmlFor="profilePhoto">
                <Button variant="secondary" size="sm" asChild>
                  <span className="cursor-pointer">
                    <Camera className="w-4 h-4 mr-2" />
                    Change
                  </span>
                </Button>
              </label>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {profileData?.name || "Unknown User"}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                  <Badge className={getRoleColor(profileData?.role || "")}>
                    {getRoleIcon(profileData?.role || "")}{" "}
                    {profileData?.role?.toUpperCase() || "USER"}
                  </Badge>
                  <Badge variant="outline" className="text-gray-600">
                    {profileData?.email || "No email"}
                  </Badge>
                </div>
                <p className="text-gray-600 mt-2">
                  {profileData?.phoneNumber || "No phone number"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
