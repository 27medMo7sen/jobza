export interface DocumentType {
  title: string;
  frontLabel: string;
  backLabel: string;
  label: string;
  acceptedTypes: string;
  hasBackSide?: boolean;
  isViewOnly?: boolean;
  isImage?: boolean;
}

export interface DocumentFormData {
  file: File | null;
  uploadDate: string;
  expiryDate: string;
  issueDate: string;
}
