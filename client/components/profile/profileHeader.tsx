// components/ProfileHeader.tsx
import React from "react";
import { Edit2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types/user";

interface ProfileHeaderProps {
  user: User;
  imageDialogOpen: boolean;
  setImageDialogOpen: (open: boolean) => void;
  setUploadDialogOpen: (open: boolean) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  imageDialogOpen,
  setImageDialogOpen,
  setUploadDialogOpen,
}) => {
  const getCompletenessColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getCompletenessBarColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center gap-6">
        {/* Profile Picture */}
        <div className="relative">
          <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
            <DialogTrigger asChild>
              <div className="relative cursor-pointer group">
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 group-hover:border-blue-300 transition-colors"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all flex items-center justify-center">
                  <span className="text-white text-xs opacity-0 group-hover:opacity-100">
                    View
                  </span>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Profile Picture</DialogTitle>
              </DialogHeader>
              <div className="relative">
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-full rounded-lg"
                />
                <button
                  onClick={() => setUploadDialogOpen(true)}
                  className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* User Info */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-2xl font-bold text-foreground">
              {user.userName}
            </h1>
            <span
              className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                user.role === "admin"
                  ? "bg-purple-100 text-purple-800"
                  : user.role === "employer"
                  ? "bg-green-100 text-green-800"
                  : user.role === "agency"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-orange-100 text-orange-800"
              }`}
            >
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>

          <p className="text-muted-foreground mb-3">{user.email}</p>

          {/* Profile Completeness */}
          {/* <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Profile Completeness
              </span>
              <span
                className={`text-sm font-bold ${getCompletenessColor(
                  completeness
                )}`}
              >
                {completeness}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getCompletenessBarColor(
                  completeness
                )}`}
                style={{ width: `${completeness}%` }}
              />
            </div>
            {completeness < 100 && (
              <p className="text-xs text-gray-500">
                Complete your profile to unlock all features
              </p>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};
