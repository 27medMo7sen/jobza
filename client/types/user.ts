// types/user.ts
export interface HouseholdComposition {
  adults: number;
  children: number;
  infants: number;
  elderly: number;
}

export interface BudgetRange {
  min: number;
  max: number;
  currency: string;
}

export interface WorkerData {
  userName: string;
  profilePicture: string;
  name: string;
  phoneNumber: string;
  gender: string;
  nationality: string;
  dateOfBirth: string;
  heighestEducationalLevel: string;
  skillSet: string[];
}

export interface EmployerData {
  profilePicture: string;
  name: string;
  phoneNumber: string;
  gender: string;
  nationality: string;
  dateOfBirth: string;
  country: string;
  householdSize: number;
  householdComposition: HouseholdComposition;
  homeType: string;
  serviceRequirements: string[];
  workingHours: string;
  preferredStartDate: string;
  budgetRange: BudgetRange;
}

export interface AgencyData {
  profilePicture: string;
  name: string;
  agencyType: string;
  registrationNumber: string;
  licenseNumber: string;
  establishmentDate: string;
  phoneNumber: string;
  nationality: string;
  country: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  businessDescription: string;
  yearsInBusiness: number;
  numberOfEmployees: number;
}

export interface AdminData {
  profilePicture: string;
  name: string;
  userName: string;
  gender: string;
  nationality: string;
  dateOfBirth: string;
  department: string;
  permissions: string[];
}

export interface User {
  profilePicture: {
    url: string;
    s3Key: string;
  };
  userName: string;
  name: string;
  phoneNumber: string;
  gender: string;
  nationality: string;
  dateOfBirth: string;
  heighestEducationalLevel: string;
  skillSet: string[];
  email: string;
  role: "worker" | "employer" | "agency" | "admin";
  data: WorkerData | EmployerData | AgencyData | AdminData;
  worker: WorkerData;
  employer: EmployerData;
  agency: AgencyData;
  admin: AdminData;
}
