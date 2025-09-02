"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmployerSidebar } from "@/components/layout/employer-sidebar"
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
import { ShortTermJobModal } from "@/components/jobs/short-term-job-modal"

export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [applicationFilter, setApplicationFilter] = useState("all")
  const [shortTermModalOpen, setShortTermModalOpen] = useState(false)
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

  const primaryAgencies = [
    { id: 1, name: "Premium Home Services", rating: 4.8, workers: 25, type: "placement" },
    { id: 2, name: "Elite Care Agency", rating: 4.9, workers: 18, type: "placement" },
    { id: 3, name: "Trusted Helpers", rating: 4.7, workers: 32, type: "service" },
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
    <div className="flex min-h-screen bg-background">
      <EmployerSidebar />

      <div className="flex-1 lg:ml-64">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
                      {/* Header */}
          <SharedHeader 
            title="Employer Dashboard" 
            subtitle="Manage your job postings and applications" 
          />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="applications" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Job Applications
                </TabsTrigger>
                <TabsTrigger value="post-job" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Post Job
                </TabsTrigger>
                <TabsTrigger value="job-history" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  My Job Posts History
                </TabsTrigger>
                <TabsTrigger value="contracts" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Contracts
                </TabsTrigger>
                <TabsTrigger value="agencies" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Primary Agencies
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
                          <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Users className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="font-medium">{app.workerName}</p>
                                <p className="text-sm text-gray-600">{app.jobTitle}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={app.status === "pending" ? "secondary" : "default"}>{app.status}</Badge>
                              <Button size="sm" variant="outline" onClick={() => handleViewDetails(app)}>
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
                          <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Building2 className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="font-medium">{app.agencyName}</p>
                                <p className="text-sm text-gray-600">{app.jobTitle}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={app.status === "pending" ? "secondary" : "default"}>{app.status}</Badge>
                              <Button size="sm" variant="outline" onClick={() => handleViewDetails(app)}>
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
                      <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="all" className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          All Job Applications
                        </TabsTrigger>
                        <TabsTrigger value="long-term" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Long Term Applications
                        </TabsTrigger>
                        <TabsTrigger value="short-term" className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Short Term Applications
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="all" className="space-y-4">
                        {[...shortTermApplications, ...longTermApplications].map((app) => (
                          <div
                            key={`${app.type}-${app.id}`}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div className="flex items-center gap-4">
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
                            <div className="flex items-center gap-2">
                              <Badge variant={app.status === "pending" ? "secondary" : "default"}>{app.status}</Badge>
                              <Button size="sm" onClick={() => handleViewDetails(app)}>
                                <Eye className="h-3 w-3 mr-1" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))}
                      </TabsContent>

                      <TabsContent value="long-term" className="space-y-4">
                        {longTermApplications.map((app) => (
                          <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                              <Building2 className="h-5 w-5 text-blue-600" />
                              <div>
                                <p className="font-medium">{app.agencyName}</p>
                                <p className="text-sm text-gray-600">{app.jobTitle}</p>
                                <p className="text-xs text-gray-500">Applied: {app.appliedDate}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={app.status === "pending" ? "secondary" : "default"}>{app.status}</Badge>
                              <Button size="sm" onClick={() => handleViewDetails(app)}>
                                <Eye className="h-3 w-3 mr-1" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))}
                      </TabsContent>

                      <TabsContent value="short-term" className="space-y-4">
                        {shortTermApplications.map((app) => (
                          <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                              <Users className="h-5 w-5 text-pink-600" />
                              <div>
                                <p className="font-medium">{app.workerName}</p>
                                <p className="text-sm text-gray-600">{app.jobTitle}</p>
                                <p className="text-xs text-gray-500">Applied: {app.appliedDate}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={app.status === "pending" ? "secondary" : "default"}>{app.status}</Badge>
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
                        <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            {job.type === "short-term" ? (
                              <Clock className="h-5 w-5 text-pink-600" />
                            ) : (
                              <Calendar className="h-5 w-5 text-blue-600" />
                            )}
                            <div>
                              <p className="font-medium">{job.title}</p>
                              <p className="text-sm text-gray-600">{job.salary}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <p className="text-xs text-gray-500">Posted: {job.postedDate}</p>
                                <Badge variant="outline">
                                  {job.type === "short-term" ? "Short-term" : "Long-term"}
                                </Badge>
                                <Badge variant={job.status === "active" ? "default" : "secondary"}>{job.status}</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-sm text-gray-600 mr-4">
                              <Users className="h-4 w-4" />
                              {job.applicants} applicants
                            </div>
                            <Button size="sm" variant="outline" onClick={() => handleViewJobPost(job.id)}>
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
                        <div key={contract.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium">{contract.position}</p>
                              <p className="text-sm text-gray-600">
                                {contract.agencyName} • {contract.workerName}
                              </p>
                              <div className="flex items-center gap-4 mt-1">
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
                          <div className="flex items-center gap-2">
                            <div className="text-right mr-4">
                              <p className="text-sm font-medium text-green-600">{contract.salary}</p>
                              <p className="text-xs text-gray-500">Contract ID: {contract.contractId}</p>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => router.push(`/contracts/${contract.id}?role=employer`)}>
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

              <TabsContent value="agencies" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <CardTitle>Primary Agencies</CardTitle>
                    </div>
                    <CardDescription>Your preferred agencies for job postings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {primaryAgencies.map((agency) => (
                        <div key={agency.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <Building2 className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium">{agency.name}</p>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span>Rating: {agency.rating}/5</span>
                                <span>•</span>
                                <Users className="h-4 w-4" />
                                <span>{agency.workers} workers</span>
                              </div>
                              <Badge variant="outline" className="mt-1">
                                {agency.type === "placement" ? "Placement Agency" : "Service Agency"}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => router.push("/agency/profile")}>
                              <Eye className="h-3 w-3 mr-1" />
                              View Profile
                            </Button>
                            <Button size="sm">Contact</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <ShortTermJobModal open={shortTermModalOpen} onOpenChange={setShortTermModalOpen} />
    </div>
  )
}
