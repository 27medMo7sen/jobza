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

export function DocumentsSectionSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-8">
      {/* Required Documents Section */}
      <div className="mb-8">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <FileUploadSkeleton
              key={`required-${index}`}
              isImage={index === 0}
            />
          ))}
        </div>
      </div>

      {/* Optional Documents Section */}
      <div className="mb-8">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <FileUploadSkeleton key={`optional-${index}`} isImage={false} />
          ))}
        </div>
      </div>

      {/* Signature Section Skeleton */}
      <div>
        <Skeleton className="h-6 w-24 mb-2" />
        <Skeleton className="h-4 w-80 mb-4" />
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
          <div className="flex items-center justify-center">
            <Skeleton className="w-64 h-32" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Profile Header Skeleton
export function ProfileHeaderSkeleton(): React.JSX.Element {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <div className="flex items-center space-x-6">
        {/* Profile Photo Skeleton */}
        <div className="flex-shrink-0">
          <Skeleton className="w-24 h-24 rounded-full" />
        </div>

        {/* Profile Info Skeleton */}
        <div className="flex-1">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32 mb-1" />
          <Skeleton className="h-4 w-40" />
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex space-x-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
}

// Personal Information Skeleton
export function PersonalInformationSkeleton(): React.JSX.Element {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-9 w-16" />
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Nationality */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Address */}
          <div className="space-y-2 md:col-span-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Skills Section Skeleton
export function SkillsSectionSkeleton(): React.JSX.Element {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-16" />
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {/* Skills List */}
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-20 rounded-full" />
            ))}
          </div>

          {/* Available Skills */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-24 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Business Information Skeleton
export function BusinessInformationSkeleton(): React.JSX.Element {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Name */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* License Number */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Business Type */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Years in Business */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Description */}
          <div className="space-y-2 md:col-span-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Household Information Skeleton
export function HouseholdInformationSkeleton(): React.JSX.Element {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Family Size */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Children Ages */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Special Requirements */}
          <div className="space-y-2 md:col-span-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Admin Information Skeleton
export function AdminInformationSkeleton(): React.JSX.Element {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Admin Level */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Permissions */}
          <div className="space-y-2 md:col-span-2">
            <Skeleton className="h-4 w-24" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Status Sidebar Skeleton
export function StatusSidebarSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-6">
      {/* Profile Completion */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      </div>

      {/* Verification Status */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <Skeleton className="h-6 w-28 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
