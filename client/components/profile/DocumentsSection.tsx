"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePreview } from "./FilePreview";
import { getDocumentsForRole } from "@/lib/document-config";
import { ProfileData } from "@/types/profile";
import SignaturePad from "./SignatureSection";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

interface DocumentsSectionProps {
  profileData: ProfileData;
  isLoadingFiles?: boolean;
}

export function DocumentsSection({
  profileData,
  isLoadingFiles = false,
}: DocumentsSectionProps) {
  const roleDocuments = getDocumentsForRole(profileData?.role, profileData);

  const requiredDocuments = roleDocuments.filter((doc) => doc.required);
  const optionalDocuments = roleDocuments.filter((doc) => !doc.required);
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="text-blue-900">
            Documents & Verification
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Upload required documents for verification
          </p>
        </div>
      </CardHeader>
      <CardContent>
        {/* Required Documents */}
        {requiredDocuments.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Required Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {requiredDocuments.map((docType) => (
                <FilePreview
                  key={docType.id}
                  documentType={docType}
                  isEditing={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Optional Documents */}
        {optionalDocuments.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Optional Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {optionalDocuments.map((docType) => (
                <FilePreview
                  key={docType.id}
                  documentType={docType}
                  isEditing={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Signature Section */}
        {(profileData?.role === "worker" || profileData?.role === "employer") &&
          !profileData?.signature && (
            <div>
              <h3 className="text-lg font-semibold text-foreground ">
                Signature
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Once you have saved the signature, you will not be able to
                change it.
              </p>
              <SignaturePad />
            </div>
          )}
      </CardContent>
    </Card>
  );
}
