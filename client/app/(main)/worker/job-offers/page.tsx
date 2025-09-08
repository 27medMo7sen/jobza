"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UnifiedSidebar } from "@/components/layout/unified-sidebar";
import { SharedHeader } from "@/components/layout/shared-header";
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Search,
  Plus,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { LongTermJobDetails } from "@/components/jobs/long-term-job-details";
import { ShortTermJobModal } from "@/components/jobs/short-term-job-modal";

export default function JobOffersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [salaryRange, setSalaryRange] = useState("all");
  const [showAffiliationSuccess, setShowAffiliationSuccess] = useState(false);
  const [lastAffiliationAgency, setLastAffiliationAgency] = useState("");
  const [pendingAffiliations, setPendingAffiliations] = useState<Set<string>>(
    new Set()
  );
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [agencyToCancel, setAgencyToCancel] = useState("");
  const [selectedShortTermJob, setSelectedShortTermJob] = useState<any>(null);
  const [showShortTermModal, setShowShortTermModal] = useState(false);
  const [selectedLongTermJob, setSelectedLongTermJob] = useState<any>(null);
  const [showLongTermDetails, setShowLongTermDetails] = useState(false);

  // Mock job offers data
  const jobOffers = [
    {
      id: 1,
      title: "House Cleaning - Weekly",
      type: "short-term",
      family: "Johnson Family",
      location: "Downtown, 2.5 km away",
      salary: "$25/hour",
      duration: "3 hours/week",
      startDate: "2024-01-15",
      description:
        "Weekly house cleaning including kitchen, bathrooms, and living areas.",
      requirements: ["Experience with cleaning", "Own transportation"],
      status: "new",
    },
    {
      id: 2,
      title: "Full-time Nanny Position",
      type: "long-term",
      agency: "Elite Care Agency",
      location: "Suburbs, 5.2 km away",
      salary: "$2,800/month",
      duration: "Full-time",
      startDate: "2024-02-01",
      description:
        "Looking for experienced nanny for 2 children (ages 3 and 6).",
      requirements: [
        "Childcare certification",
        "First aid training",
        "References",
      ],
      status: "urgent",
      // Long-term job specific details
      primaryRole: "nanny",
      adults: 2,
      children03: 1,
      children47: 1,
      children814: 0,
      bedrooms: 4,
      bathrooms: 3,
      kitchens: 1,
      additionalRooms: 2,
      cooking: true,
      laundry: true,
      grocery: true,
      petCare: false,
      otherTask: false,
      otherTaskText: "",
      mobility: false,
      personalCare: false,
      standbyHours: 2,
      livingArrangement: "Live-in",
      workCycle: "6 days/week",
      roomType: "Private Room",
      paymentCycle: "Monthly",
      mealPlan: "1-1-1 (Breakfast, Lunch, Dinner)",
      feedingAllowance: "$200/month",
      wifi: true,
      ac: true,
      tv: true,
      laundryAmenity: true,
      heater: true,
      privateBathroom: true,
      transportAllowance: "$150/month",
      externalLodge: "No",
      accommodationAllowance: "",
    },
    {
      id: 3,
      title: "Elderly Care Assistant",
      type: "long-term",
      agency: "Compassionate Care",
      location: "City Center, 1.8 km away",
      salary: "$22/hour",
      duration: "Part-time, 20 hours/week",
      startDate: "2024-01-20",
      description:
        "Assisting elderly client with daily activities and companionship.",
      requirements: [
        "Elderly care experience",
        "Patience and empathy",
        "Flexible schedule",
      ],
      status: "new",
      // Long-term job specific details
      primaryRole: "elderly-care",
      adults: 1,
      children03: 0,
      children47: 0,
      children814: 0,
      bedrooms: 2,
      bathrooms: 1,
      kitchens: 1,
      additionalRooms: 1,
      cooking: true,
      laundry: false,
      grocery: true,
      petCare: false,
      otherTask: false,
      otherTaskText: "",
      mobility: true,
      personalCare: true,
      standbyHours: 0,
      livingArrangement: "Live-out",
      workCycle: "5 days/week",
      roomType: "N/A",
      paymentCycle: "Weekly",
      mealPlan: "1-0-1 (Breakfast, No Lunch, Dinner)",
      feedingAllowance: "$100/week",
      wifi: true,
      ac: true,
      tv: true,
      laundryAmenity: false,
      heater: true,
      privateBathroom: false,
      transportAllowance: "$50/week",
      externalLodge: "No",
      accommodationAllowance: "",
    },
    {
      id: 4,
      title: "Weekend Housekeeper",
      type: "short-term",
      family: "Smith Family",
      location: "Suburbs, 3.1 km away",
      salary: "$30/hour",
      duration: "4 hours/weekend",
      startDate: "2024-01-25",
      description:
        "Weekend housekeeping including deep cleaning and organization.",
      requirements: [
        "Detail-oriented",
        "Reliable transportation",
        "Weekend availability",
      ],
      status: "new",
    },
    {
      id: 5,
      title: "Live-in House Manager",
      type: "long-term",
      agency: "Premium Household Staff",
      location: "Downtown, 4.7 km away",
      salary: "$3,500/month",
      duration: "Full-time, live-in",
      startDate: "2024-02-15",
      description: "Managing household operations for a high-profile family.",
      requirements: [
        "Household management experience",
        "Excellent communication",
        "Discretion",
      ],
      status: "urgent",
      // Long-term job specific details
      primaryRole: "house-manager",
      adults: 2,
      children03: 0,
      children47: 0,
      children814: 0,
      bedrooms: 5,
      bathrooms: 4,
      kitchens: 2,
      additionalRooms: 3,
      cooking: true,
      laundry: true,
      grocery: true,
      petCare: true,
      otherTask: true,
      otherTaskText: "Event planning and coordination",
      mobility: false,
      personalCare: false,
      standbyHours: 4,
      livingArrangement: "Live-in",
      workCycle: "6 days/week",
      roomType: "Private Suite",
      paymentCycle: "Monthly",
      mealPlan: "1-1-1 (Breakfast, Lunch, Dinner)",
      feedingAllowance: "$300/month",
      wifi: true,
      ac: true,
      tv: true,
      laundryAmenity: true,
      heater: true,
      privateBathroom: true,
      transportAllowance: "$200/month",
      externalLodge: "No",
      accommodationAllowance: "",
    },
  ];

  const handleSendAffiliationRequest = (agencyName: string) => {
    setPendingAffiliations((prev) => new Set(prev).add(agencyName));
    setLastAffiliationAgency(agencyName);
    setShowAffiliationSuccess(true);

    // Hide success message after 5 seconds
    setTimeout(() => setShowAffiliationSuccess(false), 5000);
  };

  const handleCancelAffiliationRequest = (agencyName: string) => {
    setAgencyToCancel(agencyName);
    setShowCancelDialog(true);
  };

  const confirmCancelAffiliation = () => {
    if (agencyToCancel) {
      setPendingAffiliations((prev) => {
        const newSet = new Set(prev);
        newSet.delete(agencyToCancel);
        return newSet;
      });
      setShowCancelDialog(false);
      setAgencyToCancel("");
    }
  };

  const handleViewJobDetails = (job: any) => {
    if (job.type === "short-term") {
      setSelectedShortTermJob(job);
      setShowShortTermModal(true);
    } else {
      setSelectedLongTermJob(job);
      setShowLongTermDetails(true);
    }
  };

  const handleBackToJobOffers = () => {
    setShowLongTermDetails(false);
    setSelectedLongTermJob(null);
  };

  const filteredJobs = jobOffers.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = jobTypeFilter === "all" || job.type === jobTypeFilter;
    const matchesLocation =
      locationFilter === "all" || job.location.includes(locationFilter);
    const matchesSalary =
      salaryRange === "all" ||
      (job.salary.includes("$20-25/hour") && salaryRange === "$20-25") ||
      (job.salary.includes("$25-30/hour") && salaryRange === "$25-30") ||
      (job.salary.includes("$2000+/month") && salaryRange === "$2000+");

    return matchesSearch && matchesType && matchesLocation && matchesSalary;
  });

  return (
    <div className="min-h-screen bg-background">
      <UnifiedSidebar
        userRole="worker"
        userName="Sarah Johnson"
        userEmail="sarah@example.com"
      />

      <div className="lg:ml-64 flex-1 flex flex-col overflow-hidden">
        <SharedHeader
          title="Job Offers"
          subtitle="Browse available job opportunities"
        />

        {/* Filters */}
        <div className="bg-card border-b border-border px-6 py-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="long-term">Long Term</SelectItem>
                <SelectItem value="short-term">Short Term</SelectItem>
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Downtown">Downtown</SelectItem>
                <SelectItem value="Suburbs">Suburbs</SelectItem>
                <SelectItem value="City Center">City Center</SelectItem>
              </SelectContent>
            </Select>

            <Select value={salaryRange} onValueChange={setSalaryRange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Salary Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ranges</SelectItem>
                <SelectItem value="20-25">$20-25/hour</SelectItem>
                <SelectItem value="25-30">$25-30/hour</SelectItem>
                <SelectItem value="2000+">$2000+/month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Affiliation Success Message */}
        {showAffiliationSuccess && (
          <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950/20 dark:border-green-800">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <p className="text-green-800 dark:text-green-200">
                Affiliation request sent to{" "}
                <span className="font-semibold">{lastAffiliationAgency}</span>!
                The button now shows "Pending" - you can click it to cancel if
                needed.
              </p>
            </div>
          </div>
        )}

        {/* Cancel Affiliation Confirmation Dialog */}
        {showCancelDialog && (
          <div className="mx-6 mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg dark:bg-amber-950/20 dark:border-amber-800">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200">
                  Cancel Affiliation Request
                </h3>
              </div>
              <p className="text-amber-700 dark:text-amber-300 mb-4">
                Do you want to cancel the affiliation request to{" "}
                <span className="font-semibold">{agencyToCancel}</span>?
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={confirmCancelAffiliation}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Yes, Cancel Request
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCancelDialog(false)}
                  className="border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-600 dark:text-amber-300 dark:hover:bg-amber-900/30"
                >
                  No, Keep Request
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Job Offers List */}
        {!showLongTermDetails ? (
          <div className="flex-1 overflow-auto p-6">
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card
                  key={job.id}
                  className="hover:shadow-lg dark:hover:shadow-2xl transition-all duration-200 bg-card border-border hover:border-primary/20"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-card-foreground">
                          {job.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-muted-foreground">
                            {job.type === "long-term" ? job.agency : job.family}
                          </p>
                          {job.type === "long-term" &&
                            (pendingAffiliations.has(job.agency) ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 px-2 text-xs border-yellow-300 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-400 dark:border-yellow-600 dark:text-yellow-400 dark:hover:bg-yellow-950/30"
                                onClick={() =>
                                  handleCancelAffiliationRequest(job.agency)
                                }
                              >
                                <Clock className="h-3 w-3 mr-1" />
                                Pending
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 px-2 text-xs border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-950/30"
                                onClick={() =>
                                  handleSendAffiliationRequest(job.agency)
                                }
                              >
                                <Plus className="h-3 w-1 mr-1" />
                                Connect
                              </Button>
                            ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-2">
                        <Badge
                          variant={
                            job.type === "long-term" ? "default" : "secondary"
                          }
                          className="w-fit"
                        >
                          {job.type === "long-term"
                            ? "Long Term"
                            : "Short Term"}
                        </Badge>
                        {job.status === "urgent" && (
                          <Badge variant="destructive" className="w-fit">
                            Urgent
                          </Badge>
                        )}
                        {job.status === "new" && (
                          <Badge
                            variant="outline"
                            className="w-fit bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700"
                          >
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-card-foreground mb-4">
                      {job.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                        {job.salary}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2 text-blue-500" />
                        {job.duration}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                        Start: {job.startDate}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-2 text-card-foreground">
                        Requirements:
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {job.requirements.map((req, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-3">
                      <Button className="flex-1 bg-primary hover:bg-primary/90">
                        Apply Now
                      </Button>
                      <Button
                        variant="outline"
                        className="border-border hover:bg-accent hover:text-accent-foreground"
                        onClick={() => handleViewJobDetails(job)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* Long-term Job Details View */
          <div className="flex-1 overflow-auto p-6">
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={handleBackToJobOffers}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Job Offers
              </Button>
              <h1 className="text-2xl font-bold text-card-foreground">
                Job Details
              </h1>
            </div>

            {selectedLongTermJob && (
              <LongTermJobDetails job={selectedLongTermJob} />
            )}
          </div>
        )}

        {/* Short-term Job Modal */}
        {showShortTermModal && selectedShortTermJob && (
          <ShortTermJobModal
            job={selectedShortTermJob}
            isOpen={showShortTermModal}
            onClose={() => {
              setShowShortTermModal(false);
              setSelectedShortTermJob(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
