"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { ProfileData } from "@/types/profile";
import {
  setUser,
  setFiles,
  setProfileLoaded,
  setFilesLoaded,
} from "@/lib/slices/authSlice";
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
import {
  ProfileHeaderSkeleton,
  PersonalInformationSkeleton,
  SkillsSectionSkeleton,
  BusinessInformationSkeleton,
  HouseholdInformationSkeleton,
  AdminInformationSkeleton,
  StatusSidebarSkeleton,
  DocumentsSectionSkeleton,
} from "@/components/ui/skeleton-loaders";
interface GenericProfileProps {
  role: "worker" | "employer" | "agency" | "admin";
  sidebarComponent?: React.ComponentType;
}

export function GenericProfile({
  role,
  sidebarComponent: SidebarComponent,
}: GenericProfileProps) {
  const { put, get, post } = useHttp();
  const dispatch = useDispatch();
  const { user, files, isProfileLoaded, isFilesLoaded } = useSelector(
    (state: RootState) => state.auth
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [isUploadingProfilePhoto, setIsUploadingProfilePhoto] = useState(false);
  const config = getProfileConfig(role);
  const [profileData, setProfileData] = useState<ProfileData>(
    (user as ProfileData) || ({ role: role } as ProfileData)
  );
  const [originalProfileData, setOriginalProfileData] =
    useState<ProfileData | null>(null);

  // Fetch fresh profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      if (user?.userId && !isProfileLoaded) {
        try {
          const response = await get("/auth/profile");
          console.log("Fetched fresh profile data:", response);
          dispatch(setUser(response));
          dispatch(setProfileLoaded(true));
        } catch (error) {
          console.error("Error fetching profile data:", error);
          dispatch(setProfileLoaded(true)); // Mark as loaded even if failed
        }
      } else if (!user && !isProfileLoaded) {
        // If no user is available, mark as loaded to prevent infinite loading
        console.log("No user available, marking profile as loaded");
        dispatch(setProfileLoaded(true));
      }
    };

    fetchProfileData();
  }, [user?.userId, isProfileLoaded, dispatch, get]);

  // Fetch fresh files data on component mount
  useEffect(() => {
    const fetchUserFiles = async () => {
      if (user?.userId && !isFilesLoaded) {
        try {
          const response = await get("/files/list");
          console.log("Fetched fresh user files:", response);
          dispatch(setFiles(response as Record<string, any>));
          dispatch(setFilesLoaded(true));
        } catch (error) {
          console.error("Error fetching user files:", error);
          dispatch(setFilesLoaded(true)); // Mark as loaded even if failed
        }
      } else if (!user && !isFilesLoaded) {
        // If no user is available, mark as loaded to prevent infinite loading
        console.log("No user available, marking files as loaded");
        dispatch(setFilesLoaded(true));
      }
    };

    fetchUserFiles();
  }, [user?.userId, isFilesLoaded, dispatch, get]);

  // Update local profile data when Redux user changes
  useEffect(() => {
    if (user) {
      setProfileData(user as ProfileData);
    } else {
      // If no user data, use the role as fallback
      setProfileData({ role: role } as ProfileData);
    }
  }, [user, role]);

  const updateProfileData = (updatedData: Partial<ProfileData>) => {
    const newProfileData = { ...profileData, ...updatedData };
    setProfileData(newProfileData as ProfileData);
    dispatch(setUser(newProfileData));
  };

  const handleProfilePhotoUpload = async (file: File | null) => {
    if (!file) return;

    const previousProfilePicture = profileData?.profilePicture;
    setIsUploadingProfilePhoto(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      // Server expects 'picture' for profile photos folder routing
      formData.append("type", "picture");
      formData.append("label", "profile_photo");

      const uploaded: any = await post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(uploaded);
      if (uploaded?.profilePicture?.url && uploaded?.profilePicture?.s3Key) {
        const updated = {
          ...profileData,
          profilePicture: {
            url: uploaded.profilePicture.url,
            s3Key: uploaded.profilePicture.s3Key,
          },
        } as ProfileData;

        setProfileData(updated);
        dispatch(setUser(updated));

        toast.success("Profile Photo Uploaded", {
          description: "Your profile photo has been uploaded successfully!",
        });
      } else {
        throw new Error("Upload response missing url/s3Key");
      }
    } catch (error) {
      // Revert to previous photo in local state and Redux
      const reverted = {
        ...profileData,
        profilePicture: previousProfilePicture,
      } as ProfileData;
      setProfileData(reverted);
      dispatch(setUser(reverted));

      toast.error("Upload Failed", {
        description:
          "Could not upload profile photo. Reverted to previous photo.",
      });
    } finally {
      setIsUploadingProfilePhoto(false);
    }
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

  // Debug logging (remove in production)
  // console.log("GenericProfile - isProfileLoaded:", isProfileLoaded);
  // console.log("GenericProfile - isFilesLoaded:", isFilesLoaded);
  // console.log("GenericProfile - user:", user);
  // console.log("GenericProfile - files:", files);

  // if (!user) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="flex min-h-screen bg-background">
      {SidebarComponent && <SidebarComponent />}

      <div className="flex-1 p-6">
        <div className="mb-6">
          <Link href={`/${role}/dashboard`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          {!isProfileLoaded ? (
            <ProfileHeaderSkeleton />
          ) : (
            <ProfileHeader
              profileData={profileData}
              onProfilePhotoUpload={handleProfilePhotoUpload}
              isUploadingProfilePhoto={isUploadingProfilePhoto}
            />
          )}

          {/* Profile Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Information */}
              {!isProfileLoaded ? (
                <PersonalInformationSkeleton />
              ) : (
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
              )}

              {/* Skills Section - Only for workers */}
              {config.sections.skills &&
                (!isProfileLoaded ? (
                  <SkillsSectionSkeleton />
                ) : (
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
                ))}

              {/* Business Information - Only for agencies */}
              {config.sections.businessInfo &&
                profileData?.role === "agency" &&
                (!isProfileLoaded ? (
                  <BusinessInformationSkeleton />
                ) : (
                  <BusinessInformation
                    profileData={profileData as any}
                    isEditing={isEditing}
                    onUpdate={updateProfileData}
                  />
                ))}

              {/* Household Information - Only for employers */}
              {config.sections.householdInfo &&
                profileData?.role === "employer" &&
                (!isProfileLoaded ? (
                  <HouseholdInformationSkeleton />
                ) : (
                  <HouseholdInformation
                    profileData={profileData as any}
                    isEditing={isEditing}
                    onUpdate={updateProfileData}
                  />
                ))}

              {/* Admin Information - Only for admins */}
              {config.sections.adminInfo &&
                profileData?.role === "admin" &&
                (!isProfileLoaded ? (
                  <AdminInformationSkeleton />
                ) : (
                  <AdminInformation
                    profileData={profileData as any}
                    isEditing={isEditing}
                    onUpdate={updateProfileData}
                  />
                ))}

              {/* Documents Section */}
              {config.sections.documents && (
                <DocumentsSection
                  profileData={profileData || ({ role: role } as ProfileData)}
                  isLoadingFiles={!isFilesLoaded}
                />
              )}
            </div>

            {/* Sidebar */}
            {!isProfileLoaded ? (
              <StatusSidebarSkeleton />
            ) : (
              <StatusSidebar profileData={profileData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
