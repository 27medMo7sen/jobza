"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Shield,
  MessageSquare,
  Edit,
  Upload,
  FileText,
  Camera,
  CheckCircle,
  ArrowLeft,
  Save,
  X,
  Heart,
  PenTool,
  Eye,
  GraduationCap,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { WorkerSidebar } from "@/components/layout/worker-sidebar"
import Link from "next/link"
import { SignatureCanvas } from "@/components/ui/signature-canvas"

interface Worker {
  userName: string
  email: string
  phoneNumber: string
  nationality: string
  role: string
  country: string
  approved: string
  heightestEducationLevel: string
  gender: string
  dateOfBirth: string
  skillSet: string[]
}

interface DocumentStatus {
  file: File | null
  status: "pending" | "approved" | "rejected"
  rejectionReason?: string
}

export default function WorkerProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingSkills, setIsEditingSkills] = useState(false)
  const [isEditingDocuments, setIsEditingDocuments] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [availableSkills] = useState([
    "House Cleaning",
    "Deep Cleaning",
    "Laundry & Ironing",
    "Kitchen Cleaning",
    "Elderly Care",
    "Child Care",
    "Pet Care",
    "Garden Maintenance",
    "Cooking",
    "Organization",
    "Window Cleaning",
    "Carpet Cleaning",
    "Bathroom Cleaning",
  ])
  const signatureRef = useRef<HTMLCanvasElement>(null)
  const [hasSignature, setHasSignature] = useState(false)

  const [documents, setDocuments] = useState<Record<string, DocumentStatus>>({
    visa: { file: null, status: "pending" },
    experienceLetter: { file: null, status: "pending" },
    policeClearance: { file: null, status: "pending" },
    fullBodyPhoto: { file: null, status: "approved" }, // Mock approved status
    medicalCertificate: {
      file: null,
      status: "rejected",
      rejectionReason: "Document is not clear, please upload a higher quality image",
    },
    facePhoto: { file: null, status: "pending" },
    passportId: { file: null, status: "pending" },
    educationalCertificate: { file: null, status: "pending" },
  })

  const [workerData, setWorkerData] = useState<Worker>({
    userName: "Mariam Farid",
    email: "mariam.farid@email.com",
    phoneNumber: "+20 123 456 7890",
    nationality: "Egyptian",
    role: "House Cleaner & Caregiver",
    country: "Egypt",
    approved: "Pending",
    heightestEducationLevel: "High School",
    gender: "Female",
    dateOfBirth: "1990-05-15",
    skillSet: ["House Cleaning", "Deep Cleaning", "Laundry & Ironing", "Kitchen Cleaning", "Elderly Care"],
  })

  const handleDocumentUpload = (docType: string, file: File | null) => {
    setDocuments((prev) => ({
      ...prev,
      [docType]: {
        file,
        status: "pending" as const,
        rejectionReason: undefined,
      },
    }))
  }

  const handleProfilePhotoUpload = (file: File | null) => {
    setProfilePhoto(file)
  }

  const handlePhotoCrop = (docType: string, file: File) => {
    // Mock cropping functionality - in real implementation, this would open a crop modal
    console.log(`Cropping photo for ${docType}`)
    handleDocumentUpload(docType, file)
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const clearSignature = () => {
    if (signatureRef.current && (signatureRef.current as any).clear) {
      ;(signatureRef.current as any).clear()
      setHasSignature(false)
    }
  }

  const saveSignature = () => {
    if (signatureRef.current && (signatureRef.current as any).isEmpty && !(signatureRef.current as any).isEmpty()) {
      setHasSignature(true)
    }
  }

  const addSkill = (skill: string) => {
    if (!workerData.skillSet.includes(skill)) {
      setWorkerData({ ...workerData, skillSet: [...workerData.skillSet, skill] })
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setWorkerData({
      ...workerData,
      skillSet: workerData.skillSet.filter((skill) => skill !== skillToRemove),
    })
  }

  const getBorderColor = (status: "pending" | "approved" | "rejected") => {
    switch (status) {
      case "approved":
        return "border-green-500"
      case "rejected":
        return "border-red-500"
      default:
        return "border-gray-300"
    }
  }

  const renderDocumentPreview = (file: File, title: string) => {
    if (file.type.includes('pdf')) {
      return (
        <div className="text-center p-8">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">PDF Document</p>
          <p className="text-sm text-gray-500">{file.name}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={() => window.open(URL.createObjectURL(file), '_blank')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Open PDF
          </Button>
        </div>
      )
    } else {
      return (
        <img
          src={URL.createObjectURL(file) || "/placeholder.svg"}
          alt={title}
          className="max-w-full max-h-96 object-contain rounded-lg"
        />
      )
    }
  }

  // Helper function to ensure photos fit properly within borders
  const getPhotoContainerStyle = () => {
    return "w-full h-64 object-contain bg-gray-50 rounded-lg"
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <WorkerSidebar />

      <div className="flex-1 p-6">
        <div className="mb-6">
          <Link href="/worker/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  <div className="relative group">
                    <Avatar className="w-32 h-32 border-4 border-pink-200 shadow-lg">
                      {profilePhoto ? (
                        <AvatarImage src={URL.createObjectURL(profilePhoto) || "/placeholder.svg"} alt="Profile" />
                      ) : (
                        <AvatarFallback className="text-3xl font-bold bg-pink-500 text-white">
                          {workerData.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleProfilePhotoUpload(e.target.files?.[0] || null)}
                        className="hidden"
                        id="profilePhoto"
                      />
                      <label htmlFor="profilePhoto" className="cursor-pointer">
                        <Camera className="w-8 h-8 text-white" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-blue-900 mb-2">{workerData.userName}</h1>
                      <p className="text-xl text-pink-600 mb-4">{workerData.role}</p>
                    </div>

                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                          <Button onClick={handleCancel} variant="outline">
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => setIsEditing(true)} variant="outline">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 mb-4">
                    <Link href="/messages">
                      <Button variant="outline">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        View Messages
                      </Button>
                    </Link>
                  </div>

                  <div className="mt-4">
                    <Badge
                      variant="secondary"
                      className={`${
                        workerData.approved === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      <Shield className="w-4 h-4 mr-1" />
                      {workerData.approved}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-900">Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Full Name</Label>
                        <Input
                          value={workerData.userName}
                          onChange={(e) => setWorkerData({ ...workerData, userName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          value={workerData.email}
                          onChange={(e) => setWorkerData({ ...workerData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Phone Number</Label>
                        <Input
                          value={workerData.phoneNumber}
                          onChange={(e) => setWorkerData({ ...workerData, phoneNumber: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Nationality</Label>
                        <Input
                          value={workerData.nationality}
                          onChange={(e) => setWorkerData({ ...workerData, nationality: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Role</Label>
                        <Input
                          value={workerData.role}
                          onChange={(e) => setWorkerData({ ...workerData, role: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Country</Label>
                        <Input
                          value={workerData.country}
                          onChange={(e) => setWorkerData({ ...workerData, country: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Education Level</Label>
                        <Select
                          value={workerData.heightestEducationLevel}
                          onValueChange={(value) => setWorkerData({ ...workerData, heightestEducationLevel: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Elementary">Elementary</SelectItem>
                            <SelectItem value="High School">High School</SelectItem>
                            <SelectItem value="Bachelor's">Bachelor's</SelectItem>
                            <SelectItem value="Master's">Master's</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Gender</Label>
                        <Select
                          value={workerData.gender}
                          onValueChange={(value) => setWorkerData({ ...workerData, gender: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Date of Birth</Label>
                        <Input
                          type="date"
                          value={workerData.dateOfBirth}
                          onChange={(e) => setWorkerData({ ...workerData, dateOfBirth: e.target.value })}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-semibold">{workerData.userName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-semibold">{workerData.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="font-semibold">{workerData.phoneNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Nationality</p>
                        <p className="font-semibold">{workerData.nationality}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Role</p>
                        <p className="font-semibold">{workerData.role}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Country</p>
                        <p className="font-semibold">{workerData.country}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Education Level</p>
                        <p className="font-semibold">{workerData.heightestEducationLevel}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Gender</p>
                        <p className="font-semibold">{workerData.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date of Birth</p>
                        <p className="font-semibold">{workerData.dateOfBirth}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Skills Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-blue-900">Skills & Services</CardTitle>
                    <Button onClick={() => setIsEditingSkills(!isEditingSkills)} variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      {isEditingSkills ? "Done" : "Edit"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditingSkills ? (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Current Skills</Label>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {workerData.skillSet.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
                            >
                              {skill}
                              <X
                                className="w-3 h-3 cursor-pointer hover:text-red-600"
                                onClick={() => removeSkill(skill)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">Available Skills</Label>
                        <div className="flex flex-wrap gap-2">
                          {availableSkills
                            .filter((skill) => !workerData.skillSet.includes(skill))
                            .map((skill, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="bg-gray-50 text-gray-700 border-gray-200 cursor-pointer hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                                onClick={() => addSkill(skill)}
                              >
                                + {skill}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {workerData.skillSet.map((skill, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Documents Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-blue-900">Required Documents</CardTitle>
                    <Button onClick={() => setIsEditingDocuments(!isEditingDocuments)} variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      {isEditingDocuments ? "Done" : "Edit"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Photos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                      {/* Face Photo */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">
                          Face Photo <span className="text-red-500">*</span>
                        </Label>
                        <div
                          className={`border-4 rounded-lg overflow-hidden ${getBorderColor(documents.facePhoto.status)}`}
                        >
                          {documents.facePhoto.file ? (
                            <div className="relative">
                              <img
                                src={URL.createObjectURL(documents.facePhoto.file) || "/placeholder.svg"}
                                alt="Face Photo"
                                className={getPhotoContainerStyle()}
                                style={{ objectFit: 'contain', maxHeight: '100%', maxWidth: '100%' }}
                              />
                              {isEditingDocuments && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0]
                                      if (file) handlePhotoCrop("facePhoto", file)
                                    }}
                                    className="hidden"
                                    id="facePhotoUpdate"
                                  />
                                  <label htmlFor="facePhotoUpdate">
                                    <Button variant="secondary" size="sm">
                                      <RefreshCw className="w-4 h-4 mr-2" />
                                      Update
                                    </Button>
                                  </label>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="h-48 flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
                              <div className="text-center">
                                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <span className="text-sm text-gray-600">No photo uploaded</span>
                              </div>
                            </div>
                          )}
                        </div>
                        {documents.facePhoto.status === "rejected" && documents.facePhoto.rejectionReason && (
                          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-red-700">{documents.facePhoto.rejectionReason}</span>
                          </div>
                        )}
                        {/* Upload button for missing documents */}
                        {!documents.facePhoto.file && (
                          <div className="flex gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handlePhotoCrop("facePhoto", file)
                              }}
                              className="hidden"
                              id="facePhotoUpload"
                            />
                            <label htmlFor="facePhotoUpload">
                              <Button variant="outline" size="sm" asChild className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600">
                                <span className="cursor-pointer">
                                  <Upload className="w-4 h-4 mr-2" />
                                  Upload Photo
                                </span>
                              </Button>
                            </label>
                          </div>
                        )}
                        {/* Update button when editing */}
                        {isEditingDocuments && documents.facePhoto.file && (
                          <div className="flex gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handlePhotoCrop("facePhoto", file)
                              }}
                              className="hidden"
                              id="facePhotoUpdate"
                            />
                            <label htmlFor="facePhotoUpdate">
                              <Button variant="outline" size="sm" asChild>
                                <span className="cursor-pointer">
                                  <RefreshCw className="w-4 h-4 mr-2" />
                                  Update
                                </span>
                              </Button>
                            </label>
                          </div>
                        )}
                      </div>

                      {/* Full Body Photo */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">
                          Full Body Photo <span className="text-red-500">*</span>
                        </Label>
                        <div
                          className={`border-4 rounded-lg overflow-hidden ${getBorderColor(documents.fullBodyPhoto.status)}`}
                        >
                          {documents.fullBodyPhoto.file ? (
                            <div className="relative">
                              <img
                                src={URL.createObjectURL(documents.fullBodyPhoto.file) || "/placeholder.svg"}
                                alt="Full Body Photo"
                                className={getPhotoContainerStyle()}
                                style={{ objectFit: 'contain', maxHeight: '100%', maxWidth: '100%' }}
                              />
                              {isEditingDocuments && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0]
                                      if (file) handlePhotoCrop("fullBodyPhoto", file)
                                    }}
                                    className="hidden"
                                    id="fullBodyPhotoUpdate"
                                  />
                                  <label htmlFor="fullBodyPhotoUpdate">
                                    <Button variant="secondary" size="sm">
                                      <RefreshCw className="w-4 h-4 mr-2" />
                                      Update
                                    </Button>
                                  </label>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="h-64 flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
                              <div className="text-center">
                                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <span className="text-sm text-gray-600">No photo uploaded</span>
                              </div>
                            </div>
                          )}
                        </div>
                        {documents.fullBodyPhoto.status === "approved" && (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm">Full Body Photo uploaded successfully</span>
                          </div>
                        )}
                        {/* Upload button for missing documents */}
                        {!documents.fullBodyPhoto.file && (
                          <div className="flex gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handlePhotoCrop("fullBodyPhoto", file)
                              }}
                              className="hidden"
                              id="fullBodyPhotoUpload"
                            />
                            <label htmlFor="fullBodyPhotoUpload">
                              <Button variant="outline" size="sm" asChild className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600">
                                <span className="cursor-pointer">
                                  <Upload className="w-4 h-4 mr-2" />
                                  Upload Photo
                                </span>
                              </Button>
                            </label>
                          </div>
                        )}
                        {/* Update button when editing */}
                        {isEditingDocuments && documents.fullBodyPhoto.file && (
                          <div className="flex gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handlePhotoCrop("fullBodyPhoto", file)
                              }}
                              className="hidden"
                              id="fullBodyPhotoUpdate"
                            />
                            <label htmlFor="fullBodyPhotoUpdate">
                              <Button variant="outline" size="sm" asChild>
                                <span className="cursor-pointer">
                                  <RefreshCw className="w-4 h-4 mr-2" />
                                  Update
                                </span>
                              </Button>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Documents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Passport/National ID */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Passport / National ID <span className="text-red-500">*</span>
                        </Label>
                        <div
                          className={`border-2 border-dashed rounded-lg p-4 ${getBorderColor(documents.passportId.status)}`}
                        >
                          {documents.passportId.file ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-center gap-2 text-green-600">
                                <CheckCircle className="w-5 h-5" />
                                <span className="text-sm">Passport / National ID uploaded successfully</span>
                              </div>
                              <div className="flex gap-2 justify-center">
                                {isEditingDocuments ? (
                                  <>
                                    <Input
                                      type="file"
                                      accept="image/*,.pdf"
                                      onChange={(e) => handleDocumentUpload("passportId", e.target.files?.[0] || null)}
                                      className="hidden"
                                      id="passportIdUpdate"
                                    />
                                    <label htmlFor="passportIdUpdate">
                                      <Button variant="outline" size="sm" asChild>
                                        <span className="cursor-pointer">
                                          <RefreshCw className="w-4 h-4 mr-2" />
                                          Update
                                        </span>
                                      </Button>
                                    </label>
                                  </>
                                ) : (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        <Eye className="w-4 h-4 mr-2" />
                                        Preview
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle>Passport / National ID</DialogTitle>
                                      </DialogHeader>
                                      <div className="flex justify-center">
                                        {renderDocumentPreview(documents.passportId.file, "Passport/ID")}
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => handleDocumentUpload("passportId", e.target.files?.[0] || null)}
                                className="hidden"
                                id="passportId"
                              />
                              <label
                                htmlFor="passportId"
                                className="cursor-pointer"
                              >
                                <div className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
                                  <FileText className="w-8 h-8 text-blue-400" />
                                  <span className="text-sm text-blue-600 font-medium">Upload Document</span>
                                </div>
                              </label>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Educational Certificate */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Educational Certificate <span className="text-red-500">*</span>
                        </Label>
                        <div
                          className={`border-2 border-dashed rounded-lg p-4 ${getBorderColor(documents.educationalCertificate.status)}`}
                        >
                          {documents.educationalCertificate.file ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-center gap-2 text-green-600">
                                <CheckCircle className="w-5 h-5" />
                                <span className="text-sm">Educational Certificate uploaded successfully</span>
                              </div>
                              <div className="flex gap-2 justify-center">
                                {isEditingDocuments ? (
                                  <>
                                    <Input
                                      type="file"
                                      accept="image/*,.pdf"
                                      onChange={(e) =>
                                        handleDocumentUpload("educationalCertificate", e.target.files?.[0] || null)
                                      }
                                      className="hidden"
                                      id="educationalCertificateUpdate"
                                    />
                                    <label htmlFor="educationalCertificateUpdate">
                                      <Button variant="outline" size="sm" asChild>
                                        <span className="cursor-pointer">
                                          <RefreshCw className="w-4 h-4 mr-2" />
                                          Update
                                        </span>
                                      </Button>
                                    </label>
                                  </>
                                ) : (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        <Eye className="w-4 h-4 mr-2" />
                                        Preview
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle>Educational Certificate</DialogTitle>
                                      </DialogHeader>
                                      <div className="flex justify-center">
                                        {renderDocumentPreview(documents.educationalCertificate.file, "Educational Certificate")}
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) =>
                                  handleDocumentUpload("educationalCertificate", e.target.files?.[0] || null)
                                }
                                className="hidden"
                                id="educationalCertificate"
                              />
                              <label
                                htmlFor="educationalCertificate"
                                className="cursor-pointer"
                              >
                                <div className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
                                  <GraduationCap className="w-8 h-8 text-blue-400" />
                                  <span className="text-sm text-blue-600 font-medium">Upload Certificate</span>
                                </div>
                              </label>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Medical Certificate - with rejection example */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Medical Certificate (Optional)</Label>
                        <div
                          className={`border-2 border-dashed rounded-lg p-4 ${getBorderColor(documents.medicalCertificate.status)}`}
                        >
                          {documents.medicalCertificate.file ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-center gap-2 text-green-600">
                                <CheckCircle className="w-5 h-5" />
                                <span className="text-sm">Medical Certificate uploaded successfully</span>
                              </div>
                              <div className="flex gap-2 justify-center">
                                {isEditingDocuments ? (
                                  <>
                                    <Input
                                      type="file"
                                      accept="image/*,.pdf"
                                      onChange={(e) =>
                                        handleDocumentUpload("medicalCertificate", e.target.files?.[0] || null)
                                      }
                                      className="hidden"
                                      id="medicalCertificateUpdate"
                                    />
                                    <label htmlFor="medicalCertificateUpdate">
                                      <Button variant="outline" size="sm" asChild>
                                        <span className="cursor-pointer">
                                          <RefreshCw className="w-4 h-4 mr-2" />
                                          Update
                                        </span>
                                      </Button>
                                    </label>
                                  </>
                                ) : (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        <Eye className="w-4 h-4 mr-2" />
                                        Preview
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle>Medical Certificate</DialogTitle>
                                      </DialogHeader>
                                      <div className="flex justify-center">
                                        {renderDocumentPreview(documents.medicalCertificate.file, "Medical Certificate")}
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) =>
                                  handleDocumentUpload("medicalCertificate", e.target.files?.[0] || null)
                                }
                                className="hidden"
                                id="medicalCertificate"
                              />
                              <label
                                htmlFor="medicalCertificate"
                                className="cursor-pointer"
                              >
                                <div className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
                                  <Heart className="w-8 h-8 text-blue-400" />
                                  <span className="text-sm text-blue-600 font-medium">Upload Document</span>
                                </div>
                              </label>
                            </div>
                          )}
                          {documents.medicalCertificate.status === "rejected" &&
                            documents.medicalCertificate.rejectionReason && (
                              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mt-3">
                                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-red-700">
                                  {documents.medicalCertificate.rejectionReason}
                                </span>
                              </div>
                            )}
                        </div>
                      </div>

                      {/* Visa - Optional */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Visa (Optional)</Label>
                        <div
                          className={`border-2 border-dashed rounded-lg p-4 ${getBorderColor(documents.visa.status)}`}
                        >
                          {documents.visa.file ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-center gap-2 text-green-600">
                                <CheckCircle className="w-5 h-5" />
                                <span className="text-sm">Visa uploaded successfully</span>
                              </div>
                              <div className="flex gap-2 justify-center">
                                {isEditingDocuments ? (
                                  <>
                                    <Input
                                      type="file"
                                      accept="image/*,.pdf"
                                      onChange={(e) => handleDocumentUpload("visa", e.target.files?.[0] || null)}
                                      className="hidden"
                                      id="visaUpdate"
                                    />
                                    <label htmlFor="visaUpdate">
                                      <Button variant="outline" size="sm" asChild>
                                        <span className="cursor-pointer">
                                          <RefreshCw className="w-4 h-4 mr-2" />
                                          Update
                                        </span>
                                      </Button>
                                    </label>
                                  </>
                                ) : (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        <Eye className="w-4 h-4 mr-2" />
                                        Preview
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle>Visa</DialogTitle>
                                      </DialogHeader>
                                      <div className="flex justify-center">
                                        {renderDocumentPreview(documents.visa.file, "Visa")}
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => handleDocumentUpload("visa", e.target.files?.[0] || null)}
                                className="hidden"
                                id="visa"
                              />
                              <label
                                htmlFor="visa"
                                className="cursor-pointer"
                              >
                                <div className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
                                  <FileText className="w-8 h-8 text-blue-400" />
                                  <span className="text-sm text-blue-600 font-medium">Upload Document</span>
                                </div>
                              </label>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Experience Letter - Optional */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Experience Letter (Optional)</Label>
                        <div
                          className={`border-2 border-dashed rounded-lg p-4 ${getBorderColor(documents.experienceLetter.status)}`}
                        >
                          {documents.experienceLetter.file ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-center gap-2 text-green-600">
                                <CheckCircle className="w-5 h-5" />
                                <span className="text-sm">Experience Letter uploaded successfully</span>
                              </div>
                              <div className="flex gap-2 justify-center">
                                {isEditingDocuments ? (
                                  <>
                                    <Input
                                      type="file"
                                      accept="image/*,.pdf"
                                      onChange={(e) =>
                                        handleDocumentUpload("experienceLetter", e.target.files?.[0] || null)
                                      }
                                      className="hidden"
                                      id="experienceLetterUpdate"
                                    />
                                    <label htmlFor="experienceLetterUpdate">
                                      <Button variant="outline" size="sm" asChild>
                                        <span className="cursor-pointer">
                                          <RefreshCw className="w-4 h-4 mr-2" />
                                          Update
                                        </span>
                                      </Button>
                                    </label>
                                  </>
                                ) : (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        <Eye className="w-4 h-4 mr-2" />
                                        Preview
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle>Experience Letter</DialogTitle>
                                      </DialogHeader>
                                      <div className="flex justify-center">
                                        {renderDocumentPreview(documents.experienceLetter.file, "Experience Letter")}
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => handleDocumentUpload("experienceLetter", e.target.files?.[0] || null)}
                                className="hidden"
                                id="experienceLetter"
                              />
                              <label
                                htmlFor="experienceLetter"
                                className="cursor-pointer"
                              >
                                <div className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
                                  <FileText className="w-8 h-8 text-blue-400" />
                                  <span className="text-sm text-blue-600 font-medium">Upload Document</span>
                                </div>
                              </label>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Police Clearance - Optional */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Police Clearance (Optional)</Label>
                        <div
                          className={`border-2 border-dashed rounded-lg p-4 ${getBorderColor(documents.policeClearance.status)}`}
                        >
                          {documents.policeClearance.file ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-center gap-2 text-green-600">
                                <CheckCircle className="w-5 h-5" />
                                <span className="text-sm">Police Clearance uploaded successfully</span>
                              </div>
                              <div className="flex gap-2 justify-center">
                                {isEditingDocuments ? (
                                  <>
                                    <Input
                                      type="file"
                                      accept="image/*,.pdf"
                                      onChange={(e) =>
                                        handleDocumentUpload("policeClearance", e.target.files?.[0] || null)
                                      }
                                      className="hidden"
                                      id="policeClearanceUpdate"
                                    />
                                    <label htmlFor="policeClearanceUpdate">
                                      <Button variant="outline" size="sm" asChild>
                                        <span className="cursor-pointer">
                                          <RefreshCw className="w-4 h-4 mr-2" />
                                          Update
                                        </span>
                                      </Button>
                                    </label>
                                  </>
                                ) : (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        <Eye className="w-4 h-4 mr-2" />
                                        Preview
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle>Police Clearance</DialogTitle>
                                      </DialogHeader>
                                      <div className="flex justify-center">
                                        {renderDocumentPreview(documents.policeClearance.file, "Police Clearance")}
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => handleDocumentUpload("policeClearance", e.target.files?.[0] || null)}
                                className="hidden"
                                id="policeClearance"
                              />
                              <label
                                htmlFor="policeClearance"
                                className="cursor-pointer"
                              >
                                <div className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
                                  <Shield className="w-8 h-8 text-blue-400" />
                                  <span className="text-sm text-blue-600 font-medium">Upload Document</span>
                                </div>
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 border-t pt-6">
                    <Label className="text-sm font-medium mb-4 block">
                      E-Signature <span className="text-red-500">*</span>
                    </Label>
                    <div className="border-2 border-gray-300 rounded-lg p-4">
                      <div className="mb-4">
                        <SignatureCanvas
                          width={500}
                          height={200}
                          className="signature-canvas border rounded w-full bg-white"
                          onEnd={() => setHasSignature(!(signatureRef.current as any)?.isEmpty?.())}
                          ref={signatureRef}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={clearSignature} variant="outline" size="sm">
                          Clear
                        </Button>
                        <Button onClick={saveSignature} size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <PenTool className="w-4 h-4 mr-2" />
                          Save Signature
                        </Button>
                      </div>
                      {hasSignature && (
                        <div className="mt-2 flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Signature saved</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Upload className="w-4 h-4 mr-2" />
                      Save Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-900">Account Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <Badge
                      variant="secondary"
                      className={`${
                        workerData.approved === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      } text-lg px-4 py-2`}
                    >
                      {workerData.approved}
                    </Badge>
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
