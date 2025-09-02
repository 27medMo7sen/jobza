"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  AlertTriangle,
  Shield,
  Clock,
  Heart,
  Gavel,
  Download,
  Printer,
  Building2,
  User,
} from "lucide-react"
import { WorkerSidebar } from "@/components/layout/worker-sidebar"
import { EmployerSidebar } from "@/components/layout/employer-sidebar"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

// Mock contract data - replace with actual API call
const contractData = {
  id: "CC-2025-EMP-00156",
  position: "Domestic Worker",
  agency: {
    name: "Elite Home Services",
    address: "Dubai, UAE",
    contact: "+971 50 123 4567",
    id: "AGY-CC-2025-00156",
  },
  employer: {
    name: "Hassan Family",
    address: "Zamalek, Cairo, Egypt",
    contact: "+20 10xxxxxxxx",
    id: "EMP-CC-2025-00156",
  },
  worker: {
    name: "Grace Mumbi",
    nationality: "Kenyan",
    passport: "P12345678",
    id: "WK-CC-2025-00156",
  },
  details: {
    type: "Long-term Placement - Live-in",
    location: "Zamalek, Cairo, Egypt",
    livingArrangement: "Private room with amenities (Wi-Fi, A/C, Laundry, TV)",
    duties: [
      "House cleaning and maintenance",
      "Clothes washing and ironing",
      "Meal preparation",
      "Kitchen cleaning",
      "Bathroom cleaning",
      "Grocery shopping (twice weekly)",
      "Pet feeding and care",
    ],
  },
  schedule: {
    dailyHours: "9:00 AM - 7:00 PM (10 hours including 1-hour break)",
    standbyHours: "6:30 PM - 11:30 PM (5 hours)",
    restPeriod: "11:30 PM - 8:30 AM (9 hours validated)",
    workCycle: "26 Days On / 4 Days Off",
    weeklyOff: "One full day rest per week",
  },
  compensation: {
    monthlySalary: "EGP 9,000 ($300 USD)",
    paymentMethod: "HS-Pro Wallet (Auto-deposit)",
    insurance: "Health + Workplace Injury (Plan B)",
    vacation: "48 days/year (4 days/month)",
  },
  duration: "12 months",
  startDate: "August 1, 2025",
  status: "pending_worker_signature",
  createdAt: "2024-07-20",
  employerSigned: true,
  employerSignedDate: "July 25, 2025",
  workerSigned: false,
  workerSignedDate: undefined,
  sentToAgency: false,
}

// Get user role from query parameter
const getUserRole = (searchParams: URLSearchParams): "worker" | "employer" | "agency" => {
  const role = searchParams.get('role')
  if (role === 'employer') return "employer"
  if (role === 'agency') return "agency"
  return "worker" // default
}

// Check if user role is agency (uses different layout)
const isAgency = (userRole: "worker" | "employer" | "agency") => userRole === "agency"

// Get appropriate back navigation based on user role
const getBackNavigation = (userRole: "worker" | "employer" | "agency", router: any) => {
  switch (userRole) {
    case "employer":
      return () => router.push("/employer/dashboard")
    case "agency":
      return () => router.push("/agency/dashboard")
    default:
      return () => router.push("/worker/dashboard")
  }
}

