"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Trash2
} from "lucide-react"
import Link from "next/link"

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
    description: "We are looking for a reliable and experienced live-in housekeeper to join our family. The ideal candidate should be detail-oriented, trustworthy, and have experience in maintaining a clean and organized household.",
    requirements: [
      "Minimum 3 years of experience in housekeeping",
      "Ability to work independently",
      "Good communication skills",
      "Flexible schedule",
      "Clean background check"
    ],
    responsibilities: [
      "Daily cleaning and tidying of all rooms",
      "Laundry and ironing",
      "Kitchen cleaning and meal prep assistance",
      "Grocery shopping and inventory management",
      "Pet care (if applicable)"
    ],
    location: "Downtown Cairo",
    schedule: "Monday to Friday, 8 AM - 6 PM",
    benefits: [
      "Private room with bathroom",
      "3 meals per day",
      "Health insurance",
      "Paid vacation days",
      "Transportation allowance"
    ],
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
        verified: true
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
        skills: ["Childcare", "Educational Activities", "Meal Prep", "Light Housekeeping"],
        languages: ["Arabic", "English", "French"],
        verified: true
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
        skills: ["Elder Care", "Medical Assistance", "Personal Care", "Companionship"],
        languages: ["Arabic", "English"],
        verified: true
      }
    ]
  },
  2: {
    id: 2,
    title: "Weekend House Cleaning",
    type: "short-term",
    status: "completed",
    applicants: 8,
    postedDate: "2024-01-08",
    salary: "$150/session",
    description: "Need weekend house cleaning services for a 3-bedroom apartment. Looking for someone reliable and thorough with attention to detail.",
    requirements: [
      "Experience in residential cleaning",
      "Own cleaning supplies",
      "Available on weekends",
      "References required"
    ],
    responsibilities: [
      "Deep cleaning of all rooms",
      "Bathroom sanitization",
      "Kitchen deep cleaning",
      "Floor mopping and vacuuming",
      "Dusting and organizing"
    ],
    location: "Zamalek, Cairo",
    schedule: "Weekends only, flexible hours",
    benefits: [
      "Flexible scheduling",
      "Competitive pay",
      "Potential for regular work"
    ],
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
        verified: true
      }
    ]
  },
  3: {
    id: 3,
    title: "Garden Maintenance",
    type: "short-term",
    status: "active",
    applicants: 5,
    postedDate: "2024-01-05",
    salary: "$80/day",
    description: "Looking for experienced gardener for regular garden maintenance including pruning, weeding, and general upkeep.",
    requirements: [
      "Minimum 2 years gardening experience",
      "Knowledge of local plants",
      "Own basic tools",
      "Physical fitness required"
    ],
    responsibilities: [
      "Regular weeding and pruning",
      "Plant care and watering",
      "Lawn maintenance",
      "Garden cleanup",
      "Seasonal planting"
    ],
    location: "Heliopolis, Cairo",
    schedule: "Twice weekly, flexible days",
    benefits: [
      "Regular work schedule",
      "Beautiful garden environment",
      "Competitive daily rate"
    ],
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
        verified: true
      }
    ]
  }
}

export default function JobPostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [jobPost, setJobPost] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const jobId = params.id as string
    const post = mockJobPosts[jobId as keyof typeof mockJobPosts]
    if (post) {
      setJobPost(post)
    }
  }, [params.id])

  if (!jobPost) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Post Not Found</h2>
          <p className="text-gray-600 mb-4">The job post you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/employer/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    return type === "long-term" ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"
  }

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "reviewed":
        return "bg-blue-100 text-blue-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleEditJob = () => {
    // TODO: Implement edit functionality
    console.log("Edit job:", jobPost.id)
  }

  const handleDeleteJob = () => {
    // TODO: Implement delete functionality
    console.log("Delete job:", jobPost.id)
  }

  const handleApplicationAction = (applicationId: number, action: string) => {
    // TODO: Implement application actions
    console.log(`${action} application:`, applicationId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/employer/dashboard" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={handleEditJob}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={handleDeleteJob} className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Job Post Header */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {jobPost.type === "long-term" ? (
                  <Calendar className="w-8 h-8 text-blue-600" />
                ) : (
                  <Clock className="w-8 h-8 text-pink-600" />
                )}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{jobPost.title}</h1>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getTypeColor(jobPost.type)}>
                      {jobPost.type === "long-term" ? "Long-term" : "Short-term"}
                    </Badge>
                    <Badge className={getStatusColor(jobPost.status)}>
                      {jobPost.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{jobPost.salary}</p>
                <p className="text-sm text-gray-600">Posted: {jobPost.postedDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">{jobPost.applicants} applicants</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">{jobPost.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">{jobPost.schedule}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="applications">Applications ({jobPost.applications.length})</TabsTrigger>
              <TabsTrigger value="details">Job Details</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Job Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{jobPost.description}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={getStatusColor(jobPost.status)}>{jobPost.status}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <Badge className={getTypeColor(jobPost.type)}>
                        {jobPost.type === "long-term" ? "Long-term" : "Short-term"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Applicants:</span>
                      <span className="font-medium">{jobPost.applicants}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Posted:</span>
                      <span className="font-medium">{jobPost.postedDate}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {jobPost.applications.slice(0, 3).map((app: any) => (
                      <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={app.workerAvatar} alt={app.workerName} />
                            <AvatarFallback className="text-lg font-semibold">
                              {app.workerName.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{app.workerName}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm">{app.rating}</span>
                              <span className="text-sm text-gray-500">({app.experience} exp)</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getApplicationStatusColor(app.status)}>
                            {app.status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Applications Tab */}
            <TabsContent value="applications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {jobPost.applications.map((app: any) => (
                      <div key={app.id} className="border rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-16 h-16">
                              <AvatarImage src={app.workerAvatar} alt={app.workerName} />
                              <AvatarFallback className="text-xl font-semibold">
                                {app.workerName.split(' ').map((n: string) => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-lg font-semibold">{app.workerName}</h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="font-medium">{app.rating}</span>
                                <span className="text-gray-500">({app.experience} experience)</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{app.location}</p>
                            </div>
                          </div>
                          <Badge className={getApplicationStatusColor(app.status)}>
                            {app.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-medium mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-1">
                              {app.skills.map((skill: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Languages</h4>
                            <div className="flex flex-wrap gap-1">
                              {app.languages.map((lang: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {lang}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="text-sm text-gray-600">
                            Applied: {app.appliedDate}
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-2" />
                              View Profile
                            </Button>
                            <Button size="sm" variant="outline">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Contact
                            </Button>
                            {app.status === "pending" && (
                              <>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleApplicationAction(app.id, "accept")}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Accept
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleApplicationAction(app.id, "reject")}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Job Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {jobPost.requirements.map((req: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Responsibilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {jobPost.responsibilities.map((resp: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Benefits & Perks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {jobPost.benefits.map((benefit: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">{benefit}</span>
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
  )
}


