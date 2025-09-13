"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { ProfileData } from "@/types/profile";
import {
  setUser,
  setProfileLoaded,
  setProfileStatus,
} from "@/lib/slices/authSlice";
import {
  setFiles,
  setLoading as setFilesLoading,
  setFilesLoaded as setIsfilesLoaded,
} from "@/lib/slices/filesSlice";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
interface GenericProfileProps {
  role?: "worker" | "employer" | "agency" | "admin";
  sidebarComponent?: React.ComponentType;
  username?: string; // For viewing other users' profiles
  isViewingOther?: boolean; // Whether viewing someone else's profile
}

export function GenericProfile({
  role,
  sidebarComponent: SidebarComponent,
  username,
  isViewingOther = false,
}: GenericProfileProps) {
  const { put, get, post } = useHttp();

  // Handle judgment submission
  const handleSubmitJudgment = async () => {
    console.log(fileToJudge, judgmentDecision);
    if (!fileToJudge || !judgmentDecision) {
      toast.error("Please select a decision");
      return;
    }

    if (judgmentDecision === "reject" && !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    setIsSubmittingJudgment(true);

    try {
      const response = await put(`/files/${fileToJudge._id}/status`, {
        status: judgmentDecision === "approve" ? "approved" : "rejected",
        rejectionReason:
          judgmentDecision === "reject" ? rejectionReason : undefined,
      });
      console.log("that's response ", response);

      if (response) {
        // Update the file status in Redux store
        const updatedFiles = { ...files, [(response as any).label]: response };

        console.log("that's updatedFiles ", updatedFiles);
        dispatch(setFiles(updatedFiles));

        toast.success(
          `File ${
            judgmentDecision === "approve" ? "approved" : "rejected"
          } successfully`
        );

        // Reset form and close dialog
        setJudgmentDecision("");
        setRejectionReason("");
        setFileToJudge(null);
        setIsJudging(false);
      }
    } catch (error) {
      console.error("Error updating file status:", error);
      toast.error("Failed to update file status");
    } finally {
      setIsSubmittingJudgment(false);
    }
  };

  // Handle opening judgment dialog
  const handleOpenJudgment = (file: any) => {
    setFileToJudge(file);
    setJudgmentDecision("");
    setRejectionReason("");
    setIsJudging(true);
  };

  // Handle closing judgment dialog
  const handleCloseJudgment = () => {
    setFileToJudge(null);
    setJudgmentDecision("");
    setRejectionReason("");
    setIsJudging(false);
  };
  const dispatch = useDispatch();
  const { user, isProfileLoaded, token } = useSelector(
    (state: RootState) => state.auth
  );
  const { files, isLoading: isFilesLoading } = useSelector(
    (state: RootState) => state.files
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [isUploadingProfilePhoto, setIsUploadingProfilePhoto] = useState(false);
  const [isJudging, setIsJudging] = useState(false);
  const [fileToJudge, setFileToJudge] = useState<any>(null);
  const [judgmentDecision, setJudgmentDecision] = useState<
    "approve" | "reject" | ""
  >("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmittingJudgment, setIsSubmittingJudgment] = useState(false);
  const config = getProfileConfig(role || "worker");
  const [profileData, setProfileData] = useState<ProfileData>(
    (user as ProfileData) || ({ role: role || "worker" } as ProfileData)
  );
  const { isFilesLoaded } = useSelector((state: RootState) => state.files);
  const [originalProfileData, setOriginalProfileData] =
    useState<ProfileData | null>(null);

  // Fetch fresh profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      if (isViewingOther && username) {
        // Fetch other user's profile
        try {
          const response = await get<any>(`/auth/profile/${username}`);
          console.log("Fetched other user's profile data:", response);
          setProfileData(response);
          dispatch(setProfileLoaded(true));
        } catch (error) {
          console.error("Error fetching other user's profile data:", error);
          dispatch(setProfileLoaded(true));
        }
      } else if (!isProfileLoaded) {
        // Fetch own profile
        try {
          const response = await get("/auth/authenticate");
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
  }, [user?.userId, isProfileLoaded, dispatch, get, isViewingOther, username]);

  // Fetch fresh files data on component mount
  useEffect(() => {
    const fetchUserFiles = async () => {
      if (token) {
        try {
          dispatch(setFilesLoading(true));
          const endpoint =
            isViewingOther && username
              ? `/files/list/${username}`
              : "/files/list";
          const response = await get(endpoint);
          console.log("Fetched fresh user files:", response);
          dispatch(setFiles(response as Record<string, any>));
        } catch (error) {
          console.error("Error fetching user files:", error);
        } finally {
          dispatch(setFilesLoading(false));
          dispatch(setIsfilesLoaded(true));
        }
      }
    };

    fetchUserFiles();
  }, [token, dispatch, get, isViewingOther, username]);

  // Update local profile data when Redux user changes
  useEffect(() => {
    if (isViewingOther) {
      // For viewing other users, profileData is set in the fetchProfileData function
      return;
    }

    if (user) {
      setProfileData(user as ProfileData);
    } else {
      // If no user data, use the role as fallback
      setProfileData({ role: role || "worker" } as ProfileData);
    }
  }, [user, role, isViewingOther]);

  const updateProfileData = (updatedData: Partial<ProfileData>) => {
    const newProfileData = { ...profileData, ...updatedData };
    setProfileData(newProfileData as ProfileData);
    dispatch(setUser(newProfileData));
  };

  const handleProfilePhotoUpload = async (file: File | null) => {
    if (!file || isViewingOther) return;

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
    if (isViewingOther) return;
    setIsEditing(false);
    try {
      const response = await put<any>(`auth/profile`, profileData);
      console.log(response);
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
    if (isViewingOther) return;
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
    if (isViewingOther) return;
    if (profileData?.role === "worker" && "skillSet" in profileData) {
      try {
        // Send skills update through the unified profile update endpoint
        const response = await put<any>(`auth/profile`, {
          skillSet: profileData.skillSet,
        });
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
  console.log("GenericProfile - isProfileLoaded:", isProfileLoaded);
  console.log("GenericProfile - isFilesLoaded:", isFilesLoaded);
  console.log("GenericProfile - user:", user);
  console.log("GenericProfile - user?.role:", user?.role);
  console.log("GenericProfile - isViewingOther:", isViewingOther);
  console.log(
    "GenericProfile - adminButtons should be:",
    user?.role === "admin" && isViewingOther
  );

  // if (!user) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="flex min-h-screen bg-background">
      <Dialog open={isJudging} onOpenChange={handleCloseJudgment}>
        <DialogOverlay className="bg-black/50 z-[50] fixed inset-0" />
        <DialogContent className="bg-card p-8 z-[50] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-w-lg w-full mx-4 sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground max-w-sm w-full mx-4 overflow-clip whitespace-nowrap">
              Judge File: {fileToJudge?.fileName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-8 mt-8">
            {/* Decision Radio Group */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-foreground">
                Decision
              </Label>
              <RadioGroup
                value={judgmentDecision}
                onValueChange={(value) =>
                  setJudgmentDecision(value as "approve" | "reject")
                }
                className="space-y-4"
              >
                <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem
                    value="approve"
                    id="approve"
                    className="h-5 w-5"
                  />
                  <Label
                    htmlFor="approve"
                    className="text-green-600 font-semibold text-lg cursor-pointer flex-1"
                  >
                    Approve
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem
                    value="reject"
                    id="reject"
                    className="h-5 w-5"
                  />
                  <Label
                    htmlFor="reject"
                    className="text-red-600 font-semibold text-lg cursor-pointer flex-1"
                  >
                    Reject
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Rejection Reason - Only show when reject is selected */}
            {judgmentDecision === "reject" && (
              <div className="space-y-4">
                <Label
                  htmlFor="rejection-reason"
                  className="text-lg font-semibold text-foreground"
                >
                  Rejection Reason *
                </Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Please provide a detailed reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="min-h-[120px] resize-none text-base p-4"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={handleCloseJudgment}
                disabled={isSubmittingJudgment}
                className="px-6 py-2 text-base"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitJudgment}
                disabled={isSubmittingJudgment || !judgmentDecision}
                className={`px-6 py-2 text-base font-semibold ${
                  judgmentDecision === "approve"
                    ? "bg-green-600 hover:bg-green-700 text-gray-100"
                    : judgmentDecision === "reject"
                    ? "bg-red-600 hover:bg-red-700 text-gray-100"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isSubmittingJudgment ? "Submitting..." : "Submit Decision"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {SidebarComponent && <SidebarComponent />}

      <div className="flex-1 p-6">
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
                  isViewingOther={isViewingOther}
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
                    isViewingOther={isViewingOther}
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
              {config.sections.documents &&
                (user?.role !== "admin" || isViewingOther) &&
                (isFilesLoaded ? (
                  <DocumentsSection
                    profileData={profileData || ({ role: role } as ProfileData)}
                    isLoadingFiles={isFilesLoading}
                    isViewingOther={isViewingOther}
                    adminButtons={user?.role === "admin" && isViewingOther}
                    isJudging={isJudging}
                    setIsJudging={setIsJudging}
                    onOpenJudgment={handleOpenJudgment}
                  />
                ) : (
                  <DocumentsSectionSkeleton />
                ))}
            </div>

            {/* Sidebar */}
            {user?.role !== "admin" && !isProfileLoaded ? (
              <StatusSidebarSkeleton />
            ) : (
              user?.role !== "admin" && (
                <StatusSidebar profileData={profileData} />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
