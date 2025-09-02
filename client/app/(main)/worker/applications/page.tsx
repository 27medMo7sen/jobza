"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, XCircle, CheckCircle, ArrowLeft, Search, Filter } from "lucide-react"
import { WorkerSidebar } from "@/components/layout/worker-sidebar"
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
        return "bg-yellow-100 text-yellow-800"
      case "under_review":
        return "bg-blue-100 text-blue-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <WorkerSidebar />

      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
            <p className="text-gray-600">Track all your job applications and their status</p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search applications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
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
                    <SelectTrigger className="w-40">
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
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(application.status)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{application.title}</p>
                            <Badge variant="outline" className="text-xs">
                              {application.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {application.familyName || application.agencyName} • {application.location}
                          </p>
                          <p className="text-sm font-medium text-green-600 mb-1">{application.budget}</p>
                          <p className="text-xs text-gray-500 mb-2">{application.description}</p>
                          <p className="text-xs text-gray-500">Applied: {application.appliedDate}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(application.status)}>
                        {application.status.replace("_", " ")}
                      </Badge>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredApplications.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
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
