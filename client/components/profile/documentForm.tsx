"use client";

import { useState, useRef, DragEvent } from "react";
import { DocumentType, DocumentFormData } from "@/types/documents";

interface FileDropZoneProps {
  label: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  acceptedTypes: string;
  id: string;
}

function FileDropZone({
  label,
  file,
  onFileChange,
  acceptedTypes,
  id,
}: FileDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setIsUploading(true);
      onFileChange(droppedFiles[0]);
      setIsUploading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setIsUploading(true);
      onFileChange(selectedFile);
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-w-sm">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ease-in-out cursor-pointer bg-card border-border
          ${
            isDragOver
              ? "border-blue-400 bg-blue-50 scale-105 shadow-lg"
              : file
              ? "border-green-400 bg-green-50"
              : ""
          }
          ${isUploading ? "animate-pulse" : ""}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !file && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          onChange={handleFileSelect}
          className="hidden"
          id={id}
        />

        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-3"></div>
            <span className="text-sm text-blue-600 font-medium">
              Uploading...
            </span>
          </div>
        ) : file ? (
          <div className="flex flex-col items-center">
            <div className="animate-bounce">
              <svg
                className="w-8 h-8 text-green-500 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-sm text-green-700 font-medium mb-2 max-w-32 overflow-hidden text-ellipsis whitespace-nowrap">
              {file.name}
            </span>
            <span className="text-xs text-gray-500 mb-3">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="text-xs text-red-600 hover:text-red-800 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-full transition-colors duration-200"
            >
              Remove
            </button>
          </div>
        ) : isDragOver ? (
          <div className="flex flex-col items-center">
            <div className="animate-bounce">
              <svg
                className="w-12 h-12 text-blue-400 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 12l2 2 4-4"
                />
              </svg>
            </div>
            <span className="text-blue-600 font-medium">
              Drop your file here!
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-foreground">
            <div className="transition-transform duration-200 hover:scale-110">
              <svg
                className="w-10 h-10 text-foreground mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <span className=" font-medium mb-1">
              Drag & drop or click to upload
            </span>
            <span className="text-xs">PNG, JPG, PDF up to 5MB</span>
          </div>
        )}

        {/* Animated overlay for drag state */}
        {isDragOver && (
          <div className="absolute inset-0 bg-primary/50 bg-opacity-10 rounded-lg animate-pulse"></div>
        )}
      </div>
    </div>
  );
}

interface DocumentFormProps {
  documentType: DocumentType;
  onSubmit: (data: DocumentFormData) => void;
  className?: string;
}

export default function DocumentForm({
  documentType,
  onSubmit,
  className = "",
}: DocumentFormProps) {
  const [formData, setFormData] = useState<DocumentFormData>({
    frontFile: null,
    backFile: null,
    uploadDate: "",
  });

  const handleFileChange = (side: "front" | "back", file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      [side === "front" ? "frontFile" : "backFile"]: file,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div
      className={`bg-card border border-gray-200 rounded-lg p-6 ${className} text-foreground`}
    >
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <h2 className="text-lg font-semibold   mb-4">{documentType.title}</h2>

        {/* File Upload Section */}
        <div className={``}>
          {/* Front File */}
          <FileDropZone
            label={documentType.label}
            file={formData.frontFile}
            onFileChange={(file) => handleFileChange("front", file)}
            acceptedTypes={documentType.acceptedTypes}
            id={`front-${documentType.title
              .replace(/\s+/g, "-")
              .toLowerCase()}`}
          />

          {/* Back File (if applicable) */}
          {documentType.hasBackSide && (
            <FileDropZone
              label={documentType.backLabel}
              file={formData.backFile}
              onFileChange={(file) => handleFileChange("back", file)}
              acceptedTypes={documentType.acceptedTypes}
              id={`back-${documentType.title
                .replace(/\s+/g, "-")
                .toLowerCase()}`}
            />
          )}
        </div>

        {/* Upload Date */}
        <div className="mb-4">
          <label className="block text-sm font-medium  mb-2">Upload Date</label>
          <input
            type="date"
            value={formData.uploadDate}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, uploadDate: e.target.value }))
            }
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={
            !formData.frontFile ||
            (documentType.hasBackSide && !formData.backFile)
          }
          className={`
            w-full py-3 px-6 rounded-xl font-semibold text-foreground transition-all duration-300 transform
            ${
              !formData.frontFile ||
              (documentType.hasBackSide && !formData.backFile)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-primary/80 hover:scale-105 hover:shadow-lg active:scale-95"
            }
          `}
        >
          {!formData.frontFile ||
          (documentType.hasBackSide && !formData.backFile)
            ? "Please upload required files"
            : `Upload ${documentType.title}`}
        </button>
      </form>
    </div>
  );
}
