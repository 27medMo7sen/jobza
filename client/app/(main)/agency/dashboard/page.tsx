"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UnifiedSidebar } from "@/components/layout/unified-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  DollarSign,
  Bell
} from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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

// Mock data for ongoing family requests
const mockOngoingFamilyRequests = [
  {
    id: 3,
    familyName: "Smith Family",
    jobTitle: "Live-in House Manager",
    location: "Emirates Hills",
    budget: "$2500/month",
    startDate: "2024-02-15",
    requirements: ["Household management experience", "Excellent communication", "Discretion"],
    status: "workers_assigned",
    assignedWorkers: [
      { id: 1, name: "Maria Garcia", status: "pending" },
      { id: 2, name: "Fatima Al-Zahra", status: "short_list" }
    ]
  },
  {
    id: 4,
    familyName: "Williams Family",
    jobTitle: "Elderly Care Assistant",
    location: "Jumeirah",
    budget: "$1800/month",
    startDate: "2024-02-10",
    requirements: ["Elderly care experience", "Patience and empathy", "Flexible schedule"],
    status: "awaiting_employer_decision",
    assignedWorkers: [
      { id: 3, name: "Ahmed Hassan", status: "accepted" }
    ]
  }
]

// Mock data for processed family requests
const mockProcessedFamilyRequests = [
  {
    id: 5,
    familyName: "Brown Family",
    jobTitle: "Full-time Nanny",
    location: "Downtown Dubai",
    budget: "$2000/month",
    startDate: "2024-01-15",
    requirements: ["Childcare certification", "First aid training", "References"],
    status: "completed",
    assignedWorkers: [
      { id: 4, name: "Sarah Johnson", status: "accepted" }
    ],
    contractId: 1
  },
  {
    id: 6,
    familyName: "Davis Family",
    jobTitle: "Housekeeper",
    location: "Arabian Ranches",
    budget: "$1200/month",
    startDate: "2024-01-10",
    requirements: ["Experience with cleaning", "Own transportation"],
    status: "completed",
    assignedWorkers: [
      { id: 5, name: "Lisa Chen", status: "accepted" }
    ],
    contractId: 2
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
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; type: "accept" | "decline" | null; request: any | null }>({ open: false, type: null, request: null })

  const openConfirm = (type: "accept" | "decline", request: any) => setConfirmDialog({ open: true, type, request })
  const closeConfirm = () => setConfirmDialog({ open: false, type: null, request: null })
  const proceedConfirm = () => {
    // Placeholder for future API integration
    closeConfirm()
  }
  const [activeTab, setActiveTab] = useState("family-requests")
  const [pendingRequests, setPendingRequests] = useState(mockPendingFamilyRequests)
  const [ongoingRequests, setOngoingRequests] = useState(mockOngoingFamilyRequests)
  const [processedRequests, setProcessedRequests] = useState(mockProcessedFamilyRequests)

  // Function to move request from pending to ongoing when workers are assigned
  const moveToOngoing = (requestId: number, assignedWorkers: any[]) => {
    const request = pendingRequests.find(r => r.id === requestId)
    if (request) {
      const updatedRequest = {
        ...request,
        status: 'workers_assigned',
        assignedWorkers: assignedWorkers.map(worker => ({
          ...worker,
          status: 'pending' as const,
          assignedDate: new Date().toISOString().split('T')[0]
        }))
      }
      
      setPendingRequests(prev => prev.filter(r => r.id !== requestId))
      setOngoingRequests(prev => [...prev, updatedRequest])
    }
  }

  // Function to move request from ongoing to processed when contract is created
  const moveToProcessed = (requestId: number, contractId: number) => {
    const request = ongoingRequests.find(r => r.id === requestId)
    if (request) {
      const updatedRequest = {
        ...request,
        status: 'completed',
        contractId
      }
      
      setOngoingRequests(prev => prev.filter(r => r.id !== requestId))
      setProcessedRequests(prev => [...prev, updatedRequest])
    }
  }

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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Agency Dashboard</h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your workers, requests, and contracts</p>
                </div>
                <div className="flex items-center gap-4">
                  {/* Notifications */}
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">3</span>
                  </Button>
                  {/* Theme Toggle */}
                  <ThemeToggle />
                </div>
              </div>
            </div>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              {/* Mobile dropdown */}
              <div className="sm:hidden">
                <Select value={activeTab} onValueChange={setActiveTab}>
                  <SelectTrigger aria-label="Select section">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="family-requests">Families Requests</SelectItem>
                    <SelectItem value="affiliation-requests">Pending Affiliation Requests</SelectItem>
                    <SelectItem value="create-contracts">Create New Contracts</SelectItem>
                    <SelectItem value="contracts-history">Pending Contracts History</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Desktop/Tablet tab bar */}
              <TabsList className="hidden sm:grid w-full grid-cols-3 md:grid-cols-4 gap-2 h-auto p-2">
                <TabsTrigger 
                  value="family-requests" 
                  className="text-xs sm:text-sm data-[state=active]:border-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 p-3"
                >
                  <span>Families Requests</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="affiliation-requests" 
                  className="text-xs sm:text-sm data-[state=active]:border-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 p-3"
                >
                  <span>Pending Affiliation Requests</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="create-contracts" 
                  className="text-xs sm:text-sm data-[state=active]:border-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 p-3"
                >
                  <span>Create New Contracts</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="contracts-history" 
                  className="text-xs sm:text-sm data-[state=active]:border-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 p-3"
                >
                  <span>Pending Contracts History</span>
                </TabsTrigger>
              </TabsList>

              {/* Families Requests Tab with Sub-tabs */}
              <TabsContent value="family-requests" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Families Requests</CardTitle>
                    <CardDescription>Manage family job requests through their lifecycle</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="pending" className="w-full">
                      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2 h-auto p-2">
                        <TabsTrigger 
                          value="pending" 
                          className="text-xs sm:text-sm data-[state=active]:border-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 p-3"
                        >
                          <span className="hidden sm:inline">Pending Requests</span>
                          <span className="sm:hidden">Pending</span>
                        </TabsTrigger>
                        <TabsTrigger 
                          value="ongoing" 
                          className="text-xs sm:text-sm data-[state=active]:border-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 p-3"
                        >
                          <span className="hidden sm:inline">Ongoing Requests</span>
                          <span className="sm:hidden">Ongoing</span>
                        </TabsTrigger>
                        <TabsTrigger 
                          value="processed" 
                          className="text-xs sm:text-sm data-[state=active]:border-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 p-3"
                        >
                          <span className="hidden sm:inline">Processed Requests</span>
                          <span className="sm:hidden">Processed</span>
                        </TabsTrigger>
                      </TabsList>

                      {/* Pending Requests Sub-tab - Agency Assigns Workers Here */}
                      <TabsContent value="pending" className="space-y-4 mt-4">
                        {pendingRequests.map((request) => (
                          <div key={request.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg bg-card hover:shadow-sm transition-all duration-200">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start sm:items-center gap-4">
                                <Users className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-card-foreground text-lg">{request.jobTitle}</p>
                                  <p className="text-sm text-muted-foreground break-words">
                                    {request.familyName} • 📍 {request.location}
                                  </p>
                                  <p className="text-sm font-medium text-green-600">{request.budget}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Start: {request.startDate} • Status: {request.status}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1 break-words">
                                    Requirements: {request.requirements.slice(0, 2).join(", ")}...
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 self-start sm:self-auto">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(`/agency/job-details/${request.id}`, '_blank')}
                                className="flex-1 sm:flex-none"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details & Assign Workers
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                        {pendingRequests.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                            <p>No pending family requests at the moment</p>
                            <p className="text-sm">New job requests from families will appear here</p>
                          </div>
                        )}
                      </TabsContent>

                      {/* Ongoing Requests Sub-tab - Shows Assigned Workers & Employer Acceptance Status */}
                      <TabsContent value="ongoing" className="space-y-4 mt-4">
                        {ongoingRequests.map((request) => (
                          <div key={request.id} className="p-4 border rounded-lg bg-card hover:shadow-sm transition-all duration-200">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                              <div className="flex items-start sm:items-center gap-4">
                                <Users className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-card-foreground text-lg">{request.jobTitle}</p>
                                  <p className="text-sm text-muted-foreground break-words">
                                    {request.familyName} • 📍 {request.location}
                                  </p>
                                  <p className="text-sm font-medium text-green-600">{request.budget}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 self-start sm:self-auto">
                                <Badge variant="outline" className="text-xs">
                                  {request.assignedWorkers.length} Worker{request.assignedWorkers.length !== 1 ? 's' : ''} Assigned
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {request.status}
                                </Badge>
                              </div>
                            </div>

                            {/* Assigned Workers Status */}
                            <div className="space-y-2 mb-3">
                              <p className="text-xs font-medium text-muted-foreground">Assigned Workers & Employer Status:</p>
                              {request.assignedWorkers.map((worker) => (
                                <div key={worker.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                                  <span className="text-sm text-card-foreground">{worker.name}</span>
                                  <div className="flex items-center gap-2">
                                    <Badge 
                                      variant={
                                        worker.status === 'accepted' ? 'default' : 
                                        worker.status === 'short_list' ? 'secondary' : 
                                        worker.status === 'rejected' ? 'destructive' : 'outline'
                                      }
                                      className="text-xs"
                                    >
                                      {worker.status === 'accepted' ? '✅ Accepted' :
                                       worker.status === 'short_list' ? '📋 Short List' :
                                       worker.status === 'rejected' ? '❌ Rejected' : '⏳ Pending'}
                                    </Badge>
                                    {worker.status === 'accepted' && (
                                      <Button 
                                        size="sm" 
                                        className="text-xs h-6 px-2"
                                        onClick={() => {
                                          // Move to processed and create contract
                                          moveToProcessed(request.id, Math.floor(Math.random() * 1000) + 1)
                                          router.push(`/contracts/create?familyId=${request.id}&workerId=${worker.id}`)
                                        }}
                                      >
                                        Proceed with Contract
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex items-center gap-2 self-start sm:self-auto">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(`/agency/job-details/${request.id}?tab=ongoing`, '_blank')}
                                className="flex-1 sm:flex-none"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Full Details
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                        {ongoingRequests.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                            <p>No ongoing requests at the moment</p>
                            <p className="text-sm">Requests will appear here after you assign workers</p>
                          </div>
                        )}
                      </TabsContent>

                      {/* Processed Requests Sub-tab */}
                      <TabsContent value="processed" className="space-y-4 mt-4">
                        {processedRequests.map((request) => (
                          <div key={request.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg bg-card hover:shadow-sm transition-all duration-200">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start sm:items-center gap-4">
                                <Users className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-card-foreground text-lg">{request.jobTitle}</p>
                                  <p className="text-sm text-muted-foreground break-words">
                                    {request.familyName} • 📍 {request.location}
                                  </p>
                                  <p className="text-sm font-medium text-green-600">{request.budget}</p>
                                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    <Badge variant="outline" className="text-xs">
                                      {request.assignedWorkers.length} Worker{request.assignedWorkers.length !== 1 ? 's' : ''} Assigned
                                    </Badge>
                                    <Badge variant="default" className="text-xs">
                                      Contract Created
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 self-start sm:self-auto">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(`/contracts/${request.contractId}?role=agency`, '_blank')}
                                className="flex-1 sm:flex-none"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Contract
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                        {processedRequests.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                            <p>No processed requests yet</p>
                            <p className="text-sm">Completed requests with contracts will appear here</p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
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
                        <div key={request.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg bg-card hover:shadow-sm transition-all duration-200">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start sm:items-center gap-4">
                              <UserPlus className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-card-foreground text-lg">{request.workerName}</p>
                                <p className="text-sm text-muted-foreground break-words">
                                  {request.specialization} • ⭐ {request.rating} • {request.experience} experience
                                </p>
                                <p className="text-sm text-muted-foreground break-words">
                                  📍 {request.location} • Status: {request.status}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1 break-words">
                                  {request.message}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto self-start sm:self-auto">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/agency/workers/${request.workerId ?? request.id}`)}
                              className="w-full sm:w-auto"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button size="sm" variant="outline" className="w-full sm:w-auto text-destructive border-destructive/20 hover:bg-destructive/10" onClick={() => openConfirm("decline", request)}>
                              <XCircle className="h-4 w-4 mr-2" />
                              Decline
                            </Button>
                            <Button size="sm" className="w-full sm:w-auto bg-green-600 hover:bg-green-700" onClick={() => openConfirm("accept", request)}>
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
                          <Link href="/contracts/create">
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
                        <div key={contract.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg bg-card hover:shadow-sm transition-all duration-200">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start sm:items-center gap-4">
                              <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-card-foreground text-lg">{contract.jobTitle}</p>
                                <p className="text-sm text-muted-foreground break-words">
                                  {contract.familyName} • {contract.workerName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Created: {contract.createdAt} • Status: {contract.status.replace('_', ' ')}
                                </p>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2">
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
                                  <div className="flex items-center gap-2 sm:ml-4">
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
                                  {/* Mobile: View contract under statuses */}
                                  <div className="sm:hidden w-full">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => router.push(`/contracts/${contract.id}?role=agency`)}
                                      className="mt-2 w-full"
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Contract
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="hidden sm:flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/contracts/${contract.id}?role=agency`)}
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
        </div>
      </div>

      {/* Confirmation Dialog for Accept/Decline */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => !open && closeConfirm()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.type === "accept" ? "Accept Affiliation Request" : "Decline Affiliation Request"}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.type === "accept"
                ? `Are you sure you want to accept ${confirmDialog.request?.workerName}'s affiliation request?`
                : `Are you sure you want to decline ${confirmDialog.request?.workerName}'s affiliation request?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeConfirm}>Cancel</Button>
            {confirmDialog.type === "accept" ? (
              <Button className="bg-green-600 hover:bg-green-700" onClick={proceedConfirm}>Confirm Accept</Button>
            ) : (
              <Button variant="destructive" onClick={proceedConfirm}>Confirm Decline</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
