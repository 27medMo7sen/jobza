"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Eye,
  RefreshCw,
  Upload,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { DocumentType } from "@/lib/document-config";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { addFile } from "@/lib/slices/authSlice";
import { useHttp } from "@/hooks/use-http";
import { toast } from "sonner";
import {
  FileUploadSkeleton,
  FilePreviewAreaSkeleton,
} from "@/components/ui/skeleton-loaders";

interface FilePreviewProps {
  documentType: DocumentType;
  isEditing: boolean;
}

export function FilePreview({ documentType, isEditing }: FilePreviewProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();
  const { files } = useSelector((state: RootState) => state.auth);
  const { post } = useHttp();

  // Get file data from Redux store
  const fileData = files?.[documentType.id] || null;
  const file = fileData || null;
  const status = file?.status || "pending";
  const rejectionReason = file?.rejectionReason;

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);

      // Create FormData
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", documentType.isImage ? "image" : "document");
      formData.append("label", documentType.id);

      // Upload to backend
      const result = await post<any>("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Create a data URL for the file to store in Redux
      const reader = new FileReader();
      reader.onload = () => {
        const fileData = {
          [documentType.id]: {
            url: result.url,
            fileName: result.fileName,
            s3Key: result.s3Key,
            status: result.status,
            rejectionReason: result.rejectionReason,
            size: result.size,
            type: result.fileType,
            // Store the data URL for immediate display
            dataUrl: reader.result as string,
          },
        };

        console.log("Adding file to Redux:", fileData);
        dispatch(addFile(fileData));

        toast.success("File Uploaded", {
          description: `${documentType.name} uploaded successfully`,
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Upload Failed", {
        description: `Failed to upload ${documentType.name}`,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isFileTypeValid(droppedFile)) {
      uploadFile(droppedFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && isFileTypeValid(selectedFile)) {
      uploadFile(selectedFile);
    }
    // Reset the input value after handling
    e.target.value = "";
  };

  const isFileTypeValid = (file: File): boolean => {
    return documentType.acceptedTypes.includes(file.type);
  };

  const handleFileOpen = (file: any) => {
    const url = getFileUrl(file);
    if (url) {
      window.open(url, "_blank");
    }
  };

  const handleFileReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && isFileTypeValid(selectedFile)) {
      uploadFile(selectedFile);
    }
    // Reset the input value after handling
    e.target.value = "";
  };

  const getStatusColor = () => {
    switch (status) {
      case "approved":
        return "border-green-500 bg-green-50";
      case "rejected":
        return "border-red-500 bg-red-50";
      default:
        return "border-gray-300 bg-gray-50";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return "0 Bytes";
    if (typeof bytes !== "number" || isNaN(bytes)) return "Unknown size";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileSizeDisplay = (file: any): string => {
    if (!file || !file.size) return "Unknown size";
    if (typeof file.size !== "number" || isNaN(file.size))
      return "Unknown size";
    return formatFileSize(file.size);
  };

  const getFileUrl = (file: any): string | null => {
    // Check if file is a proper File or Blob object
    if (file && (file instanceof File || file instanceof Blob)) {
      return URL.createObjectURL(file);
    }

    // If file has a URL property (from backend response), use that first for opening
    if (file && file.url) {
      return file.url;
    }

    // If file has a data URL (for immediate display), use that as fallback
    if (file && file.dataUrl) {
      return file.dataUrl;
    }

    return null;
  };

  if (!file) {
    // Show skeleton while uploading
    if (isUploading) {
      return <FileUploadSkeleton isImage={documentType.isImage} />;
    }

    return (
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Input
          type="file"
          accept={documentType.acceptedTypes.join(",")}
          onChange={handleFileInput}
          className="hidden"
          id={`upload-${documentType.id}`}
        />
        <label
          htmlFor={`upload-${documentType.id}`}
          className="cursor-pointer block"
        >
          <div className="text-center">
            <div className="text-4xl mb-2">{documentType.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {documentType.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {documentType.description}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Upload className="w-4 h-4" />
              <span>Click to upload or drag and drop</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Max size: {documentType.maxSize}MB
            </p>
            {documentType.required && (
              <span className="inline-block mt-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                Required
              </span>
            )}
          </div>
        </label>
      </div>
    );
  }

  return (
    <div
      className={`relative border-2 rounded-lg p-4 transition-all ${getStatusColor()}`}
    >
      {/* File Preview */}
      <div className="relative group">
        {isUploading ? (
          <FilePreviewAreaSkeleton isImage={documentType.isImage} />
        ) : (
          <>
            {documentType.isImage ? (
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                {getFileUrl(file) ? (
                  <img
                    src={getFileUrl(file)!}
                    alt={documentType.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
                <FileText className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </>
        )}

        {/* Hover Actions */}
        {!isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleFileOpen(file)}
            >
              <Eye className="w-4 h-4 mr-1" />
              Open
            </Button>
            {isEditing && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  const input = document.getElementById(
                    `replace-${documentType.id}`
                  ) as HTMLInputElement;
                  if (input) {
                    input.value = ""; // Reset the input value to allow selecting the same file
                    input.click();
                  }
                }}
                disabled={isUploading}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Replace
              </Button>
            )}
          </div>
        )}

        {/* Hidden file input for replace */}
        <Input
          type="file"
          accept={documentType.acceptedTypes.join(",")}
          onChange={handleFileReplace}
          className="hidden"
          id={`replace-${documentType.id}`}
        />
      </div>

      {/* File Info */}
      {!isUploading && file && (
        <div className="mt-3">
          <h3 className="font-semibold text-sm text-gray-900 mb-1">
            {documentType.name}
          </h3>
          <h4 className="font-medium text-xs text-gray-700 truncate mb-1">
            {file.fileName || "Unknown file"}
          </h4>
          <p className="text-xs text-gray-500">{getFileSizeDisplay(file)}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-600">
              {documentType.isImage ? "Image" : "Document"}
            </span>
            {status === "approved" && (
              <span className="text-xs text-green-600 font-medium">
                ✓ Approved
              </span>
            )}
            {status === "rejected" && (
              <span className="text-xs text-red-600 font-medium">
                ✗ Rejected
              </span>
            )}
          </div>
        </div>
      )}

      {/* Rejection Reason */}
      {!isUploading && status === "rejected" && rejectionReason && (
        <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded text-xs text-red-700">
          {rejectionReason}
        </div>
      )}
    </div>
  );
}
