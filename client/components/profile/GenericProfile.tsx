"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Settings, Edit3 } from "lucide-react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { ProfileData } from "@/types/profile";
import { setUser, setFiles } from "@/lib/slices/authSlice";
import { getProfileConfig } from "@/lib/profile-config";
import { ProfileHeader } from "./ProfileHeader";
import { PersonalInformation } from "./PersonalInformation";
import { SkillsSection } from "./SkillsSection";
import { DocumentsSection } from "./DocumentsSection";
import { BusinessInformation } from "./BusinessInformation";
import { HouseholdInformation } from "./HouseholdInformation";
import { AdminInformation } from "./AdminInformation";
import { StatusSidebar } from "./StatusSidebar";
import { useHttp } from "@/hooks/use-http";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GenericProfileProps {
  role: "worker" | "employer" | "agency" | "admin";
  sidebarComponent?: React.ComponentType;
}

export function GenericProfile({
  role,
  sidebarComponent: SidebarComponent,
}: GenericProfileProps) {
  const { put, get } = useHttp();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  const config = getProfileConfig(role);
  const [profileData, setProfileData] = useState<ProfileData>(
    user as ProfileData
  );
  useEffect(() => {
    setProfileData(user as ProfileData);
    console.log(profileData);
  }, [user]);
  const [originalProfileData, setOriginalProfileData] =
    useState<ProfileData | null>(null);

  useEffect(() => {
    if (user) {
      setProfileData(user as ProfileData);
    }
  }, [user]);

  // Fetch user files when component mounts and user is available
  useEffect(() => {
    const fetchUserFiles = async () => {
      if (user?.userId) {
        setIsLoadingFiles(true);
        try {
          const response = await get("/files/list");
          console.log("Fetched user files:", response);
          dispatch(setFiles(response as Record<string, any>));
        } catch (error) {
          console.error("Error fetching user files:", error);
          // Don't show error toast as this is a background operation
        } finally {
          setIsLoadingFiles(false);
        }
      }
    };

    fetchUserFiles();
  }, [user?.userId, dispatch, get]);

  const updateProfileData = (updatedData: Partial<ProfileData>) => {
    const newProfileData = { ...profileData, ...updatedData };
    setProfileData(newProfileData as ProfileData);
    dispatch(setUser(newProfileData));
  };

  const handleProfilePhotoUpload = (file: File | null) => {
    setProfilePhoto(file);
  };

  const handleSave = async () => {
    setIsEditing(false);
    try {
      const updatedProfile = await put(`auth/profile`, profileData);
      console.log(updatedProfile);
      dispatch(setUser(profileData));
      toast.success("Profile Updated", {
        description: "Your profile has been updated successfully!",
      });
    } catch (error) {
      dispatch(setUser(originalProfileData));
      console.error(error);
      toast.error("Update Failed", {
        description: "Failed to update profile. Please try again.",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (originalProfileData) {
      setProfileData(originalProfileData);
      dispatch(setUser(originalProfileData));
    }
    setOriginalProfileData(null);
  };

  const addSkill = (skill: string) => {
    if (profileData?.role === "worker" && "skillSet" in profileData) {
      const currentSkills = profileData.skillSet || [];
      if (!currentSkills.includes(skill)) {
        updateProfileData({
          skillSet: [...currentSkills, skill],
        } as any);
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    if (profileData?.role === "worker" && "skillSet" in profileData) {
      const currentSkills = profileData.skillSet || [];
      updateProfileData({
        skillSet: currentSkills.filter(
          (skill: string) => skill !== skillToRemove
        ),
      } as any);
    }
  };

  const handleSkillsEditComplete = async () => {
    if (profileData?.role === "worker" && "skillSet" in profileData) {
      try {
        await put(`auth/profile`, profileData);
        dispatch(setUser(profileData));
        toast.success("Skills Updated", {
          description: "Your skills have been updated successfully!",
        });
      } catch (error) {
        dispatch(setUser(originalProfileData));
        console.error("Failed to update skills:", error);
        toast.error("Skills Update Failed", {
          description: "Failed to update skills. Please try again.",
        });
      }
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "worker":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "employer":
        return "bg-green-100 text-green-800 border-green-200";
      case "agency":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {SidebarComponent && <SidebarComponent />}

      <div className="lg:ml-64">
        {/* Compact Header Section */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href={`/${role}/dashboard`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
                <div className="h-6 w-px bg-gray-300"></div>
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <h1 className="text-xl font-semibold text-gray-900">
                    Profile
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  className={`${getRoleColor(profileData?.role || "")} border`}
                >
                  {getRoleIcon(profileData?.role || "")}{" "}
                  {profileData?.role?.toUpperCase() || "USER"}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setOriginalProfileData({ ...profileData });
                    setIsEditing(true);
                  }}
                  className="hidden sm:flex items-center gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-6">
          <div className="max-w-6xl mx-auto">
            {/* Enhanced Profile Header */}
            <Card className="mb-6 border-0 shadow-lg bg-gradient-to-r from-white to-gray-50">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  {/* Profile Photo */}
                  <div className="relative group">
                    <Avatar className="w-20 h-20 ring-4 ring-white shadow-lg">
                      {profileData?.profilePicture?.url ? (
                        <AvatarImage
                          src={profileData.profilePicture.url}
                          alt={profileData.name || "Profile"}
                        />
                      ) : (
                        <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
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
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleProfilePhotoUpload(e.target.files?.[0] || null)
                        }
                        className="hidden"
                        id="profilePhoto"
                      />
                      <label htmlFor="profilePhoto">
                        <Button variant="secondary" size="sm" asChild>
                          <span className="cursor-pointer">
                            <Settings className="w-4 h-4 mr-2" />
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">
                          {profileData?.name || "Unknown User"}
                        </h2>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <Badge
                            variant="outline"
                            className="text-gray-600 border-gray-300"
                          >
                            {profileData?.email || "No email"}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-gray-600 border-gray-300"
                          >
                            {profileData?.phoneNumber || "No phone number"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setOriginalProfileData({ ...profileData });
                            setIsEditing(true);
                          }}
                          className="sm:hidden"
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <PersonalInformation
                  profileData={profileData}
                  isEditing={isEditing}
                  onUpdate={updateProfileData}
                  onEdit={() => {
                    setOriginalProfileData({ ...profileData });
                    setIsEditing(true);
                  }}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />

                {/* Skills Section - Only for workers */}
                {config.sections.skills && (
                  <SkillsSection
                    profileData={profileData}
                    isEditingSkills={isEditingSkills}
                    availableSkills={config.skills.available}
                    onToggleEdit={async () => {
                      if (isEditingSkills) {
                        // User is finishing editing, save to backend
                        await handleSkillsEditComplete();
                      }
                      setIsEditingSkills(!isEditingSkills);
                    }}
                    onAddSkill={addSkill}
                    onRemoveSkill={removeSkill}
                  />
                )}

                {/* Business Information - Only for agencies */}
                {config.sections.businessInfo &&
                  profileData?.role === "agency" && (
                    <BusinessInformation
                      profileData={profileData as any}
                      isEditing={isEditing}
                      onUpdate={updateProfileData}
                    />
                  )}

                {/* Household Information - Only for employers */}
                {config.sections.householdInfo &&
                  profileData?.role === "employer" && (
                    <HouseholdInformation
                      profileData={profileData as any}
                      isEditing={isEditing}
                      onUpdate={updateProfileData}
                    />
                  )}

                {/* Admin Information - Only for admins */}
                {config.sections.adminInfo && profileData?.role === "admin" && (
                  <AdminInformation
                    profileData={profileData as any}
                    isEditing={isEditing}
                    onUpdate={updateProfileData}
                  />
                )}

                {/* Documents Section */}
                {config.sections.documents && (
                  <DocumentsSection
                    profileData={profileData}
                    isLoadingFiles={isLoadingFiles}
                  />
                )}
              </div>

              {/* Sidebar */}
              <StatusSidebar profileData={profileData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
