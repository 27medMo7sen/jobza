import React, { useState } from "react";
import IdentitySelectionList from "./identitySelectionList";
import Link from "next/link";

const UserIdentity: React.FC = () => {
  const [selectedIdentity, setSelectedIdentity] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-pink-500 text-gray-100 px-4 py-1 rounded-full text-sm mb-6">
            Join Care Comm-Unity
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Account Type
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Select the account type that best describes your role in the
            domestic work ecosystem
          </p>
        </div>

        {/* Identity Selection List */}
        <IdentitySelectionList
          selectedIdentity={selectedIdentity}
          onIdentitySelect={setSelectedIdentity}
        />

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth?mode=login"
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserIdentity;
