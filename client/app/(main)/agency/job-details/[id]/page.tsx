"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  Users, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  ArrowLeft,
  UserPlus,
  Star,
  Building2
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SharedHeader } from "@/components/layout/shared-header"

interface JobRequest {
  id: number
  familyName: string
  jobTitle: string
  location: string
  budget: string
  startDate: string
  endDate?: string
  workingHours: string
  requirements: string[]
  description: string
  familyDetails: {
    members: number
    children: number
    elderly: number
    pets: boolean
    houseSize: string
  }
  additionalInfo: {
    accommodation: boolean
    meals: boolean
    transportation: boolean
    benefits: string[]
  }
  status: string
}

interface AffiliatedWorker {
  id: number
  name: string
  specialization: string
  rating: number
  experience: number
  location: string
  availability: string
  skills: string[]
  matchScore: number
}

export default function JobDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [jobRequest, setJobRequest] = useState<JobRequest | null>(null)
  const [affiliatedWorkers, setAffiliatedWorkers] = useState<AffiliatedWorker[]>([])
  const [showWorkerAssignment, setShowWorkerAssignment] = useState(false)
  const [selectedWorkers, setSelectedWorkers] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - in real app, fetch from API using params.id
    const mockJobRequest: JobRequest = {
      id: parseInt(params.id as string) || 1,
      familyName: "Al-Ahmad Family",
      jobTitle: "Full-time Housekeeper",
      location: "Dubai Marina",
      budget: "$1500/month",
      startDate: "2024-02-01",
      workingHours: "8 hours/day, 6 days/week",
      requirements: [
        "5+ years experience in housekeeping",
        "Fluent in English and Arabic",
        "Excellent cooking skills",
        "Experience with large families",
        "Valid health certificate",
        "References from previous employers"
      ],
      description: "We are looking for a reliable and experienced full-time housekeeper for our 4-bedroom villa in Dubai Marina. The ideal candidate should be able to handle all household tasks including cleaning, laundry, cooking, and general organization. We have 2 children (ages 8 and 12) and prefer someone who is patient and caring.",
      familyDetails: {
        members: 4,
        children: 2,
        elderly: 0,
        pets: true,
        houseSize: "4-bedroom villa"
      },
      additionalInfo: {
        accommodation: true,
        meals: true,
        transportation: false,
        benefits: ["Health insurance", "Paid vacation", "Performance bonus"]
      },
      status: "pending"
    }

    const mockAffiliatedWorkers: AffiliatedWorker[] = [
      {
        id: 1,
        name: "Maria Garcia",
        specialization: "Housekeeping",
        rating: 4.7,
        experience: 6,
        location: "Dubai",
        availability: "Available",
        skills: ["Deep cleaning", "Laundry", "Cooking", "Organization", "Child care"],
        matchScore: 95
      },
      {
        id: 2,
        name: "Fatima Al-Zahra",
        specialization: "Housekeeping",
        rating: 4.9,
        experience: 8,
        location: "Dubai",
        availability: "Available",
        skills: ["Luxury home care", "Cooking", "Laundry", "Pet care", "Child care"],
        matchScore: 88
      },
      {
        id: 3,
        name: "Sarah Johnson",
        specialization: "Housekeeping",
        rating: 4.6,
        experience: 5,
        location: "Dubai",
        availability: "Available",
        skills: ["General cleaning", "Laundry", "Basic cooking", "Organization"],
        matchScore: 82
      }
    ]

    setJobRequest(mockJobRequest)
    setAffiliatedWorkers(mockAffiliatedWorkers)
    setLoading(false)
  }, [params.id])

  const handleWorkerSelection = (workerId: number) => {
    setSelectedWorkers(prev => 
      prev.includes(workerId) 
        ? prev.filter(id => id !== workerId)
        : [...prev, workerId]
    )
  }

  const handleAssignWorkers = () => {
    // In real app, this would send the assignment to the backend
    console.log("Assigning workers:", selectedWorkers)
    setShowWorkerAssignment(false)
    setSelectedWorkers([])
  }

  if (loading) {
    return (
      <DashboardLayout userRole="agency" userName="Elite Home Services" userEmail="admin@elitehomeservices.com">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading job details...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!jobRequest) {
    return (
      <DashboardLayout userRole="agency" userName="Elite Home Services" userEmail="admin@elitehomeservices.com">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Job request not found</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="agency" userName="Elite Home Services" userEmail="admin@elitehomeservices.com">
      <div className="space-y-6">
        {/* Header */}
        <SharedHeader 
          title="Job Request Details" 
          subtitle={`${jobRequest.familyName} - ${jobRequest.jobTitle}`} 
        />

        {/* Job Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{jobRequest.jobTitle}</CardTitle>
                <CardDescription className="text-lg">{jobRequest.familyName}</CardDescription>
              </div>
              <Badge variant={jobRequest.status === "pending" ? "secondary" : "default"}>
                {jobRequest.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{jobRequest.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{jobRequest.budget}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Start: {jobRequest.startDate}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground mb-2">Job Description</h3>
                <p className="text-muted-foreground leading-relaxed">{jobRequest.description}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-foreground mb-2">Working Hours</h3>
                <p className="text-muted-foreground">{jobRequest.workingHours}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Requirements & Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobRequest.requirements.map((requirement, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">{requirement}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Family Details */}
        <Card>
          <CardHeader>
            <CardTitle>Family Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-foreground mb-3">Household Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Members:</span>
                    <span className="text-sm font-medium">{jobRequest.familyDetails.members}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Children:</span>
                    <span className="text-sm font-medium">{jobRequest.familyDetails.children}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Elderly:</span>
                    <span className="text-sm font-medium">{jobRequest.familyDetails.elderly}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pets:</span>
                    <span className="text-sm font-medium">{jobRequest.familyDetails.pets ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">House Size:</span>
                    <span className="text-sm font-medium">{jobRequest.familyDetails.houseSize}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-3">Benefits & Accommodation</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Accommodation:</span>
                    <span className="text-sm font-medium">{jobRequest.additionalInfo.accommodation ? "Provided" : "Not provided"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Meals:</span>
                    <span className="text-sm font-medium">{jobRequest.additionalInfo.meals ? "Provided" : "Not provided"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Transportation:</span>
                    <span className="text-sm font-medium">{jobRequest.additionalInfo.transportation ? "Provided" : "Not provided"}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h5 className="font-medium text-foreground mb-2">Additional Benefits</h5>
                  <div className="flex flex-wrap gap-2">
                    {jobRequest.additionalInfo.benefits.map((benefit, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Worker Assignment Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Assign Workers</CardTitle>
                <CardDescription>Select from your affiliated workers to assign to this job</CardDescription>
              </div>
              <Button onClick={() => setShowWorkerAssignment(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Assign Workers
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No workers assigned yet</p>
              <p className="text-sm">Click "Assign Workers" to select from your affiliated workers</p>
            </div>
          </CardContent>
        </Card>

        {/* Worker Assignment Modal */}
        {showWorkerAssignment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-background border border-border rounded-lg p-6 max-w-4xl w-full mx-4 shadow-xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Assign Workers to Job</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowWorkerAssignment(false)}>
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Select workers from your affiliated pool. Workers are ranked by match score.
                </p>
                
                <div className="space-y-3">
                  {affiliatedWorkers.map((worker) => (
                    <div
                      key={worker.id}
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedWorkers.includes(worker.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                      onClick={() => handleWorkerSelection(worker.id)}
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" alt={worker.name} />
                          <AvatarFallback>{worker.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{worker.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {worker.specialization} • ⭐ {worker.rating} • {worker.experience} years experience
                          </p>
                          <p className="text-xs text-muted-foreground">
                            📍 {worker.location} • {worker.availability}
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
                      
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          Match: {worker.matchScore}%
                        </Badge>
                        {selectedWorkers.includes(worker.id) && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-3 justify-end pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowWorkerAssignment(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAssignWorkers}
                    disabled={selectedWorkers.length === 0}
                  >
                    Assign {selectedWorkers.length} Worker{selectedWorkers.length !== 1 ? 's' : ''}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
