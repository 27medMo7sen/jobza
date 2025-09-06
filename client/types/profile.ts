// types/profile.ts
import { User, WorkerData, EmployerData, AgencyData, AdminData } from "./user";

export type UserRole = "worker" | "employer" | "agency" | "admin";
export enum status {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}
export interface BaseProfileData {
  userName: string;
  name: string;
  email: string;
  phoneNumber: string;
  nationality: string;
  dateOfBirth: string;
  status: status;
  profilePicture: {
    url: string;
    s3Key: string;
  };
}

export interface WorkerProfileData extends BaseProfileData {
  role: "worker";
  gender: string;
  country: string;
  heighestEducationalLevel: string;
  skillSet: string[];
  data: WorkerData;
  signature: boolean;
}

export interface EmployerProfileData extends BaseProfileData {
  role: "employer";
  gender: string;
  country: string;
  householdSize: number;
  householdComposition: {
    adults: number;
    children: number;
    infants: number;
    elderly: number;
  };
  homeType: string;
  serviceRequirements: string[];
  workingHours: string;
  preferredStartDate: string;
  budgetRange: {
    min: number;
    max: number;
    currency: string;
  };
  data: EmployerData;
  signature: boolean;
}

export interface AgencyProfileData extends BaseProfileData {
  role: "agency";
  agencyType: string;
  registrationNumber: string;
  licenseNumber: string;
  establishmentDate: string;
  country: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  businessDescription: string;
  yearsInBusiness: number;
  numberOfEmployees: number;
  data: AgencyData;
}

export interface AdminProfileData extends BaseProfileData {
  role: "admin";
  gender: string;
  department: string;
  permissions: string[];
  data: AdminData;
}

export type ProfileData =
  | WorkerProfileData
  | EmployerProfileData
  | AgencyProfileData
  | AdminProfileData;

export interface DocumentStatus {
  file: File | null;
  status: status;
  rejectionReason?: string;
}

export interface ProfileConfig {
  role: UserRole;
  title: string;
  subtitle: string;
  sections: {
    personalInfo: boolean;
    skills: boolean;
    documents: boolean;
    businessInfo: boolean;
    householdInfo: boolean;
    adminInfo: boolean;
  };
  documents: {
    required: string[];
    optional: string[];
  };
  skills: {
    available: string[];
    custom: boolean;
  };
}
