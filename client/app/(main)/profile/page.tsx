"use client";
import { DOCUMENT_TYPES } from "@/config/documentsType";
import DocumentForm from "@/components/profile/documentForm";
import { DocumentFormData } from "@/types/documents";

export default function DocumentsPage() {
  const handleDocumentSubmit = (
    documentKey: string,
    data: DocumentFormData
  ) => {
    console.log(`Submitting ${documentKey}:`, data);
    // Handle the form submission here
  };

  return (
    <div className="container w-full px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">
        Document Upload
      </h1>

      <div className="flex flex-wrap gap-4 mb-8">
        {Object.entries(DOCUMENT_TYPES).map(([key, documentType]) => (
          <DocumentForm
            key={key}
            documentType={documentType}
            onSubmit={(data) => handleDocumentSubmit(key, data)}
          />
        ))}
      </div>
    </div>
  );
}
