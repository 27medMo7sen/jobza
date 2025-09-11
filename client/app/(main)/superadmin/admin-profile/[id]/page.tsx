"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ArrowLeft,
  Trash2,
  Edit3,
  Shield,
  Clock,
} from "lucide-react";
import { useHttp } from "@/hooks/use-http";
import { toast } from "sonner";

interface AdminProfile {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  gender?: string;
  country?: string;
  nationality?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  profilePicture?: {
    url: string;
    s3Key: string;
  };
  userId: {
    _id: string;
    email: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function AdminProfileViewPage() {
  const params = useParams();
  const router = useRouter();
  const { get, del } = useHttp();

  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchAdminProfile();
    }
  }, [params.id]);

  const fetchAdminProfile = async () => {
    try {
      const response = await get<any>(`/admin/profile/${params.id}`);
      setAdmin(response.admin);
    } catch (error) {
      console.error("Failed to fetch admin profile:", error);
      toast.error("Failed to load admin profile");
      router.push("/superadmin/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAdmin = async () => {
    if (!admin) return;

    if (
      !confirm(
        `Are you sure you want to delete admin "${admin.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await del(`/superadmin/delete-admin/${admin.email}`);
      toast.success("Admin deleted successfully");
      router.push("/superadmin/dashboard");
    } catch (error) {
      console.error("Failed to delete admin:", error);
      toast.error("Failed to delete admin");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin profile...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Admin Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The admin profile you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/superadmin/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={() => router.push("/superadmin/dashboard")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{admin.name}</h1>
              <p className="text-gray-600">Admin Profile Details</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleDeleteAdmin}
                variant="destructive"
                disabled={isDeleting}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete Admin"}
              </Button>
            </div>
          </div>
        </div>

        {/* Profile Picture and Basic Info */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                {admin.profilePicture?.url ? (
                  <img
                    src={admin.profilePicture.url}
                    alt={admin.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-semibold">{admin.name}</h2>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Shield className="h-3 w-3" />
                    {admin.userId.role}
                  </Badge>
                  {admin.userId.isVerified && (
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800"
                    >
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Mail className="h-4 w-4" />
                  {admin.email}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  Created {formatDate(admin.userId.createdAt)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Full Name
                  </Label>
                  <p className="text-lg">{admin.name || "Not provided"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Email
                  </Label>
                  <p className="text-lg">{admin.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Phone Number
                  </Label>
                  <p className="text-lg">
                    {admin.phoneNumber || "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Gender
                  </Label>
                  <p className="text-lg capitalize">
                    {admin.gender || "Not provided"}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Country
                  </Label>
                  <p className="text-lg">{admin.country || "Not provided"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Nationality
                  </Label>
                  <p className="text-lg">
                    {admin.nationality || "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Date of Birth
                  </Label>
                  <p className="text-lg">
                    {admin.dateOfBirth
                      ? formatDate(admin.dateOfBirth)
                      : "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    City
                  </Label>
                  <p className="text-lg">{admin.city || "Not provided"}</p>
                </div>
              </div>
            </div>
            {admin.address && (
              <div className="mt-6">
                <Label className="text-sm font-medium text-gray-500">
                  Address
                </Label>
                <p className="text-lg">{admin.address}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Role
                </Label>
                <p className="text-lg capitalize">{admin.userId.role}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Verification Status
                </Label>
                <p className="text-lg">
                  {admin.userId.isVerified ? (
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800"
                    >
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Not Verified</Badge>
                  )}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Account Created
                </Label>
                <p className="text-lg">{formatDate(admin.userId.createdAt)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Profile Last Updated
                </Label>
                <p className="text-lg">{formatDate(admin.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
