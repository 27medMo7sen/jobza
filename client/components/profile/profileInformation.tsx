// components/ProfileInformation.tsx
import React from "react";
import { Edit2 } from "lucide-react";
import WorkerSignupForm from "../auth/workerSignupForm";

interface ProfileInformationProps {
  data: any;
  role: string;
  isEditing: boolean;
  onEditToggle: () => void;
}

export const ProfileInformation: React.FC<ProfileInformationProps> = ({
  data,
  role,
  isEditing,
  onEditToggle,
}) => {
  const formatFieldName = (key: string): string => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/([a-z])([A-Z])/g, "$1 $2");
  };

  const formatValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    if (typeof value === "object" && value !== null) {
      return Object.entries(value)
        .map(([k, v]) => `${formatFieldName(k)}: ${v}`)
        .join(", ");
    }
    if (typeof value === "string" && value.includes("T00:00:00.000Z")) {
      return new Date(value).toLocaleDateString();
    }
    return String(value);
  };

  const renderDataFields = (data: any) => {
    const entries = Object.entries(data);
    const midPoint = Math.ceil(entries.length / 2);
    const leftColumn = entries.slice(0, midPoint);
    const rightColumn = entries.slice(midPoint);

    return (
      <div className="grid md:grid-cols-2 gap-6 w-full">
        <div className="space-y-4">
          {leftColumn.map(([key, value]) => (
            <div key={key} className="border-b pb-2">
              <label className="text-sm font-medium text-muted-foreground block mb-1">
                {formatFieldName(key)}
              </label>
              <div className="text-foreground">{formatValue(value)}</div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {rightColumn.map(([key, value]) => (
            <div key={key} className="border-b pb-2">
              <label className="text-sm font-medium text-muted-foreground block mb-1">
                {formatFieldName(key)}
              </label>
              <div className="text-foreground">{formatValue(value)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-foreground">
          User Information
        </h2>
        <button
          onClick={onEditToggle}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-gray-100 rounded-lg transition-colors"
        >
          <Edit2 size={16} />
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {isEditing ? (
        role === "worker" ? (
          <WorkerSignupForm />
        ) : (
          <></>
        )
      ) : (
        renderDataFields(data)
      )}
    </div>
  );
};
