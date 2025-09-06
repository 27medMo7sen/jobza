// lib/profile-config.ts
import { ProfileConfig } from "@/types/profile";

export const PROFILE_CONFIGS: Record<string, ProfileConfig> = {
  worker: {
    role: "worker",
    title: "Worker Profile",
    subtitle: "Manage your professional profile and skills",
    sections: {
      personalInfo: true,
      skills: true,
      documents: true,
      businessInfo: false,
      householdInfo: false,
      adminInfo: false,
    },
    documents: {
      required: [
        "facePhoto",
        "fullBodyPhoto",
        "passportId",
        "educationalCertificate",
        "medicalCertificate",
        "visa",
        "nationalId",
        "experienceLetter",
        "policeClearance",
        "signature",
      ],
      optional: [],
    },
    skills: {
      available: [
        "House Cleaning",
        "Deep Cleaning",
        "Laundry & Ironing",
        "Kitchen Cleaning",
        "Elderly Care",
        "Child Care",
        "Pet Care",
        "Garden Maintenance",
        "Cooking",
        "Organization",
        "Window Cleaning",
        "Carpet Cleaning",
        "Bathroom Cleaning",
      ],
      custom: true,
    },
  },
  employer: {
    role: "employer",
    title: "Employer Profile",
    subtitle: "Manage your household and service requirements",
    sections: {
      personalInfo: true,
      skills: false,
      documents: true,
      businessInfo: false,
      householdInfo: true,
      adminInfo: false,
    },
    documents: {
      required: ["facePhoto", "nationalId", "proofOfAddress"],
      optional: ["employmentLetter", "incomeProof"],
    },
    skills: {
      available: [],
      custom: false,
    },
  },
  agency: {
    role: "agency",
    title: "Agency Profile",
    subtitle: "Manage your agency information and business details",
    sections: {
      personalInfo: true,
      skills: false,
      documents: true,
      businessInfo: true,
      householdInfo: false,
      adminInfo: false,
    },
    documents: {
      required: [
        "businessLicense",
        "registrationCertificate",
        "insuranceCertificate",
      ],
      optional: ["taxCertificate", "complianceDocuments"],
    },
    skills: {
      available: [],
      custom: false,
    },
  },
  admin: {
    role: "admin",
    title: "Admin Profile",
    subtitle: "Manage your administrative profile and permissions",
    sections: {
      personalInfo: true,
      skills: false,
      documents: true,
      businessInfo: false,
      householdInfo: false,
      adminInfo: true,
    },
    documents: {
      required: ["facePhoto", "idDocument"],
      optional: ["backgroundCheck", "securityClearance"],
    },
    skills: {
      available: [],
      custom: false,
    },
  },
};

export const getProfileConfig = (role: string): ProfileConfig => {
  return PROFILE_CONFIGS[role] || PROFILE_CONFIGS.worker;
};
