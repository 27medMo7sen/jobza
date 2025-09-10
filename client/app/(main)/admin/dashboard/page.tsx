"use client"

import { useState, useEffect, Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Users, 
  Building2, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  AlertCircle,
  UserCheck,
  UserX,
  Shield,
  TrendingUp,
  Calendar,
  MapPin,
  Star,
  Phone,
  Mail,
  Download,
  Eye as EyeIcon,
  User,
  Award,
  Building
} from "lucide-react"
import { UnifiedSidebar } from "@/components/layout/unified-sidebar"
import { useRouter } from "next/navigation"

interface Document {
  id: string
  type: string
  fileName: string
  status: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
  uploadedDate: string
  fileUrl?: string
}

interface UserProfile {
  id: number
  name: string
  email: string
  phone: string
  type: 'worker' | 'employer' | 'agency'
  status: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
  documents: Document[]
  registrationDate: string
  location?: string
  specialization?: string
  rating?: number
  experience?: number
  companyName?: string
  businessType?: string
  nationality?: string
  expectedSalary?: string
  skills?: string[]
}

interface Contract {
  id: number
  familyName: string
  workerName: string
  agencyName: string
  jobTitle: string
  status: 'pending_admin_approval' | 'approved' | 'rejected'
  rejectionReason?: string
  contractValue: string
  startDate: string
  endDate: string
  submittedDate: string
}

