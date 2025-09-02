"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { 
  FileText, 
  Users, 
  Building2, 
  Calendar, 
  DollarSign, 
  Send,
  ArrowLeft,
  CheckCircle,
  Clock
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SharedHeader } from "@/components/layout/shared-header"

interface FamilyRequest {
  id: number
  familyName: string
  jobTitle: string
  location: string
  budget: string
  startDate: string
  description: string
  address: string
  contact: string
}

interface AffiliatedWorker {
  id: number
  name: string
  specialization: string
  rating: number
  experience: number
  location: string
  availability: string
  nationality: string
  passport: string
}

interface ContractForm {
  familyId: number | null
  workerId: number | null
  position: string
  type: string
  location: string
  livingArrangement: string
  duties: string[]
  dailyHours: string
  standbyHours: string
  restPeriod: string
  workCycle: string
  weeklyOff: string
  monthlySalary: string
  paymentMethod: string
  insurance: string
  vacation: string
  duration: string
  startDate: string
  endDate: string
}

export default function CreateContractPage() {
  const router = useRouter()
  const [familyRequests, setFamilyRequests] = useState<FamilyRequest[]>([])
  const [affiliatedWorkers, setAffiliatedWorkers] = useState<AffiliatedWorker[]>([])
  const [selectedFamily, setSelectedFamily] = useState<FamilyRequest | null>(null)
  const [selectedWorker, setSelectedWorker] = useState<AffiliatedWorker | null>(null)
  const [showFamilySelection, setShowFamilySelection] = useState(false)
  const [showWorkerSelection, setShowWorkerSelection] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [contractForm, setContractForm] = useState<ContractForm>({
    familyId: null,
    workerId: null,
    position: "",
    type: "Long-term Placement - Live-in",
    location: "",
    livingArrangement: "Private room with amenities (Wi-Fi, A/C, Laundry, TV)",
    duties: [],
    dailyHours: "9:00 AM - 7:00 PM (10 hours including 1-hour break)",
    standbyHours: "6:30 PM - 11:30 PM (5 hours)",
    restPeriod: "11:30 PM - 8:30 AM (9 hours validated)",
    workCycle: "26 Days On / 4 Days Off",
    weeklyOff: "One full day rest per week",
    monthlySalary: "",
    paymentMethod: "HS-Pro Wallet (Auto-deposit)",
    insurance: "Health + Workplace Injury (Plan B)",
    vacation: "48 days/year (4 days/month)",
    duration: "12 months",
    startDate: "",
    endDate: ""
  })

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockFamilyRequests: FamilyRequest[] = [
      {
        id: 1,
        familyName: "Al-Ahmad Family",
        jobTitle: "Full-time Housekeeper",
        location: "Dubai Marina",
        budget: "$1500/month",
        startDate: "2024-02-01",
        description: "Looking for a reliable full-time housekeeper for our 4-bedroom villa.",
        address: "Dubai Marina, Dubai, UAE",
        contact: "+971 50 123 4567"
      },
      {
        id: 2,
        familyName: "Johnson Family",
        jobTitle: "Part-time Nanny",
        location: "Abu Dhabi",
        budget: "$800/month",
        startDate: "2024-02-15",
        description: "Need a caring nanny for our 2 children for 4 hours daily.",
        address: "Abu Dhabi, UAE",
        contact: "+971 50 987 6543"
      }
    ]

    const mockAffiliatedWorkers: AffiliatedWorker[] = [
      {
        id: 1,
        name: "Maria Garcia",
        specialization: "Housekeeping",
        rating: 4.7,
        experience: 6,
        location: "Dubai",
        availability: "Available",
        nationality: "Filipino",
        passport: "P12345678"
      },
      {
        id: 2,
        name: "Fatima Al-Zahra",
        specialization: "Childcare",
        rating: 4.9,
        experience: 8,
        location: "Sharjah",
        availability: "Available",
        nationality: "Egyptian",
        passport: "E87654321"
      }
    ]

    setFamilyRequests(mockFamilyRequests)
    setAffiliatedWorkers(mockAffiliatedWorkers)
  }, [])

  const handleFamilySelection = (family: FamilyRequest) => {
    setSelectedFamily(family)
    setContractForm(prev => ({ 
      ...prev, 
      familyId: family.id,
      position: family.jobTitle,
      location: family.location,
      startDate: family.startDate,
      monthlySalary: family.budget
    }))
    setShowFamilySelection(false)
  }

  const handleWorkerSelection = (worker: AffiliatedWorker) => {
    setSelectedWorker(worker)
    setContractForm(prev => ({ ...prev, workerId: worker.id }))
    setShowWorkerSelection(false)
  }

  const handleFormChange = (field: keyof ContractForm, value: string | string[]) => {
    setContractForm(prev => ({ ...prev, [field]: value }))
  }

  const handleDutyChange = (index: number, value: string) => {
    const newDuties = [...contractForm.duties]
    newDuties[index] = value
    setContractForm(prev => ({ ...prev, duties: newDuties }))
  }

  const addDuty = () => {
    setContractForm(prev => ({ ...prev, duties: [...prev.duties, ""] }))
  }

  const removeDuty = (index: number) => {
    const newDuties = contractForm.duties.filter((_, i) => i !== index)
    setContractForm(prev => ({ ...prev, duties: newDuties }))
  }

  const handleCreateContract = () => {
    // In real app, this would create the contract in the backend
    console.log("Creating contract:", contractForm)
    setShowSuccessPopup(true)
    
    // Auto-hide popup after 5 seconds
    setTimeout(() => {
      setShowSuccessPopup(false)
      router.push('/agency/contracts')
    }, 5000)
  }

  return (
    <DashboardLayout userRole="agency" userName="Elite Home Services" userEmail="admin@elitehomeservices.com">
      <div className="space-y-6">
        {/* Header */}
        <SharedHeader 
          title="Create New Contract" 
          subtitle="Generate employment agreement between family and worker" 
          showBackButton={true}
        />

        {/* Contract Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <FileText className="text-blue-600 text-2xl" />
                </div>
                <div>
                  <h2 className="font-bold text-xl">Employment Agreement</h2>
                  <p className="text-muted-foreground">Contract ID: CC-2025-EMP-{Date.now().toString().slice(-6)}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-muted-foreground text-xs">Employer</p>
                  <p className="font-medium">{selectedFamily?.familyName || "Not Selected"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Position</p>
                  <p className="font-medium">{contractForm.position || "Not Selected"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Status</p>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Draft
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contract Content */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">Employment Agreement</h2>

                {/* Parties */}
                <div className="mb-8">
                  <h3 className="font-bold mb-4 flex items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                    Parties to the Agreement
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold mb-3">Employer</h4>
                      {selectedFamily ? (
                        <div className="space-y-2">
                          <p><strong>Name:</strong> {selectedFamily.familyName}</p>
                          <p><strong>Address:</strong> {selectedFamily.address}</p>
                          <p><strong>Contact:</strong> {selectedFamily.contact}</p>
                          <p><strong>ID:</strong> EMP-CC-2025-{selectedFamily.id.toString().padStart(6, '0')}</p>
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          onClick={() => setShowFamilySelection(true)}
                          className="w-full"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Select Family
                        </Button>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold mb-3">Worker</h4>
                      {selectedWorker ? (
                        <div className="space-y-2">
                          <p><strong>Name:</strong> {selectedWorker.name}</p>
                          <p><strong>Nationality:</strong> {selectedWorker.nationality}</p>
                          <p><strong>Passport:</strong> {selectedWorker.passport}</p>
                          <p><strong>Worker ID:</strong> WK-CC-2025-{selectedWorker.id.toString().padStart(6, '0')}</p>
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          onClick={() => setShowWorkerSelection(true)}
                          className="w-full"
                          disabled={!selectedFamily}
                        >
                          <Building2 className="h-4 w-4 mr-2" />
                          Select Worker
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Position and Duties */}
                <div className="mb-8">
                  <h3 className="font-bold mb-4 flex items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                    Position and Duties
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="position">Position</Label>
                        <Input
                          id="position"
                          value={contractForm.position}
                          onChange={(e) => handleFormChange('position', e.target.value)}
                          placeholder="e.g., Full-time Housekeeper"
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Input
                          id="type"
                          value={contractForm.type}
                          onChange={(e) => handleFormChange('type', e.target.value)}
                          placeholder="e.g., Long-term Placement - Live-in"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Work Location</Label>
                        <Input
                          id="location"
                          value={contractForm.location}
                          onChange={(e) => handleFormChange('location', e.target.value)}
                          placeholder="e.g., Dubai Marina, Dubai, UAE"
                        />
                      </div>
                      <div>
                        <Label htmlFor="livingArrangement">Living Arrangement</Label>
                        <Input
                          id="livingArrangement"
                          value={contractForm.livingArrangement}
                          onChange={(e) => handleFormChange('livingArrangement', e.target.value)}
                          placeholder="e.g., Private room with amenities"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Primary Duties</Label>
                      <div className="space-y-2 mt-2">
                        {contractForm.duties.map((duty, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={duty}
                              onChange={(e) => handleDutyChange(index, e.target.value)}
                              placeholder={`Duty ${index + 1}`}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeDuty(index)}
                              className="text-destructive"
                            >
                              ✕
                            </Button>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" onClick={addDuty}>
                          + Add Duty
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Work Schedule */}
                <div className="mb-8">
                  <h3 className="font-bold mb-4 flex items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                    Work Schedule
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dailyHours">Daily Hours</Label>
                      <Input
                        id="dailyHours"
                        value={contractForm.dailyHours}
                        onChange={(e) => handleFormChange('dailyHours', e.target.value)}
                        placeholder="e.g., 9:00 AM - 7:00 PM (10 hours including 1-hour break)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="standbyHours">Standby Hours</Label>
                      <Input
                        id="standbyHours"
                        value={contractForm.standbyHours}
                        onChange={(e) => handleFormChange('standbyHours', e.target.value)}
                        placeholder="e.g., 6:30 PM - 11:30 PM (5 hours)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="restPeriod">Rest Period</Label>
                      <Input
                        id="restPeriod"
                        value={contractForm.restPeriod}
                        onChange={(e) => handleFormChange('restPeriod', e.target.value)}
                        placeholder="e.g., 11:30 PM - 8:30 AM (9 hours validated)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="workCycle">Work Cycle</Label>
                      <Input
                        id="workCycle"
                        value={contractForm.workCycle}
                        onChange={(e) => handleFormChange('workCycle', e.target.value)}
                        placeholder="e.g., 26 Days On / 4 Days Off"
                      />
                    </div>
                    <div>
                      <Label htmlFor="weeklyOff">Weekly Off</Label>
                      <Input
                        id="weeklyOff"
                        value={contractForm.weeklyOff}
                        onChange={(e) => handleFormChange('weeklyOff', e.target.value)}
                        placeholder="e.g., One full day rest per week"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Compensation */}
                <div className="mb-8">
                  <h3 className="font-bold mb-4 flex items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                    Compensation and Benefits
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="monthlySalary">Monthly Salary</Label>
                      <Input
                        id="monthlySalary"
                        value={contractForm.monthlySalary}
                        onChange={(e) => handleFormChange('monthlySalary', e.target.value)}
                        placeholder="e.g., EGP 9,000 ($300 USD)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Input
                        id="paymentMethod"
                        value={contractForm.paymentMethod}
                        onChange={(e) => handleFormChange('paymentMethod', e.target.value)}
                        placeholder="e.g., HS-Pro Wallet (Auto-deposit)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="insurance">Insurance</Label>
                      <Input
                        id="insurance"
                        value={contractForm.insurance}
                        onChange={(e) => handleFormChange('insurance', e.target.value)}
                        placeholder="e.g., Health + Workplace Injury (Plan B)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vacation">Vacation</Label>
                      <Input
                        id="vacation"
                        value={contractForm.vacation}
                        onChange={(e) => handleFormChange('vacation', e.target.value)}
                        placeholder="e.g., 48 days/year (4 days/month)"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Duration */}
                <div className="mb-8">
                  <h3 className="font-bold mb-4 flex items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                    Contract Duration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={contractForm.duration}
                        onChange={(e) => handleFormChange('duration', e.target.value)}
                        placeholder="e.g., 12 months"
                      />
                    </div>
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={contractForm.startDate}
                        onChange={(e) => handleFormChange('startDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date (Optional)</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={contractForm.endDate}
                        onChange={(e) => handleFormChange('endDate', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Contract Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleCreateContract}
                  disabled={!selectedFamily || !selectedWorker}
                  className="w-full"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Create Contract
                </Button>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Next Steps:</h4>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Contract created</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-blue-500" />
                      <span>Send to employer for signature</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-blue-500" />
                      <span>Send to worker for signature</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-yellow-500" />
                      <span>Admin approval</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Family Selection Modal */}
        {showFamilySelection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-background border border-border rounded-lg p-6 max-w-2xl w-full mx-4 shadow-xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Select Family Request</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowFamilySelection(false)}>
                  ✕
                </Button>
              </div>
              
              <div className="space-y-3">
                {familyRequests.map((family) => (
                  <div
                    key={family.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-card hover-lift transition-theme cursor-pointer"
                    onClick={() => handleFamilySelection(family)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <Users className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-card-foreground">{family.jobTitle}</p>
                          <p className="text-sm text-muted-foreground">
                            {family.familyName} • 📍 {family.location}
                          </p>
                          <p className="text-sm font-medium text-green-600">{family.budget}</p>
                          <p className="text-xs text-muted-foreground">
                            Start: {family.startDate}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Select
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Worker Selection Modal */}
        {showWorkerSelection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-background border border-border rounded-lg p-6 max-w-2xl w-full mx-4 shadow-xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Select Worker</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowWorkerSelection(false)}>
                  ✕
                </Button>
              </div>
              
              <div className="space-y-3">
                {affiliatedWorkers.map((worker) => (
                  <div
                    key={worker.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-card hover-lift transition-theme cursor-pointer"
                    onClick={() => handleWorkerSelection(worker)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <Building2 className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-card-foreground">{worker.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {worker.specialization} • ⭐ {worker.rating} • {worker.experience} years experience
                          </p>
                          <p className="text-xs text-muted-foreground">
                            📍 {worker.location} • {worker.availability}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Select
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-background border border-border rounded-lg p-8 max-w-md w-full mx-4 shadow-xl text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Contract Created Successfully!</h2>
              <p className="text-muted-foreground mb-6">
                The employment agreement has been generated and is ready for signatures.
              </p>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>Contract sent to employer for signature</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>Contract sent to worker for signature</span>
                </div>
              </div>
              <Button 
                onClick={() => {
                  setShowSuccessPopup(false)
                  router.push('/agency/contracts')
                }}
                className="mt-6 w-full"
              >
                View All Contracts
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
