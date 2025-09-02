"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Building,
  PenTool,
} from "lucide-react"
import Link from "next/link"
// @ts-ignore
import SignatureCanvas from "react-signature-canvas"

interface Agency {
  agencyName: string
  agencyType: string
  website: string
  registrationNumber: string
  licenseNumber: string
  establishmentDate: string
  phoneNumber: string
  streetAddress: string
  city: string
  state: string
  country: string
  postalCode: string
  businessDescription: string
  yearsInBusiness: number
  numberOfEmployees: number
}

export default function AgencyProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const signatureRef = useRef<any>(null)
  const [hasSignature, setHasSignature] = useState(false)

  const [documents, setDocuments] = useState({
    businessLicense: null,
    registrationCertificate: null,
    insuranceCertificate: null,
    taxCertificate: null,
  })

  const [agencyData, setAgencyData] = useState<Agency>({
    agencyName: "CleanPro Services Agency",
    agencyType: "Domestic Services",
    website: "www.cleanpro-services.com",
    registrationNumber: "REG-2020-001234",
    licenseNumber: "LIC-DS-2020-5678",
    establishmentDate: "2020-01-15",
    phoneNumber: "+20 2 1234 5678",
    streetAddress: "123 Business District",
    city: "Cairo",
    state: "Cairo Governorate",
    country: "Egypt",
    postalCode: "11511",
    businessDescription:
      "Professional domestic services agency providing qualified housekeepers, nannies, and caregivers to families across Cairo and surrounding areas.",
    yearsInBusiness: 4,
    numberOfEmployees: 25,
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-6">
        <div className="mb-6">
          <Link href="/agency/dashboard">
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
                    <AvatarFallback className="text-3xl font-bold bg-blue-600 text-white">
                      {agencyData.agencyName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-blue-900 mb-2">{agencyData.agencyName}</h1>
                      <p className="text-xl text-pink-600 mb-4">{agencyData.agencyType}</p>
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
                      Verified Agency
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Business Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-900">Business Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label>Agency Name</Label>
                        <Input
                          value={agencyData.agencyName}
                          onChange={(e) => setAgencyData({ ...agencyData, agencyName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Agency Type</Label>
                        <Input
                          value={agencyData.agencyType}
                          onChange={(e) => setAgencyData({ ...agencyData, agencyType: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Website</Label>
                        <Input
                          value={agencyData.website}
                          onChange={(e) => setAgencyData({ ...agencyData, website: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Registration Number</Label>
                        <Input
                          value={agencyData.registrationNumber}
                          onChange={(e) => setAgencyData({ ...agencyData, registrationNumber: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>License Number</Label>
                        <Input
                          value={agencyData.licenseNumber}
                          onChange={(e) => setAgencyData({ ...agencyData, licenseNumber: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Establishment Date</Label>
                        <Input
                          type="date"
                          value={agencyData.establishmentDate}
                          onChange={(e) => setAgencyData({ ...agencyData, establishmentDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Phone Number</Label>
                        <Input
                          value={agencyData.phoneNumber}
                          onChange={(e) => setAgencyData({ ...agencyData, phoneNumber: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Years in Business</Label>
                        <Input
                          type="number"
                          value={agencyData.yearsInBusiness}
                          onChange={(e) =>
                            setAgencyData({ ...agencyData, yearsInBusiness: Number.parseInt(e.target.value) })
                          }
                        />
                      </div>
                      <div>
                        <Label>Number of Employees</Label>
                        <Input
                          type="number"
                          value={agencyData.numberOfEmployees}
                          onChange={(e) =>
                            setAgencyData({ ...agencyData, numberOfEmployees: Number.parseInt(e.target.value) })
                          }
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Business Description</Label>
                        <Textarea
                          value={agencyData.businessDescription}
                          onChange={(e) => setAgencyData({ ...agencyData, businessDescription: e.target.value })}
                          rows={4}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">Agency Name</p>
                        <p className="font-semibold">{agencyData.agencyName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Agency Type</p>
                        <p className="font-semibold">{agencyData.agencyType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Website</p>
                        <p className="font-semibold">{agencyData.website}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Registration Number</p>
                        <p className="font-semibold">{agencyData.registrationNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">License Number</p>
                        <p className="font-semibold">{agencyData.licenseNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Establishment Date</p>
                        <p className="font-semibold">{agencyData.establishmentDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="font-semibold">{agencyData.phoneNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Years in Business</p>
                        <p className="font-semibold">{agencyData.yearsInBusiness} years</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Number of Employees</p>
                        <p className="font-semibold">{agencyData.numberOfEmployees} employees</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">Business Description</p>
                        <p className="font-semibold">{agencyData.businessDescription}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-900">Address Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label>Street Address</Label>
                        <Input
                          value={agencyData.streetAddress}
                          onChange={(e) => setAgencyData({ ...agencyData, streetAddress: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>City</Label>
                        <Input
                          value={agencyData.city}
                          onChange={(e) => setAgencyData({ ...agencyData, city: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>State</Label>
                        <Input
                          value={agencyData.state}
                          onChange={(e) => setAgencyData({ ...agencyData, state: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Country</Label>
                        <Input
                          value={agencyData.country}
                          onChange={(e) => setAgencyData({ ...agencyData, country: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Postal Code</Label>
                        <Input
                          value={agencyData.postalCode}
                          onChange={(e) => setAgencyData({ ...agencyData, postalCode: e.target.value })}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">Street Address</p>
                        <p className="font-semibold">{agencyData.streetAddress}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">City</p>
                        <p className="font-semibold">{agencyData.city}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">State</p>
                        <p className="font-semibold">{agencyData.state}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Country</p>
                        <p className="font-semibold">{agencyData.country}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Postal Code</p>
                        <p className="font-semibold">{agencyData.postalCode}</p>
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
                    {/* Business License */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Business License <span className="text-red-500">*</span>
                      </Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleDocumentUpload("businessLicense", e.target.files?.[0] || null)}
                          className="hidden"
                          id="businessLicense"
                        />
                        <label htmlFor="businessLicense" className="cursor-pointer">
                          {documents.businessLicense ? (
                            <div className="flex items-center justify-center gap-2 text-green-600">
                              <CheckCircle className="w-5 h-5" />
                              <span className="text-sm">{documents.businessLicense.name}</span>
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

                    {/* Registration Certificate */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Registration Certificate <span className="text-red-500">*</span>
                      </Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleDocumentUpload("registrationCertificate", e.target.files?.[0] || null)}
                          className="hidden"
                          id="registrationCertificate"
                        />
                        <label htmlFor="registrationCertificate" className="cursor-pointer">
                          {documents.registrationCertificate ? (
                            <div className="flex items-center justify-center gap-2 text-green-600">
                              <CheckCircle className="w-5 h-5" />
                              <span className="text-sm">{documents.registrationCertificate.name}</span>
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

                    {/* Insurance Certificate */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Insurance Certificate (Optional)</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleDocumentUpload("insuranceCertificate", e.target.files?.[0] || null)}
                          className="hidden"
                          id="insuranceCertificate"
                        />
                        <label htmlFor="insuranceCertificate" className="cursor-pointer">
                          {documents.insuranceCertificate ? (
                            <div className="flex items-center justify-center gap-2 text-green-600">
                              <CheckCircle className="w-5 h-5" />
                              <span className="text-sm">{documents.insuranceCertificate.name}</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <Shield className="w-8 h-8 text-gray-400" />
                              <span className="text-sm text-gray-600">Upload Document</span>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Tax Certificate */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Tax Certificate (Optional)</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleDocumentUpload("taxCertificate", e.target.files?.[0] || null)}
                          className="hidden"
                          id="taxCertificate"
                        />
                        <label htmlFor="taxCertificate" className="cursor-pointer">
                          {documents.taxCertificate ? (
                            <div className="flex items-center justify-center gap-2 text-green-600">
                              <CheckCircle className="w-5 h-5" />
                              <span className="text-sm">{documents.taxCertificate.name}</span>
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
                  <CardTitle className="text-blue-900">Agency Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-lg px-4 py-2">
                      <Building className="w-4 h-4 mr-1" />
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
