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
  ArrowLeft, 
  ArrowRight, 
  Home, 
  Users, 
  Clock, 
  CheckCircle,
  Building2,
  FileText,
  Crown,
  AlertTriangle
} from "lucide-react"
import Link from "next/link"

export default function LongTermBookingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    primaryRole: "",
    adults: 2,
    children03: 1,
    children47: 1,
    children814: 0,
    bedrooms: 3,
    bathrooms: 2,
    kitchens: 1,
    additionalRooms: 2,
    cooking: false,
    laundry: false,
    grocery: false,
    petCare: false,
    otherTask: false,
    otherTaskText: "",
    mobility: false,
    personalCare: false,
    standbyHours: 3,
    livingArrangement: "",
    workCycle: "",
    roomType: "Private Room",
    paymentCycle: "Monthly",
    mealPlan: "1-1-1 (Breakfast, Lunch, Dinner)",
    feedingAllowance: "",
    wifi: false,
    ac: false,
    tv: false,
    laundryAmenity: false,
    heater: false,
    privateBathroom: false,
    transportAllowance: "",
    externalLodge: "No",
    accommodationAllowance: "",
    startDate: "",
    bookingType: "instant"
  })

  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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

  const calculateWorkload = () => {
    // Simplified workload calculation
    let baseHours = 8
    if (formData.primaryRole === "nanny") baseHours = 10
    if (formData.primaryRole === "caregiver") baseHours = 10
    
    let adjustments = 0
    if (formData.adults > 2) adjustments += (formData.adults - 2) * 0.8
    if (formData.children03 + formData.children47 + formData.children814 > 0) {
      adjustments += (formData.children03 + formData.children47 + formData.children814) * 1.2
    }
    if (formData.cooking) adjustments += 0.8
    if (formData.laundry) adjustments += 0.6
    if (formData.grocery) adjustments += 0.4
    if (formData.petCare) adjustments += 0.5
    if (formData.otherTask) adjustments += 0.7
    if (formData.mobility) adjustments += 1.5
    if (formData.personalCare) adjustments += 2.0
    
    return (baseHours + adjustments).toFixed(1)
  }

  const calculateSalary = () => {
    const workload = parseFloat(calculateWorkload())
    const baseRate = 8000 // EGP 8,000 base monthly
    const workDays = 26
    const hourlyRate = baseRate / (workDays * 8)
    const monthlySalary = workload * hourlyRate * workDays
    
    return {
      min: Math.round(monthlySalary),
      max: Math.round(monthlySalary * 1.25)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex justify-between items-center mb-8">
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
            step < currentStep 
              ? "bg-green-500 text-white" 
              : step === currentStep 
                ? "bg-blue-600 text-white" 
                : "bg-gray-200 text-gray-600"
          }`}>
            {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
          </div>
          <span className="text-xs mt-2 text-gray-600">
            {step === 1 && "Job Details"}
            {step === 2 && "Living Conditions"}
            {step === 3 && "Agency Assignment"}
            {step === 4 && "Review & Pay"}
            {step === 5 && "Confirmation"}
          </span>
        </div>
      ))}
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Job & Household Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Primary Role</Label>
                  <Select value={formData.primaryRole} onValueChange={(value) => handleInputChange("primaryRole", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Primary Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maid">Maid / Housekeeper</SelectItem>
                      <SelectItem value="nanny">Nanny / Child Care</SelectItem>
                      <SelectItem value="caregiver">Adult Caregiver</SelectItem>
                      <SelectItem value="combined">Combined Role</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Standby Hours (per day)</Label>
                  <Select value={formData.standbyHours.toString()} onValueChange={(value) => handleInputChange("standbyHours", parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="2">2 hours</SelectItem>
                      <SelectItem value="3">3 hours</SelectItem>
                      <SelectItem value="4">4 hours</SelectItem>
                      <SelectItem value="5">5 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Household Composition</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Adults (15+)</Label>
                    <Input 
                      type="number" 
                      value={formData.adults} 
                      onChange={(e) => handleInputChange("adults", parseInt(e.target.value))}
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Children (0-3 yrs)</Label>
                    <Input 
                      type="number" 
                      value={formData.children03} 
                      onChange={(e) => handleInputChange("children03", parseInt(e.target.value))}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Children (4-7 yrs)</Label>
                    <Input 
                      type="number" 
                      value={formData.children47} 
                      onChange={(e) => handleInputChange("children47", parseInt(e.target.value))}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Children (8-14 yrs)</Label>
                    <Input 
                      type="number" 
                      value={formData.children814} 
                      onChange={(e) => handleInputChange("children814", parseInt(e.target.value))}
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Home Details</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Bedrooms</Label>
                    <Input 
                      type="number" 
                      value={formData.bedrooms} 
                      onChange={(e) => handleInputChange("bedrooms", parseInt(e.target.value))}
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Bathrooms</Label>
                    <Input 
                      type="number" 
                      value={formData.bathrooms} 
                      onChange={(e) => handleInputChange("bathrooms", parseInt(e.target.value))}
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Kitchens</Label>
                    <Input 
                      type="number" 
                      value={formData.kitchens} 
                      onChange={(e) => handleInputChange("kitchens", parseInt(e.target.value))}
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Additional Rooms</Label>
                    <Input 
                      type="number" 
                      value={formData.additionalRooms} 
                      onChange={(e) => handleInputChange("additionalRooms", parseInt(e.target.value))}
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Additional Tasks</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="cooking" 
                      checked={formData.cooking}
                      onCheckedChange={(checked) => handleInputChange("cooking", checked)}
                    />
                    <Label htmlFor="cooking">Cooking</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="laundry" 
                      checked={formData.laundry}
                      onCheckedChange={(checked) => handleInputChange("laundry", checked)}
                    />
                    <Label htmlFor="laundry">Laundry</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="grocery" 
                      checked={formData.grocery}
                      onCheckedChange={(checked) => handleInputChange("grocery", checked)}
                    />
                    <Label htmlFor="grocery">Grocery Shopping</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="petCare" 
                      checked={formData.petCare}
                      onCheckedChange={(checked) => handleInputChange("petCare", checked)}
                    />
                    <Label htmlFor="petCare">Pet Care</Label>
                  </div>
                </div>
              </div>

              {(formData.primaryRole === "caregiver" || formData.primaryRole === "combined") && (
                <div className="space-y-4">
                  <Label>Care Needs</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="mobility" 
                        checked={formData.mobility}
                        onCheckedChange={(checked) => handleInputChange("mobility", checked)}
                      />
                      <Label htmlFor="mobility">Mobility assistance required</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="personalCare" 
                        checked={formData.personalCare}
                        onCheckedChange={(checked) => handleInputChange("personalCare", checked)}
                      />
                      <Label htmlFor="personalCare">Personal/private care required</Label>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Living Conditions & Accommodation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>Living Arrangement</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:border-blue-500" 
                         onClick={() => handleInputChange("livingArrangement", "live-in")}>
                      <input 
                        type="radio" 
                        name="livingArrangement" 
                        checked={formData.livingArrangement === "live-in"}
                        readOnly
                      />
                      <div>
                        <p className="font-medium">Live-in</p>
                        <p className="text-sm text-gray-600">Worker stays at employer's home</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:border-blue-500"
                         onClick={() => handleInputChange("livingArrangement", "live-out")}>
                      <input 
                        type="radio" 
                        name="livingArrangement" 
                        checked={formData.livingArrangement === "live-out"}
                        readOnly
                      />
                      <div>
                        <p className="font-medium">Live-out</p>
                        <p className="text-sm text-gray-600">Worker commutes daily</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Work Cycle</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:border-blue-500"
                         onClick={() => handleInputChange("workCycle", "6+1")}>
                      <input 
                        type="radio" 
                        name="workCycle" 
                        checked={formData.workCycle === "6+1"}
                        readOnly
                      />
                      <div>
                        <p className="font-medium">6+1</p>
                        <p className="text-sm text-gray-600">6 days work + 1 day off</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:border-blue-500"
                         onClick={() => handleInputChange("workCycle", "13+2")}>
                      <input 
                        type="radio" 
                        name="workCycle" 
                        checked={formData.workCycle === "13+2"}
                        readOnly
                      />
                      <div>
                        <p className="font-medium">13+2</p>
                        <p className="text-sm text-gray-600">13 days work + 2 days off</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:border-blue-500"
                         onClick={() => handleInputChange("workCycle", "26+4")}>
                      <input 
                        type="radio" 
                        name="workCycle" 
                        checked={formData.workCycle === "26+4"}
                        readOnly
                      />
                      <div>
                        <p className="font-medium">26+4</p>
                        <p className="text-sm text-gray-600">26 days work + 4 days off</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {formData.livingArrangement === "live-in" && (
                <div className="space-y-4">
                  <Label>Live-in Specific Details</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Room Type</Label>
                      <Select value={formData.roomType} onValueChange={(value) => handleInputChange("roomType", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Private Room">Private Room</SelectItem>
                          <SelectItem value="Shared Room">Shared Room</SelectItem>
                          <SelectItem value="Converted Space">Converted Space</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Cycle</Label>
                      <Select value={formData.paymentCycle} onValueChange={(value) => handleInputChange("paymentCycle", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Weekly">Weekly</SelectItem>
                          <SelectItem value="Biweekly">Biweekly</SelectItem>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Meal Plan</Label>
                      <Select value={formData.mealPlan} onValueChange={(value) => handleInputChange("mealPlan", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-1-1 (Breakfast, Lunch, Dinner)">1-1-1 (Breakfast, Lunch, Dinner)</SelectItem>
                          <SelectItem value="1-0-1 (Breakfast and Dinner)">1-0-1 (Breakfast and Dinner)</SelectItem>
                          <SelectItem value="0-0-1 (Dinner only)">0-0-1 (Dinner only)</SelectItem>
                          <SelectItem value="No meals provided">No meals provided</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Feeding Allowance (Optional)</Label>
                      <Input 
                        placeholder="e.g., EGP 500/month for groceries"
                        value={formData.feedingAllowance}
                        onChange={(e) => handleInputChange("feedingAllowance", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.livingArrangement === "live-out" && (
                <div className="space-y-4">
                  <Label>Live-out Specific Details</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Transport Allowance</Label>
                      <Input 
                        placeholder="e.g., EGP 300/month"
                        value={formData.transportAllowance}
                        onChange={(e) => handleInputChange("transportAllowance", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>External Lodge Provided</Label>
                      <Select value={formData.externalLodge} onValueChange={(value) => handleInputChange("externalLodge", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="No">No</SelectItem>
                          <SelectItem value="Yes">Yes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Agency Assignment & Processing Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Primary Agency</Label>
                <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">BrightHands Agency</h3>
                      <p className="text-sm text-gray-600">Auto-assigned from referral</p>
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm ml-1">4.8 (127 reviews)</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-gray-600">Downtown, Cairo</span>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Assigned</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Booking Type & Fulfillment Timeline</Label>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start space-x-3">
                      <input 
                        type="radio" 
                        name="bookingType" 
                        checked={formData.bookingType === "instant"}
                        onChange={() => handleInputChange("bookingType", "instant")}
                      />
                      <div>
                        <h4 className="font-medium">Instant Booking (Start Date: Today)</h4>
                        <p className="text-sm text-gray-600">Primary agency has 72 hours to fulfill placement</p>
                        <p className="text-sm text-yellow-600 mt-1">⚠️ If not fulfilled, fallback agencies will be contacted</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start space-x-3">
                      <input 
                        type="radio" 
                        name="bookingType" 
                        checked={formData.bookingType === "future"}
                        onChange={() => handleInputChange("bookingType", "future")}
                      />
                      <div>
                        <h4 className="font-medium">Future Date Booking</h4>
                        <p className="text-sm text-gray-600">Specify start date for fulfillment</p>
                        <Input 
                          type="date" 
                          className="mt-2"
                          value={formData.startDate}
                          onChange={(e) => handleInputChange("startDate", e.target.value)}
                        />
                        <p className="text-sm text-yellow-600 mt-1">⚠️ Agency has 48 hours from booking submission to fulfill</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Processing Timeline</Label>
                <div className="border rounded-lg p-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs mt-1">
                        ✓
                      </div>
                      <div>
                        <h5 className="font-medium">Booking Submitted</h5>
                        <p className="text-sm text-gray-600">Your booking request has been submitted to BrightHands Agency</p>
                        <p className="text-sm text-gray-500 mt-1">Today, 10:30 AM</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mt-1">
                        <Clock className="w-3 h-3" />
                      </div>
                      <div>
                        <h5 className="font-medium">Agency Processing</h5>
                        <p className="text-sm text-gray-600">BrightHands Agency has 72 hours to fulfill your request</p>
                        <p className="text-sm text-yellow-600 mt-1">Deadline: Oct 15, 2023, 10:30 AM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Review & Submit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg p-5">
                <h3 className="font-bold mb-4">Booking Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-xs">Primary Role</p>
                    <p className="font-medium">{formData.primaryRole || "Not selected"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs">Household Composition</p>
                    <p className="font-medium">{formData.adults} Adults, {formData.children03 + formData.children47 + formData.children814} Children</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs">Home Details</p>
                    <p className="font-medium">{formData.bedrooms} Bedrooms, {formData.bathrooms} Bathrooms</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs">Estimated Workload</p>
                    <p className="font-medium">{calculateWorkload()} hours/day</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs">Estimated Salary</p>
                    <p className="font-medium">EGP {calculateSalary().min} – EGP {calculateSalary().max}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs">Living Arrangement</p>
                    <p className="font-medium">{formData.livingArrangement || "Not selected"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-1" />
                  <div>
                    <p className="font-bold text-yellow-800">Premium Membership Required</p>
                    <p className="text-sm text-yellow-700">Long-term bookings are only available to subscribed members.</p>
                    <Button className="mt-3 bg-blue-600 hover:bg-blue-700">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Premium
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
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
              <Crown className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-gray-600">Premium Feature</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Long-Term Domestic Help Booking</h1>
            <p className="text-gray-600">Premium feature for subscribed members only</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            {renderStepIndicator()}
          </div>

          {/* Form Content */}
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            {currentStep < totalSteps && (
              <Button onClick={nextStep}>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