export default function ContractPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [signatureSent, setSignatureSent] = useState(false)

  const userRole = getUserRole(searchParams)
  const isAgencyUser = isAgency(userRole)
  const handleBack = getBackNavigation(userRole, router)
  
  // Check if user has already signed
  const hasUserSigned = userRole === "employer" ? contractData.employerSigned : contractData.workerSigned
  const canUserSign = userRole !== "agency" && !hasUserSigned && !signatureSent

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !canUserSign) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = 150

    // Set drawing styles
    ctx.strokeStyle = "#2563eb"
    ctx.lineWidth = 2
    ctx.lineCap = "round"

    let lastX = 0
    let lastY = 0

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      setIsDrawing(true)
      const rect = canvas.getBoundingClientRect()
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
      lastX = clientX - rect.left
      lastY = clientY - rect.top
    }

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return
      const rect = canvas.getBoundingClientRect()
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
      const currentX = clientX - rect.left
      const currentY = clientY - rect.top

      ctx.beginPath()
      ctx.moveTo(lastX, lastY)
      ctx.lineTo(currentX, currentY)
      ctx.stroke()

      lastX = currentX
      lastY = currentY
      setHasSignature(true)
    }

    const stopDrawing = () => {
      setIsDrawing(false)
    }

    canvas.addEventListener("mousedown", startDrawing)
    canvas.addEventListener("mousemove", draw)
    canvas.addEventListener("mouseup", stopDrawing)
    canvas.addEventListener("touchstart", startDrawing)
    canvas.addEventListener("touchmove", draw)
    canvas.addEventListener("touchend", stopDrawing)

    return () => {
      canvas.removeEventListener("mousedown", startDrawing)
      canvas.removeEventListener("mouseup", stopDrawing)
      canvas.removeEventListener("mousemove", draw)
      canvas.removeEventListener("touchstart", startDrawing)
      canvas.removeEventListener("touchmove", draw)
      canvas.removeEventListener("touchend", stopDrawing)
    }
  }, [isDrawing, canUserSign])

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
  }

  const submitContract = async () => {
    if (!hasSignature) {
      alert("Please provide your signature before submitting.")
      return
    }

    const userType = userRole === "employer" ? "employer" : "worker"
    if (
      confirm(
        `By signing this contract as the ${userType}, you acknowledge that you have read and understood all terms. Do you wish to proceed?`,
      )
    ) {
      setIsSubmitting(true)
      // Simulate API call
      setTimeout(() => {
        setSignatureSent(true)
        setIsSubmitting(false)
        alert(
          `Congratulations! Your signature has been submitted. The contract will now be sent to the agency for final processing.`,
        )
      }, 2000)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending_employer_signature":
        return "bg-yellow-100 text-yellow-800"
      case "pending_worker_signature":
        return "bg-blue-100 text-blue-800"
      case "both_signed":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending_employer_signature":
        return "Pending Employer Signature"
      case "pending_worker_signature":
        return "Pending Worker Signature"
      case "both_signed":
        return "Both Parties Signed"
      case "completed":
        return "Contract Completed"
      default:
        return status
    }
  }

  const getProgressPercentage = () => {
    if (contractData.employerSigned && contractData.workerSigned) return 100
    if (contractData.employerSigned || contractData.workerSigned) return 66
    return 33
  }

  const getCurrentStep = () => {
    if (contractData.employerSigned && contractData.workerSigned) return 3
    if (contractData.employerSigned || contractData.workerSigned) return 2
    return 1
  }

  const getStepText = () => {
    const current = getCurrentStep()
    return `Step ${current} of 3`
  }

  const renderSignaturePanel = () => {
    if (userRole === "agency") {
      return (
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-gray-900">Contract Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Employer Signature</p>
                    <p className="text-sm text-gray-600">{contractData.employer.name}</p>
                  </div>
                </div>
                {contractData.employerSigned ? (
                  <Badge variant="default" className="bg-green-600 px-3 py-1">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Signed on {contractData.employerSignedDate}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-600 px-3 py-1">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Worker Signature</p>
                    <p className="text-sm text-gray-600">{contractData.worker.name}</p>
                  </div>
                </div>
                {contractData.workerSigned ? (
                  <Badge variant="default" className="bg-green-600 px-3 py-1">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Signed on {contractData.workerSignedDate}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-600 px-3 py-1">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" className="w-full">
                <Printer className="h-4 w-4 mr-2" />
                Print Contract
              </Button>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <h4 className="font-medium text-sm">Contract Info:</h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span>{contractData.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="capitalize">{getStatusText(contractData.status)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    if (hasUserSigned || signatureSent) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Signature Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-medium text-green-800 mb-2">Signature Submitted</h3>
              <p className="text-sm text-muted-foreground">
                Your signature has been recorded and sent to the agency.
              </p>
            </div>

            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" className="w-full">
                <Printer className="h-4 w-4 mr-2" />
                Print Contract
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>{userRole === "employer" ? "Employer" : "Worker"} Signature</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Please sign below to accept this employment agreement
            </p>
            
            <div className="border-2 border-dashed border-muted rounded-lg p-4 mb-4">
              <canvas
                ref={canvasRef}
                className="w-full h-32 border border-border rounded cursor-crosshair bg-card"
              />
            </div>
            
            <div className="flex gap-2 justify-center mb-4">
              <Button variant="outline" size="sm" onClick={clearSignature}>
                Clear Signature
              </Button>
            </div>
          </div>

          <Button 
            onClick={submitContract}
            disabled={!hasSignature || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Submitting..." : `Sign as ${userRole === "employer" ? "Employer" : "Worker"}`}
          </Button>

          <div className="space-y-3 pt-4 border-t border-border">
            <h4 className="font-medium text-sm text-card-foreground">Next Steps:</h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Contract created by agency</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-primary" />
                <span>You sign the contract</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-yellow-500" />
                <span>Other party signs the contract</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span>Agency processes final approval</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // If agency user, wrap with DashboardLayout
  if (isAgencyUser) {
    return (
      <DashboardLayout userRole="agency">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={handleBack} className="mr-4">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-card-foreground">Contract Review & Signing</h1>
              <p className="text-muted-foreground">Review and sign your employment agreement</p>
            </div>
          </div>

        {/* Contract Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <FileText className="text-blue-600 text-2xl" />
                </div>
                <div>
                  <h2 className="font-bold text-2xl text-card-foreground">Employment Agreement</h2>
                  <p className="text-muted-foreground text-sm">Contract ID: {contractData.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center md:text-left">
                  <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide mb-1">Agency</p>
                  <p className="font-semibold text-card-foreground">{contractData.agency.name}</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide mb-1">Position</p>
                  <p className="font-semibold text-card-foreground">{contractData.position}</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide mb-1">Status</p>
                  <Badge variant="secondary" className={`${getStatusColor(contractData.status)} font-medium`}>
                    {getStatusText(contractData.status)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Signing Progress</h2>
              <span className="text-sm text-muted-foreground">{getStepText()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            <div className="flex justify-between">
              <div className="text-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold mb-2 mx-auto">
                  ✓
                </div>
                <div className="text-xs text-green-600 font-medium">Agency Created</div>
              </div>
              <div className="text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mb-2 mx-auto ${
                  contractData.employerSigned ? 'bg-green-500' : 'bg-blue-600'
                }`}>
                  {contractData.employerSigned ? '✓' : '2'}
                </div>
                <div className={`text-xs ${contractData.employerSigned ? 'text-green-600 font-medium' : 'text-blue-600'}`}>
                  Employer Sign
                </div>
              </div>
              <div className="text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mb-2 mx-auto ${
                  contractData.workerSigned ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  {contractData.workerSigned ? '✓' : '3'}
                </div>
                <div className={`text-xs ${contractData.workerSigned ? 'text-green-600 font-medium' : 'text-muted-foreground'}`}>
                  Worker Sign
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
                      <h4 className="font-bold mb-3 flex items-center">
                        <Building2 className="h-4 w-4 mr-2 text-blue-600" />
                        Agency
                      </h4>
                      <p><strong>Name:</strong> {contractData.agency.name}</p>
                      <p><strong>Address:</strong> {contractData.agency.address}</p>
                      <p><strong>Contact:</strong> {contractData.agency.contact}</p>
                      <p><strong>ID:</strong> {contractData.agency.id}</p>
                    </div>
                    <div>
                      <h4 className="font-bold mb-3 flex items-center">
                        <User className="h-4 w-4 mr-2 text-green-600" />
                        Worker
                      </h4>
                      <p><strong>Name:</strong> {contractData.worker.name}</p>
                      <p><strong>Nationality:</strong> {contractData.worker.nationality}</p>
                      <p><strong>Passport:</strong> {contractData.worker.passport}</p>
                      <p><strong>Worker ID:</strong> {contractData.worker.id}</p>
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
                  <div className="space-y-3">
                    <p><strong>Position:</strong> {contractData.position}</p>
                    <p><strong>Type:</strong> {contractData.details.type}</p>
                    <p><strong>Work Location:</strong> {contractData.details.location}</p>
                    <p><strong>Living Arrangement:</strong> {contractData.details.livingArrangement}</p>
                    <p><strong>Primary Duties:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      {contractData.details.duties.map((duty, index) => (
                        <li key={index}>{duty}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Work Schedule */}
                <div className="mb-8">
                  <h3 className="font-bold mb-4 flex items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                    Work Schedule
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p><strong>Daily Hours:</strong> {contractData.schedule.dailyHours}</p>
                      <p><strong>Standby Hours:</strong> {contractData.schedule.standbyHours}</p>
                      <p><strong>Rest Period:</strong> {contractData.schedule.restPeriod}</p>
                    </div>
                    <div>
                      <p><strong>Work Cycle:</strong> {contractData.schedule.workCycle}</p>
                      <p><strong>Weekly Off:</strong> {contractData.schedule.weeklyOff}</p>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p><strong>Monthly Salary:</strong> {contractData.compensation.monthlySalary}</p>
                      <p><strong>Payment Method:</strong> {contractData.compensation.paymentMethod}</p>
                    </div>
                    <div>
                      <p><strong>Insurance:</strong> {contractData.compensation.insurance}</p>
                      <p><strong>Vacation:</strong> {contractData.compensation.vacation}</p>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p><strong>Duration:</strong> {contractData.duration}</p>
                    </div>
                    <div>
                      <p><strong>Start Date:</strong> {contractData.startDate}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Signature/Status Panel */}
          <div className="lg:col-span-1">
            {renderSignaturePanel()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

  // Regular layout for worker and employer
  return (
    <div className="flex min-h-screen bg-gray-50">
      {userRole === "employer" ? <EmployerSidebar /> : <WorkerSidebar />}

      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={handleBack} className="mr-4">
            <ArrowLeft className="w-4 h-4" />
          </Button>
                      <div>
              <h1 className="text-2xl font-bold text-card-foreground">Contract Review & Signing</h1>
              <p className="text-muted-foreground">Review and sign your employment agreement</p>
            </div>
        </div>

        {/* Contract Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <FileText className="text-blue-600 text-2xl" />
                </div>
                <div>
                  <h2 className="font-bold text-xl">Employment Agreement</h2>
                  <p className="text-muted-foreground">Contract ID: {contractData.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-muted-foreground text-xs">Agency</p>
                  <p className="font-medium">{contractData.agency.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Position</p>
                  <p className="font-medium">{contractData.position}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Status</p>
                  <Badge variant="secondary" className={getStatusColor(contractData.status)}>
                    {getStatusText(contractData.status)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Signing Progress</h2>
              <span className="text-sm text-muted-foreground">{getStepText()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            <div className="flex justify-between">
              <div className="text-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold mb-2 mx-auto">
                  ✓
                </div>
                <div className="text-xs text-green-600 font-medium">Agency Created</div>
              </div>
              <div className="text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mb-2 mx-auto ${
                  contractData.employerSigned ? 'bg-green-500' : 'bg-blue-600'
                }`}>
                  {contractData.employerSigned ? '✓' : '2'}
                </div>
                <div className={`text-xs ${contractData.employerSigned ? 'text-green-600 font-medium' : 'text-blue-600'}`}>
                  Employer Sign
                </div>
              </div>
              <div className="text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mb-2 mx-auto ${
                  contractData.workerSigned ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  {contractData.workerSigned ? '✓' : '3'}
                </div>
                <div className={`text-xs ${contractData.workerSigned ? 'text-green-600 font-medium' : 'text-muted-foreground'}`}>
                  Worker Sign
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
                      <h4 className="font-bold mb-3 flex items-center">
                        <Building2 className="h-4 w-4 mr-2 text-blue-600" />
                        Agency
                      </h4>
                      <p><strong>Name:</strong> {contractData.agency.name}</p>
                      <p><strong>Address:</strong> {contractData.agency.address}</p>
                      <p><strong>Contact:</strong> {contractData.agency.contact}</p>
                      <p><strong>ID:</strong> {contractData.agency.id}</p>
                    </div>
                    <div>
                      <h4 className="font-bold mb-3 flex items-center">
                        <User className="h-4 w-4 mr-2 text-green-600" />
                        Worker
                      </h4>
                      <p><strong>Name:</strong> {contractData.worker.name}</p>
                      <p><strong>Nationality:</strong> {contractData.worker.nationality}</p>
                      <p><strong>Passport:</strong> {contractData.worker.passport}</p>
                      <p><strong>Worker ID:</strong> {contractData.worker.id}</p>
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
                  <div className="space-y-3">
                    <p><strong>Position:</strong> {contractData.position}</p>
                    <p><strong>Type:</strong> {contractData.details.type}</p>
                    <p><strong>Work Location:</strong> {contractData.details.location}</p>
                    <p><strong>Living Arrangement:</strong> {contractData.details.livingArrangement}</p>
                    <p><strong>Primary Duties:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      {contractData.details.duties.map((duty, index) => (
                        <li key={index}>{duty}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Work Schedule */}
                <div className="mb-8">
                  <h3 className="font-bold mb-4 flex items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                    Work Schedule
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p><strong>Daily Hours:</strong> {contractData.schedule.dailyHours}</p>
                      <p><strong>Standby Hours:</strong> {contractData.schedule.standbyHours}</p>
                      <p><strong>Rest Period:</strong> {contractData.schedule.restPeriod}</p>
                    </div>
                    <div>
                      <p><strong>Work Cycle:</strong> {contractData.schedule.workCycle}</p>
                      <p><strong>Weekly Off:</strong> {contractData.schedule.weeklyOff}</p>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p><strong>Monthly Salary:</strong> {contractData.compensation.monthlySalary}</p>
                      <p><strong>Payment Method:</strong> {contractData.compensation.paymentMethod}</p>
                    </div>
                    <div>
                      <p><strong>Insurance:</strong> {contractData.compensation.insurance}</p>
                      <p><strong>Vacation:</strong> {contractData.compensation.vacation}</p>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p><strong>Duration:</strong> {contractData.duration}</p>
                    </div>
                    <div>
                      <p><strong>Start Date:</strong> {contractData.startDate}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Signature/Status Panel */}
          <div className="lg:col-span-1">
            {renderSignaturePanel()}
          </div>
        </div>
      </div>
    </div>
  )
}
