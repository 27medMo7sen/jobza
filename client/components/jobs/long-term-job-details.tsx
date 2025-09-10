"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Home, 
  Users, 
  Clock, 
  Building2,
  FileText,
  Crown,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle,
  Star,
  User
} from "lucide-react"

interface LongTermJobDetailsProps {
  job: {
    id: number
    title: string
    agency: string
    location: string
    salary: string
    duration: string
    startDate: string
    description: string
    requirements: string[]
    primaryRole: string
    adults: number
    children03: number
    children47: number
    children814: number
    bedrooms: number
    bathrooms: number
    kitchens: number
    additionalRooms: number
    cooking: boolean
    laundry: boolean
    grocery: boolean
    petCare: boolean
    otherTask: boolean
    otherTaskText: string
    mobility: boolean
    personalCare: boolean
    standbyHours: number
    livingArrangement: string
    workCycle: string
    roomType: string
    paymentCycle: string
    mealPlan: string
    feedingAllowance: string
    wifi: boolean
    ac: boolean
    tv: boolean
    laundryAmenity: boolean
    heater: boolean
    privateBathroom: boolean
    transportAllowance: string
    externalLodge: string
    accommodationAllowance: string
    // Optional flags for labels
    isUrgent?: boolean
    typeLabel?: string // e.g., "Long Term"
  }
}

export function LongTermJobDetails({ job }: LongTermJobDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Job Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-2xl">{job.title}</CardTitle>
              <CardDescription className="text-lg">{job.agency}</CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-2">
              <Badge variant="default" className="w-fit">
                {job.typeLabel || "Long Term"}
              </Badge>
              {job.isUrgent && (
                <Badge variant="destructive" className="w-fit">Urgent</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{job.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{job.salary}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Start: {job.startDate}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-foreground mb-2">Job Description</h3>
              <p className="text-muted-foreground leading-relaxed">{job.description}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-foreground mb-2">Working Hours</h3>
              <p className="text-muted-foreground">{job.workCycle}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Requirements & Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {job.requirements.map((requirement, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">{requirement}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Family Details */}
      <Card>
        <CardHeader>
          <CardTitle>Family & Household Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-3">Household Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Adults:</span>
                  <span className="text-sm font-medium">{job.adults}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Children (0-3 years):</span>
                  <span className="text-sm font-medium">{job.children03}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Children (4-7 years):</span>
                  <span className="text-sm font-medium">{job.children47}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Children (8-14 years):</span>
                  <span className="text-sm font-medium">{job.children814}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Bedrooms:</span>
                  <span className="text-sm font-medium">{job.bedrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Bathrooms:</span>
                  <span className="text-sm font-medium">{job.bathrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Kitchens:</span>
                  <span className="text-sm font-medium">{job.kitchens}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Additional Rooms:</span>
                  <span className="text-sm font-medium">{job.additionalRooms}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-3">Primary Role & Duties</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Primary Role:</span>
                  <span className="text-sm font-medium capitalize">{job.primaryRole.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Cooking:</span>
                  <span className="text-sm font-medium">{job.cooking ? "Required" : "Not required"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Laundry:</span>
                  <span className="text-sm font-medium">{job.laundry ? "Required" : "Not required"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Grocery Shopping:</span>
                  <span className="text-sm font-medium">{job.grocery ? "Required" : "Not required"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Pet Care:</span>
                  <span className="text-sm font-medium">{job.petCare ? "Required" : "Not required"}</span>
                </div>
                {job.otherTask && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Other Tasks:</span>
                    <span className="text-sm font-medium">{job.otherTaskText}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accommodation & Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Accommodation & Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-3">Living Arrangement</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <span className="text-sm font-medium">{job.livingArrangement}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Room Type:</span>
                  <span className="text-sm font-medium">{job.roomType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Work Cycle:</span>
                  <span className="text-sm font-medium">{job.workCycle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Weekly Off:</span>
                  <span className="text-sm font-medium">One full day rest per week</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-3">Amenities & Benefits</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">WiFi:</span>
                  <span className="text-sm font-medium">{job.wifi ? "Available" : "Not available"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Air Conditioning:</span>
                  <span className="text-sm font-medium">{job.ac ? "Available" : "Not available"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">TV:</span>
                  <span className="text-sm font-medium">{job.tv ? "Available" : "Not available"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Laundry Amenity:</span>
                  <span className="text-sm font-medium">{job.laundryAmenity ? "Available" : "Not available"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Heater:</span>
                  <span className="text-sm font-medium">{job.heater ? "Available" : "Not available"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Private Bathroom:</span>
                  <span className="text-sm font-medium">{job.privateBathroom ? "Yes" : "Shared"}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compensation & Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Compensation & Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-3">Payment Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Monthly Salary:</span>
                  <span className="text-sm font-medium">{job.salary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Payment Cycle:</span>
                  <span className="text-sm font-medium">{job.paymentCycle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Payment Method:</span>
                  <span className="text-sm font-medium">HS-Pro Wallet (Auto-deposit)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Insurance:</span>
                  <span className="text-sm font-medium">Health + Workplace Injury (Plan B)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Vacation:</span>
                  <span className="text-sm font-medium">48 days/year (4 days/month)</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-3">Working Schedule</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Daily Hours:</span>
                  <span className="text-sm font-medium">9:00 AM - 7:00 PM (10 hours including 1-hour break)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Standby Hours:</span>
                  <span className="text-sm font-medium">{job.standbyHours} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Rest Period:</span>
                  <span className="text-sm font-medium">11:30 PM - 8:30 AM (9 hours validated)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Duration:</span>
                  <span className="text-sm font-medium">{job.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-3">Allowances</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Feeding Allowance:</span>
                  <span className="text-sm font-medium">{job.feedingAllowance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Transport Allowance:</span>
                  <span className="text-sm font-medium">{job.transportAllowance}</span>
                </div>
                {job.accommodationAllowance && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Accommodation Allowance:</span>
                    <span className="text-sm font-medium">{job.accommodationAllowance}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-3">Meal Plan</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Meal Plan:</span>
                  <span className="text-sm font-medium">{job.mealPlan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">External Lodge:</span>
                  <span className="text-sm font-medium">{job.externalLodge}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