function AdminDashboardContent() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("workers")
  const [pendingUsers, setPendingUsers] = useState<UserProfile[]>([])
  const [pendingContracts, setPendingContracts] = useState<Contract[]>([])

  useEffect(() => {
    // Mock data for pending users
    const mockPendingUsers: UserProfile[] = [
      {
        id: 1,
        name: "Maria Garcia",
        email: "maria.garcia@email.com",
        phone: "+971 50 123 4567",
        type: "worker",
        status: "pending",
        documents: [
          {
            id: "doc1",
            type: "Passport",
            fileName: "passport_maria.pdf",
            status: "pending",
            uploadedDate: "2024-01-20"
          },
          {
            id: "doc2",
            type: "Visa",
            fileName: "visa_maria.pdf",
            status: "pending",
            uploadedDate: "2024-01-20"
          }
        ],
        registrationDate: "2024-01-20",
        location: "Dubai",
        specialization: "Nanny",
        rating: 4.9,
        experience: 8,
        nationality: "Filipino",
        expectedSalary: "$1200/month",
        skills: ["Childcare", "Cooking", "Cleaning", "First Aid"]
      },
      {
        id: 2,
        name: "Ahmed Hassan",
        email: "ahmed.hassan@email.com",
        phone: "+971 50 234 5678",
        type: "worker",
        status: "pending",
        documents: [
          {
            id: "doc3",
            type: "ID Card",
            fileName: "id_ahmed.pdf",
            status: "pending",
            uploadedDate: "2024-01-19"
          }
        ],
        registrationDate: "2024-01-19",
        location: "Abu Dhabi",
        specialization: "Driver",
        rating: 4.7,
        experience: 5,
        nationality: "Egyptian",
        expectedSalary: "$1000/month",
        skills: ["Driving", "Navigation", "Vehicle Maintenance", "Customer Service"]
      },
      {
        id: 3,
        name: "Elite Home Services",
        email: "admin@elitehomeservices.com",
        phone: "+971 50 345 6789",
        type: "agency",
        status: "pending",
        documents: [
          {
            id: "doc4",
            type: "Business License",
            fileName: "license_elite.pdf",
            status: "pending",
            uploadedDate: "2024-01-18"
          },
          {
            id: "doc5",
            type: "Insurance Certificate",
            fileName: "insurance_elite.pdf",
            status: "pending",
            uploadedDate: "2024-01-18"
          }
        ],
        registrationDate: "2024-01-18",
        companyName: "Elite Home Services",
        businessType: "Domestic Staffing Agency"
      },
      {
        id: 4,
        name: "Al-Zahra Family",
        email: "zahra.family@email.com",
        phone: "+971 50 456 7890",
        type: "employer",
        status: "pending",
        documents: [
          {
            id: "doc6",
            type: "Residence Permit",
            fileName: "residence_zahra.pdf",
            status: "pending",
            uploadedDate: "2024-01-17"
          }
        ],
        registrationDate: "2024-01-17",
        location: "Sharjah"
      }
    ]

    // Mock data for approved users
    const mockApprovedUsers: UserProfile[] = [
      {
        id: 5,
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        phone: "+971 50 666 7777",
        type: "worker",
        status: "approved",
        documents: [],
        registrationDate: "2024-01-16",
        location: "Dubai",
        specialization: "Housekeeper",
        rating: 4.8,
        experience: 6,
        nationality: "British",
        expectedSalary: "$1500/month",
        skills: ["Housekeeping", "Laundry", "Organization", "Time Management"]
      },
      {
        id: 6,
        name: "Professional Care Services",
        email: "admin@procare.com",
        phone: "+971 50 777 6666",
        type: "agency",
        status: "approved",
        documents: [],
        registrationDate: "2024-01-19",
        companyName: "Professional Care Services",
        businessType: "Healthcare Staffing Agency"
      },
      {
        id: 7,
        name: "Al-Rashid Family",
        email: "rashid.family@email.com",
        phone: "+971 50 555 4444",
        type: "employer",
        status: "approved",
        documents: [],
        registrationDate: "2024-01-18",
        location: "Abu Dhabi"
      }
    ]

    // Mock data for pending contracts
    const mockPendingContracts: Contract[] = [
      {
        id: 1,
        familyName: "Al-Zahra Family",
        workerName: "Maria Garcia",
        agencyName: "Elite Home Services",
        jobTitle: "Full-time Nanny",
        status: "pending_admin_approval",
        contractValue: "$1,200/month",
        startDate: "2024-02-01",
        endDate: "2024-12-31",
        submittedDate: "2024-01-20"
      },
      {
        id: 2,
        familyName: "Al-Rashid Family",
        workerName: "Ahmed Hassan",
        agencyName: "Professional Care Services",
        jobTitle: "Personal Driver",
        status: "pending_admin_approval",
        contractValue: "$1,000/month",
        startDate: "2024-02-01",
        endDate: "2024-12-31",
        submittedDate: "2024-01-19"
      }
    ]

    setPendingUsers([...mockPendingUsers, ...mockApprovedUsers])
    setPendingContracts(mockPendingContracts)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPendingCount = (type: string) => {
    return pendingUsers.filter(user => user.type === type && user.status === 'pending').length
  }

  const getPendingContractsCount = () => {
    return pendingContracts.filter(contract => contract.status === 'pending_admin_approval').length
  }

  const handleViewProfile = (user: UserProfile) => {
    const route = `/${user.type}/profile?admin=true&userId=${user.id}`
    window.open(route, '_blank')
  }

  const handleViewContract = (contract: Contract) => {
    const route = `/contracts/${contract.id}?admin=true&userRole=admin`
    window.open(route, '_blank')
  }

  return (
    <div className="min-h-screen bg-background">
      <UnifiedSidebar 
        userRole="admin"
        userName="Admin"
        userEmail="admin@jobza.com"
      />
      
      <div className="lg:ml-64">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Review and manage incoming users and contracts</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Pending Workers</p>
                      <p className="text-lg font-bold">{getPendingCount('worker')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <Building2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Pending Agencies</p>
                      <p className="text-lg font-bold">{getPendingCount('agency')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                      <Shield className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Pending Employers</p>
                      <p className="text-lg font-bold">{getPendingCount('employer')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg mr-3">
                      <FileText className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Pending Contracts</p>
                      <p className="text-lg font-bold">{getPendingContractsCount()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Tabs */}
            <Card className="mb-6">
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  {/* Mobile dropdown */}
                  <div className="sm:hidden">
                    <Select value={activeTab} onValueChange={setActiveTab}>
                      <SelectTrigger aria-label="Select section">
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="workers">Pending Workers ({getPendingCount('worker')})</SelectItem>
                        <SelectItem value="agencies">Pending Agencies ({getPendingCount('agency')})</SelectItem>
                        <SelectItem value="families">Pending Families ({getPendingCount('employer')})</SelectItem>
                        <SelectItem value="contracts">Pending Contracts ({getPendingContractsCount()})</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Desktop/Tablet tab bar */}
                  <TabsList className="hidden sm:grid w-full grid-cols-3 md:grid-cols-4 gap-2 h-auto p-2">
                    <TabsTrigger 
                      value="workers" 
                      className="text-xs sm:text-sm data-[state=active]:border-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 p-3"
                    >
                      <span>Pending Workers ({getPendingCount('worker')})</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="agencies" 
                      className="text-xs sm:text-sm data-[state=active]:border-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 p-3"
                    >
                      <span>Pending Agencies ({getPendingCount('agency')})</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="families" 
                      className="text-xs sm:text-sm data-[state=active]:border-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 p-3"
                    >
                      <span>Pending Families ({getPendingCount('employer')})</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="contracts" 
                      className="text-xs sm:text-sm data-[state=active]:border-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 p-3"
                    >
                      <span>Pending Contracts ({getPendingContractsCount()})</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Pending Workers Tab */}
                  <TabsContent value="workers" className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pendingUsers.filter(user => user.type === 'worker' && user.status === 'pending').map((worker) => (
                        <Card key={worker.id} className="hover:shadow-sm transition-all duration-200">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="font-bold text-lg">{worker.name}</h3>
                                <p className="text-muted-foreground text-sm">{worker.specialization}</p>
                              </div>
                              {getStatusBadge(worker.status)}
                            </div>
                            
                            <div className="space-y-3 mb-4">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span>{worker.location}</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Star className="h-4 w-4 mr-2" />
                                <span>⭐ {worker.rating} • {worker.experience} years experience</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Building className="h-4 w-4 mr-2" />
                                <span>{worker.nationality}</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Award className="h-4 w-4 mr-2" />
                                <span>{worker.expectedSalary}</span>
                              </div>
                            </div>
                            
                            {worker.skills && (
                              <div className="mb-4">
                                <p className="text-xs text-muted-foreground mb-2">Skills:</p>
                                <div className="flex flex-wrap gap-1">
                                  {worker.skills.slice(0, 3).map((skill, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                  {worker.skills.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{worker.skills.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => handleViewProfile(worker)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Pending Agencies Tab */}
                  <TabsContent value="agencies" className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pendingUsers.filter(user => user.type === 'agency' && user.status === 'pending').map((agency) => (
                        <Card key={agency.id} className="hover:shadow-sm transition-all duration-200">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="font-bold text-lg">{agency.companyName}</h3>
                                <p className="text-muted-foreground text-sm">{agency.businessType}</p>
                              </div>
                              {getStatusBadge(agency.status)}
                            </div>
                            
                            <div className="space-y-3 mb-4">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <User className="h-4 w-4 mr-2" />
                                <span>{agency.name}</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Mail className="h-4 w-4 mr-2" />
                                <span>{agency.email}</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Phone className="h-4 w-4 mr-2" />
                                <span>{agency.phone}</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>Registered: {agency.registrationDate}</span>
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <p className="text-xs text-muted-foreground mb-2">Documents:</p>
                              <div className="flex flex-wrap gap-1">
                                {agency.documents.map((doc) => (
                                  <Badge key={doc.id} variant="outline" className="text-xs">
                                    {doc.type}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => handleViewProfile(agency)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Pending Families Tab */}
                  <TabsContent value="families" className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pendingUsers.filter(user => user.type === 'employer' && user.status === 'pending').map((family) => (
                        <Card key={family.id} className="hover:shadow-sm transition-all duration-200">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="font-bold text-lg">{family.name}</h3>
                                <p className="text-muted-foreground text-sm">Family/Employer</p>
                              </div>
                              {getStatusBadge(family.status)}
                            </div>
                            
                            <div className="space-y-3 mb-4">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span>{family.location}</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Mail className="h-4 w-4 mr-2" />
                                <span>{family.email}</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Phone className="h-4 w-4 mr-2" />
                                <span>{family.phone}</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>Registered: {family.registrationDate}</span>
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <p className="text-xs text-muted-foreground mb-2">Documents:</p>
                              <div className="flex flex-wrap gap-1">
                                {family.documents.map((doc) => (
                                  <Badge key={doc.id} variant="outline" className="text-xs">
                                    {doc.type}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => handleViewProfile(family)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Pending Contracts Tab */}
                  <TabsContent value="contracts" className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pendingContracts.filter(contract => contract.status === 'pending_admin_approval').map((contract) => (
                        <Card key={contract.id} className="hover:shadow-sm transition-all duration-200">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="font-bold text-lg">{contract.jobTitle}</h3>
                                <p className="text-muted-foreground text-sm">Contract Review Required</p>
                              </div>
                              <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending Approval</Badge>
                            </div>
                            
                            <div className="space-y-3 mb-4">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Users className="h-4 w-4 mr-2" />
                                <span>{contract.familyName} → {contract.workerName}</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Building2 className="h-4 w-4 mr-2" />
                                <span>Agency: {contract.agencyName}</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Award className="h-4 w-4 mr-2" />
                                <span>Value: {contract.contractValue}</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>{contract.startDate} - {contract.endDate}</span>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => handleViewContract(contract)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Contract
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Approved Accounts Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-900">Approved Accounts</CardTitle>
                <CardDescription>Users and agencies that have been verified and approved</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="approved-workers" className="w-full">
                  <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2 h-auto p-2">
                    <TabsTrigger 
                      value="approved-workers" 
                      className="text-xs sm:text-sm data-[state=active]:border-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 p-3"
                    >
                      <span className="hidden sm:inline">Approved Workers</span>
                      <span className="sm:hidden">Workers</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="approved-agencies" 
                      className="text-xs sm:text-sm data-[state=active]:border-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 p-3"
                    >
                      <span className="hidden sm:inline">Approved Agencies</span>
                      <span className="sm:hidden">Agencies</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="approved-families" 
                      className="text-xs sm:text-sm data-[state=active]:border-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 p-3"
                    >
                      <span className="hidden sm:inline">Approved Families</span>
                      <span className="sm:hidden">Families</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="approved-workers" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pendingUsers.filter(user => user.type === 'worker' && user.status === 'approved').map((worker) => (
                        <Card key={worker.id} className="hover:shadow-sm transition-all duration-200 border-green-200">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="font-bold text-lg">{worker.name}</h3>
                                <p className="text-muted-foreground text-sm">{worker.specialization}</p>
                              </div>
                              {getStatusBadge(worker.status)}
                            </div>
                            
                            <div className="space-y-3 mb-4">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span>{worker.location}</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Star className="h-4 w-4 mr-2" />
                                <span>⭐ {worker.rating} • {worker.experience} years experience</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Building className="h-4 w-4 mr-2" />
                                <span>{worker.nationality}</span>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => handleViewProfile(worker)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="approved-agencies" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pendingUsers.filter(user => user.type === 'agency' && user.status === 'approved').map((agency) => (
                        <Card key={agency.id} className="hover:shadow-sm transition-all duration-200 border-green-200">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="font-bold text-lg">{agency.companyName}</h3>
                                <p className="text-muted-foreground text-sm">{agency.businessType}</p>
                              </div>
                              {getStatusBadge(agency.status)}
                            </div>
                            
                            <div className="space-y-3 mb-4">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <User className="h-4 w-4 mr-2" />
                                <span>{agency.name}</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Mail className="h-4 w-4 mr-2" />
                                <span>{agency.email}</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Phone className="h-4 w-4 mr-2" />
                                <span>{agency.phone}</span>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => handleViewProfile(agency)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="approved-families" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pendingUsers.filter(user => user.type === 'employer' && user.status === 'approved').map((family) => (
                        <Card key={family.id} className="hover:shadow-sm transition-all duration-200 border-green-200">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="font-bold text-lg">{family.name}</h3>
                                <p className="text-muted-foreground text-sm">Family/Employer</p>
                              </div>
                              {getStatusBadge(family.status)}
                            </div>
                            
                            <div className="space-y-3 mb-4">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span>{family.location}</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Mail className="h-4 w-4 mr-2" />
                                <span>{family.email}</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Phone className="h-4 w-4 mr-2" />
                                <span>{family.phone}</span>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => handleViewProfile(family)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </Button>
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
  )
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <UnifiedSidebar 
          userRole="admin"
          userName="Admin"
          userEmail="admin@jobza.com"
        />
        <div className="lg:ml-64">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading admin dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <AdminDashboardContent />
    </Suspense>
  )
}
