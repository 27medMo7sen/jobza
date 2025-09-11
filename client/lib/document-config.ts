// lib/document-config.ts
export interface DocumentType {
  id: string;
  name: string;
  description: string;
  required: boolean;
  acceptedTypes: string[];
  maxSize: number; // in MB
  isImage: boolean;
  icon: string;
  isViewOnly?: boolean;
}

export const DOCUMENT_TYPES: Record<string, DocumentType> = {
  // Worker Documents
  facePhoto: {
    id: "face_photo",
    name: "Face Photo",
    description: "Clear photo of your face for identification",
    required: true,
    acceptedTypes: ["image/jpeg", "image/png", "image/webp"],
    maxSize: 5,
    isImage: true,
    icon: "📷",
  },
  fullBodyPhoto: {
    id: "full_body_photo",
    name: "Full Body Photo",
    description: "Full body photo for identification",
    required: true,
    acceptedTypes: ["image/jpeg", "image/png", "image/webp"],
    maxSize: 5,
    isImage: true,
    icon: "👤",
  },
  passport: {
    id: "passport",
    name: "Passport",
    description: "Valid passport document",
    required: true,
    acceptedTypes: ["image/jpeg", "image/png", "application/pdf"],
    maxSize: 10,
    isImage: false,
    icon: "🆔",
  },
  educationalCertificate: {
    id: "educational_certificate",
    name: "Educational Certificate",
    description: "Highest educational qualification certificate",
    required: true,
    acceptedTypes: ["image/jpeg", "image/png", "application/pdf"],
    maxSize: 10,
    isImage: false,
    icon: "🎓",
  },
  medicalCertificate: {
    id: "medical_certificate",
    name: "Medical Certificate",
    description: "Health clearance certificate ",
    required: true,
    acceptedTypes: ["image/jpeg", "image/png", "application/pdf"],
    maxSize: 10,
    isImage: false,
    icon: "🏥",
  },
  visa: {
    id: "visa",
    name: "Visa",
    description: "Work visa or residence permit ",
    required: true,
    acceptedTypes: ["image/jpeg", "image/png", "application/pdf"],
    maxSize: 10,
    isImage: false,
    icon: "✈️",
  },
  experienceLetter: {
    id: "experience_letter",
    name: "Experience Letter",
    description: "Previous work experience letter ",
    required: true,
    acceptedTypes: ["image/jpeg", "image/png", "application/pdf"],
    maxSize: 10,
    isImage: false,
    icon: "📄",
  },
  policeClearance: {
    id: "police_clearance_certificate",
    name: "Police Clearance",
    description: "Criminal background check ",
    required: true,
    acceptedTypes: ["image/jpeg", "image/png", "application/pdf"],
    maxSize: 10,
    isImage: false,
    icon: "🛡️",
  },

  // Employer Documents
  nationalId: {
    id: "national_id",
    name: "National ID",
    description: "Valid national identification document",
    required: true,
    acceptedTypes: ["image/jpeg", "image/png", "application/pdf"],
    maxSize: 10,
    isImage: false,
    icon: "🆔",
  },
  proofOfAddress: {
    id: "proof_of_address",
    name: "Proof of Address",
    description: "Utility bill or bank statement showing your address",
    required: true,
    acceptedTypes: ["image/jpeg", "image/png", "application/pdf"],
    maxSize: 10,
    isImage: false,
    icon: "🏠",
  },
  employmentLetter: {
    id: "employmentLetter",
    name: "Employment Letter",
    description: "Employment verification letter ",
    required: true,
    acceptedTypes: ["image/jpeg", "image/png", "application/pdf"],
    maxSize: 10,
    isImage: false,
    icon: "💼",
  },
  incomeProof: {
    id: "incomeProof",
    name: "Income Proof",
    description: "Salary certificate or bank statement ",
    required: true,
    acceptedTypes: ["image/jpeg", "image/png", "application/pdf"],
    maxSize: 10,
    isImage: false,
    icon: "💰",
  },

  // Agency Documents
  businessLicense: {
    id: "businessLicense",
    name: "Business License",
    description: "Valid business operating license",
    required: true,
    acceptedTypes: ["image/jpeg", "image/png", "application/pdf"],
    maxSize: 10,
    isImage: false,
    icon: "📋",
  },
  registrationCertificate: {
    id: "registrationCertificate",
    name: "Registration Certificate",
    description: "Company registration certificate",
    required: true,
    acceptedTypes: ["image/jpeg", "image/png", "application/pdf"],
    maxSize: 10,
    isImage: false,
    icon: "📜",
  },
  insuranceCertificate: {
    id: "insuranceCertificate",
    name: "Insurance Certificate",
    description: "Professional liability insurance certificate",
    required: true,
    acceptedTypes: ["image/jpeg", "image/png", "application/pdf"],
    maxSize: 10,
    isImage: false,
    icon: "🛡️",
  },
  taxCertificate: {
    id: "taxCertificate",
    name: "Tax Certificate",
    description: "Tax registration certificate ",
    required: true,
    acceptedTypes: ["image/jpeg", "image/png", "application/pdf"],
    maxSize: 10,
    isImage: false,
    icon: "🧾",
  },
  complianceDocuments: {
    id: "complianceDocuments",
    name: "Compliance Documents",
    description: "Additional compliance certificates ",
    required: true,
    acceptedTypes: ["image/jpeg", "image/png", "application/pdf"],
    maxSize: 10,
    isImage: false,
    icon: "✅",
  },

  // Admin Documents
  idDocument: {
    id: "idDocument",
    name: "ID Document",
    description: "Valid identification document",
    required: true,
    acceptedTypes: ["image/jpeg", "image/png", "application/pdf"],
    maxSize: 10,
    isImage: false,
    icon: "🆔",
  },
  backgroundCheck: {
    id: "backgroundCheck",
    name: "Background Check",
    description: "Security clearance background check ",
    required: true,
    acceptedTypes: ["image/jpeg", "image/png", "application/pdf"],
    maxSize: 10,
    isImage: false,
    icon: "🔍",
  },
  securityClearance: {
    id: "securityClearance",
    name: "Security Clearance",
    description: "Security clearance certificate ",
    required: true,
    acceptedTypes: ["image/jpeg", "image/png", "application/pdf"],
    maxSize: 10,
    isImage: false,
    icon: "🔐",
  },
  signature: {
    id: "signature",
    name: "Signature",
    description: "Digital signature for document verification",
    required: true,
    acceptedTypes: ["image/jpeg", "image/png", "image/webp"],
    maxSize: 2,
    isImage: true,
    icon: "✍️",
    isViewOnly: true,
  },
};

