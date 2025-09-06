"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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
          <ProfileHeader
            profileData={profileData}
            onProfilePhotoUpload={handleProfilePhotoUpload}
          />

          {/* Profile Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
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
  );
}
