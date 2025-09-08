"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Save, X } from "lucide-react";
import { ProfileData } from "@/types/profile";
import { CountryNationalitySelect } from "@/components/auth/CountryNationalitySelect";
import { GenderSelect } from "@/components/auth/GenderSelect";
import { EducationLevelSelect } from "@/components/auth/EducationLevelSelect";

interface PersonalInformationProps {
  profileData: ProfileData;
  isEditing: boolean;
  onUpdate: (data: Partial<ProfileData>) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function PersonalInformation({
  profileData,
  isEditing,
  onUpdate,
  onEdit,
  onSave,
  onCancel,
}: PersonalInformationProps) {
  // console.log(profileData);
  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-foreground">
              Personal Information
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={onSave}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={onCancel} variant="outline" size="sm">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input
                value={profileData?.name || ""}
                onChange={(e) => onUpdate({ name: e.target.value })}
              />
            </div>
            <div>
              <Label>Username</Label>
              <Input
                value={profileData?.userName || ""}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                value={profileData?.email || ""}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input
                value={profileData?.phoneNumber || ""}
                onChange={(e) => onUpdate({ phoneNumber: e.target.value })}
              />
            </div>
            {/* Country and Nationality */}
            <div className="md:col-span-2">
              <CountryNationalitySelect
                country={profileData?.country || ""}
                nationality={profileData?.nationality || ""}
                onCountryChange={(value) => onUpdate({ country: value })}
                onNationalityChange={(value) =>
                  onUpdate({ nationality: value })
                }
                required
              />
            </div>
            <div>
              <Label>Date of Birth</Label>
              <Input
                type="date"
                value={profileData?.dateOfBirth || ""}
                onChange={(e) => onUpdate({ dateOfBirth: e.target.value })}
              />
            </div>
            {profileData?.role === "worker" && (
              <GenderSelect
                value={profileData.gender || ""}
                onChange={(value) => onUpdate({ gender: value } as any)}
                required
              />
            )}
            {profileData?.role === "worker" && (
              <EducationLevelSelect
                value={profileData.heighestEducationalLevel || ""}
                onChange={(value) =>
                  onUpdate({ heighestEducationalLevel: value } as any)
                }
                required
              />
            )}
            {profileData?.role === "employer" && "gender" in profileData && (
              <GenderSelect
                value={profileData.gender || ""}
                onChange={(value) => onUpdate({ gender: value } as any)}
                required
              />
            )}
            {profileData?.role === "admin" && "gender" in profileData && (
              <GenderSelect
                value={profileData.gender || ""}
                onChange={(value) => onUpdate({ gender: value } as any)}
                required
              />
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-foreground">
            Personal Information
          </CardTitle>
          <Button onClick={onEdit} variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Full Name</p>
            <p className="font-semibold">
              {profileData?.name || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Username</p>
            <p className="font-semibold">
              {profileData?.userName || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-semibold break-all">
              {profileData?.email || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone Number</p>
            <p className="font-semibold">
              {profileData?.phoneNumber || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Country</p>
            <p className="font-semibold">
              {profileData?.country || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Nationality</p>
            <p className="font-semibold">
              {profileData?.nationality || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Date of Birth</p>
            <p className="font-semibold">
              {profileData?.dateOfBirth || "Not provided"}
            </p>
          </div>
          {profileData?.role === "worker" && (
            <div>
              <p className="text-sm text-gray-600">Gender</p>
              <p className="font-semibold">
                {profileData.gender || "Not provided"}
              </p>
            </div>
          )}
          {profileData?.role === "worker" && (
            <div>
              <p className="text-sm text-gray-600">Education Level</p>
              <p className="font-semibold">
                {profileData.heighestEducationalLevel || "Not provided"}
              </p>
            </div>
          )}
          {profileData?.role === "employer" && "gender" in profileData && (
            <div>
              <p className="text-sm text-gray-600">Gender</p>
              <p className="font-semibold">
                {profileData.gender || "Not provided"}
              </p>
            </div>
          )}
          {profileData?.role === "admin" && (
            <div>
              <p className="text-sm text-gray-600">Gender</p>
              <p className="font-semibold">
                {profileData.gender || "Not provided"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}