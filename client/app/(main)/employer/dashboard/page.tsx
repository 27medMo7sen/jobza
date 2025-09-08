"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UnifiedSidebar } from "@/components/layout/unified-sidebar"
import { SharedHeader } from "@/components/layout/shared-header"
import {
  Plus,
  Home,
  Briefcase,
  FileText,
  Building2,
  Users,
  Clock,
  Calendar,
  Eye,
  Star,
} from "lucide-react"

export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [applicationFilter, setApplicationFilter] = useState("all")

  const router = useRouter()

  const shortTermApplications = [
    {
      id: 1,
      workerName: "Sarah Johnson",
      jobTitle: "House Cleaning",
      appliedDate: "2024-01-15",
      status: "pending",
      type: "worker",
    },
    {
      id: 2,
      workerName: "Mike Chen",
      jobTitle: "Garden Maintenance",
      appliedDate: "2024-01-14",
      status: "pending",
      type: "worker",
    },
    {
      id: 3,
      workerName: "Lisa Rodriguez",
      jobTitle: "Babysitting",
      appliedDate: "2024-01-13",
      status: "reviewed",
      type: "worker",
    },
  ]

  const longTermApplications = [
    {
      id: 1,
      agencyName: "Premium Home Services",
      jobTitle: "Full-time Housekeeper",
      appliedDate: "2024-01-12",
      status: "pending",
      type: "agency",
    },
    {
      id: 2,
      agencyName: "Elite Care Agency",
      jobTitle: "Live-in Nanny",
      appliedDate: "2024-01-10",
      status: "reviewed",
      type: "agency",
    },
  ]


  const jobPostsHistory = [
    {
      id: 1,
      title: "Live-in Housekeeper",
      type: "long-term",
      status: "active",
      applicants: 12,
      postedDate: "2024-01-10",
      salary: "$2,500/month",
    },
    {
      id: 2,
      title: "Weekend House Cleaning",
      type: "short-term",
      status: "completed",
      applicants: 8,
      postedDate: "2024-01-08",
      salary: "$150/session",
    },
    {
      id: 3,
      title: "Garden Maintenance",
      type: "short-term",
      status: "active",
      applicants: 5,
      postedDate: "2024-01-05",
      salary: "$80/day",
    },
  ]

  const incomingContracts = [
    {
      id: 1,
      contractId: "CC-2025-EMP-00156",
      position: "Full-time Housekeeper",
      agencyName: "Elite Home Services",
      workerName: "Maria Garcia",
      salary: "$1,500/month",
      startDate: "2024-02-01",
      status: "pending_signature",
      createdAt: "2024-01-20",
      type: "long-term"
    },
    {
      id: 2,
      contractId: "CC-2025-EMP-00157",
      position: "Part-time Nanny",
      agencyName: "Premium Care Agency",
      workerName: "Fatima Al-Zahra",
      salary: "$800/month",
      startDate: "2024-02-15",
      status: "pending_signature",
      createdAt: "2024-01-18",
      type: "long-term"
    }
  ]

  const handleViewDetails = (application: any) => {
    if (application.type === "worker") {
      router.push(`/worker/profile`)
    } else if (application.type === "agency") {
      router.push(`/agency/profile`)
    }
  }

  const handleViewJobPost = (jobId: number) => {
    router.push(`/employer/job-post/${jobId}`)
  }



  return (
    <div className="min-h-screen bg-background">
      <UnifiedSidebar 
        userRole="employer"
        userName="John Smith"
        userEmail="john@example.com"
      />
      
      <div className="lg:ml-64">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <SharedHeader 
              title="Employer Dashboard" 
              subtitle="Manage your job postings and applications" 
            />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              {/* Mobile dropdown */}
              <div className="sm:hidden">
                <Select value={activeTab} onValueChange={setActiveTab}>
                  <SelectTrigger aria-label="Select section">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Overview</SelectItem>
                    <SelectItem value="applications">Job Applications</SelectItem>
                    <SelectItem value="post-job">Post Job</SelectItem>
                    <SelectItem value="job-history">My Job Posts History</SelectItem>
                    <SelectItem value="contracts">Contracts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Desktop/Tablet tab bar */}
              <TabsList className="hidden sm:grid w-full grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                <TabsTrigger value="overview" className="flex items-center gap-2 text-sm">
                  <Home className="h-4 w-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="applications" className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4" />
                  <span>Job Applications</span>
                </TabsTrigger>
                <TabsTrigger value="post-job" className="flex items-center gap-2 text-sm">
                  <Plus className="h-4 w-4" />
                  <span>Post Job</span>
                </TabsTrigger>
                <TabsTrigger value="job-history" className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4" />
                  <span>My Job Posts History</span>
                </TabsTrigger>
                <TabsTrigger value="contracts" className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4" />
                  <span>Contracts</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-pink-600" />
                        <CardTitle>Recent Short-term Applications</CardTitle>
                      </div>
                      <CardDescription>Applications from freelancer workers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {shortTermApplications.slice(0, 3).map((app) => (
                          <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg">
                            <div className="flex items-start sm:items-center gap-4">
                              <Users className="h-5 w-5 text-pink-600" />
                              <div>
                                <p className="font-medium">{app.workerName}</p>
                                <p className="text-sm text-gray-600">{app.jobTitle}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              <Badge variant={app.status === "pending" ? "secondary" : "default"}>{app.status}</Badge>
                              <div className="sm:hidden w-full">
                                <Button size="sm" onClick={() => handleViewDetails(app)} className="w-full">
                                  <Eye className="h-3 w-3 mr-1" />
                                  View Details
                                </Button>
                              </div>
                            </div>
                            <div className="hidden sm:flex items-center gap-2">
                              <Button size="sm" onClick={() => handleViewDetails(app)}>
                                <Eye className="h-3 w-3 mr-1" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <CardTitle>Recent Long-term Applications</CardTitle>
                      </div>
                      <CardDescription>Applications from agencies</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {longTermApplications.map((app) => (
                          <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg">
                            <div className="flex items-start sm:items-center gap-4">
                              <Building2 className="h-5 w-5 text-blue-600" />
                              <div>
                                <p className="font-medium">{app.agencyName}</p>
                                <p className="text-sm text-gray-600">{app.jobTitle}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              <Badge variant={app.status === "pending" ? "secondary" : "default"}>{app.status}</Badge>
                              <div className="sm:hidden w-full">
                                <Button size="sm" onClick={() => handleViewDetails(app)} className="w-full">
                                  <Eye className="h-3 w-3 mr-1" />
                                  View Details
                                </Button>
                              </div>
                            </div>
                            <div className="hidden sm:flex items-center gap-2">
                              <Button size="sm" onClick={() => handleViewDetails(app)}>
                                <Eye className="h-3 w-3 mr-1" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="applications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-green-600" />
                      <CardTitle>Job Applications</CardTitle>
                    </div>
                    <CardDescription>All applications from workers and agencies</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={applicationFilter} onValueChange={setApplicationFilter} className="w-full">
                      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-10">
                        <TabsTrigger 
                          value="all" 
                          className="flex items-center gap-2 text-xs sm:text-sm data-[state=active]:border-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50"
                        >
                          <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">All Job Applications</span>
                          <span className="sm:hidden">All</span>
                        </TabsTrigger>
                        <TabsTrigger 
                          value="long-term" 
                          className="flex items-center gap-2 text-xs sm:text-sm data-[state=active]:border-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50"
                        >
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">Long Term Applications</span>
                          <span className="sm:hidden">Long Term</span>
                        </TabsTrigger>
                        <TabsTrigger 
                          value="short-term" 
                          className="flex items-center gap-2 text-xs sm:text-sm data-[state=active]:border-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50"
                        >
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">Short Term Applications</span>
                          <span className="sm:hidden">Short Term</span>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="all" className="space-y-4 mt-6">
                        {[...shortTermApplications, ...longTermApplications].map((app) => (
                          <div
                            key={`${app.type}-${app.id}`}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg"
                          >
                            <div className="flex items-start sm:items-center gap-4">
                              {app.type === "worker" ? (
                                <Users className="h-5 w-5 text-pink-600" />
                              ) : (
                                <Building2 className="h-5 w-5 text-blue-600" />
                              )}
                              <div>
                                <p className="font-medium">{app.type === "worker" ? (app as any).workerName : (app as any).agencyName}</p>
                                <p className="text-sm text-gray-600">{app.jobTitle}</p>
                                <p className="text-xs text-gray-500">Applied: {app.appliedDate}</p>
                                <Badge variant="outline" className="mt-1">
                                  {app.type === "worker" ? "Worker" : "Agency"}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              <Badge variant={app.status === "pending" ? "secondary" : "default"}>{app.status}</Badge>
                              {app.status === "accepted" && (
                                <Button size="sm" className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-700" onClick={() => router.push('/messages')}>
                                  Contact
                                </Button>
                              )}
                              <div className="sm:hidden w-full">
                                <Button size="sm" onClick={() => handleViewDetails(app)} className="w-full">
                                  <Eye className="h-3 w-3 mr-1" />
                                  View Details
                                </Button>
                              </div>
                            </div>
                            <div className="hidden sm:flex items-center gap-2">
                              {app.status === "accepted" && (
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push('/messages')}>
                                  Contact
                                </Button>
                              )}
                              <Button size="sm" onClick={() => handleViewDetails(app)}>
                                <Eye className="h-3 w-3 mr-1" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))}
                      </TabsContent>

                      <TabsContent value="long-term" className="space-y-4 mt-6">
                        {longTermApplications.map((app) => (
                          <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg">
                            <div className="flex items-start sm:items-center gap-4">
                              <Building2 className="h-5 w-5 text-blue-600" />
                              <div>
                                <p className="font-medium">{app.agencyName}</p>
                                <p className="text-sm text-gray-600">{app.jobTitle}</p>
                                <p className="text-xs text-gray-500">Applied: {app.appliedDate}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              <Badge variant={app.status === "pending" ? "secondary" : "default"}>{app.status}</Badge>
                              <div className="sm:hidden w-full">
                                <Button size="sm" onClick={() => handleViewDetails(app)} className="w-full">
                                  <Eye className="h-3 w-3 mr-1" />
                                  View Details
                                </Button>
                              </div>
                            </div>
                            <div className="hidden sm:flex items-center gap-2">
                              <Button size="sm" onClick={() => handleViewDetails(app)}>
                                <Eye className="h-3 w-3 mr-1" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))}
                      </TabsContent>

                      <TabsContent value="short-term" className="space-y-4 mt-6">
                        {shortTermApplications.map((app) => (
                          <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg">
                            <div className="flex items-start sm:items-center gap-4">
                              <Users className="h-5 w-5 text-pink-600" />
                              <div>
                                <p className="font-medium">{app.workerName}</p>
                                <p className="text-sm text-gray-600">{app.jobTitle}</p>
                                <p className="text-xs text-gray-500">Applied: {app.appliedDate}</p>
                              </div>
                            </div>
                            <div className="flex items-center sm:items-center gap-2 sm:justify-end w-full sm:w-auto">
                              <div className="flex items-center gap-2">
                                <Badge variant={app.status === "pending" ? "secondary" : "default"}>{app.status}</Badge>
                              </div>
                              <div className="sm:hidden w-full">
                                <Button size="sm" onClick={() => handleViewDetails(app)} className="w-full">
                                  <Eye className="h-3 w-3 mr-1" />
                                  View Details
                                </Button>
                              </div>
                            </div>
                            <div className="hidden sm:flex items-center gap-2">
                              <Button size="sm" onClick={() => handleViewDetails(app)}>
                                <Eye className="h-3 w-3 mr-1" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="post-job" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-pink-600" />
                        <CardTitle>Post Short-term Job</CardTitle>
                      </div>
                      <CardDescription>Send directly to freelancer workers or service agencies</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline" size="lg" asChild className="w-full">
                        <Link href="/employer/short-term-booking">
                          <Clock className="mr-2 h-4 w-4" />
                          Short-term Booking Form
                        </Link>
                      </Button>
                      <p className="text-sm text-gray-600 mt-2">
                        Perfect for one-time tasks, temporary help, or flexible scheduling needs. 
                        Browse workers or select agencies directly from the form based on your needs.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <CardTitle>Post Long-term Job</CardTitle>
                      </div>
                      <CardDescription>Send to your primary placement agencies</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline" size="lg" asChild className="w-full">
                        <Link href="/employer/long-term-booking">
                          <Calendar className="mr-2 h-4 w-4" />
                          Long-term Booking Form
                        </Link>
                      </Button>
                      <p className="text-sm text-gray-600 mt-2">
                        Ideal for permanent positions, regular schedules, and ongoing relationships.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="job-history" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      <CardTitle>My Job Posts History</CardTitle>
                    </div>
                    <CardDescription>Review, edit, and manage all your job postings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {jobPostsHistory.map((job) => (
                        <div key={job.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg">
                          <div className="flex items-start sm:items-center gap-4">
                            {job.type === "short-term" ? (
                              <Clock className="h-5 w-5 text-pink-600" />
                            ) : (
                              <Calendar className="h-5 w-5 text-blue-600" />
                            )}
                            <div>
                              <p className="font-medium">{job.title}</p>
                              <p className="text-sm text-gray-600">{job.salary}</p>
                              <p className="text-xs text-gray-500 mt-1">Posted: {job.postedDate}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline">
                                  {job.type === "short-term" ? "Short-term" : "Long-term"}
                                </Badge>
                                <span className="text-xs text-gray-500">-</span>
                                <Badge variant={job.status === "active" ? "default" : "secondary"}>{job.status}</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="hidden sm:flex items-center gap-2">
                            <div className="flex items-center gap-1 text-sm text-gray-600 mr-4">
                              <Users className="h-4 w-4" />
                              {job.applicants} applicants
                            </div>
                            <Button size="sm" variant="outline" onClick={() => handleViewJobPost(job.id)}>
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </div>
                          <div className="sm:hidden mt-1 space-y-2">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Users className="h-4 w-4" />
                              {job.applicants} applicants
                            </div>
                            <Button size="sm" variant="outline" className="w-full" onClick={() => handleViewJobPost(job.id)}>
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contracts" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <CardTitle>Incoming Contracts</CardTitle>
                    </div>
                    <CardDescription>Review and sign contracts from agencies for long-term placements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {incomingContracts.map((contract) => (
                        <div key={contract.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg">
                          <div className="flex items-start sm:items-center gap-4">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium">{contract.position}</p>
                              <p className="text-sm text-gray-600">
                                {contract.agencyName} • {contract.workerName}
                              </p>
                              <div className="flex flex-wrap items-center gap-4 mt-1">
                                <p className="text-xs text-gray-500">Created: {contract.createdAt}</p>
                                <p className="text-xs text-gray-500">Start: {contract.startDate}</p>
                                <Badge variant="outline">
                                  {contract.type === "short-term" ? "Short-term" : "Long-term"}
                                </Badge>
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                  Pending Signature
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="hidden sm:flex items-center gap-2">
                            <div className="text-right mr-4">
                              <p className="text-sm font-medium text-green-600">{contract.salary}</p>
                              <p className="text-xs text-gray-500">Contract ID: {contract.contractId}</p>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => router.push(`/contracts/${contract.id}?role=employer`)}>
                              <Eye className="h-3 w-3 mr-1" />
                              View & Sign
                            </Button>
                          </div>
                          {/* Mobile: move salary/id and action below */}
                          <div className="sm:hidden mt-2 space-y-2">
                            <div className="text-sm text-gray-700">
                              <p className="font-medium text-green-600">{contract.salary}</p>
                              <p className="text-xs text-gray-500">Contract ID: {contract.contractId}</p>
                            </div>
                            <Button size="sm" variant="outline" className="w-full" onClick={() => router.push(`/contracts/${contract.id}?role=employer`)}>
                              <Eye className="h-3 w-3 mr-1" />
                              View & Sign
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {incomingContracts.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>No incoming contracts at the moment</p>
                          <p className="text-sm">Contracts from agencies will appear here when ready for your signature</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </div>


    </div>
  )
}
