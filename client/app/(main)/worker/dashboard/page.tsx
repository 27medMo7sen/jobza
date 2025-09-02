"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, Clock, Building2, AlertCircle } from "lucide-react"
import { WorkerSidebar } from "@/components/layout/worker-sidebar"
import { JobDetailsModal } from "@/components/jobs/job-details-modal"
import { SharedHeader } from "@/components/layout/shared-header"

export default function WorkerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedJob, setSelectedJob] = useState(null)
  const [isJobDetailsOpen, setIsJobDetailsOpen] = useState(false)
  const [affiliationRequests, setAffiliationRequests] = useState([])
  const [showCancelMessage, setShowCancelMessage] = useState(false)
  const [showAcceptWarning, setShowAcceptWarning] = useState(false)
  const [pendingAcceptanceId, setPendingAcceptanceId] = useState(null)
  const [affiliationHistory, setAffiliationHistory] = useState([])
  const [affiliationSubTab, setAffiliationSubTab] = useState('incoming')
  const [outgoingAffiliationRequests, setOutgoingAffiliationRequests] = useState([])
  const router = useRouter()

  // Initialize affiliation requests on component mount
  useEffect(() => {
    setAffiliationRequests(incomingAffiliationRequests)
    
    // Mock outgoing affiliation requests data
    setOutgoingAffiliationRequests([
      {
        id: 101,
        agencyName: "Premium Home Services",
        agencyLocation: "Dubai",
        agencyRating: 4.7,
        agencyReviews: 234,
        agencyServices: ["House Cleaning", "Deep Cleaning", "Laundry", "Cooking", "Elderly Care"],
        requestDate: "2024-01-20",
        status: "pending",
      },
      {
        id: 102,
        agencyName: "Elite Care Solutions",
        agencyLocation: "Abu Dhabi",
        agencyRating: 4.9,
        agencyReviews: 189,
        agencyServices: ["Specialized Care", "Medical Assistance", "House Management", "Child Care"],
        requestDate: "2024-01-19",
        status: "pending",
      }
    ])
  }, [])

  const handleViewContract = (jobId: number) => {
            router.push(`/contracts/${jobId}?role=worker`)
  }

  const handleViewDetails = (job: any) => {
    setSelectedJob(job)
    setIsJobDetailsOpen(true)
  }

  const handleAcceptAffiliation = (requestId: number) => {
    // Show warning first
    setPendingAcceptanceId(requestId)
    setShowAcceptWarning(true)
  }

  const confirmAcceptAffiliation = () => {
    if (pendingAcceptanceId) {
      // Move current request to affiliated status
      const acceptedRequest = affiliationRequests.find(req => req.id === pendingAcceptanceId)
      if (acceptedRequest) {
        const updatedRequest = { 
          ...acceptedRequest, 
          status: "affiliated", 
          acceptedDate: new Date().toISOString().split('T')[0] 
        }
        
        // Move all other incoming requests to history
        const otherIncomingRequests = affiliationRequests.filter(req => req.id !== pendingAcceptanceId)
        const historyRequests = otherIncomingRequests.map(req => ({ ...req, status: "declined" }))
        
        // Cancel all outgoing requests automatically
        const cancelledOutgoingRequests = outgoingAffiliationRequests.map(req => ({ ...req, status: "cancelled" }))
        
        // Update state
        setAffiliationRequests([updatedRequest])
        setAffiliationHistory(prev => [...prev, ...historyRequests, ...cancelledOutgoingRequests])
        setOutgoingAffiliationRequests([]) // Clear outgoing requests
      }
      
      // Reset warning state
      setShowAcceptWarning(false)
      setPendingAcceptanceId(null)
    }
  }

  const cancelAcceptAffiliation = () => {
    setShowAcceptWarning(false)
    setPendingAcceptanceId(null)
  }

  const handleCancelOutgoingRequest = (requestId: number) => {
    setOutgoingAffiliationRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: "cancelled" }
          : req
      )
    )
  }

  const handleRejectAffiliation = (requestId: number) => {
    setAffiliationRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: "rejected" }
          : req
      )
    )
  }

  const handleViewAgencyDetails = (requestId: number) => {
    // Navigate to the existing agency profile page
    window.open('/agency/profile', '_blank')
  }

  const handleCancelAffiliation = (requestId: number, acceptedDate: string) => {
    if (acceptedDate) {
      const accepted = new Date(acceptedDate)
      const today = new Date()
      const daysSinceAccepted = Math.floor((today.getTime() - accepted.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysSinceAccepted < 14) {
        setShowCancelMessage(true)
        setTimeout(() => setShowCancelMessage(false), 5000) // Hide message after 5 seconds
        return
      }
    }
    
    // Allow cancellation after 14 days
    setAffiliationRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: "cancelled" }
          : req
      )
    )
  }

  const longTermJobs = [
    {
      id: 1,
      title: "Full-time House Cleaner",
      agencyName: "CleanPro Agency",
      budget: "$1200/month",
      location: "Dubai",
      status: "active",
      startDate: "2024-01-15",
      endDate: "2024-12-15",
      type: "long-term",
      description:
        "We are looking for an experienced full-time housekeeper to manage our household. The ideal candidate should have experience with family care and household management.",
      requirements: [
        "5+ years of experience as a housekeeper",
        "Fluent in Arabic and English",
        "Valid health certificate",
        "References from previous employers",
      ],
      benefits: ["Accommodation provided", "Monthly salary of $1200", "Paid time off", "Health insurance"],
      tasks: ["Daily cleaning and maintenance", "Laundry and ironing", "Basic cooking", "Household organization"],
    },
  ]

  const shortTermJobs = [
    {
      id: 1,
      title: "Weekend House Cleaning",
      familyName: "Al-Ahmad Family",
      budget: "$25/hr",
      location: "Dubai",
      status: "active",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      type: "short-term",
      description:
        "Looking for reliable weekend house cleaning service. The job involves thorough cleaning of a 3-bedroom apartment.",
      requirements: ["Experience in house cleaning", "Own cleaning supplies", "Reliable and punctual"],
      benefits: ["Competitive hourly rate", "Flexible weekend schedule", "Regular weekly work"],
      tasks: ["Vacuum and mop floors", "Clean bathrooms and kitchen", "Dust furniture", "Change bed linens"],
    },
    {
      id: 2,
      title: "One-time Deep Cleaning",
      familyName: "Johnson Family",
      budget: "$150",
      location: "Abu Dhabi",
      status: "active",
      startDate: "2024-01-20",
      endDate: "2024-01-20",
      type: "short-term",
      description:
        "Need a thorough deep cleaning service for our home before a special event. This is a one-time job requiring attention to detail.",
      requirements: ["Experience in deep cleaning", "Professional cleaning equipment", "Available on specified date"],
      benefits: ["One-time payment of $150", "Potential for future work", "Flexible timing"],
      tasks: ["Deep clean all rooms", "Clean windows and mirrors", "Sanitize all surfaces", "Organize storage areas"],
    },
  ]

  const incomingAffiliationRequests = [
    {
      id: 1,
      agencyName: "CleanPro Agency",
      agencyLocation: "Dubai",
      agencyRating: 4.8,
      agencyReviews: 156,
      agencyServices: ["House Cleaning", "Deep Cleaning", "Laundry", "Cooking"],
      requestDate: "2024-01-18",
      status: "pending_acceptance",
      acceptedDate: null,
    },
    {
      id: 2,
      agencyName: "HomeHelp Agency",
      agencyLocation: "Abu Dhabi",
      agencyRating: 4.6,
      agencyReviews: 89,
      agencyServices: ["Elderly Care", "Child Care", "House Cleaning", "Pet Care"],
      requestDate: "2024-01-17",
      status: "accepted",
      acceptedDate: "2024-01-17",
    },
    {
      id: 3,
      agencyName: "Elite Care Services",
      agencyLocation: "Sharjah",
      agencyRating: 4.9,
      agencyReviews: 203,
      agencyServices: ["Specialized Care", "Medical Assistance", "House Management"],
      requestDate: "2024-01-16",
      status: "pending_acceptance",
      acceptedDate: null,
    },
  ]



  return (
    <div className="flex min-h-screen bg-background">
      <WorkerSidebar />

      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <SharedHeader 
            title="Worker Dashboard" 
            subtitle="Manage your jobs and track your progress" 
          />

          {/* Accept Affiliation Warning Modal */}
          {showAcceptWarning && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-background border border-border rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Important: Affiliation Request Acceptance
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Once you accept this affiliation request, you cannot accept any more requests. 
                    All other pending incoming requests and any outgoing requests you've sent will be automatically cancelled and moved to your affiliation history.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button 
                      onClick={confirmAcceptAffiliation}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Yes, Accept This Request
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={cancelAcceptAffiliation}
                      className="border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cancel Affiliation Message */}
          {showCancelMessage && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg dark:bg-amber-950/20 dark:border-amber-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <p className="text-amber-800 dark:text-amber-200">
                  You cannot cancel an affiliation relationship before 14 days have passed since acceptance. 
                  Please wait until {(new Date().getTime() + (14 * 24 * 60 * 60 * 1000)).toLocaleDateString()} to cancel.
                </p>
              </div>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="long-term">Long Term</TabsTrigger>
              <TabsTrigger value="short-term">Short Term</TabsTrigger>
              <TabsTrigger value="affiliation-requests">Affiliation Requests</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Jobs Summary</CardTitle>
                  <CardDescription>Your active work contracts overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {longTermJobs.map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg bg-card hover-lift transition-theme">
                        <div>
                          <p className="font-medium text-card-foreground">{job.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {job.agencyName} • {job.budget}
                          </p>
                          <p className="text-xs text-muted-foreground">Long-term contract</p>
                        </div>
                        <Badge variant="default">Active</Badge>
                      </div>
                    ))}
                    {shortTermJobs.slice(0, 2).map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg bg-card hover-lift transition-theme">
                        <div>
                          <p className="font-medium text-card-foreground">{job.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {job.familyName} • {job.budget}
                          </p>
                          <p className="text-xs text-muted-foreground">Short-term job</p>
                        </div>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Affiliated Agency Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Affiliation</CardTitle>
                  <CardDescription>Your active agency affiliation status</CardDescription>
                </CardHeader>
                <CardContent>
                  {affiliationRequests.some(request => request.status === "affiliated") ? (
                    affiliationRequests
                      .filter(request => request.status === "affiliated")
                      .map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-4">
                            <Building2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                            <div>
                              <p className="font-medium text-card-foreground">{request.agencyName}</p>
                              <p className="text-sm text-muted-foreground">
                                📍 {request.agencyLocation} • ⭐ {request.agencyRating} ({request.agencyReviews} reviews)
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Affiliated since: {request.acceptedDate}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                              Affiliated
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewAgencyDetails(request.id)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>No active agency affiliation</p>
                      <p className="text-sm">Check the Affiliation Requests tab to connect with agencies</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="long-term" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Long Term Jobs</CardTitle>
                  <CardDescription>Jobs from agencies with extended contracts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {longTermJobs.map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <Users className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="font-medium">{job.title}</p>
                              <p className="text-sm text-gray-600">
                                {job.agencyName} • {job.location}
                              </p>
                              <p className="text-sm font-medium text-green-600">{job.budget}</p>
                              <p className="text-xs text-gray-500">
                                Contract: {job.startDate} - {job.endDate}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="default">Active</Badge>
                          <Button size="sm" variant="outline" onClick={() => handleViewContract(job.id)}>
                            View Contract
                          </Button>
                        </div>
                      </div>
                    ))}
                    {longTermJobs.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No long-term jobs available</p>
                        <p className="text-sm">Check back later for agency opportunities</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="short-term" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Short Term Jobs</CardTitle>
                  <CardDescription>Direct jobs from families for temporary work</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {shortTermJobs.map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <Calendar className="h-5 w-5 text-pink-500" />
                            <div>
                              <p className="font-medium">{job.title}</p>
                              <p className="text-sm text-gray-600">
                                {job.familyName} • {job.location}
                              </p>
                              <p className="text-sm font-medium text-green-600">{job.budget}</p>
                              <p className="text-xs text-gray-500">
                                Duration: {job.startDate} - {job.endDate}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">Active</Badge>
                          <Button size="sm" variant="outline" onClick={() => handleViewDetails(job)}>
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

                        <TabsContent value="affiliation-requests" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Affiliation Requests</CardTitle>
                  <CardDescription>Manage your agency affiliations and requests</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Sub-tabs for affiliation requests */}
                  <div className="mb-6">
                    <div className="flex space-x-1 bg-muted p-1 rounded-lg">
                      <button
                        onClick={() => setAffiliationSubTab('incoming')}
                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                          affiliationSubTab === 'incoming'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        Incoming
                      </button>
                      <button
                        onClick={() => setAffiliationSubTab('outgoing')}
                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                          affiliationSubTab === 'outgoing'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-foreground hover:text-foreground'
                        }`}
                      >
                        Outgoing
                      </button>
                      <button
                        onClick={() => setAffiliationSubTab('history')}
                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                          affiliationSubTab === 'history'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-foreground hover:text-foreground'
                        }`}
                      >
                        History
                      </button>
                    </div>
                  </div>

                  {/* Incoming Tab Content */}
                  {affiliationSubTab === 'incoming' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-card-foreground mb-4">Incoming Requests</h3>
                      {affiliationRequests
                        .filter(request => request.status === "pending_acceptance")
                        .map((request) => (
                          <div
                            key={request.id}
                            className="flex items-center justify-between p-4 border rounded-lg bg-card hover-lift transition-theme"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-4">
                                <Building2 className="h-5 w-5 text-primary" />
                                <div>
                                  <p className="font-medium text-card-foreground">{request.agencyName}</p>
                                  <p className="text-sm text-muted-foreground">
                                    📍 {request.agencyLocation} • ⭐ {request.agencyRating} ({request.agencyReviews} reviews)
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Services: {request.agencyServices.slice(0, 3).join(", ")}
                                    {request.agencyServices.length > 3 && "..."}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Request received: {request.requestDate}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewAgencyDetails(request.id)}
                              >
                                View Details
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive border-destructive/20 hover:bg-destructive/10 bg-transparent"
                                onClick={() => handleRejectAffiliation(request.id)}
                              >
                                Decline
                              </Button>
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleAcceptAffiliation(request.id)}
                              >
                                Accept
                              </Button>
                            </div>
                          </div>
                        ))}
                      
                      {affiliationRequests.filter(request => request.status === "pending_acceptance").length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                          <p>No incoming affiliation requests</p>
                          <p className="text-sm">Agencies will send you affiliation requests when they're interested in working with you</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Outgoing Tab Content */}
                  {affiliationSubTab === 'outgoing' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-card-foreground mb-4">Outgoing Requests</h3>
                      {outgoingAffiliationRequests
                        .filter(request => request.status === "pending")
                        .map((request) => (
                          <div
                            key={request.id}
                            className="flex items-center justify-between p-4 border rounded-lg bg-card hover-lift transition-theme"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-4">
                                <Building2 className="h-5 w-5 text-primary" />
                                <div>
                                  <p className="font-medium text-card-foreground">{request.agencyName}</p>
                                  <p className="text-sm text-muted-foreground">
                                    📍 {request.agencyLocation} • ⭐ {request.agencyRating} ({request.agencyReviews} reviews)
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Services: {request.agencyServices.slice(0, 3).join(", ")}
                                    {request.agencyReviews.length > 3 && "..."}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Request sent: {request.requestDate}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                                Pending
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive border-destructive/20 hover:bg-destructive/10 bg-transparent"
                                onClick={() => handleCancelOutgoingRequest(request.id)}
                              >
                                Cancel Request
                              </Button>
                            </div>
                          </div>
                        ))}
                      
                      {outgoingAffiliationRequests.filter(request => request.status === "pending").length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                          <p>No outgoing affiliation requests</p>
                          <p className="text-sm">Send affiliation requests to agencies you're interested in working with</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* History Tab Content */}
                  {affiliationSubTab === 'history' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-card-foreground mb-4">Affiliation History</h3>
                      {affiliationHistory.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                          <p>No affiliation history yet</p>
                          <p className="text-sm">Your declined and past affiliation requests will appear here</p>
                        </div>
                      ) : (
                        affiliationHistory.map((request) => (
                          <div
                            key={request.id}
                            className="flex items-center justify-between p-4 border rounded-lg bg-card hover-lift transition-theme opacity-75"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-4">
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium text-card-foreground">{request.agencyName}</p>
                                  <p className="text-sm text-muted-foreground">
                                    📍 {request.agencyLocation} • ⭐ {request.agencyRating} ({request.agencyReviews} reviews)
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Services: {request.agencyServices.slice(0, 3).join(", ")}
                                    {request.agencyServices.length > 3 && "..."}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {request.status === "declined" 
                                      ? `Declined on: ${request.requestDate}` 
                                      : `Request received: ${request.requestDate}`}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={request.status === "declined" ? "secondary" : "outline"}
                                className="text-xs"
                              >
                                {request.status === "declined" ? "Declined" : request.status}
                              </Badge>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>



          </Tabs>
        </div>
      </div>

      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          isOpen={isJobDetailsOpen}
          onClose={() => {
            setIsJobDetailsOpen(false)
            setSelectedJob(null)
          }}
        />
      )}
    </div>
  )
}
