import { Skeleton } from "./skeleton";
import { Upload } from "lucide-react";
import React from "react";

interface FileUploadSkeletonProps {
  isImage?: boolean;
}

export function FileUploadSkeleton({
  isImage = false,
}: FileUploadSkeletonProps): React.JSX.Element {
  return (
    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6">
      <div className="text-center">
        {/* Icon skeleton */}
        <div className="flex justify-center mb-2">
          <Skeleton className="w-12 h-12 rounded-full" />
        </div>

        {/* Title skeleton */}
        <Skeleton className="h-6 w-32 mx-auto mb-1" />

        {/* Description skeleton */}
        <Skeleton className="h-4 w-48 mx-auto mb-4" />

        {/* Upload text skeleton */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="h-4 w-40" />
        </div>

        {/* File size skeleton */}
        <Skeleton className="h-3 w-20 mx-auto mb-2" />

        {/* Required badge skeleton */}
        <Skeleton className="h-6 w-16 mx-auto" />
      </div>

      {/* Upload progress overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-90 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <Upload className="w-8 h-8 text-blue-500 animate-bounce" />
          </div>
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>
      </div>
    </div>
  );
}

export function FilePreviewSkeleton({
  isImage = false,
}: FileUploadSkeletonProps): React.JSX.Element {
  return (
    <div className="relative border-2 rounded-lg p-4">
      {/* File Preview skeleton */}
      <div className="relative group">
        {isImage ? (
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
            <Skeleton className="w-full h-full" />
          </div>
        ) : (
          <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
            <Skeleton className="w-16 h-16" />
          </div>
        )}

        {/* Hover Actions skeleton */}
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>

      {/* File Info skeleton */}
      <div className="mt-3">
        <Skeleton className="h-4 w-32 mb-1" />
        <Skeleton className="h-3 w-16 mb-2" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

export function FilePreviewAreaSkeleton({
  isImage = false,
}: FileUploadSkeletonProps): React.JSX.Element {
  if (isImage) {
    return (
      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
      <Skeleton className="w-16 h-16" />
    </div>
  );
}
