"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AgencyProfileData } from "@/types/profile";

interface BusinessInformationProps {
  profileData: AgencyProfileData;
  isEditing: boolean;
  onUpdate: (data: Partial<AgencyProfileData>) => void;
}

export function BusinessInformation({
  profileData,
  isEditing,
  onUpdate,
}: BusinessInformationProps) {
  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">
            Business Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Agency Type</Label>
              <Select
                value={profileData.agencyType || ""}
                onValueChange={(value) => onUpdate({ agencyType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="domestic">Domestic Services</SelectItem>
                  <SelectItem value="cleaning">Cleaning Services</SelectItem>
                  <SelectItem value="care">Care Services</SelectItem>
                  <SelectItem value="maintenance">
                    Maintenance Services
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Registration Number</Label>
              <Input
                value={profileData.registrationNumber || ""}
                onChange={(e) =>
                  onUpdate({ registrationNumber: e.target.value })
                }
              />
            </div>
            <div>
              <Label>License Number</Label>
              <Input
                value={profileData.licenseNumber || ""}
                onChange={(e) => onUpdate({ licenseNumber: e.target.value })}
              />
            </div>
            <div>
              <Label>Establishment Date</Label>
              <Input
                type="date"
                value={profileData.establishmentDate || ""}
                onChange={(e) =>
                  onUpdate({ establishmentDate: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Street Address</Label>
              <Input
                value={profileData.streetAddress || ""}
                onChange={(e) => onUpdate({ streetAddress: e.target.value })}
              />
            </div>
            <div>
              <Label>City</Label>
              <Input
                value={profileData.city || ""}
                onChange={(e) => onUpdate({ city: e.target.value })}
              />
            </div>
            <div>
              <Label>State</Label>
              <Input
                value={profileData.state || ""}
                onChange={(e) => onUpdate({ state: e.target.value })}
              />
            </div>
            <div>
              <Label>Postal Code</Label>
              <Input
                value={profileData.postalCode || ""}
                onChange={(e) => onUpdate({ postalCode: e.target.value })}
              />
            </div>
            <div>
              <Label>Years in Business</Label>
              <Input
                type="number"
                value={profileData.yearsInBusiness || ""}
                onChange={(e) =>
                  onUpdate({ yearsInBusiness: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <Label>Number of Employees</Label>
              <Input
                type="number"
                value={profileData.numberOfEmployees || ""}
                onChange={(e) =>
                  onUpdate({ numberOfEmployees: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div className="md:col-span-2">
              <Label>Business Description</Label>
              <Textarea
                value={profileData.businessDescription || ""}
                onChange={(e) =>
                  onUpdate({ businessDescription: e.target.value })
                }
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Business Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Agency Type</p>
            <p className="font-semibold">
              {profileData.agencyType || "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Registration Number</p>
            <p className="font-semibold">
              {profileData.registrationNumber || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">License Number</p>
            <p className="font-semibold">
              {profileData.licenseNumber || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Establishment Date</p>
            <p className="font-semibold">
              {profileData.establishmentDate || "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Address</p>
            <p className="font-semibold">
              {profileData.streetAddress || "Not provided"}
              {profileData.city && `, ${profileData.city}`}
              {profileData.state && `, ${profileData.state}`}
              {profileData.postalCode && ` ${profileData.postalCode}`}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Years in Business</p>
            <p className="font-semibold">
              {profileData.yearsInBusiness || "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Number of Employees</p>
            <p className="font-semibold">
              {profileData.numberOfEmployees || "Not specified"}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-600">Business Description</p>
            <p className="font-semibold">
              {profileData.businessDescription || "Not provided"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
