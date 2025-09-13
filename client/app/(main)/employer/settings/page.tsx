"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Lock,
  Building2,
  CheckCircle,
  AlertCircle,
  Edit,
  Star,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

// Mock data for primary agencies
const mockAgencies = [
  {
    id: 1,
    name: "Elite Home Services",
    rating: 4.8,
    workersCount: 45,
    location: "Cairo, Egypt",
    isPrimary: true,
    contactPerson: "Ahmed Hassan",
    phone: "+20 123 456 7890",
    email: "ahmed@elitehomeservices.com",
  },
  {
    id: 2,
    name: "Premier Care Solutions",
    rating: 4.6,
    workersCount: 32,
    location: "Alexandria, Egypt",
    isPrimary: false,
    contactPerson: "Fatima Al-Zahra",
    phone: "+20 987 654 3210",
    email: "fatima@premiercare.com",
  },
  {
    id: 3,
    name: "Golden Hands Agency",
    rating: 4.9,
    workersCount: 28,
    location: "Giza, Egypt",
    isPrimary: false,
    contactPerson: "Mohamed Ali",
    phone: "+20 555 123 4567",
    email: "mohamed@goldenhands.com",
  },
];

export default function EmployerSettingsPage() {
  const router = useRouter();
  const [agencies, setAgencies] = useState(mockAgencies);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [changeReason, setChangeReason] = useState("");
  const [selectedAgency, setSelectedAgency] = useState<any>(null);

  const handleAgencyChange = (agencyId: number) => {
    const agency = agencies.find((a) => a.id === agencyId);
    setSelectedAgency(agency);
    setIsDialogOpen(true);
  };

  const confirmAgencyChange = () => {
    if (!changeReason.trim()) {
      toast.error("Please provide a reason for changing your agency");
      return;
    }

    // Update the agencies
    const updatedAgencies = agencies.map((agency) => ({
      ...agency,
      isPrimary: agency.id === selectedAgency.id,
    }));

    setAgencies(updatedAgencies);
    setChangeReason("");
    setIsDialogOpen(false);
    setSelectedAgency(null);

    toast.success(
      `Successfully changed primary agency to ${selectedAgency.name}`
    );
  };

  const getPrimaryAgency = () => {
    return agencies.find((agency) => agency.isPrimary) || null;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 pt-4 lg:pt-0">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 p-0 h-auto mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              Agency Settings
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your primary agency and view all affiliated agencies
            </p>
          </div>

          {/* Primary Agency Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Primary Agency
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getPrimaryAgency() ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {getPrimaryAgency()?.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {getPrimaryAgency()?.location}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">
                              {getPrimaryAgency()?.rating}
                            </span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {getPrimaryAgency()?.workersCount} workers
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Primary
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Contact Person
                      </Label>
                      <p className="text-sm text-gray-900">
                        {getPrimaryAgency()?.contactPerson}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Phone
                      </Label>
                      <p className="text-sm text-gray-900">
                        {getPrimaryAgency()?.phone}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Email
                      </Label>
                      <p className="text-sm text-gray-900">
                        {getPrimaryAgency()?.email}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Status
                      </Label>
                      <Badge className="bg-green-100 text-green-800">
                        <Lock className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Primary Agency
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You haven't selected a primary agency yet.
                  </p>
                  <Button>Select Primary Agency</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* All Agencies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-gray-600" />
                All Affiliated Agencies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agencies.map((agency) => (
                  <div
                    key={agency.id}
                    className={`p-4 border rounded-lg ${
                      agency.isPrimary
                        ? "border-blue-200 bg-blue-50/30"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            agency.isPrimary ? "bg-blue-100" : "bg-gray-100"
                          }`}
                        >
                          <Building2
                            className={`h-6 w-6 ${
                              agency.isPrimary
                                ? "text-blue-600"
                                : "text-gray-600"
                            }`}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {agency.name}
                            </h3>
                            {agency.isPrimary && (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Primary
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {agency.location}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">
                                {agency.rating}
                              </span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {agency.workersCount} workers
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!agency.isPrimary && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAgencyChange(agency.id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Set as Primary
                          </Button>
                        )}
                      </div>
                    </div>

                    <Collapsible>
                      <CollapsibleTrigger className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mt-3">
                        <ChevronRight className="h-4 w-4" />
                        View Details
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700">
                              Contact Person
                            </Label>
                            <p className="text-sm text-gray-900">
                              {agency.contactPerson}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">
                              Phone
                            </Label>
                            <p className="text-sm text-gray-900">
                              {agency.phone}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">
                              Email
                            </Label>
                            <p className="text-sm text-gray-900">
                              {agency.email}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">
                              Status
                            </Label>
                            <Badge className="bg-green-100 text-green-800">
                              <Lock className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Agency Change Reason Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Change Primary Agency
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for changing your primary agency. This
              will help us understand your needs better.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Reason for Change</Label>
              <Textarea
                id="reason"
                placeholder="e.g., Better service quality, more workers available, closer location..."
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setChangeReason("");
                setSelectedAgency(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAgencyChange}
              disabled={!changeReason.trim()}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
