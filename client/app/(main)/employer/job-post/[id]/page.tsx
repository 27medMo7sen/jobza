"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  DollarSign,
  MapPin,
  Star,
  Eye,
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Building2,
  Edit,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { UnifiedSidebar } from "@/components/layout/unified-sidebar";
import { ApplicantsList } from "@/components/shared/ApplicantsList";
import { JobDetails } from "@/components/shared/JobDetails";

// Mock job post data
const mockJobPosts = {
  1: {
    id: 1,
    title: "Live-in Housekeeper",
    type: "long-term",
    status: "active",
    applicants: 12,
    postedDate: "2024-01-10",
    salary: "$2,500/month",
    description:
      "We are looking for a reliable and experienced live-in housekeeper to join our family. The ideal candidate should be detail-oriented, trustworthy, and have experience in maintaining a clean and organized household.",
    requirements: [
      "Minimum 3 years of experience in housekeeping",
      "Ability to work independently",
      "Good communication skills",
      "Flexible schedule",
      "Clean background check",
    ],
    responsibilities: [
      "Daily cleaning and tidying of all rooms",
      "Laundry and ironing",
      "Kitchen cleaning and meal prep assistance",
      "Grocery shopping and inventory management",
      "Pet care (if applicable)",
    ],
    location: "Downtown Cairo",
    schedule: "Monday to Friday, 8 AM - 6 PM",
    benefits: [
      "Private room with bathroom",
      "3 meals per day",
      "Health insurance",
      "Paid vacation days",
      "Transportation allowance",
    ],
    familyDetails: {
      members: 4,
      children: 0,
      elderly: 0,
      pets: false,
      houseSize: "3-bedroom apartment",
    },
    additionalInfo: {
      accommodation: true,
      meals: true,
      transportation: true,
      benefits: ["Health insurance", "Paid vacation", "Performance bonus"],
    },
    applications: [
      {
        id: 1,
        workerName: "Amina Hassan",
        workerAvatar: "/avatars/amina.jpg",
        appliedDate: "2024-01-12",
        status: "pending",
        rating: 4.8,
        experience: "5 years",
        location: "Downtown, Cairo",
        hourlyRate: "EGP 45-60",
        skills: ["Cleaning", "Laundry", "Cooking", "Pet Care"],
        languages: ["Arabic", "English"],
        verified: true,
      },
      {
        id: 2,
        workerName: "Fatima Ali",
        workerAvatar: "/avatars/fatima.jpg",
        appliedDate: "2024-01-11",
        status: "reviewed",
        rating: 4.9,
        experience: "7 years",
        location: "Maadi, Cairo",
        hourlyRate: "EGP 50-70",
        skills: [
          "Childcare",
          "Educational Activities",
          "Meal Prep",
          "Light Housekeeping",
        ],
        languages: ["Arabic", "English", "French"],
        verified: true,
      },
      {
        id: 3,
        workerName: "Mariam Ahmed",
        workerAvatar: "/avatars/mariam.jpg",
        appliedDate: "2024-01-10",
        status: "accepted",
        rating: 4.7,
        experience: "8 years",
        location: "Heliopolis, Cairo",
        hourlyRate: "EGP 55-75",
        skills: [
          "Elder Care",
          "Medical Assistance",
          "Personal Care",
          "Companionship",
        ],
        languages: ["Arabic", "English"],
        verified: true,
      },
    ],
  },
  2: {
    id: 2,
    title: "Weekend House Cleaning",
    type: "short-term",
    status: "completed",
    applicants: 8,
    postedDate: "2024-01-08",
    salary: "$150/session",
    description:
      "Need weekend house cleaning services for a 3-bedroom apartment. Looking for someone reliable and thorough with attention to detail.",
    requirements: [
      "Experience in residential cleaning",
      "Own cleaning supplies",
      "Available on weekends",
      "References required",
    ],
    responsibilities: [
      "Deep cleaning of all rooms",
      "Bathroom sanitization",
      "Kitchen deep cleaning",
      "Floor mopping and vacuuming",
      "Dusting and organizing",
    ],
    location: "Zamalek, Cairo",
    schedule: "Weekends only, flexible hours",
    benefits: [
      "Flexible scheduling",
      "Competitive pay",
      "Potential for regular work",
    ],
    familyDetails: {
      members: 3,
      children: 0,
      elderly: 0,
      pets: false,
      houseSize: "3-bedroom apartment",
    },
    additionalInfo: {
      accommodation: false,
      meals: false,
      transportation: false,
      benefits: ["Performance bonus"],
    },
    applications: [
      {
        id: 1,
        workerName: "Sara Mohamed",
        workerAvatar: "/avatars/sara.jpg",
        appliedDate: "2024-01-08",
        status: "completed",
        rating: 4.5,
        experience: "6 years",
        location: "Nasr City, Cairo",
        hourlyRate: "EGP 42-58",
        skills: ["Deep Cleaning", "Laundry", "Ironing", "Organization"],
        languages: ["Arabic"],
        verified: true,
      },
    ],
  },
  3: {
    id: 3,
    title: "Garden Maintenance",
    type: "short-term",
    status: "active",
    applicants: 5,
    postedDate: "2024-01-05",
    salary: "$80/day",
    description:
      "Looking for experienced gardener for regular garden maintenance including pruning, weeding, and general upkeep.",
    requirements: [
      "Minimum 2 years gardening experience",
      "Knowledge of local plants",
      "Own basic tools",
      "Physical fitness required",
    ],
    responsibilities: [
      "Regular weeding and pruning",
      "Plant care and watering",
      "Lawn maintenance",
      "Garden cleanup",
      "Seasonal planting",
    ],
    location: "Heliopolis, Cairo",
    schedule: "Twice weekly, flexible days",
    benefits: [
      "Regular work schedule",
      "Beautiful garden environment",
      "Competitive daily rate",
    ],
    familyDetails: {
      members: 2,
      children: 0,
      elderly: 0,
      pets: true,
      houseSize: "House with garden",
    },
    additionalInfo: {
      accommodation: false,
      meals: false,
      transportation: true,
      benefits: ["Transport allowance"],
    },
    applications: [
      {
        id: 1,
        workerName: "Ahmed Hassan",
        workerAvatar: "/avatars/ahmed.jpg",
        appliedDate: "2024-01-06",
        status: "pending",
        rating: 4.6,
        experience: "4 years",
        location: "Heliopolis, Cairo",
        hourlyRate: "EGP 35-50",
        skills: ["Gardening", "Landscaping", "Plant Care", "Irrigation"],
        languages: ["Arabic", "English"],
        verified: true,
      },
    ],
  },
};

