"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProfileData, status as ProfileStatus } from "@/types/profile";

export function StatusSidebar({ profileData }: { profileData: ProfileData }) {
  const status = profileData?.status;
  return (
    <div className="space-y-6">
      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-900">Account Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            {status && (
              <Badge
                variant={
                  status === ProfileStatus.PENDING
                    ? "secondary"
                    : status === ProfileStatus.APPROVED
                    ? "default"
                    : "destructive"
                }
                className={
                  status === ProfileStatus.PENDING
                    ? "bg-yellow-100 text-yellow-800 text-lg px-4 py-2"
                    : status === ProfileStatus.APPROVED
                    ? "bg-green-100 text-green-800 text-lg px-4 py-2"
                    : "bg-red-100 text-red-800 text-lg px-4 py-2"
                }
              >
                {status}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
