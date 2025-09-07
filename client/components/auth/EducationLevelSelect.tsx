"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface EducationLevelSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

const EDUCATION_LEVELS = [
  { value: "", label: "Select Educational Level" },
  { value: "no_formal_education", label: "No Formal Education" },
  { value: "primary", label: "Primary School" },
  { value: "secondary", label: "Secondary School" },
  { value: "high_school", label: "High School" },
  { value: "diploma", label: "Diploma" },
  { value: "associate", label: "Associate Degree" },
  { value: "bachelor", label: "Bachelor's Degree" },
  { value: "master", label: "Master's Degree" },
  { value: "doctorate", label: "Doctorate/PhD" },
  { value: "professional", label: "Professional Degree" },
  { value: "other", label: "Other" },
];

export const EducationLevelSelect: React.FC<EducationLevelSelectProps> = ({
  value,
  onChange,
  error,
  required = false,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setShowDropdown(false);
  };

  const getSelectedOption = () => {
    return EDUCATION_LEVELS.find((option) => option.value === value);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Educational Level {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className={`w-full px-3 py-2 text-left border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          aria-label="Select educational level"
        >
          <div className="flex items-center justify-between">
            <span className={value ? "text-gray-900" : "text-gray-500"}>
              {getSelectedOption()?.label || "Select Educational Level"}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </button>

        {showDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            <div className="py-1">
              {EDUCATION_LEVELS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full px-3 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100 ${
                    option.value === value
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-900"
                  } ${option.value === "" ? "text-gray-500" : ""}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
