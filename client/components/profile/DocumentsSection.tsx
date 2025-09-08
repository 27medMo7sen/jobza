"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePreview } from "./FilePreview";
import { getDocumentsForRole } from "@/lib/document-config";
import { ProfileData } from "@/types/profile";
import SignaturePad from "./SignatureSection";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { clearFiles } from "@/lib/slices/authSlice";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface DocumentsSectionProps {
  profileData: ProfileData;
  isLoadingFiles?: boolean;
}

export function DocumentsSection({
  profileData,
  isLoadingFiles = false,
}: DocumentsSectionProps) {
  const { files } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);
  const roleDocuments = getDocumentsForRole(
    profileData?.role || "worker",
    profileData
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  // console.log("DocumentsSection - files from Redux:", files);
  // console.log("DocumentsSection - roleDocuments:", roleDocuments);

  const handleClearFiles = () => {
    dispatch(clearFiles());
    console.log("Files cleared from Redux");
  };

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
        {/* Loading State */}
        {isLoadingFiles && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">
                Loading documents...
              </span>
            </div>
          </div>
        )}

        {/* Required Documents */}
        {!isLoadingFiles && requiredDocuments.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Required Documents
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        {!isLoadingFiles && optionalDocuments.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Optional Documents
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        {!isLoadingFiles &&
          (profileData?.role === "worker" ||
            profileData?.role === "employer") &&
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

        {/* Debug Section - Remove in production */}
        {/* {!isLoadingFiles && isClient && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-sm text-yellow-900 mb-2">
              Debug Info (Remove in production)
            </h4>
            <div className="text-xs text-yellow-800 mb-2">
              <p>Profile Role: {profileData?.role}</p>
              <p>Required Documents: {requiredDocuments.length}</p>
              <p>Optional Documents: {optionalDocuments.length}</p>
              <p>Files in Redux: {Object.keys(files || {}).length} files</p>
              <p>Files: {JSON.stringify(files, null, 2)}</p>
              <p>Role Documents: {JSON.stringify(roleDocuments, null, 2)}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleClearFiles}
              className="text-xs"
            >
              Clear All Files
            </Button>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
}
