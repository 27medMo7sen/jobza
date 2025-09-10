"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Search,
  Filter,
  MapPin,
  Star,
  Clock,
  Building2,
  UserPlus,
  UserCheck,
  Phone,
  Mail,
  Calendar,
  Award,
  Languages,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  ArrowLeft,
} from "lucide-react";
import { UnifiedSidebar } from "@/components/layout/unified-sidebar";
import { cn } from "@/lib/utils";

interface Worker {
  id: number;
  name: string;
  specialization: string;
  rating: number;
  experience: number;
  location: string;
  availability: string;
  nationality: string;
  passport: string;
  skills: string[];
  matchScore: number;
  isAffiliated: boolean;
  affiliatedDate?: string;
  affiliationStatus: "none" | "pending" | "accepted" | "rejected";
  affiliationRequestDate?: string;
  phone: string;
  email: string;
  languages: string[];
  certifications: string[];
  expectedSalary: string;
  preferredLocation: string;
  workType: "live-in" | "live-out" | "both";
  startDate: string;
}

function AgencyWorkersPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    specialization: "",
    location: "",
    experience: "",
    rating: "",
    availability: "",
    workType: "",
    nationality: "",
    salaryRange: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      message: string;
      type: "success" | "info" | "warning";
      timestamp: Date;
    }>
  >([]);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockWorkers: Worker[] = [
      {
        id: 1,
        name: "Maria Garcia",
        specialization: "Housekeeping",
        rating: 4.7,
        experience: 6,
        location: "Dubai",
        availability: "Available",
        nationality: "Filipino",
        passport: "P12345678",
        skills: [
          "Deep cleaning",
          "Laundry",
          "Cooking",
          "Organization",
          "Child care",
        ],
        matchScore: 95,
        isAffiliated: true,
        affiliatedDate: "2024-01-15",
        affiliationStatus: "accepted",
        affiliationRequestDate: "2024-01-10",
        phone: "+971 50 123 4567",
        email: "maria.garcia@email.com",
        languages: ["English", "Tagalog", "Spanish"],
        certifications: [
          "Housekeeping Certificate",
          "First Aid",
          "Food Safety",
        ],
        expectedSalary: "$1500/month",
        preferredLocation: "Dubai Marina, Downtown",
        workType: "both",
        startDate: "Immediate",
      },
      {
        id: 2,
        name: "Fatima Al-Zahra",
        specialization: "Childcare",
        rating: 4.9,
        experience: 8,
        location: "Sharjah",
        availability: "Available",
        nationality: "Egyptian",
        passport: "E87654321",
        skills: [
          "Child development",
          "Educational activities",
          "Meal preparation",
          "Safety protocols",
        ],
        matchScore: 88,
        isAffiliated: true,
        affiliatedDate: "2024-01-20",
        affiliationStatus: "accepted",
        affiliationRequestDate: "2024-01-15",
        phone: "+971 50 987 6543",
        email: "fatima.alzahra@email.com",
        languages: ["Arabic", "English", "French"],
        certifications: [
          "Childcare Diploma",
          "Early Childhood Education",
          "CPR Certified",
        ],
        expectedSalary: "$1800/month",
        preferredLocation: "Sharjah, Dubai",
        workType: "live-in",
        startDate: "2024-02-01",
      },
      {
        id: 3,
        name: "Sarah Johnson",
        specialization: "Elderly Care",
        rating: 4.6,
        experience: 5,
        location: "Abu Dhabi",
        availability: "Available",
        nationality: "British",
        passport: "B11223344",
        skills: [
          "Elderly care",
          "Medication management",
          "Mobility assistance",
          "Companionship",
        ],
        matchScore: 82,
        isAffiliated: false,
        affiliationStatus: "none",
        phone: "+971 50 555 1234",
        email: "sarah.johnson@email.com",
        languages: ["English", "French"],
        certifications: [
          "Nursing Assistant",
          "Geriatric Care",
          "Medication Administration",
        ],
        expectedSalary: "$2000/month",
        preferredLocation: "Abu Dhabi, Dubai",
        workType: "live-in",
        startDate: "2024-02-15",
      },
      {
        id: 4,
        name: "Ahmed Hassan",
        specialization: "Driver",
        rating: 4.8,
        experience: 7,
        location: "Dubai",
        availability: "Available",
        nationality: "Pakistani",
        passport: "PK98765432",
        skills: [
          "Safe driving",
          "Vehicle maintenance",
          "Route planning",
          "Customer service",
        ],
        matchScore: 90,
        isAffiliated: false,
        affiliationStatus: "none",
        phone: "+971 50 777 8888",
        email: "ahmed.hassan@email.com",
        languages: ["English", "Urdu", "Arabic"],
        certifications: [
          "UAE Driving License",
          "Defensive Driving",
          "First Aid",
        ],
        expectedSalary: "$1600/month",
        preferredLocation: "Dubai",
        workType: "live-out",
        startDate: "Immediate",
      },
      {
        id: 5,
        name: "Lisa Chen",
        specialization: "Cook",
        rating: 4.5,
        experience: 4,
        location: "Dubai",
        availability: "Available",
        nationality: "Chinese",
        passport: "C55667788",
        skills: [
          "International cuisine",
          "Dietary restrictions",
          "Meal planning",
          "Kitchen management",
        ],
        matchScore: 78,
        isAffiliated: false,
        affiliationStatus: "none",
        phone: "+971 50 999 0000",
        email: "lisa.chen@email.com",
        languages: ["English", "Mandarin", "Cantonese"],
        certifications: [
          "Culinary Arts Diploma",
          "Food Safety",
          "Nutrition Certificate",
        ],
        expectedSalary: "$1700/month",
        preferredLocation: "Dubai Marina, Palm Jumeirah",
        workType: "live-in",
        startDate: "2024-02-01",
      },
      {
        id: 6,
        name: "Priya Patel",
        specialization: "Housekeeping",
        rating: 4.7,
        experience: 6,
        location: "Dubai",
        availability: "Available",
        nationality: "Indian",
        passport: "IN11223344",
        skills: ["Deep cleaning", "Laundry", "Organization", "Time management"],
        matchScore: 85,
        isAffiliated: true,
        affiliatedDate: "2024-01-10",
        affiliationStatus: "accepted",
        affiliationRequestDate: "2024-01-05",
        phone: "+971 50 111 2222",
        email: "priya.patel@email.com",
        languages: ["English", "Hindi", "Gujarati"],
        certifications: [
          "Housekeeping Certificate",
          "Cleaning Techniques",
          "Safety Training",
        ],
        expectedSalary: "$1400/month",
        preferredLocation: "Dubai, Sharjah",
        workType: "both",
        startDate: "Immediate",
      },
    ];

    setWorkers(mockWorkers);
    setFilteredWorkers(mockWorkers);
  }, []);

  useEffect(() => {
    let filtered = workers;

    // Filter by tab
    if (activeTab === "affiliated") {
      filtered = filtered.filter(
        (worker) =>
          worker.isAffiliated && worker.affiliationStatus === "accepted"
      );
    } else {
      // For "all" tab, show workers that are not accepted affiliates
      filtered = filtered.filter(
        (worker) =>
          !worker.isAffiliated || worker.affiliationStatus !== "accepted"
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (worker) =>
          worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          worker.specialization
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          worker.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          worker.nationality.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply other filters
    if (filters.specialization) {
      filtered = filtered.filter(
        (worker) => worker.specialization === filters.specialization
      );
    }
    if (filters.location) {
      filtered = filtered.filter(
        (worker) => worker.location === filters.location
      );
    }
    if (filters.experience) {
      const minExp = parseInt(filters.experience);
      filtered = filtered.filter((worker) => worker.experience >= minExp);
    }
    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter((worker) => worker.rating >= minRating);
    }
    if (filters.availability) {
      filtered = filtered.filter(
        (worker) => worker.availability === filters.availability
      );
    }
    if (filters.workType) {
      filtered = filtered.filter(
        (worker) => worker.workType === filters.workType
      );
    }
    if (filters.nationality) {
      filtered = filtered.filter(
        (worker) => worker.nationality === filters.nationality
      );
    }

    setFilteredWorkers(filtered);
  }, [workers, activeTab, searchTerm, filters]);

  const addNotification = (
    message: string,
    type: "success" | "info" | "warning"
  ) => {
    const newNotification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
    };
    setNotifications((prev) => [...prev, newNotification]);

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== newNotification.id)
      );
    }, 5000);
  };

  const handleAffiliateWorker = (workerId: number) => {
    setWorkers((prev) =>
      prev.map((worker) =>
        worker.id === workerId
          ? {
              ...worker,
              affiliationStatus: "pending",
              affiliationRequestDate: new Date().toISOString().split("T")[0],
            }
          : worker
      )
    );
    addNotification("Affiliation request sent successfully!", "info");
  };

  const handleWorkerResponse = (
    workerId: number,
    response: "accepted" | "rejected"
  ) => {
    setWorkers((prev) =>
      prev.map((worker) => {
        if (worker.id === workerId) {
          if (response === "accepted") {
            return {
              ...worker,
              affiliationStatus: "accepted",
              isAffiliated: true,
              affiliatedDate: new Date().toISOString().split("T")[0],
            };
          } else {
            return {
              ...worker,
              affiliationStatus: "rejected",
            };
          }
        }
        return worker;
      })
    );

    if (response === "accepted") {
      addNotification(
        "Worker accepted affiliation request! Worker moved to affiliated tab.",
        "success"
      );
    } else {
      addNotification("Worker rejected affiliation request.", "warning");
    }
  };

  const handleRemoveAffiliation = (workerId: number) => {
    setWorkers((prev) =>
      prev.map((worker) =>
        worker.id === workerId
          ? { ...worker, isAffiliated: false, affiliatedDate: undefined }
          : worker
      )
    );
  };

  const clearFilters = () => {
    setFilters({
      specialization: "",
      location: "",
      experience: "",
      rating: "",
      availability: "",
      workType: "",
      nationality: "",
      salaryRange: "",
    });
    setSearchTerm("");
  };

  const getSpecializations = () => [
    ...new Set(workers.map((w) => w.specialization)),
  ];
  const getLocations = () => [...new Set(workers.map((w) => w.location))];
  const getNationalities = () => [
    ...new Set(workers.map((w) => w.nationality)),
  ];

  return (
    <div className="min-h-screen bg-background">
      <UnifiedSidebar
        userRole="agency"
        userName="Elite Home Services"
        userEmail="admin@elitehomeservices.com"
      />

      <div className="lg:ml-64">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Workers Management
              </h1>
              <p className="text-gray-600 mt-2">
                Browse and manage available workers and affiliated staff
              </p>
            </div>

            {/* Notifications */}
            {notifications.length > 0 && (
              <div className="space-y-2 mb-6">
                {notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={cn(
                      "border-l-4",
                      notification.type === "success"
                        ? "border-green-500 bg-green-50"
                        : notification.type === "warning"
                        ? "border-yellow-500 bg-yellow-50"
                        : "border-blue-500 bg-blue-50"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {notification.type === "success" && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                          {notification.type === "warning" && (
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                          )}
                          {notification.type === "info" && (
                            <Info className="h-4 w-4 text-blue-600" />
                          )}
                          <p
                            className={cn(
                              "text-sm font-medium",
                              notification.type === "success"
                                ? "text-green-800"
                                : notification.type === "warning"
                                ? "text-yellow-800"
                                : "text-blue-800"
                            )}
                          >
                            {notification.message}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setNotifications((prev) =>
                              prev.filter((n) => n.id !== notification.id)
                            )
                          }
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">
                        Total Workers
                      </p>
                      <p className="text-lg font-bold">{workers.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <UserCheck className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">
                        Affiliated
                      </p>
                      <p className="text-lg font-bold">
                        {workers.filter((w) => w.isAffiliated).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Available</p>
                      <p className="text-lg font-bold">
                        {
                          workers.filter((w) => w.availability === "Available")
                            .length
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                      <Star className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Top Rated</p>
                      <p className="text-lg font-bold">
                        {workers.filter((w) => w.rating >= 4.5).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search workers by name, specialization, location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={showFilters ? "default" : "outline"}
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2"
                    >
                      <Filter className="h-4 w-4" />
                      Filters
                    </Button>
                    <Button variant="outline" onClick={clearFilters}>
                      Clear All
                    </Button>
                  </div>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <Label>Specialization</Label>
                        <select
                          value={filters.specialization}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              specialization: e.target.value,
                            }))
                          }
                          className="w-full mt-1 p-2 border border-border rounded-md"
                        >
                          <option value="">All Specializations</option>
                          {getSpecializations().map((spec) => (
                            <option key={spec} value={spec}>
                              {spec}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label>Location</Label>
                        <select
                          value={filters.location}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          className="w-full mt-1 p-2 border border-border rounded-md"
                        >
                          <option value="">All Locations</option>
                          {getLocations().map((loc) => (
                            <option key={loc} value={loc}>
                              {loc}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label>Min Experience (years)</Label>
                        <select
                          value={filters.experience}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              experience: e.target.value,
                            }))
                          }
                          className="w-full mt-1 p-2 border border-border rounded-md"
                        >
                          <option value="">Any Experience</option>
                          <option value="1">1+ years</option>
                          <option value="3">3+ years</option>
                          <option value="5">5+ years</option>
                          <option value="8">8+ years</option>
                        </select>
                      </div>

                      <div>
                        <Label>Min Rating</Label>
                        <select
                          value={filters.rating}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              rating: e.target.value,
                            }))
                          }
                          className="w-full mt-1 p-2 border border-border rounded-md"
                        >
                          <option value="">Any Rating</option>
                          <option value="4.0">4.0+</option>
                          <option value="4.5">4.5+</option>
                          <option value="4.8">4.8+</option>
                        </select>
                      </div>

                      <div>
                        <Label>Work Type</Label>
                        <select
                          value={filters.workType}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              workType: e.target.value,
                            }))
                          }
                          className="w-full mt-1 p-2 border border-border rounded-md"
                        >
                          <option value="">All Types</option>
                          <option value="live-in">Live-in</option>
                          <option value="live-out">Live-out</option>
                          <option value="both">Both</option>
                        </select>
                      </div>

                      <div>
                        <Label>Nationality</Label>
                        <select
                          value={filters.nationality}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              nationality: e.target.value,
                            }))
                          }
                          className="w-full mt-1 p-2 border border-border rounded-md"
                        >
                          <option value="">All Nationalities</option>
                          {getNationalities().map((nat) => (
                            <option key={nat} value={nat}>
                              {nat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Workers Tabs */}
            <Card>
              <CardContent className="p-0">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 gap-2 h-auto p-2">
                    <TabsTrigger
                      value="all"
                      className="flex flex-col items-center justify-center p-4 h-auto data-[state=active]:border-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50"
                    >
                      <span className="font-medium">All Available Workers</span>
                      <span className="text-sm text-muted-foreground">
                        (
                        {
                          filteredWorkers.filter(
                            (w) =>
                              !w.isAffiliated ||
                              w.affiliationStatus !== "accepted"
                          ).length
                        }
                        )
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="affiliated"
                      className="flex flex-col items-center justify-center p-4 h-auto data-[state=active]:border-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50"
                    >
                      <span className="font-medium">Affiliated Workers</span>
                      <span className="text-sm text-muted-foreground">
                        (
                        {
                          filteredWorkers.filter(
                            (w) =>
                              w.isAffiliated &&
                              w.affiliationStatus === "accepted"
                          ).length
                        }
                        )
                      </span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredWorkers
                        .filter(
                          (w) =>
                            !w.isAffiliated ||
                            w.affiliationStatus !== "accepted"
                        )
                        .map((worker) => (
                          <Card
                            key={worker.id}
                            className="hover:shadow-sm transition-all duration-200"
                          >
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="font-bold text-lg">
                                    {worker.name}
                                  </h3>
                                  <p className="text-muted-foreground text-sm">
                                    {worker.specialization}
                                  </p>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {worker.availability}
                                </Badge>
                              </div>

                              <div className="space-y-3 mb-4">
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  <span>{worker.location}</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Star className="h-4 w-4 mr-2" />
                                  <span>
                                    ⭐ {worker.rating} • {worker.experience}{" "}
                                    years experience
                                  </span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Building2 className="h-4 w-4 mr-2" />
                                  <span>{worker.nationality}</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Award className="h-4 w-4 mr-2" />
                                  <span>{worker.expectedSalary}</span>
                                </div>
                              </div>

                              <div className="mb-4">
                                <p className="text-xs text-muted-foreground mb-2">
                                  Skills:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {worker.skills
                                    .slice(0, 3)
                                    .map((skill, index) => (
                                      <Badge
                                        key={index}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {skill}
                                      </Badge>
                                    ))}
                                  {worker.skills.length > 3 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      +{worker.skills.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full sm:flex-1"
                                  onClick={() =>
                                    window.open(
                                      `/agency/workers/${worker.id}`,
                                      "_blank"
                                    )
                                  }
                                >
                                  <Building2 className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>

                                {worker.affiliationStatus === "none" && (
                                  <Button
                                    size="sm"
                                    className="w-full sm:flex-1"
                                    onClick={() =>
                                      handleAffiliateWorker(worker.id)
                                    }
                                  >
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Send Affiliation Request
                                  </Button>
                                )}

                                {worker.affiliationStatus === "pending" && (
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    className="w-full sm:flex-1"
                                    disabled
                                  >
                                    <Clock className="h-4 w-4 mr-2" />
                                    Pending
                                  </Button>
                                )}

                                {worker.affiliationStatus === "rejected" && (
                                  <div className="flex flex-col sm:flex-row gap-2 flex-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full sm:flex-1"
                                      onClick={() =>
                                        handleAffiliateWorker(worker.id)
                                      }
                                    >
                                      <UserPlus className="h-4 w-4 mr-2" />
                                      Resend Request
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      className="w-full sm:flex-1"
                                      onClick={() =>
                                        handleWorkerResponse(
                                          worker.id,
                                          "rejected"
                                        )
                                      }
                                    >
                                      Simulate Reject
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="affiliated" className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredWorkers
                        .filter(
                          (w) =>
                            w.isAffiliated && w.affiliationStatus === "accepted"
                        )
                        .map((worker) => (
                          <Card
                            key={worker.id}
                            className="hover:shadow-sm transition-all duration-200 border-green-200"
                          >
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="font-bold text-lg">
                                    {worker.name}
                                  </h3>
                                  <p className="text-muted-foreground text-sm">
                                    {worker.specialization}
                                  </p>
                                </div>
                                <Badge
                                  variant="default"
                                  className="text-xs bg-green-100 text-green-800"
                                >
                                  Affiliated
                                </Badge>
                              </div>

                              <div className="space-y-3 mb-4">
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  <span>{worker.location}</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Star className="h-4 w-4 mr-2" />
                                  <span>
                                    ⭐ {worker.rating} • {worker.experience}{" "}
                                    years experience
                                  </span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  <span>
                                    Affiliated: {worker.affiliatedDate}
                                  </span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Award className="h-4 w-4 mr-2" />
                                  <span>{worker.expectedSalary}</span>
                                </div>
                              </div>

                              <div className="mb-4">
                                <p className="text-xs text-muted-foreground mb-2">
                                  Skills:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {worker.skills
                                    .slice(0, 3)
                                    .map((skill, index) => (
                                      <Badge
                                        key={index}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {skill}
                                      </Badge>
                                    ))}
                                  {worker.skills.length > 3 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      +{worker.skills.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                  onClick={() =>
                                    window.open(
                                      `/agency/workers/${worker.id}`,
                                      "_blank"
                                    )
                                  }
                                >
                                  <Building2 className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="flex-1"
                                  onClick={() =>
                                    handleRemoveAffiliation(worker.id)
                                  }
                                >
                                  Remove Affiliation
                                </Button>
                              </div>

                              {/* Demo: Simulate worker responses (remove in production) */}
                              <div className="mt-2 pt-2 border-t border-border">
                                <p className="text-xs text-muted-foreground mb-2">
                                  Demo: Simulate Worker Response
                                </p>
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 text-xs"
                                    onClick={() =>
                                      handleWorkerResponse(
                                        worker.id,
                                        "accepted"
                                      )
                                    }
                                  >
                                    Simulate Accept
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 text-xs"
                                    onClick={() =>
                                      handleWorkerResponse(
                                        worker.id,
                                        "rejected"
                                      )
                                    }
                                  >
                                    Simulate Reject
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AgencyWorkersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <UnifiedSidebar
            userRole="agency"
            userName="Elite Home Services"
            userEmail="admin@elitehomeservices.com"
          />
          <div className="lg:ml-64">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading workers...</p>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <AgencyWorkersPageContent />
    </Suspense>
  );
}
