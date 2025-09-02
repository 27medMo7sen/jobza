"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, 
  Building2, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Plus,
  UserPlus,
  Calendar,
  MapPin,
  DollarSign
} from "lucide-react"
import Link from "next/link"
import { SharedHeader } from "@/components/layout/shared-header"

// Mock data for pending family requests
const mockPendingFamilyRequests = [
  {
    id: 1,
    familyName: "Al-Ahmad Family",
    jobTitle: "Full-time Housekeeper",
    location: "Dubai Marina",
    budget: "$1500/month",
    startDate: "2024-02-01",
    requirements: ["5+ years experience", "English & Arabic", "Cooking skills"],
    description: "Looking for a reliable full-time housekeeper for our 4-bedroom villa. Must be experienced with large families and able to handle all household tasks.",
    status: "pending"
  },
  {
    id: 2,
    familyName: "Johnson Family",
    jobTitle: "Part-time Nanny",
    location: "Abu Dhabi",
    budget: "$800/month",
    startDate: "2024-02-15",
    requirements: ["Childcare experience", "First aid certified", "Patient with children"],
    description: "Need a caring nanny for our 2 children (ages 3 and 6) for 4 hours daily, Monday to Friday.",
    status: "pending"
  }
]

// Mock data for pending affiliation requests
const mockPendingAffiliationRequests = [
  {
    id: 1,
    workerName: "Sarah Johnson",
    specialization: "Housekeeping",
    rating: 4.8,
    experience: "6 years",
    location: "Dubai",
    message: "I'm interested in joining your agency. I have experience with luxury homes and can provide excellent references.",
    status: "pending"
  },
  {
    id: 2,
    workerName: "Ahmed Hassan",
    specialization: "Elderly Care",
    rating: 4.9,
    experience: "8 years",
    location: "Abu Dhabi",
    message: "Looking for opportunities to work with families through your agency. I'm certified in elderly care and have medical training.",
    status: "pending"
  }
]

// Mock data for affiliated workers
const mockAffiliatedWorkers = [
  {
    id: 1,
    name: "Maria Garcia",
    specialization: "Housekeeping",
    rating: 4.7,
    activeJobs: 2,
    location: "Dubai",
    availability: "Available",
    skills: ["Deep cleaning", "Laundry", "Cooking", "Organization"]
  },
  {
    id: 2,
    name: "Fatima Al-Zahra",
    specialization: "Childcare",
    rating: 4.9,
    activeJobs: 1,
    location: "Sharjah",
    availability: "Available",
    skills: ["Child development", "Educational activities", "Meal prep", "Safety first"]
  }
]

// Mock data for contracts
const mockContracts = [
  {
    id: 1,
    familyName: "Al-Ahmad Family",
    workerName: "Maria Garcia",
    jobTitle: "Full-time Housekeeper",
    status: "pending_worker_signature",
    workerSigned: false,
    employerSigned: true,
    createdAt: "2024-01-20"
  },
  {
    id: 2,
    familyName: "Johnson Family",
    workerName: "Fatima Al-Zahra",
    jobTitle: "Part-time Nanny",
    status: "pending_employer_signature",
    workerSigned: true,
    employerSigned: false,
    createdAt: "2024-01-18"
  }
]

export default function AgencyDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("family-requests")

  return (
    <DashboardLayout userRole="agency" userName="Elite Home Services" userEmail="admin@elitehomeservices.com">
      <div className="space-y-6">
        {/* Header */}
        <SharedHeader 
          title="Agency Dashboard" 
          subtitle="Manage your workers, requests, and contracts" 
          showNotification={true}
        />

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="family-requests">Pending Family Requests</TabsTrigger>
            <TabsTrigger value="affiliation-requests">Pending Affiliation Requests</TabsTrigger>
            <TabsTrigger value="affiliated-workers">Affiliated Workers</TabsTrigger>
            <TabsTrigger value="create-contracts">Create New Contracts</TabsTrigger>
            <TabsTrigger value="contracts-history">Pending Contracts History</TabsTrigger>
          </TabsList>

          {/* Pending Family Requests Tab */}
          <TabsContent value="family-requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Family Job Requests</CardTitle>
                <CardDescription>Review and respond to incoming job requests from families</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPendingFamilyRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover-lift transition-theme">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <Users className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium text-card-foreground">{request.jobTitle}</p>
                            <p className="text-sm text-muted-foreground">
                              {request.familyName} • 📍 {request.location}
                            </p>
                            <p className="text-sm font-medium text-green-600">{request.budget}</p>
                            <p className="text-xs text-muted-foreground">
                              Start: {request.startDate} • Status: {request.status}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Requirements: {request.requirements.slice(0, 2).join(", ")}...
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`/agency/job-details/${request.id}`, '_blank')}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {mockPendingFamilyRequests.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>No pending family requests at the moment</p>
                      <p className="text-sm">New job requests from families will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Affiliation Requests Tab */}
          <TabsContent value="affiliation-requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Worker Affiliation Requests</CardTitle>
                <CardDescription>Review requests from workers wanting to join your agency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPendingAffiliationRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover-lift transition-theme">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <UserPlus className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium text-card-foreground">{request.workerName}</p>
                            <p className="text-sm text-muted-foreground">
                              {request.specialization} • ⭐ {request.rating} • {request.experience} experience
                            </p>
                            <p className="text-sm text-muted-foreground">
                              📍 {request.location} • Status: {request.status}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {request.message}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/10">
                          <XCircle className="h-4 w-4 mr-2" />
                          Decline
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {mockPendingAffiliationRequests.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <UserPlus className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>No pending affiliation requests at the moment</p>
                      <p className="text-sm">Worker requests to join your agency will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Affiliated Workers Tab */}
          <TabsContent value="affiliated-workers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Affiliated Workers</CardTitle>
                <CardDescription>Manage workers who are part of your agency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAffiliatedWorkers.map((worker) => (
                    <div key={worker.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover-lift transition-theme">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" alt={worker.name} />
                          <AvatarFallback>{worker.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-card-foreground">{worker.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {worker.specialization} • ⭐ {worker.rating} • 📍 {worker.location}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {worker.activeJobs} active jobs • {worker.availability}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {worker.skills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {mockAffiliatedWorkers.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>No affiliated workers yet</p>
                      <p className="text-sm">Workers will appear here after accepting their affiliation requests</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create New Contracts Tab */}
          <TabsContent value="create-contracts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Contracts</CardTitle>
                <CardDescription>Generate contracts between families and workers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-muted-foreground mb-4">Create contracts by selecting from pending requests</p>
                    <Button asChild>
                      <Link href="/agency/contracts/create">
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Contract
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Contracts History Tab */}
          <TabsContent value="contracts-history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Contracts History</CardTitle>
                <CardDescription>Track the status of all contracts and signatures</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockContracts.map((contract) => (
                    <div key={contract.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover-lift transition-theme">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium text-card-foreground">{contract.jobTitle}</p>
                            <p className="text-sm text-muted-foreground">
                              {contract.familyName} • {contract.workerName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Created: {contract.createdAt} • Status: {contract.status.replace('_', ' ')}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Worker:</span>
                                {contract.workerSigned ? (
                                  <Badge variant="default" className="text-xs">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Signed
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pending
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Employer:</span>
                                {contract.employerSigned ? (
                                  <Badge variant="default" className="text-xs">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Signed
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pending
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/agency/contracts/${contract.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Contract
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {mockContracts.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>No contracts yet</p>
                      <p className="text-sm">Contracts will appear here after creation</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
