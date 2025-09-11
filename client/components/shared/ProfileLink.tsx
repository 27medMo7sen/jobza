"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProfileLinkProps {
  username: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function ProfileLink({
  username,
  children,
  className,
  onClick,
}: ProfileLinkProps) {
  return (
    <Link
      href={`/profile/${username}`}
      className={cn("hover:underline", className)}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

interface UserProfileCardProps {
  username: string;
  name: string;
  role: string;
  profilePicture?: {
    url: string;
    s3Key: string;
  };
  className?: string;
}

export function UserProfileCard({
  username,
  name,
  role,
  profilePicture,
  className,
}: UserProfileCardProps) {
  return (
    <ProfileLink username={username} className={cn("block", className)}>
      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          {profilePicture?.url ? (
            <img
              src={profilePicture.url}
              alt={name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-medium text-gray-600">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
          <p className="text-xs text-gray-500">
            @{username} • {role}
          </p>
        </div>
      </div>
    </ProfileLink>
  );
}
