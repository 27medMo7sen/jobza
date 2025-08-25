export interface DocumentType {
  title: string;
  frontLabel: string;
  backLabel: string;
  label: string;
  acceptedTypes: string;
  hasBackSide?: boolean;
}

export interface DocumentFormData {
  frontFile: File | null;
  backFile: File | null;
  uploadDate: string;
}
