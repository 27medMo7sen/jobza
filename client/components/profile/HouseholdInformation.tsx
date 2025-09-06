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
import { EmployerProfileData } from "@/types/profile";

interface HouseholdInformationProps {
  profileData: EmployerProfileData;
  isEditing: boolean;
  onUpdate: (data: Partial<EmployerProfileData>) => void;
}

export function HouseholdInformation({
  profileData,
  isEditing,
  onUpdate,
}: HouseholdInformationProps) {
  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">
            Household Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Household Size</Label>
              <Input
                type="number"
                value={profileData.householdSize || ""}
                onChange={(e) =>
                  onUpdate({ householdSize: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <Label>Home Type</Label>
              <Select
                value={profileData.homeType || ""}
                onValueChange={(value) => onUpdate({ homeType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="condo">Condominium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Adults</Label>
              <Input
                type="number"
                value={profileData.householdComposition?.adults || ""}
                onChange={(e) =>
                  onUpdate({
                    householdComposition: {
                      ...profileData.householdComposition,
                      adults: parseInt(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label>Children</Label>
              <Input
                type="number"
                value={profileData.householdComposition?.children || ""}
                onChange={(e) =>
                  onUpdate({
                    householdComposition: {
                      ...profileData.householdComposition,
                      children: parseInt(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label>Infants</Label>
              <Input
                type="number"
                value={profileData.householdComposition?.infants || ""}
                onChange={(e) =>
                  onUpdate({
                    householdComposition: {
                      ...profileData.householdComposition,
                      infants: parseInt(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label>Elderly</Label>
              <Input
                type="number"
                value={profileData.householdComposition?.elderly || ""}
                onChange={(e) =>
                  onUpdate({
                    householdComposition: {
                      ...profileData.householdComposition,
                      elderly: parseInt(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label>Working Hours</Label>
              <Input
                value={profileData.workingHours || ""}
                onChange={(e) => onUpdate({ workingHours: e.target.value })}
                placeholder="e.g., 9 AM - 5 PM"
              />
            </div>
            <div>
              <Label>Preferred Start Date</Label>
              <Input
                type="date"
                value={profileData.preferredStartDate || ""}
                onChange={(e) =>
                  onUpdate({ preferredStartDate: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Budget Min</Label>
              <Input
                type="number"
                value={profileData.budgetRange?.min || ""}
                onChange={(e) =>
                  onUpdate({
                    budgetRange: {
                      ...profileData.budgetRange,
                      min: parseInt(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label>Budget Max</Label>
              <Input
                type="number"
                value={profileData.budgetRange?.max || ""}
                onChange={(e) =>
                  onUpdate({
                    budgetRange: {
                      ...profileData.budgetRange,
                      max: parseInt(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label>Currency</Label>
              <Select
                value={profileData.budgetRange?.currency || ""}
                onValueChange={(value) =>
                  onUpdate({
                    budgetRange: {
                      ...profileData.budgetRange,
                      currency: value,
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="AED">AED</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Household Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Household Size</p>
            <p className="font-semibold">
              {profileData.householdSize || "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Home Type</p>
            <p className="font-semibold">
              {profileData.homeType || "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Adults</p>
            <p className="font-semibold">
              {profileData.householdComposition?.adults || "0"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Children</p>
            <p className="font-semibold">
              {profileData.householdComposition?.children || "0"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Infants</p>
            <p className="font-semibold">
              {profileData.householdComposition?.infants || "0"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Elderly</p>
            <p className="font-semibold">
              {profileData.householdComposition?.elderly || "0"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Working Hours</p>
            <p className="font-semibold">
              {profileData.workingHours || "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Preferred Start Date</p>
            <p className="font-semibold">
              {profileData.preferredStartDate || "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Budget Range</p>
            <p className="font-semibold">
              {profileData.budgetRange?.min && profileData.budgetRange?.max
                ? `${profileData.budgetRange.currency} ${profileData.budgetRange.min} - ${profileData.budgetRange.max}`
                : "Not specified"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
