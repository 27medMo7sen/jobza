// components/DocumentsTab.tsx
import React from "react";

export const DocumentsTab: React.FC = () => {
  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold text-foreground mb-6">Documents</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          "ID Document",
          "Work Permit",
          "Medical Certificate",
          "References",
        ].map((doc) => (
          <div
            key={doc}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="text-sm font-medium text-foreground mb-2">
              {doc}
            </div>
            <div className="text-xs text-gray-500 mb-3">
              Uploaded 2 days ago
            </div>
            <div className="flex gap-2">
              <button className="text-blue-600 hover:text-blue-700 text-xs">
                View
              </button>
              <button className="text-green-600 hover:text-green-700 text-xs">
                Download
              </button>
              <button className="text-orange-600 hover:text-orange-700 text-xs">
                Replace
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
