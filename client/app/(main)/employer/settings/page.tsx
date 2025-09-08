"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { UnifiedSidebar } from "@/components/layout/unified-sidebar"
import { 
  Lock, 
  Building2, 
  CheckCircle, 
  AlertCircle,
  Edit,
  Star,
  ChevronDown,
  ChevronRight,
  ArrowLeft
} from "lucide-react"
import { toast } from "sonner"

// Mock data for primary agencies
const mockAgencies = [
  {
    id: 1,
    name: "Elite Home Services",
    rating: 4.8,
    workersCount: 45,
    location: "Cairo, Egypt",
    isPrimary: true,
    contactPerson: "Ahmed Hassan",
    phone: "+20 123 456 7890",
    email: "ahmed@elitehomeservices.com"
  },
  {
    id: 2,
    name: "Premium Care Agency",
    rating: 4.6,
    workersCount: 32,
    location: "Giza, Egypt",
    isPrimary: false,
    contactPerson: "Fatima Ali",
    phone: "+20 987 654 3210",
    email: "fatima@premiumcare.com"
  },
  {
    id: 3,
    name: "Quality Staff Solutions",
    rating: 4.9,
    workersCount: 28,
    location: "Alexandria, Egypt",
    isPrimary: false,
    contactPerson: "Mohamed Ibrahim",
    phone: "+20 555 123 4567",
    email: "mohamed@qualitystaff.com"
  }
]

export default function EmployerSettingsPage() {
  const router = useRouter()
  const [openSections, setOpenSections] = useState<string[]>([])
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [agencies, setAgencies] = useState(mockAgencies)
  const [isChangingAgency, setIsChangingAgency] = useState(false)
  const [selectedAgencyId, setSelectedAgencyId] = useState<number | null>(null)
  const [changeReason, setChangeReason] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match")
      return
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long")
      return
    }
    
    // Here you would typically make an API call to change the password
    console.log("Changing password:", passwordData)
    toast.success("Password changed successfully")
    
    // Reset form
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    })
  }

  const handleAgencyChange = (agencyId: number) => {
    setSelectedAgencyId(agencyId)
    setIsDialogOpen(true)
  }

  const confirmAgencyChange = () => {
    if (!changeReason.trim()) {
      toast.error("Please provide a reason for changing the agency")
      return
    }
    
    // Update agencies state
    setAgencies(prev => prev.map(agency => ({
      ...agency,
      isPrimary: agency.id === selectedAgencyId
    })))
    
    // Here you would typically make an API call to notify the agency
    console.log("Changing primary agency to:", selectedAgencyId, "Reason:", changeReason)
    toast.success("Primary agency changed successfully")
    
    // Reset state
    setChangeReason("")
    setIsDialogOpen(false)
    setSelectedAgencyId(null)
  }

  const getPrimaryAgency = () => {
    return agencies.find(agency => agency.isPrimary)
  }

  return (
    <div className="min-h-screen bg-background">
      <UnifiedSidebar 
        userRole="employer"
        userName="John Smith"
        userEmail="john@example.com"
      />
      
      <div className="lg:ml-64">
        {/* Back Button Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => router.push("/employer/dashboard")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 p-0 h-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 pt-4 lg:pt-0">
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
            </div>

            <div className="space-y-4">
              {/* Change Password Section */}
              <Collapsible 
                open={openSections.includes("password")} 
                onOpenChange={() => toggleSection("password")}
              >
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between p-6 h-auto text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-gray-600" />
                      <div>
                        <h3 className="text-lg font-semibold">Change Password</h3>
                        <p className="text-sm text-gray-600">Update your account password</p>
                      </div>
                    </div>
                    {openSections.includes("password") ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 pb-6">
                  <Card>
                    <CardContent className="pt-6">
                      <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="oldPassword">Current Password</Label>
                          <Input
                            id="oldPassword"
                            name="oldPassword"
                            type="password"
                            value={passwordData.oldPassword}
                            onChange={handlePasswordChange}
                            placeholder="Enter your current password"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="Enter your new password"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="Confirm your new password"
                            required
                          />
                        </div>
                        
                        <Button type="submit" className="w-full sm:w-auto">
                          Change Password
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>

              {/* Primary Agencies Section */}
              <Collapsible 
                open={openSections.includes("agencies")} 
                onOpenChange={() => toggleSection("agencies")}
              >
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between p-6 h-auto text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-gray-600" />
                      <div>
                        <h3 className="text-lg font-semibold">Primary Agencies</h3>
                        <p className="text-sm text-gray-600">Manage your default agencies</p>
                      </div>
                    </div>
                    {openSections.includes("agencies") ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 pb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Primary Agencies
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Set your default agency for job postings and worker recommendations
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Current Primary Agency */}
                        <div className="p-4 border-2 border-blue-200 bg-blue-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-blue-900">Current Primary Agency</h3>
                              <p className="text-sm text-blue-700">
                                {getPrimaryAgency()?.name || "No primary agency set"}
                              </p>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">
                              Primary
                            </Badge>
                          </div>
                        </div>

                        {/* Available Agencies */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">Available Agencies</h4>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {agencies.map((agency) => (
                              <div
                                key={agency.id}
                                className={`p-4 border rounded-lg transition-all duration-200 ${
                                  agency.isPrimary 
                                    ? 'border-blue-200 bg-blue-50 shadow-sm' 
                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                }`}
                              >
                                <div className="flex flex-col h-full">
                                  {/* Header with name and rating */}
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-semibold text-gray-900 text-lg mb-1 break-words">{agency.name}</h3>
                                      <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                                        <span className="text-sm text-gray-600">{agency.rating}</span>
                                      </div>
                                    </div>
                                    {agency.isPrimary && (
                                      <Badge className="bg-blue-100 text-blue-800 flex-shrink-0">
                                        Current Primary
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  {/* Agency details */}
                                  <div className="flex-1 space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <span className="text-gray-400">📍</span>
                                      <span className="break-words">{agency.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <span className="text-gray-400">👥</span>
                                      <span>{agency.workersCount} workers</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <span className="text-gray-400">📞</span>
                                      <span className="break-words">{agency.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <span className="text-gray-400">✉️</span>
                                      <span className="break-words">{agency.email}</span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      Contact: {agency.contactPerson}
                                    </div>
                                  </div>
                                  
                                  {/* Action button */}
                                  <div className="mt-auto">
                                    {agency.isPrimary ? (
                                      <div className="text-center py-2">
                                        <Badge className="bg-green-100 text-green-800">
                                          ✓ Primary Agency
                                        </Badge>
                                      </div>
                                    ) : (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleAgencyChange(agency.id)}
                                        disabled={isChangingAgency}
                                        className="w-full"
                                      >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Set as Primary
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>
      </div>

      {/* Agency Change Reason Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Change Primary Agency
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for changing your primary agency. This reason will be sent to the agency you're switching to.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="changeReason">Reason for Change</Label>
              <Textarea
                id="changeReason"
                placeholder="Please explain why you're changing your primary agency..."
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                rows={4}
                required
              />
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false)
                setChangeReason("")
                setSelectedAgencyId(null)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAgencyChange}
              disabled={!changeReason.trim()}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
