import { DocumentType } from "@/types/documents";

export const DOCUMENT_TYPES: Record<string, DocumentType> = {
  passport: {
    title: "Passport",
    frontLabel: "Front face",
    backLabel: "Back face",
    label: "passport",
    acceptedTypes: "image/*,.pdf",
    hasBackSide: false,
  },
  workVisa: {
    title: "Work Visa/Student Permit",
    frontLabel: "Front face",
    backLabel: "Back face",
    label: "residence_permit",
    acceptedTypes: "image/*,.pdf",
    hasBackSide: false,
  },
  medicalCert: {
    title: "Medical Certificate",
    frontLabel: "Front face",
    backLabel: "Back face",
    label: "medical_certificate",
    acceptedTypes: "image/*,.pdf",
    hasBackSide: false,
  },
  educationalCert: {
    title: "Educational Certificate",
    frontLabel: "Front face",
    backLabel: "Back face",
    label: "educational_certificate",
    acceptedTypes: "image/*,.pdf",
    hasBackSide: false,
  },
  experienceLetter: {
    title: "Experience Letter",
    frontLabel: "Document",
    backLabel: "Additional pages",
    label: "experience_letter",
    acceptedTypes: "image/*,.pdf",
    hasBackSide: false,
  },
  policeCheck: {
    title: "Police Check Certificate",
    frontLabel: "Front face",
    backLabel: "Back face",
    label: "police_clearance_certificate",
    acceptedTypes: "image/*,.pdf",
    hasBackSide: false,
  },
};
