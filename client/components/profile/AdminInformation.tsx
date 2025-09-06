"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AdminProfileData } from "@/types/profile";

interface AdminInformationProps {
  profileData: AdminProfileData;
  isEditing: boolean;
  onUpdate: (data: Partial<AdminProfileData>) => void;
}

export function AdminInformation({
  profileData,
  isEditing,
  onUpdate,
}: AdminInformationProps) {
  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">
            Administrative Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Department</Label>
              <Select
                value={profileData.department || ""}
                onValueChange={(value) => onUpdate({ department: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="support">Customer Support</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Permissions</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="user-management"
                    checked={
                      profileData.permissions?.includes("user_management") ||
                      false
                    }
                    onChange={(e) => {
                      const permissions = profileData.permissions || [];
                      if (e.target.checked) {
                        onUpdate({
                          permissions: [...permissions, "user_management"],
                        });
                      } else {
                        onUpdate({
                          permissions: permissions.filter(
                            (p) => p !== "user_management"
                          ),
                        });
                      }
                    }}
                  />
                  <Label htmlFor="user-management" className="text-sm">
                    User Management
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="content-moderation"
                    checked={
                      profileData.permissions?.includes("content_moderation") ||
                      false
                    }
                    onChange={(e) => {
                      const permissions = profileData.permissions || [];
                      if (e.target.checked) {
                        onUpdate({
                          permissions: [...permissions, "content_moderation"],
                        });
                      } else {
                        onUpdate({
                          permissions: permissions.filter(
                            (p) => p !== "content_moderation"
                          ),
                        });
                      }
                    }}
                  />
                  <Label htmlFor="content-moderation" className="text-sm">
                    Content Moderation
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="analytics"
                    checked={
                      profileData.permissions?.includes("analytics") || false
                    }
                    onChange={(e) => {
                      const permissions = profileData.permissions || [];
                      if (e.target.checked) {
                        onUpdate({
                          permissions: [...permissions, "analytics"],
                        });
                      } else {
                        onUpdate({
                          permissions: permissions.filter(
                            (p) => p !== "analytics"
                          ),
                        });
                      }
                    }}
                  />
                  <Label htmlFor="analytics" className="text-sm">
                    Analytics
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="system-settings"
                    checked={
                      profileData.permissions?.includes("system_settings") ||
                      false
                    }
                    onChange={(e) => {
                      const permissions = profileData.permissions || [];
                      if (e.target.checked) {
                        onUpdate({
                          permissions: [...permissions, "system_settings"],
                        });
                      } else {
                        onUpdate({
                          permissions: permissions.filter(
                            (p) => p !== "system_settings"
                          ),
                        });
                      }
                    }}
                  />
                  <Label htmlFor="system-settings" className="text-sm">
                    System Settings
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">
          Administrative Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Department</p>
            <p className="font-semibold">
              {profileData.department || "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Permissions</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {profileData.permissions && profileData.permissions.length > 0 ? (
                profileData.permissions.map((permission, index) => (
                  <Badge key={index} variant="secondary">
                    {permission.replace("_", " ").toUpperCase()}
                  </Badge>
                ))
              ) : (
                <span className="text-gray-500">No permissions assigned</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