export const getDocumentType = (id: string): DocumentType | undefined => {
  return DOCUMENT_TYPES[id];
};

export const getDocumentsForRole = (
  role: string,
  profileData?: any
): DocumentType[] => {
  const roleDocuments: Record<string, string[]> = {
    worker: [
      "facePhoto",
      "fullBodyPhoto",
      "educationalCertificate",
      "medicalCertificate",
      "experienceLetter",
      "policeClearance",
      "signature",
    ],
    employer: [
      "facePhoto",
      "nationalId",
      "proofOfAddress",
      "employmentLetter",
      "incomeProof",
      "signature",
    ],
    agency: [
      "facePhoto",
      "businessLicense",
      "registrationCertificate",
      "insuranceCertificate",
      "taxCertificate",
      "complianceDocuments",
    ],
    // admin: ["facePhoto", "idDocument", "backgroundCheck", "securityClearance"],
    admin: [],
  };

  // For workers, conditionally add passport/visa or national ID based on country vs nationality
  if (role === "worker" && profileData) {
    const isSameCountry = profileData.country === profileData.nationality;

    if (isSameCountry) {
      // If country equals nationality, only ask for national ID
      roleDocuments.worker.push("nationalId");
    } else {
      // If different country, ask for passport and visa
      roleDocuments.worker.push("passport", "visa");
    }
  } else if (role === "worker") {
    // Default case when no profile data is provided - include both passport and visa
    roleDocuments.worker.push("passport", "visa");
  }

  const documentIds = roleDocuments[role] || [];
  return documentIds.map((id) => DOCUMENT_TYPES[id]).filter(Boolean);
};
