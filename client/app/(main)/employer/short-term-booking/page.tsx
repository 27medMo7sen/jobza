"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, ArrowRight, Home, Users, Clock, CheckCircle,
  Building2, FileText, AlertTriangle, MapPin, Calendar, DollarSign, Star, Eye
} from "lucide-react"
import Link from "next/link"

export default function ShortTermBookingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    serviceType: "",
    location: "",
    date: "",
    time: "",
    duration: "",
    budget: "",
    numberOfWorkers: 1,
    description: "",
    requirements: [],
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    preferredLanguage: "",
    specialInstructions: ""
  })

  const totalSteps = 5

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleRequirementChange = (requirement: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      requirements: checked 
        ? [...prev.requirements, requirement]
        : prev.requirements.filter(r => r !== requirement)
    }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    console.log("Submitting short-term booking:", formData)
    // TODO: Implement submission logic
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Details</h2>
        <p className="text-gray-600">Tell us about the service you need</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="serviceType">Service Type *</Label>
          <Select value={formData.serviceType} onValueChange={(value) => handleInputChange("serviceType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="house-cleaning">House Cleaning</SelectItem>
              <SelectItem value="deep-cleaning">Deep Cleaning</SelectItem>
              <SelectItem value="laundry-ironing">Laundry & Ironing</SelectItem>
              <SelectItem value="garden-maintenance">Garden Maintenance</SelectItem>
              <SelectItem value="pet-care">Pet Care</SelectItem>
              <SelectItem value="babysitting">Babysitting</SelectItem>
              <SelectItem value="elder-care">Elder Care</SelectItem>
              <SelectItem value="cooking-meal-prep">Cooking & Meal Prep</SelectItem>
              <SelectItem value="organization">Home Organization</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="location"
              placeholder="Enter your address or area"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Preferred Date *</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Preferred Time *</Label>
          <Select value={formData.time} onValueChange={(value) => handleInputChange("time", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning (8 AM - 12 PM)</SelectItem>
              <SelectItem value="afternoon">Afternoon (12 PM - 4 PM)</SelectItem>
              <SelectItem value="evening">Evening (4 PM - 8 PM)</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration *</Label>
          <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2-hours">2 Hours</SelectItem>
              <SelectItem value="4-hours">4 Hours</SelectItem>
              <SelectItem value="6-hours">6 Hours</SelectItem>
              <SelectItem value="8-hours">8 Hours</SelectItem>
              <SelectItem value="full-day">Full Day</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget">Budget Range *</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Select value={formData.budget} onValueChange={(value) => handleInputChange("budget", value)}>
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50-100">EGP 50 - 100</SelectItem>
                <SelectItem value="100-200">EGP 100 - 200</SelectItem>
                <SelectItem value="200-300">EGP 200 - 300</SelectItem>
                <SelectItem value="300-500">EGP 300 - 500</SelectItem>
                <SelectItem value="500+">EGP 500+</SelectItem>
                <SelectItem value="negotiable">Negotiable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="numberOfWorkers">Number of Workers Needed *</Label>
          <Select value={formData.numberOfWorkers.toString()} onValueChange={(value) => handleInputChange("numberOfWorkers", parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Select number of workers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Worker</SelectItem>
              <SelectItem value="2">2 Workers</SelectItem>
              <SelectItem value="3">3 Workers</SelectItem>
              <SelectItem value="4">4 Workers</SelectItem>
              <SelectItem value="5+">5+ Workers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Service Description *</Label>
        <textarea
          id="description"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Please describe the specific service you need, including any special requirements or preferences..."
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Requirements & Preferences</h2>
        <p className="text-gray-600">Specify your requirements and preferences</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-base font-medium">Worker Requirements</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="experience"
                checked={formData.requirements.includes("experience")}
                onCheckedChange={(checked) => handleRequirementChange("experience", checked as boolean)}
              />
              <Label htmlFor="experience">Minimum 2 years experience</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="references"
                checked={formData.requirements.includes("references")}
                onCheckedChange={(checked) => handleRequirementChange("references", checked as boolean)}
              />
              <Label htmlFor="references">References required</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="background-check"
                checked={formData.requirements.includes("background-check")}
                onCheckedChange={(checked) => handleRequirementChange("background-check", checked as boolean)}
              />
              <Label htmlFor="background-check">Background check</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="own-supplies"
                checked={formData.requirements.includes("own-supplies")}
                onCheckedChange={(checked) => handleRequirementChange("own-supplies", checked as boolean)}
              />
              <Label htmlFor="own-supplies">Own supplies/tools</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="vehicle"
                checked={formData.requirements.includes("vehicle")}
                onCheckedChange={(checked) => handleRequirementChange("vehicle", checked as boolean)}
              />
              <Label htmlFor="vehicle">Own vehicle</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="flexible-schedule"
                checked={formData.requirements.includes("flexible-schedule")}
                onCheckedChange={(checked) => handleRequirementChange("flexible-schedule", checked as boolean)}
              />
              <Label htmlFor="flexible-schedule">Flexible schedule</Label>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="preferredLanguage">Preferred Language</Label>
          <Select value={formData.preferredLanguage} onValueChange={(value) => handleInputChange("preferredLanguage", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select preferred language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="arabic">Arabic</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="french">French</SelectItem>
              <SelectItem value="german">German</SelectItem>
              <SelectItem value="any">Any language</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialInstructions">Special Instructions</Label>
          <textarea
            id="specialInstructions"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any special instructions, allergies, pet information, or other important details..."
            value={formData.specialInstructions}
            onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
          />
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
        <p className="text-gray-600">How should workers contact you?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="contactName">Contact Name *</Label>
          <Input
            id="contactName"
            placeholder="Your full name"
            value={formData.contactName}
            onChange={(e) => handleInputChange("contactName", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPhone">Phone Number *</Label>
          <Input
            id="contactPhone"
            type="tel"
            placeholder="Your phone number"
            value={formData.contactPhone}
            onChange={(e) => handleInputChange("contactPhone", e.target.value)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="contactEmail">Email Address</Label>
          <Input
            id="contactEmail"
            type="email"
            placeholder="Your email address (optional)"
            value={formData.contactEmail}
            onChange={(e) => handleInputChange("contactEmail", e.target.value)}
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Privacy Notice</h4>
            <p className="text-sm text-blue-700 mt-1">
              Your contact information will only be shared with workers who apply for your job. 
              We never share your personal details with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
        <p className="text-gray-600">Review your booking details before submitting</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-pink-600" />
              Service Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-600">Service Type:</span>
                <p className="text-gray-900">{formData.serviceType || "Not specified"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Location:</span>
                <p className="text-gray-900">{formData.location || "Not specified"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Date:</span>
                <p className="text-gray-900">{formData.date || "Not specified"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Time:</span>
                <p className="text-gray-900">{formData.time || "Not specified"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Duration:</span>
                <p className="text-gray-900">{formData.duration || "Not specified"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Budget:</span>
                <p className="text-gray-900">{formData.budget || "Not specified"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Workers Needed:</span>
                <p className="text-gray-900">{formData.numberOfWorkers} {formData.numberOfWorkers === 1 ? 'Worker' : 'Workers'}</p>
              </div>
            </div>
            {formData.description && (
              <div>
                <span className="font-medium text-gray-600">Description:</span>
                <p className="text-gray-900 mt-1">{formData.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Requirements & Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            {formData.requirements.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.requirements.map((req, index) => (
                  <Badge key={index} variant="secondary">{req}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No specific requirements selected</p>
            )}
            {formData.preferredLanguage && (
              <div className="mt-3">
                <span className="font-medium text-gray-600">Preferred Language:</span>
                <p className="text-gray-900">{formData.preferredLanguage}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><span className="font-medium text-gray-600">Name:</span> {formData.contactName || "Not specified"}</p>
            <p><span className="font-medium text-gray-600">Phone:</span> {formData.contactPhone || "Not specified"}</p>
            {formData.contactEmail && (
              <p><span className="font-medium text-gray-600">Email:</span> {formData.contactEmail}</p>
            )}
          </CardContent>
        </Card>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900">Ready to Submit!</h4>
              <p className="text-sm text-green-700 mt-1">
                Your short-term booking request will be sent to available workers and agencies. 
                You'll receive applications within 24-48 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {formData.numberOfWorkers === 1 ? 'Choose Your Worker' : 'Choose Your Service Agency'}
        </h2>
        <p className="text-gray-600">
          {formData.numberOfWorkers === 1 
            ? 'Browse and select from available workers who match your requirements'
            : 'Select a service agency to handle your multi-worker request'
          }
        </p>
      </div>

      {formData.numberOfWorkers === 1 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-pink-600" />
              Available Workers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">
                Based on your requirements, here are workers who match your criteria:
              </p>
              
              {/* Mock worker data - in real app, this would be filtered by requirements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Sarah Johnson</h4>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm">4.8 (127 reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Experience:</span> 5 years</p>
                    <p><span className="font-medium">Specialties:</span> House Cleaning, Laundry</p>
                    <p><span className="font-medium">Rate:</span> EGP 45-60/hour</p>
                  </div>
                  <Button className="w-full mt-3" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Profile & Select
                  </Button>
                </div>

                <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Fatima Ali</h4>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm">4.9 (89 reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Experience:</span> 7 years</p>
                    <p><span className="font-medium">Specialties:</span> Deep Cleaning, Organization</p>
                    <p><span className="font-medium">Rate:</span> EGP 50-70/hour</p>
                  </div>
                  <Button className="w-full mt-3" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Profile & Select
                  </Button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button asChild size="lg" className="bg-pink-600 hover:bg-pink-700">
                  <Link href="/employer/browse-workers">
                    <Users className="mr-2 h-4 w-4" />
                    Browse All Available Workers
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Service Agencies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">
                For {formData.numberOfWorkers} workers, we recommend working with a service agency:
              </p>
              
              {/* Mock agency data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Premium Home Services</h4>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm">4.8 (156 reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Workers Available:</span> 25+</p>
                    <p><span className="font-medium">Services:</span> All domestic services</p>
                    <p><span className="font-medium">Response Time:</span> Within 2 hours</p>
                  </div>
                  <Button className="w-full mt-3" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Agency & Select
                  </Button>
                </div>

                <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Elite Care Agency</h4>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm">4.9 (203 reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Workers Available:</span> 18+</p>
                    <p><span className="font-medium">Services:</span> Specialized care services</p>
                    <p><span className="font-medium">Response Time:</span> Within 1 hour</p>
                  </div>
                  <Button className="w-full mt-3" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Agency & Select
                  </Button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/employer/select-agencies">
                    <Building2 className="mr-2 h-4 w-4" />
                    Browse All Service Agencies
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      case 4:
        return renderStep4()
      case 5:
        return renderStep5()
      default:
        return renderStep1()
    }
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
            <div className="flex items-center space-x-2">
              <Home className="w-5 h-5 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900">Short-term Booking</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {renderCurrentStep()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex items-center gap-3">
              {currentStep < totalSteps ? (
                <Button onClick={nextStep} className="flex items-center gap-2">
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4" />
                  Submit Booking Request
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
