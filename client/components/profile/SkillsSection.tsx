"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Edit, X } from "lucide-react";
import { ProfileData } from "@/types/profile";

interface SkillsSectionProps {
  profileData: ProfileData;
  isEditingSkills: boolean;
  availableSkills: string[];
  onToggleEdit: () => void;
  onAddSkill: (skill: string) => void;
  onRemoveSkill: (skill: string) => void;
  isViewingOther: boolean;
}

export function SkillsSection({
  profileData,
  isEditingSkills,
  availableSkills,
  onToggleEdit,
  onAddSkill,
  onRemoveSkill,
  isViewingOther,
}: SkillsSectionProps) {
  // Only show skills for workers
  if (profileData?.role !== "worker" || !("skillSet" in profileData)) {
    return null;
  }

  const skillSet = profileData?.skillSet || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Skills & Services</CardTitle>
          {!isViewingOther && (
            <Button onClick={onToggleEdit} variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              {isEditingSkills ? "Done" : "Edit"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditingSkills ? (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Current Skills
              </Label>
              <div className="flex flex-wrap gap-2 mb-4">
                {skillSet.map((skill: string, index: number) => (
                  <Badge
                    key={index}
                    variant="outline"
                    onClick={() => onRemoveSkill(skill)}
                    className="bg-blue-50 text-blue-700 cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors border-blue-200 flex items-center gap-1"
                  >
                    {skill}
                    <X className="w-3 h-3 cursor-pointer hover:text-red-600" />
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Available Skills
              </Label>
              <div className="flex flex-wrap gap-2">
                {availableSkills
                  .filter((skill) => !skillSet.includes(skill))
                  .map((skill: string, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-gray-50 text-gray-700 border-gray-200 cursor-pointer hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                      onClick={() => onAddSkill(skill)}
                    >
                      + {skill}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap gap-2">
              {skillSet.length > 0 ? (
                skillSet.map((skill: string, index: number) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No skills added yet</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
