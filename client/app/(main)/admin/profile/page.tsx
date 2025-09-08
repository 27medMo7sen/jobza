"use client"

import { useState, Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  ArrowLeft,
  Edit,
  Save,
  X,
  Shield,
  User,
  Mail,
  Phone,
  Building2
} from "lucide-react"
import { UnifiedSidebar } from "@/components/layout/unified-sidebar"
import { useRouter } from "next/navigation"

interface AdminProfile {
  name: string
  email: string
  phone: string
  role: string
  department: string
  employeeId: string
  joinDate: string
  permissions: string[]
}

function AdminProfileContent() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<AdminProfile>({
    name: "Admin User",
    email: "admin@jobza.com",
    phone: "+971 50 123 4567",
    role: "System Administrator",
    department: "IT & Operations",
    employeeId: "ADM-001",
    joinDate: "2024-01-01",
    permissions: [
      "User Management",
      "Document Verification",
      "Contract Approval",
      "System Configuration",
      "Analytics Access",
      "Security Management"
    ]
  })

  const [editForm, setEditForm] = useState<AdminProfile>(profile)

  const handleEdit = () => {
    setEditForm(profile)
    setIsEditing(true)
  }

  const handleSave = () => {
    setProfile(editForm)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditForm(profile)
    setIsEditing(false)
  }

  const handleInputChange = (field: keyof AdminProfile, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }))
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
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push("/admin/dashboard")}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 p-0 h-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Dashboard</span>
                </Button>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
              <p className="text-gray-600 mt-2">Manage your administrative account settings</p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Profile Header */}
              <Card className="mb-8">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <Avatar className="w-32 h-32 border-4 border-blue-200 shadow-lg">
                          <AvatarFallback className="text-3xl font-bold bg-blue-500 text-white">
                            {profile.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h1 className="text-3xl font-bold text-blue-900 mb-2">{profile.name}</h1>
                          <p className="text-xl text-blue-600 mb-4">{profile.role}</p>
                        </div>

                        <div className="flex gap-2">
                          {isEditing ? (
                            <>
                              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                              </Button>
                              <Button onClick={handleCancel} variant="outline">
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <Button onClick={handleEdit} variant="outline">
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Profile
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Shield className="h-4 w-4" />
                          <span>System Administrator</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building2 className="h-4 w-4" />
                          <span>{profile.department}</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          <Shield className="w-4 h-4 mr-2" />
                          Full System Access
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-900">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">{profile.name}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={editForm.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">{profile.email}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={editForm.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">{profile.phone}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-900">Employment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="role">Job Title</Label>
                      {isEditing ? (
                        <Input
                          id="role"
                          value={editForm.role}
                          onChange={(e) => handleInputChange('role', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">{profile.role}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="department">Department</Label>
                      {isEditing ? (
                        <Input
                          id="department"
                          value={editForm.department}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">{profile.department}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="employeeId">Employee ID</Label>
                      <p className="text-sm text-muted-foreground mt-1">{profile.employeeId}</p>
                    </div>

                    <div>
                      <Label htmlFor="joinDate">Join Date</Label>
                      <p className="text-sm text-muted-foreground mt-1">{profile.joinDate}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Permissions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-900">System Permissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {profile.permissions.map((permission, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">{permission}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminProfile() {
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
              <p className="text-muted-foreground">Loading admin profile...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <AdminProfileContent />
    </Suspense>
  )
}
