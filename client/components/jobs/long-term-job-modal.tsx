"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  User,
  Briefcase,
  Clock,
  MapPin,
  CheckCircle,
  DollarSign,
  FileText,
  Building,
  Eye,
} from "lucide-react"

interface LongTermJobModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LongTermJobModal({ open, onOpenChange }: LongTermJobModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",

    // Job Details
    workerRole: "",
    jobDescription: "",
    startDate: "",
    jobDuration: "",
    livingArrangement: "",
    numberOfChildren: "",
    numberOfElderly: "",
    numberOfPets: "",

    // Work Schedule
    dailyStartTime: "",
    workHoursPerDay: "",
    daysPerWeek: "",
    earlyMorningAssistance: false,
    earlyMorningTime: "",
    middayBreak: false,
    standbyHours: "",
    schoolRun: false,
    schoolPickup: "",
    schoolDropoff: "",
    babysittingSchedule: [] as string[],
    workCycle: "",

    // Location & Accommodation
    propertyAddress: "",
    accommodationOptions: [] as string[],
    familyMembers: "",
    specialRequirements: "",
    amenities: [] as string[],

    // Tasks & Requirements
    coreTasks: [] as string[],
    additionalTasks: [] as string[],
    estimatedHours: "",

    // Compensation & Payment
    salaryType: "",
    salaryAmount: "",
    paymentCycle: "",
    benefits: [] as string[],
    overtimeRate: "",
    holidayPay: false,

    // Employment Terms
    contractDuration: "",
    probationPeriod: "",
    terminationTerms: "",
    workPermits: false,

    // Agency & Referrals
    selectedAgencies: [] as string[],
    referralSources: "",
    backgroundCheck: false,
  })

  const totalSteps = 9

  const workerRoles = [
    { value: "maid", label: "Maid" },
    { value: "nanny", label: "Nanny" },
    { value: "adult-caregiver", label: "Adult Caregiver" },
  ]

  const livingArrangements = [
    { value: "live-in", label: "Live-in" },
    { value: "live-out", label: "Live-out" },
  ]

  const workCycles = [
    { value: "weekly", label: "Weekly" },
    { value: "bi-weekly", label: "Bi-weekly" },
    { value: "monthly", label: "Monthly" },
  ]

  const accommodationOptions = [
    "Private Room",
    "Shared Room",
    "Private Bathroom",
    "Shared Bathroom",
    "Kitchen Access",
    "Laundry Access",
  ]

  const amenities = ["WiFi", "TV", "Air Conditioning", "Parking", "Garden Access", "Pool Access", "Gym Access"]

  const coreTasks = [
    "House Cleaning",
    "Laundry",
    "Ironing",
    "Cooking",
    "Childcare",
    "Elder Care",
    "Pet Care",
    "Shopping",
  ]

  const additionalTasks = [
    "Garden Maintenance",
    "Car Washing",
    "Event Assistance",
    "Travel Companion",
    "Tutoring",
    "Driving",
  ]

  const benefits = ["Accommodation", "Meals", "Transportation", "Health Insurance", "Annual Leave", "Sick Leave"]

  const paymentCycles = [
    { value: "weekly", label: "Weekly" },
    { value: "bi-weekly", label: "Bi-weekly" },
    { value: "monthly", label: "Monthly" },
  ]

  const placementAgencies = [
    { id: 1, name: "Premium Home Services", rating: 4.8, workers: 25 },
    { id: 2, name: "Elite Care Agency", rating: 4.9, workers: 18 },
    { id: 3, name: "Professional Placements", rating: 4.7, workers: 30 },
  ]

  const babysittingOptions = ["After-school", "Evenings", "Weekends", "Overnight", "Holiday Care"]

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
    console.log("Long-term job form submitted:", formData)
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
              <User className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Personal Details</h3>
              <p className="text-gray-600">Tell us about yourself and your contact information</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  placeholder="Enter last name"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  value={formData.phoneNumber}
                  onChange={(e) => updateFormData("phoneNumber", e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Address</Label>
                <Textarea
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  placeholder="Enter your address"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Emergency Contact Name</Label>
                <Input
                  value={formData.emergencyContact}
                  onChange={(e) => updateFormData("emergencyContact", e.target.value)}
                  placeholder="Emergency contact name"
                />
              </div>
              <div className="space-y-2">
                <Label>Emergency Contact Phone</Label>
                <Input
                  value={formData.emergencyPhone}
                  onChange={(e) => updateFormData("emergencyPhone", e.target.value)}
                  placeholder="Emergency contact phone"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Briefcase className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Job Details</h3>
              <p className="text-gray-600">Define the role and requirements</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Worker Role</Label>
                <Select value={formData.workerRole} onValueChange={(value) => updateFormData("workerRole", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select worker role" />
                  </SelectTrigger>
                  <SelectContent>
                    {workerRoles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Job Description</Label>
                <Textarea
                  value={formData.jobDescription}
                  onChange={(e) => updateFormData("jobDescription", e.target.value)}
                  placeholder="Describe the job responsibilities and requirements in detail"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => updateFormData("startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Job Duration (months)</Label>
                  <Input
                    type="number"
                    value={formData.jobDuration}
                    onChange={(e) => updateFormData("jobDuration", e.target.value)}
                    placeholder="Duration in months"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Living Arrangement</Label>
                <Select
                  value={formData.livingArrangement}
                  onValueChange={(value) => updateFormData("livingArrangement", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select living arrangement" />
                  </SelectTrigger>
                  <SelectContent>
                    {livingArrangements.map((arrangement) => (
                      <SelectItem key={arrangement.value} value={arrangement.value}>
                        {arrangement.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Number of Children</Label>
                  <Input
                    type="number"
                    value={formData.numberOfChildren}
                    onChange={(e) => updateFormData("numberOfChildren", e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Number of Elderly</Label>
                  <Input
                    type="number"
                    value={formData.numberOfElderly}
                    onChange={(e) => updateFormData("numberOfElderly", e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Number of Pets</Label>
                  <Input
                    type="number"
                    value={formData.numberOfPets}
                    onChange={(e) => updateFormData("numberOfPets", e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Clock className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Work Schedule</h3>
              <p className="text-gray-600">Define working hours and schedule</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Daily Start Time</Label>
                <Input
                  type="time"
                  value={formData.dailyStartTime}
                  onChange={(e) => updateFormData("dailyStartTime", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Work Hours per Day</Label>
                <Input
                  type="number"
                  value={formData.workHoursPerDay}
                  onChange={(e) => updateFormData("workHoursPerDay", e.target.value)}
                  placeholder="8"
                />
              </div>
              <div className="space-y-2">
                <Label>Days per Week</Label>
                <Input
                  type="number"
                  value={formData.daysPerWeek}
                  onChange={(e) => updateFormData("daysPerWeek", e.target.value)}
                  placeholder="5"
                  min="1"
                  max="7"
                />
              </div>
              <div className="space-y-2">
                <Label>Work Cycle</Label>
                <Select value={formData.workCycle} onValueChange={(value) => updateFormData("workCycle", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select work cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    {workCycles.map((cycle) => (
                      <SelectItem key={cycle.value} value={cycle.value}>
                        {cycle.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="earlyMorning"
                  checked={formData.earlyMorningAssistance}
                  onCheckedChange={(checked) => updateFormData("earlyMorningAssistance", checked)}
                />
                <Label htmlFor="earlyMorning">Early Morning Assistance Required</Label>
              </div>
              {formData.earlyMorningAssistance && (
                <div className="space-y-2 ml-6">
                  <Label>Early Morning Start Time</Label>
                  <Input
                    type="time"
                    value={formData.earlyMorningTime}
                    onChange={(e) => updateFormData("earlyMorningTime", e.target.value)}
                  />
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="middayBreak"
                  checked={formData.middayBreak}
                  onCheckedChange={(checked) => updateFormData("middayBreak", checked)}
                />
                <Label htmlFor="middayBreak">Midday Break Options</Label>
              </div>
              <div className="space-y-2">
                <Label>Standby Hours (if applicable)</Label>
                <Input
                  value={formData.standbyHours}
                  onChange={(e) => updateFormData("standbyHours", e.target.value)}
                  placeholder="e.g., 2 hours evening standby"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="schoolRun"
                  checked={formData.schoolRun}
                  onCheckedChange={(checked) => updateFormData("schoolRun", checked)}
                />
                <Label htmlFor="schoolRun">School Run Required</Label>
              </div>
              {formData.schoolRun && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                  <div className="space-y-2">
                    <Label>School Pickup Time</Label>
                    <Input
                      type="time"
                      value={formData.schoolPickup}
                      onChange={(e) => updateFormData("schoolPickup", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>School Dropoff Time</Label>
                    <Input
                      type="time"
                      value={formData.schoolDropoff}
                      onChange={(e) => updateFormData("schoolDropoff", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Babysitting Schedule</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {babysittingOptions.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            id={option}
                            checked={formData.babysittingSchedule.includes(option)}
                            onCheckedChange={() => toggleArrayItem("babysittingSchedule", option)}
                          />
                          <Label htmlFor={option} className="text-sm">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      // Continue with remaining steps...
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <MapPin className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Location & Accommodation</h3>
              <p className="text-gray-600">Property details and accommodation options</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Property Address</Label>
                <Textarea
                  value={formData.propertyAddress}
                  onChange={(e) => updateFormData("propertyAddress", e.target.value)}
                  placeholder="Enter complete property address"
                  rows={2}
                />
              </div>
              {formData.livingArrangement === "live-in" && (
                <div className="space-y-4">
                  <Label>Accommodation Options</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {accommodationOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={formData.accommodationOptions.includes(option)}
                          onCheckedChange={() => toggleArrayItem("accommodationOptions", option)}
                        />
                        <Label htmlFor={option} className="text-sm">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label>Number of Family Members</Label>
                <Input
                  type="number"
                  value={formData.familyMembers}
                  onChange={(e) => updateFormData("familyMembers", e.target.value)}
                  placeholder="Total family members"
                />
              </div>
              <div className="space-y-2">
                <Label>Special Requirements</Label>
                <Textarea
                  value={formData.specialRequirements}
                  onChange={(e) => updateFormData("specialRequirements", e.target.value)}
                  placeholder="Any special requirements or considerations"
                  rows={3}
                />
              </div>
              <div className="space-y-4">
                <Label>Available Amenities</Label>
                <div className="grid grid-cols-2 gap-2">
                  {amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={formData.amenities.includes(amenity)}
                        onCheckedChange={() => toggleArrayItem("amenities", amenity)}
                      />
                      <Label htmlFor={amenity} className="text-sm">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Tasks & Requirements</h3>
              <p className="text-gray-600">Define core and additional responsibilities</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <Label>Core Tasks (Daily Responsibilities)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {coreTasks.map((task) => (
                    <div key={task} className="flex items-center space-x-2">
                      <Checkbox
                        id={task}
                        checked={formData.coreTasks.includes(task)}
                        onCheckedChange={() => toggleArrayItem("coreTasks", task)}
                      />
                      <Label htmlFor={task} className="text-sm">
                        {task}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <Label>Additional Tasks (Special Requirements)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {additionalTasks.map((task) => (
                    <div key={task} className="flex items-center space-x-2">
                      <Checkbox
                        id={task}
                        checked={formData.additionalTasks.includes(task)}
                        onCheckedChange={() => toggleArrayItem("additionalTasks", task)}
                      />
                      <Label htmlFor={task} className="text-sm">
                        {task}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Estimated Hours Needed (per day)</Label>
                <Input
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => updateFormData("estimatedHours", e.target.value)}
                  placeholder="Estimated daily hours"
                />
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <DollarSign className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Compensation & Payment</h3>
              <p className="text-gray-600">Define salary and benefits</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Salary Type</Label>
                  <Select value={formData.salaryType} onValueChange={(value) => updateFormData("salaryType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select salary type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Salary Amount</Label>
                  <Input
                    type="number"
                    value={formData.salaryAmount}
                    onChange={(e) => updateFormData("salaryAmount", e.target.value)}
                    placeholder="Amount"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Payment Cycle</Label>
                <Select value={formData.paymentCycle} onValueChange={(value) => updateFormData("paymentCycle", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentCycles.map((cycle) => (
                      <SelectItem key={cycle.value} value={cycle.value}>
                        {cycle.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <Label>Benefits</Label>
                <div className="grid grid-cols-2 gap-2">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center space-x-2">
                      <Checkbox
                        id={benefit}
                        checked={formData.benefits.includes(benefit)}
                        onCheckedChange={() => toggleArrayItem("benefits", benefit)}
                      />
                      <Label htmlFor={benefit} className="text-sm">
                        {benefit}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Overtime Rate (per hour)</Label>
                  <Input
                    type="number"
                    value={formData.overtimeRate}
                    onChange={(e) => updateFormData("overtimeRate", e.target.value)}
                    placeholder="Overtime rate"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <Checkbox
                    id="holidayPay"
                    checked={formData.holidayPay}
                    onCheckedChange={(checked) => updateFormData("holidayPay", checked)}
                  />
                  <Label htmlFor="holidayPay">Holiday Pay Included</Label>
                </div>
              </div>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Employment Terms</h3>
              <p className="text-gray-600">Contract terms and conditions</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Contract Duration</Label>
                  <Input
                    value={formData.contractDuration}
                    onChange={(e) => updateFormData("contractDuration", e.target.value)}
                    placeholder="e.g., 12 months"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Probation Period</Label>
                  <Input
                    value={formData.probationPeriod}
                    onChange={(e) => updateFormData("probationPeriod", e.target.value)}
                    placeholder="e.g., 3 months"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Termination Terms</Label>
                <Textarea
                  value={formData.terminationTerms}
                  onChange={(e) => updateFormData("terminationTerms", e.target.value)}
                  placeholder="Describe termination conditions and notice period"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="workPermits"
                  checked={formData.workPermits}
                  onCheckedChange={(checked) => updateFormData("workPermits", checked)}
                />
                <Label htmlFor="workPermits">Work Permits/Visas Required</Label>
              </div>
            </div>
          </div>
        )

      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Building className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Agency & Referrals</h3>
              <p className="text-gray-600">Select placement agencies and referral sources</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <Label>Select Placement Agencies</Label>
                <div className="space-y-2">
                  {placementAgencies.map((agency) => (
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
                      <Badge variant="outline">Placement Agency</Badge>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Referral Sources</Label>
                <Textarea
                  value={formData.referralSources}
                  onChange={(e) => updateFormData("referralSources", e.target.value)}
                  placeholder="How did you hear about us? Any specific referrals?"
                  rows={2}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="backgroundCheck"
                  checked={formData.backgroundCheck}
                  onCheckedChange={(checked) => updateFormData("backgroundCheck", checked)}
                />
                <Label htmlFor="backgroundCheck">Background Check Required</Label>
              </div>
            </div>
          </div>
        )

      case 9:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Eye className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Summary & Submission</h3>
              <p className="text-gray-600">Review your long-term job posting</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Job Posting Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Contact Person:</p>
                    <p className="text-gray-600">
                      {formData.firstName} {formData.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Worker Role:</p>
                    <p className="text-gray-600 capitalize">{formData.workerRole}</p>
                  </div>
                  <div>
                    <p className="font-medium">Living Arrangement:</p>
                    <p className="text-gray-600 capitalize">{formData.livingArrangement}</p>
                  </div>
                  <div>
                    <p className="font-medium">Start Date:</p>
                    <p className="text-gray-600">{formData.startDate}</p>
                  </div>
                  <div>
                    <p className="font-medium">Duration:</p>
                    <p className="text-gray-600">{formData.jobDuration} months</p>
                  </div>
                  <div>
                    <p className="font-medium">Work Schedule:</p>
                    <p className="text-gray-600">
                      {formData.workHoursPerDay}h/day, {formData.daysPerWeek} days/week
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Salary:</p>
                    <p className="text-gray-600">
                      {formData.salaryAmount} ({formData.salaryType})
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Payment Cycle:</p>
                    <p className="text-gray-600 capitalize">{formData.paymentCycle}</p>
                  </div>
                </div>

                {formData.coreTasks.length > 0 && (
                  <div>
                    <p className="font-medium">Core Tasks:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.coreTasks.map((task) => (
                        <Badge key={task} variant="secondary" className="text-xs">
                          {task}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {formData.benefits.length > 0 && (
                  <div>
                    <p className="font-medium">Benefits:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.benefits.map((benefit) => (
                        <Badge key={benefit} variant="outline" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {formData.selectedAgencies.length > 0 && (
                  <div>
                    <p className="font-medium">Selected Agencies:</p>
                    <p className="text-gray-600">{formData.selectedAgencies.length} placement agencies selected</p>
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Long-term Job</DialogTitle>
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
