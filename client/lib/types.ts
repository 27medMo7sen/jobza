export type UserRole = "family" | "worker" | "agency" | "admin"

export type JobType = "long-term" | "short-term"

export type ServiceType =
  | "housekeeping"
  | "childcare"
  | "elderly-care"
  | "cooking"
  | "pet-care"
  | "garden-maintenance"
  | "laundry-organization"

export type ServiceLevel = "basic" | "standard" | "premium" | "luxury"

export type CycleType = "one-time" | "daily" | "weekly" | "monthly" | "custom"

export type UrgencyLevel = "low" | "medium" | "high"

export type ApplicationStatus = "pending" | "accepted" | "rejected" | "withdrawn"

export type VerificationStatus = "pending" | "verified" | "rejected"

export interface User {
  id: string
  email: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
  isVerified: boolean
  verificationStatus: VerificationStatus
}

export interface FamilyProfile {
  id: string
  userId: string
  familyName: string
  familySize: number
  location: {
    address: string
    city: string
    country: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  preferences: string[]
  bio?: string
  avatar?: string
  phoneNumber?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
}

export interface WorkerProfile {
  id: string
  userId: string
  firstName: string
  lastName: string
  dateOfBirth: Date
  nationality: string
  languages: string[]
  skills: ServiceType[]
  experience: number // years
  bio: string
  avatar?: string
  phoneNumber: string
  availability: {
    days: string[]
    hours: {
      start: string
      end: string
    }
  }
  hourlyRate: {
    min: number
    max: number
    currency: string
  }
  documents: {
    type: string
    url: string
    verified: boolean
  }[]
  rating: number
  reviewCount: number
}

export interface AgencyProfile {
  id: string
  userId: string
  businessName: string
  licenseNumber: string
  establishedYear: number
  location: {
    address: string
    city: string
    country: string
  }
  services: ServiceType[]
  bio: string
  logo?: string
  phoneNumber: string
  email: string
  website?: string
  workerCount: number
  rating: number
  reviewCount: number
}

export interface Job {
  id: string
  familyId: string
  title: string
  description: string
  jobType: JobType
  serviceType: ServiceType
  serviceLevel: ServiceLevel
  cycleType: CycleType
  cycleFrequency?: number
  requiredTasks: string[]
  taskScope: Record<string, any>
  budget: {
    min: number
    max: number
    currency: string
  }
  location: {
    address: string
    city: string
    country: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  schedule: {
    startDate: Date
    endDate?: Date
    preferredTimes: {
      start: string
      end: string
    }
  }
  urgencyLevel: UrgencyLevel
  requirements: {
    experience: number
    languages: string[]
    skills: string[]
    backgroundCheck: boolean
  }
  status: "draft" | "published" | "in-progress" | "completed" | "cancelled"
  applicationsCount: number
  createdAt: Date
  updatedAt: Date
}

export interface JobApplication {
  id: string
  jobId: string
  workerId?: string
  agencyId?: string
  proposedRate: number
  coverLetter: string
  estimatedDuration?: number
  status: ApplicationStatus
  appliedAt: Date
  respondedAt?: Date
}

export interface Review {
  id: string
  jobId: string
  reviewerId: string
  revieweeId: string
  rating: number
  comment: string
  createdAt: Date
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  attachments?: {
    type: string
    url: string
    name: string
  }[]
  sentAt: Date
  readAt?: Date
}

export interface Conversation {
  id: string
  participants: string[]
  jobId?: string
  lastMessage?: Message
  createdAt: Date
  updatedAt: Date
}

export interface Contract {
  id: string
  contractId: string
  jobId: string
  agencyId: string
  workerId: string
  familyId: string
  position: {
    title: string
    type: string
    location: string
    duties: string[]
  }
  schedule: {
    dailyHours: string
    workCycle: string
    restPeriod: string
  }
  compensation: {
    monthlySalary: string
    currency: string
    benefits: string[]
  }
  duration: string
  startDate: Date
  endDate?: Date
  status: "draft" | "pending" | "signed" | "active" | "completed" | "terminated"
  agencySigned: boolean
  agencySignedAt?: Date
  workerSigned: boolean
  workerSignedAt?: Date
  createdAt: Date
  updatedAt: Date
}
