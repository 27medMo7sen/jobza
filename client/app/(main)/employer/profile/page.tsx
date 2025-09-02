"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Shield,
  MessageSquare,
  Edit,
  Upload,
  FileText,
  CheckCircle,
  ArrowLeft,
  Save,
  X,
  Home,
  PenTool,
  Users,
} from "lucide-react"
import Link from "next/link"
// @ts-ignore
import SignatureCanvas from "react-signature-canvas"

interface Employer {
  userName: string
  phoneNumber: string
  gender: string
  nationality: string
  dateOfBirth: string
  country: string
  householdSize: number
  householdComposition: {
    adults: number
    children: number
    infants: number
    elders: number
  }
  homeType: string
  serviceRequirements: string[]
  workingHours: string
  preferredStartDate: string
  budgetRange: {
    min: number
    max: number
    currency: string
  }
}

export default function EmployerProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingServices, setIsEditingServices] = useState(false)
  const signatureRef = useRef<any>(null)
  const [hasSignature, setHasSignature] = useState(false)

  const [availableServices] = useState([
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
  ])

  const [documents, setDocuments] = useState({
    nationalId: null,
    proofOfAddress: null,
    employmentLetter: null,
  })

  const [employerData, setEmployerData] = useState<Employer>({
    userName: "Ahmed Hassan",
    phoneNumber: "+20 123 456 7890",
    gender: "Male",
    nationality: "Egyptian",
    dateOfBirth: "1985-03-20",
    country: "Egypt",
    householdSize: 5,
    householdComposition: {
      adults: 2,
      children: 2,
      infants: 1,
      elders: 0,
    },
    homeType: "Villa",
    serviceRequirements: ["House Cleaning", "Child Care", "Cooking"],
    workingHours: "8 hours/day",
    preferredStartDate: "2024-02-01",
    budgetRange: {
      min: 2000,
      max: 3500,
      currency: "EGP",
    },
  })

  const handleDocumentUpload = (docType: string, file: File | null) => {
    setDocuments((prev) => ({ ...prev, [docType]: file }))
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const clearSignature = () => {
    signatureRef.current?.clear()
    setHasSignature(false)
  }

  const saveSignature = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      setHasSignature(true)
    }
  }

  const addService = (service: string) => {
    if (!employerData.serviceRequirements.includes(service)) {
      setEmployerData({ ...employerData, serviceRequirements: [...employerData.serviceRequirements, service] })
    }
  }

  const removeService = (serviceToRemove: string) => {
    setEmployerData({
      ...employerData,
      serviceRequirements: employerData.serviceRequirements.filter((service) => service !== serviceToRemove),
    })
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-6">
        <div className="mb-6">
          <Link href="/employer/dashboard">
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
                  <Avatar className="w-32 h-32">
                    <AvatarFallback className="text-3xl font-bold bg-pink-500 text-white">
                      {employerData.userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-blue-900 mb-2">{employerData.userName}</h1>
                      <p className="text-xl text-pink-600 mb-4">Family Employer</p>
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
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Shield className="w-4 h-4 mr-1" />
                      Verified Employer
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
                          value={employerData.userName}
                          onChange={(e) => setEmployerData({ ...employerData, userName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Phone Number</Label>
                        <Input
                          value={employerData.phoneNumber}
                          onChange={(e) => setEmployerData({ ...employerData, phoneNumber: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Gender</Label>
                        <Select
                          value={employerData.gender}
                          onValueChange={(value) => setEmployerData({ ...employerData, gender: value })}
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
                        <Label>Nationality</Label>
                        <Input
                          value={employerData.nationality}
                          onChange={(e) => setEmployerData({ ...employerData, nationality: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Date of Birth</Label>
                        <Input
                          type="date"
                          value={employerData.dateOfBirth}
                          onChange={(e) => setEmployerData({ ...employerData, dateOfBirth: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Country</Label>
                        <Input
                          value={employerData.country}
                          onChange={(e) => setEmployerData({ ...employerData, country: e.target.value })}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-semibold">{employerData.userName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="font-semibold">{employerData.phoneNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Gender</p>
                        <p className="font-semibold">{employerData.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Nationality</p>
                        <p className="font-semibold">{employerData.nationality}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date of Birth</p>
                        <p className="font-semibold">{employerData.dateOfBirth}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Country</p>
                        <p className="font-semibold">{employerData.country}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Household Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-900">Household Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Household Size</Label>
                        <Input
                          type="number"
                          value={employerData.householdSize}
                          onChange={(e) =>
                            setEmployerData({ ...employerData, householdSize: Number.parseInt(e.target.value) })
                          }
                        />
                      </div>
                      <div>
                        <Label>Home Type</Label>
                        <Select
                          value={employerData.homeType}
                          onValueChange={(value) => setEmployerData({ ...employerData, homeType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Apartment">Apartment</SelectItem>
                            <SelectItem value="Villa">Villa</SelectItem>
                            <SelectItem value="Townhouse">Townhouse</SelectItem>
                            <SelectItem value="Penthouse">Penthouse</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Adults</Label>
                        <Input
                          type="number"
                          value={employerData.householdComposition.adults}
                          onChange={(e) =>
                            setEmployerData({
                              ...employerData,
                              householdComposition: {
                                ...employerData.householdComposition,
                                adults: Number.parseInt(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Children</Label>
                        <Input
                          type="number"
                          value={employerData.householdComposition.children}
                          onChange={(e) =>
                            setEmployerData({
                              ...employerData,
                              householdComposition: {
                                ...employerData.householdComposition,
                                children: Number.parseInt(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Infants</Label>
                        <Input
                          type="number"
                          value={employerData.householdComposition.infants}
                          onChange={(e) =>
                            setEmployerData({
                              ...employerData,
                              householdComposition: {
                                ...employerData.householdComposition,
                                infants: Number.parseInt(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Elders</Label>
                        <Input
                          type="number"
                          value={employerData.householdComposition.elders}
                          onChange={(e) =>
                            setEmployerData({
                              ...employerData,
                              householdComposition: {
                                ...employerData.householdComposition,
                                elders: Number.parseInt(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Household Size</p>
                        <p className="font-semibold">{employerData.householdSize} members</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Home Type</p>
                        <p className="font-semibold">{employerData.homeType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Adults</p>
                        <p className="font-semibold">{employerData.householdComposition.adults}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Children</p>
                        <p className="font-semibold">{employerData.householdComposition.children}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Infants</p>
                        <p className="font-semibold">{employerData.householdComposition.infants}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Elders</p>
                        <p className="font-semibold">{employerData.householdComposition.elders}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Service Requirements */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-blue-900">Service Requirements</CardTitle>
                    <Button onClick={() => setIsEditingServices(!isEditingServices)} variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      {isEditingServices ? "Done" : "Edit"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditingServices ? (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Current Requirements</Label>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {employerData.serviceRequirements.map((service, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-pink-50 text-pink-700 border-pink-200 flex items-center gap-1"
                            >
                              {service}
                              <X
                                className="w-3 h-3 cursor-pointer hover:text-red-600"
                                onClick={() => removeService(service)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">Available Services</Label>
                        <div className="flex flex-wrap gap-2">
                          {availableServices
                            .filter((service) => !employerData.serviceRequirements.includes(service))
                            .map((service, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="bg-gray-50 text-gray-700 border-gray-200 cursor-pointer hover:bg-pink-50 hover:text-pink-700 hover:border-pink-200"
                                onClick={() => addService(service)}
                              >
                                + {service}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {employerData.serviceRequirements.map((service, index) => (
                        <Badge key={index} variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Work Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-900">Work Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Working Hours</Label>
                        <Input
                          value={employerData.workingHours}
                          onChange={(e) => setEmployerData({ ...employerData, workingHours: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Preferred Start Date</Label>
                        <Input
                          type="date"
                          value={employerData.preferredStartDate}
                          onChange={(e) => setEmployerData({ ...employerData, preferredStartDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Budget Min ({employerData.budgetRange.currency})</Label>
                        <Input
                          type="number"
                          value={employerData.budgetRange.min}
                          onChange={(e) =>
                            setEmployerData({
                              ...employerData,
                              budgetRange: { ...employerData.budgetRange, min: Number.parseInt(e.target.value) },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Budget Max ({employerData.budgetRange.currency})</Label>
                        <Input
                          type="number"
                          value={employerData.budgetRange.max}
                          onChange={(e) =>
                            setEmployerData({
                              ...employerData,
                              budgetRange: { ...employerData.budgetRange, max: Number.parseInt(e.target.value) },
                            })
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Working Hours</p>
                        <p className="font-semibold">{employerData.workingHours}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Preferred Start Date</p>
                        <p className="font-semibold">{employerData.preferredStartDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Budget Range</p>
                        <p className="font-semibold">
                          {employerData.budgetRange.min} - {employerData.budgetRange.max}{" "}
                          {employerData.budgetRange.currency}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Documents Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-900">Required Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* National ID */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        National ID <span className="text-red-500">*</span>
                      </Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleDocumentUpload("nationalId", e.target.files?.[0] || null)}
                          className="hidden"
                          id="nationalId"
                        />
                        <label htmlFor="nationalId" className="cursor-pointer">
                          {documents.nationalId ? (
                            <div className="flex items-center justify-center gap-2 text-green-600">
                              <CheckCircle className="w-5 h-5" />
                              <span className="text-sm">{documents.nationalId.name}</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <FileText className="w-8 h-8 text-gray-400" />
                              <span className="text-sm text-gray-600">Upload Document</span>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Proof of Address */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Proof of Address <span className="text-red-500">*</span>
                      </Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleDocumentUpload("proofOfAddress", e.target.files?.[0] || null)}
                          className="hidden"
                          id="proofOfAddress"
                        />
                        <label htmlFor="proofOfAddress" className="cursor-pointer">
                          {documents.proofOfAddress ? (
                            <div className="flex items-center justify-center gap-2 text-green-600">
                              <CheckCircle className="w-5 h-5" />
                              <span className="text-sm">{documents.proofOfAddress.name}</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <Home className="w-8 h-8 text-gray-400" />
                              <span className="text-sm text-gray-600">Upload Document</span>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Employment Letter */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Employment Letter (Optional)</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleDocumentUpload("employmentLetter", e.target.files?.[0] || null)}
                          className="hidden"
                          id="employmentLetter"
                        />
                        <label htmlFor="employmentLetter" className="cursor-pointer">
                          {documents.employmentLetter ? (
                            <div className="flex items-center justify-center gap-2 text-green-600">
                              <CheckCircle className="w-5 h-5" />
                              <span className="text-sm">{documents.employmentLetter.name}</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <FileText className="w-8 h-8 text-gray-400" />
                              <span className="text-sm text-gray-600">Upload Document</span>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* E-Signature Section */}
                  <div className="mt-8 border-t pt-6">
                    <Label className="text-sm font-medium mb-4 block">
                      E-Signature <span className="text-red-500">*</span>
                    </Label>
                    <div className="border-2 border-gray-300 rounded-lg p-4">
                      <div className="mb-4">
                        <SignatureCanvas
                          ref={signatureRef}
                          canvasProps={{
                            width: 500,
                            height: 200,
                            className: "signature-canvas border rounded w-full bg-white",
                          }}
                          onEnd={() => setHasSignature(!signatureRef.current?.isEmpty())}
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
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-lg px-4 py-2">
                      <Users className="w-4 h-4 mr-1" />
                      Verified
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
