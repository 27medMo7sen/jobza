"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, MapPin, Calendar, Home, CheckCircle } from "lucide-react"

interface ShortTermJobModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShortTermJobModal({ open, onOpenChange }: ShortTermJobModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    jobType: "",
    serviceLevel: "",
    city: "",
    startDate: "",
    endDate: "",
    bedrooms: "",
    bathrooms: "",
    areas: [] as string[],
    tasks: [] as string[],
    deepCleaning: [] as string[],
    houseSize: "",
    workerSelection: "",
    selectedAgencies: [] as string[],
  })

  const totalSteps = 7

  const jobTypes = [
    { value: "maid", label: "Maid" },
    { value: "nanny", label: "Nanny" },
    { value: "caregiver", label: "Caregiver" },
  ]

  const serviceLevels = [
    { value: "standard", label: "Standard" },
    { value: "premium", label: "Premium" },
    { value: "deep-cleaning", label: "Deep Cleaning" },
  ]

  const cities = [
    { value: "cairo", label: "Cairo" },
    { value: "alexandria", label: "Alexandria" },
    { value: "giza", label: "Giza" },
  ]

  const areas = ["Kitchen", "Living Room", "Reception", "Gym", "Balcony", "Garden"]

  const getTasksByJobType = () => {
    switch (formData.jobType) {
      case "maid":
        return ["Laundry", "Ironing", "Bedrooms", "Bathrooms", "Kitchen Cleaning", "Dusting"]
      case "nanny":
        return ["Meal Planning", "Grocery Shopping", "Cooking", "Childcare", "Educational Activities", "Playtime"]
      case "caregiver":
        return [
          "Personal Assistance",
          "Meal Preparation",
          "Medication Reminders",
          "Companionship",
          "Light Housekeeping",
        ]
      default:
        return []
    }
  }

  const deepCleaningOptions = [
    "Oven",
    "Refrigerator",
    "Toilet/Bathroom",
    "Living Area",
    "Kitchen",
    "Bedrooms",
    "Whole House",
  ]

  const houseSizes = [
    { value: "small-apartment", label: "Small Apartment" },
    { value: "medium-apartment", label: "Medium Apartment" },
    { value: "large-house", label: "Large House" },
    { value: "mansion", label: "Mansion" },
  ]

  const serviceAgencies = [
    { id: 1, name: "Quick Clean Services", rating: 4.7, workers: 15 },
    { id: 2, name: "Trusted Helpers", rating: 4.8, workers: 22 },
    { id: 3, name: "Home Care Express", rating: 4.6, workers: 18 },
  ]

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    console.log("Short-term job form submitted:", formData)
    onOpenChange(false)
    setCurrentStep(1)
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleArrayItem = (field: string, item: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(item)
        ? (prev[field as keyof typeof prev] as string[]).filter((i) => i !== item)
        : [...(prev[field as keyof typeof prev] as string[]), item],
    }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Home className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Job Type Selection</h3>
              <p className="text-gray-600">Choose the type of worker you need</p>
            </div>
            <div className="space-y-4">
              <Label>Worker Role</Label>
              <Select value={formData.jobType} onValueChange={(value) => updateFormData("jobType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select worker type" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <Label>Service Level</Label>
              <Select value={formData.serviceLevel} onValueChange={(value) => updateFormData("serviceLevel", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service level" />
                </SelectTrigger>
                <SelectContent>
                  {serviceLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Calendar className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Location & Schedule</h3>
              <p className="text-gray-600">Set your location and timing preferences</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Select value={formData.city} onValueChange={(value) => updateFormData("city", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.value} value={city.value}>
                        {city.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateFormData("startDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date (Optional)</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => updateFormData("endDate", e.target.value)}
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Home className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Property Details</h3>
              <p className="text-gray-600">Tell us about your property</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Number of Bedrooms</Label>
                <Select value={formData.bedrooms} onValueChange={(value) => updateFormData("bedrooms", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bedrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}+ Bedroom{num > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Number of Bathrooms</Label>
                <Select value={formData.bathrooms} onValueChange={(value) => updateFormData("bathrooms", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bathrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}+ Bathroom{num > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <Label>Areas to Clean</Label>
              <div className="grid grid-cols-2 gap-2">
                {areas.map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      id={area}
                      checked={formData.areas.includes(area)}
                      onCheckedChange={() => toggleArrayItem("areas", area)}
                    />
                    <Label htmlFor={area} className="text-sm">
                      {area}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Task Selection</h3>
              <p className="text-gray-600">Choose specific tasks for your {formData.jobType}</p>
            </div>
            <div className="space-y-4">
              <Label>Required Tasks</Label>
              <div className="grid grid-cols-1 gap-2">
                {getTasksByJobType().map((task) => (
                  <div key={task} className="flex items-center space-x-2">
                    <Checkbox
                      id={task}
                      checked={formData.tasks.includes(task)}
                      onCheckedChange={() => toggleArrayItem("tasks", task)}
                    />
                    <Label htmlFor={task} className="text-sm">
                      {task}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 5:
        return formData.serviceLevel === "deep-cleaning" ? (
          <div className="space-y-6">
            <div className="text-center">
              <Home className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Deep Cleaning Options</h3>
              <p className="text-gray-600">Select areas for deep cleaning</p>
            </div>
            <div className="space-y-4">
              <Label>Deep Cleaning Areas</Label>
              <div className="grid grid-cols-2 gap-2">
                {deepCleaningOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={formData.deepCleaning.includes(option)}
                      onCheckedChange={() => toggleArrayItem("deepCleaning", option)}
                    />
                    <Label htmlFor={option} className="text-sm">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Label>House Size</Label>
              <Select value={formData.houseSize} onValueChange={(value) => updateFormData("houseSize", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select house size" />
                </SelectTrigger>
                <SelectContent>
                  {houseSizes.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Step Complete</h3>
              <p className="text-gray-600">Deep cleaning options not needed for {formData.serviceLevel} service</p>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <MapPin className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Worker Selection</h3>
              <p className="text-gray-600">Choose how to find workers</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <Card
                  className={`cursor-pointer border-2 ${formData.workerSelection === "browse" ? "border-blue-500" : "border-gray-200"}`}
                  onClick={() => updateFormData("workerSelection", "browse")}
                >
                  <CardContent className="p-4">
                    <h4 className="font-semibold">Browse Available Workers</h4>
                    <p className="text-sm text-gray-600">Choose from individual freelancer workers</p>
                  </CardContent>
                </Card>
                <Card
                  className={`cursor-pointer border-2 ${formData.workerSelection === "agency" ? "border-blue-500" : "border-gray-200"}`}
                  onClick={() => updateFormData("workerSelection", "agency")}
                >
                  <CardContent className="p-4">
                    <h4 className="font-semibold">Select Service Agencies</h4>
                    <p className="text-sm text-gray-600">Send request to multiple agencies</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            {formData.workerSelection === "agency" && (
              <div className="space-y-4">
                <Label>Select Service Agencies</Label>
                <div className="space-y-2">
                  {serviceAgencies.map((agency) => (
                    <div key={agency.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={`agency-${agency.id}`}
                          checked={formData.selectedAgencies.includes(agency.id.toString())}
                          onCheckedChange={() => toggleArrayItem("selectedAgencies", agency.id.toString())}
                        />
                        <div>
                          <p className="font-medium">{agency.name}</p>
                          <p className="text-sm text-gray-600">
                            Rating: {agency.rating}/5 • {agency.workers} workers
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">Service Agency</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Summary & Confirmation</h3>
              <p className="text-gray-600">Review your job posting details</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Job Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Job Type:</p>
                    <p className="text-gray-600 capitalize">{formData.jobType}</p>
                  </div>
                  <div>
                    <p className="font-medium">Service Level:</p>
                    <p className="text-gray-600 capitalize">{formData.serviceLevel}</p>
                  </div>
                  <div>
                    <p className="font-medium">Location:</p>
                    <p className="text-gray-600 capitalize">{formData.city}</p>
                  </div>
                  <div>
                    <p className="font-medium">Start Date:</p>
                    <p className="text-gray-600">{formData.startDate}</p>
                  </div>
                  <div>
                    <p className="font-medium">Property:</p>
                    <p className="text-gray-600">
                      {formData.bedrooms} bed, {formData.bathrooms} bath
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Worker Selection:</p>
                    <p className="text-gray-600 capitalize">{formData.workerSelection}</p>
                  </div>
                </div>
                {formData.areas.length > 0 && (
                  <div>
                    <p className="font-medium">Areas to Clean:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.areas.map((area) => (
                        <Badge key={area} variant="secondary" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {formData.tasks.length > 0 && (
                  <div>
                    <p className="font-medium">Required Tasks:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.tasks.map((task) => (
                        <Badge key={task} variant="secondary" className="text-xs">
                          {task}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Short-term Job</DialogTitle>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </div>
            <div className="flex space-x-1">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${i + 1 <= currentStep ? "bg-blue-500" : "bg-gray-300"}`}
                />
              ))}
            </div>
          </div>
        </DialogHeader>

        <div className="py-6">{renderStep()}</div>

        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep === totalSteps ? (
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              Submit Job Posting
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
