"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, XCircle, CheckCircle, ArrowLeft, Search, Filter } from "lucide-react"
import { UnifiedSidebar } from "@/components/layout/unified-sidebar"
import Link from "next/link"

export default function WorkerApplications() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const applications = [
    {
      id: 1,
      title: "Elderly Care",
      familyName: "Brown Family",
      budget: "$22/hr",
      location: "Dubai",
      appliedDate: "2024-01-14",
      status: "pending",
      type: "short-term",
      description: "Looking for experienced caregiver for elderly parent",
    },
    {
      id: 2,
      title: "House Cleaning",
      familyName: "Davis Family",
      budget: "$24/hr",
      location: "Abu Dhabi",
      appliedDate: "2024-01-13",
      status: "under_review",
      type: "short-term",
      description: "Weekly house cleaning service needed",
    },
    {
      id: 3,
      title: "Full-time Caregiver",
      agencyName: "CareFirst Agency",
      budget: "$1500/month",
      location: "Dubai",
      appliedDate: "2024-01-12",
      status: "pending",
      type: "long-term",
      description: "Full-time position with benefits",
    },
    {
      id: 4,
      title: "Garden Maintenance",
      familyName: "Wilson Family",
      budget: "$18/hr",
      location: "Sharjah",
      appliedDate: "2024-01-10",
      status: "rejected",
      type: "short-term",
      description: "Monthly garden maintenance and landscaping",
    },
    {
      id: 5,
      title: "Nanny Position",
      familyName: "Ahmed Family",
      budget: "$20/hr",
      location: "Dubai",
      appliedDate: "2024-01-08",
      status: "accepted",
      type: "short-term",
      description: "Part-time childcare for 2 children",
    },
  ]

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.familyName && app.familyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.agencyName && app.agencyName.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    const matchesType = typeFilter === "all" || app.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "under_review":
        return <XCircle className="h-5 w-5 text-blue-500" />
      case "accepted":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-200/50 text-yellow-700 dark:bg-yellow-400/20 dark:text-yellow-300"
      case "under_review":
        return "bg-blue-200/50 text-blue-700 dark:bg-blue-400/20 dark:text-blue-300"
      case "accepted":
        return "bg-green-200/50 text-green-700 dark:bg-green-400/20 dark:text-green-300"
      case "rejected":
        return "bg-red-200/50 text-red-700 dark:bg-red-400/20 dark:text-red-300"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <UnifiedSidebar userRole="worker" userName="Sarah Johnson" userEmail="sarah@example.com" />

      <div className="lg:ml-64 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="mb-6">
            <Link href="/worker/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Applications</h1>
            <p className="text-muted-foreground">Track all your job applications and their status</p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search applications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:col-span-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="short-term">Short Term</SelectItem>
                      <SelectItem value="long-term">Long Term</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applications List */}
          <Card>
            <CardHeader>
              <CardTitle>Applications ({filteredApplications.length})</CardTitle>
              <CardDescription>Your job application history and current status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <div
                    key={application.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start sm:items-center gap-4">
                        {getStatusIcon(application.status)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className="font-medium">{application.title}</p>
                            <Badge variant="outline" className="text-xs">
                              {application.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Badge className={`${getStatusColor(application.status)} whitespace-nowrap`}>
                              {application.status.replace("_", " ")}
                            </Badge>
                            <p className="text-sm text-muted-foreground">
                              {application.familyName || application.agencyName} • {application.location}
                            </p>
                            <span className="text-sm font-medium text-green-600">{application.budget}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{application.description}</p>
                          <p className="text-xs text-muted-foreground">Applied: {application.appliedDate}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto sm:justify-end justify-end">
                      <Button size="sm" variant="outline" className="shrink-0">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredApplications.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-lg font-medium mb-2">No applications found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