export default function JobPostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [jobPost, setJobPost] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("applications");

  useEffect(() => {
    const jobId = params.id as string;
    const numericId = Number(jobId) as keyof typeof mockJobPosts;
    const post = mockJobPosts[numericId];
    if (post) {
      setJobPost(post);
    }
  }, [params.id]);

  if (!jobPost) {
    return (
      <div className="min-h-screen bg-background">
        <UnifiedSidebar
          userRole="employer"
          userName="John Smith"
          userEmail="john@example.com"
        />

        <div className="lg:ml-64">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Job Post Not Found
              </h2>
              <p className="text-gray-600 mb-4">
                The job post you're looking for doesn't exist.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    return type === "long-term"
      ? "bg-blue-100 text-blue-800"
      : "bg-pink-100 text-pink-800";
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleApplicationAction = (applicationId: number, action: string) => {
    setJobPost((prev: any) => {
      if (!prev) return prev;
      const nextStatus =
        action === "accept"
          ? "accepted"
          : action === "reject"
          ? "rejected"
          : action === "short_list"
          ? "short_list"
          : undefined;
      if (!nextStatus) return prev;
      return {
        ...prev,
        applications: prev.applications.map((app: any) =>
          app.id === applicationId ? { ...app, status: nextStatus } : app
        ),
      };
    });
  };

  const sortApplications = (applications: any[]) => {
    const rank: Record<string, number> = {
      accepted: 0,
      short_list: 1,
      pending: 2,
      reviewed: 3,
      completed: 4,
      rejected: 5,
    };
    return [...applications].sort((a, b) => {
      const ra = rank[a.status] ?? 99;
      const rb = rank[b.status] ?? 99;
      return ra - rb;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <UnifiedSidebar
        userRole="employer"
        userName="John Smith"
        userEmail="john@example.com"
      />

      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between"></div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Job Post Header */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex items-center space-x-3">
                  {jobPost.type === "long-term" ? (
                    <Calendar className="w-8 h-8 text-blue-600" />
                  ) : (
                    <Clock className="w-8 h-8 text-pink-600" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
                      {jobPost.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge className={getTypeColor(jobPost.type)}>
                        {jobPost.type === "long-term"
                          ? "Long-term"
                          : "Short-term"}
                      </Badge>
                      <Badge className={getStatusColor(jobPost.status)}>
                        {jobPost.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:text-right">
                  <p className="text-xl sm:text-2xl font-bold text-green-600 break-words">
                    {jobPost.salary}
                  </p>
                  <p className="text-sm text-gray-600">
                    Posted: {jobPost.postedDate}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-600 truncate">
                    {jobPost.applicants} applicants
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-600 truncate">
                    {jobPost.location}
                  </span>
                </div>
                <div className="flex items-center space-x-2 sm:col-span-2 lg:col-span-1">
                  <ClockIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-600 truncate">
                    {jobPost.schedule}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="applications">
                  Applicants ({jobPost.applications.length})
                </TabsTrigger>
                <TabsTrigger value="details">Job Details</TabsTrigger>
              </TabsList>

              {/* Applicants Tab */}
              <TabsContent value="applications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Applicants</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ApplicantsList
                      applications={jobPost.applications}
                      onAction={(id, action) =>
                        handleApplicationAction(id, action)
                      }
                      getStatusBadgeClass={(status) =>
                        getApplicationStatusColor(status)
                      }
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Job Details Tab (shared unified component) */}
              <TabsContent value="details" className="space-y-6">
                <JobDetails
                  audience="employer"
                  job={{
                    title: jobPost.title,
                    type: jobPost.type,
                    status: jobPost.status,
                    salary: jobPost.salary,
                    postedDate: jobPost.postedDate,
                    description: jobPost.description,
                    schedule: jobPost.schedule,
                    location: jobPost.location,
                    requirements: jobPost.requirements,
                    responsibilities: jobPost.responsibilities,
                    benefits: jobPost.benefits,
                    familyDetails: jobPost.familyDetails,
                    additionalInfo: jobPost.additionalInfo,
                  }}
                  getTypeBadgeClass={(type) => getTypeColor(type)}
                  getStatusBadgeClass={(status) => getStatusColor(status)}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
