import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import Input from "@/components/auth/input";
import useInput from "@/hooks/use-input";
import Link from "next/link";

// Validation functions
const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

const validateEmail = (value: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

const validatePhone = (value: string): boolean => {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  return phoneRegex.test(value);
};

const validatePassword = (value: string): boolean => {
  return value.length >= 8;
};

const validateUrl = (value: string): boolean => {
  return value === "" || /^https?:\/\/.+/.test(value);
};

const validateNumber = (value: string): boolean => {
  return /^\d+$/.test(value);
};

const validateYear = (value: string): boolean => {
  return (
    /^\d{4}$/.test(value) &&
    parseInt(value) >= 1900 &&
    parseInt(value) <= new Date().getFullYear()
  );
};

const AgencySignupForm: React.FC = () => {
  // Initialize form inputs with useInput hook
  const agencyName = useInput(validateRequired);
  const registrationNumber = useInput(validateRequired);
  const licenseNumber = useInput(validateRequired);
  const establishmentDate = useInput(validateRequired);
  const email = useInput(validateEmail);
  const phoneNumber = useInput(validatePhone);
  const website = useInput(validateUrl);
  const streetAddress = useInput(validateRequired);
  const city = useInput(validateRequired);
  const stateProvince = useInput(validateRequired);
  const country = useInput(validateRequired);
  const postalCode = useInput(validateRequired);
  const businessDescription = useInput(validateRequired);
  const yearsInBusiness = useInput(validateYear);
  const numberOfEmployees = useInput(validateNumber);
  const password = useInput(validatePassword);
  const confirmPassword = useInput(
    (value: string) => value === password.value && value.length >= 8
  );

  // Dropdown states
  const [agencyType, setAgencyType] = useState("");
  const [showAgencyTypeDropdown, setShowAgencyTypeDropdown] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  const agencyTypes = [
    "Marketing Agency",
    "Advertising Agency",
    "Digital Agency",
    "Creative Agency",
    "Public Relations",
    "Consulting Agency",
    "Other",
  ];

  const handleInputChange = (field: string, value: string) => {
    if (field === "agencyType") {
      setAgencyType(value);
    }
  };
  const isFormValid =
    agencyName.isValid &&
    agencyType &&
    registrationNumber.isValid &&
    licenseNumber.isValid &&
    establishmentDate.isValid &&
    email.isValid &&
    phoneNumber.isValid &&
    streetAddress.isValid &&
    city.isValid &&
    stateProvince.isValid &&
    country.isValid &&
    postalCode.isValid &&
    businessDescription.isValid &&
    yearsInBusiness.isValid &&
    numberOfEmployees.isValid &&
    password.isValid &&
    confirmPassword.isValid &&
    acceptedTerms &&
    acceptedPrivacy;
  const handleSubmit = () => {
    // Validate all required fields

    if (isFormValid) {
      const formData = {
        agencyName: agencyName.value,
        agencyType,
        registrationNumber: registrationNumber.value,
        licenseNumber: licenseNumber.value,
        establishmentDate: establishmentDate.value,
        email: email.value,
        phoneNumber: phoneNumber.value,
        website: website.value,
        streetAddress: streetAddress.value,
        city: city.value,
        stateProvince: stateProvince.value,
        country: country.value,
        postalCode: postalCode.value,
        businessDescription: businessDescription.value,
        yearsInBusiness: yearsInBusiness.value,
        numberOfEmployees: numberOfEmployees.value,
        password: password.value,
      };
      console.log("Form submitted:", formData);
    } else {
      // Touch all fields to show validation errors
      agencyName.onBlur();
      registrationNumber.onBlur();
      licenseNumber.onBlur();
      establishmentDate.onBlur();
      email.onBlur();
      phoneNumber.onBlur();
      streetAddress.onBlur();
      city.onBlur();
      stateProvince.onBlur();
      country.onBlur();
      postalCode.onBlur();
      businessDescription.onBlur();
      yearsInBusiness.onBlur();
      numberOfEmployees.onBlur();
      password.onBlur();
      confirmPassword.onBlur();
      console.log("Please fill all required fields correctly");
    }
  };

  const handleGoogleSignUp = () => {
    console.log("Sign up with Google clicked");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Create Agency Account
            </h1>
          </div>

          {/* Google Sign Up Button */}
          <Link
            href="http://localhost:3000/auth/google?role=agency"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 mb-6 text-black"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <hr className="flex-1 border-gray-200" />
            <span className="text-gray-500 text-sm">OR</span>
            <hr className="flex-1 border-gray-200" />
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Agency Information Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">
                Agency Information
              </h2>

              {/* Agency Name and Type Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Agency Name"
                  type="text"
                  placeholder="Enter agency name"
                  required
                  value={agencyName.value}
                  onChange={agencyName.onChange}
                  onBlur={agencyName.onBlur}
                  hasError={agencyName.hasError}
                  errorMessage="Agency name is required"
                />
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Agency Type <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setShowAgencyTypeDropdown(!showAgencyTypeDropdown)
                    }
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between"
                  >
                    <span
                      className={agencyType ? "text-gray-900" : "text-gray-500"}
                    >
                      {agencyType || "Select agency type"}
                    </span>
                    <ChevronDown size={20} className="text-gray-400" />
                  </button>
                  {showAgencyTypeDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      {agencyTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            handleInputChange("agencyType", type);
                            setShowAgencyTypeDropdown(false);
                          }}
                          className="w-full px-3 py-2 text-left text-black hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Registration Number and License Number Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Registration Number"
                  type="text"
                  placeholder="Enter registration number"
                  required
                  value={registrationNumber.value}
                  onChange={registrationNumber.onChange}
                  onBlur={registrationNumber.onBlur}
                  hasError={registrationNumber.hasError}
                  errorMessage="Registration number is required"
                />
                <Input
                  label="License Number"
                  type="text"
                  placeholder="Enter license number"
                  required
                  value={licenseNumber.value}
                  onChange={licenseNumber.onChange}
                  onBlur={licenseNumber.onBlur}
                  hasError={licenseNumber.hasError}
                  errorMessage="License number is required"
                />
              </div>

              {/* Establishment Date */}
              <Input
                label="Establishment Date"
                type="date"
                required
                value={establishmentDate.value}
                onChange={establishmentDate.onChange}
                onBlur={establishmentDate.onBlur}
                hasError={establishmentDate.hasError}
                errorMessage="Establishment date is required"
              />
            </div>

            {/* Contact Person Information Section */}
            <div className="space-y-4">
              {/* Email and Phone Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter email address"
                  required
                  value={email.value}
                  onChange={email.onChange}
                  onBlur={email.onBlur}
                  hasError={email.hasError}
                  errorMessage="Please enter a valid email address"
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="Enter phone number"
                  required
                  value={phoneNumber.value}
                  onChange={phoneNumber.onChange}
                  onBlur={phoneNumber.onBlur}
                  hasError={phoneNumber.hasError}
                  errorMessage="Please enter a valid phone number"
                />
              </div>

              {/* Website */}
              <Input
                label="Website"
                type="url"
                placeholder="https://example.com"
                value={website.value}
                onChange={website.onChange}
                onBlur={website.onBlur}
                hasError={website.hasError}
                errorMessage="Please enter a valid URL"
              />
            </div>

            {/* Address Information Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">
                Address Information
              </h2>

              {/* Street Address */}
              <Input
                label="Street Address"
                type="text"
                placeholder="Enter street address"
                required
                value={streetAddress.value}
                onChange={streetAddress.onChange}
                onBlur={streetAddress.onBlur}
                hasError={streetAddress.hasError}
                errorMessage="Street address is required"
              />

              {/* City, State, Country, Postal Code Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                  label="City"
                  type="text"
                  placeholder="Enter city"
                  required
                  value={city.value}
                  onChange={city.onChange}
                  onBlur={city.onBlur}
                  hasError={city.hasError}
                  errorMessage="City is required"
                />
                <Input
                  label="State/Province"
                  type="text"
                  placeholder="Enter state/province"
                  required
                  value={stateProvince.value}
                  onChange={stateProvince.onChange}
                  onBlur={stateProvince.onBlur}
                  hasError={stateProvince.hasError}
                  errorMessage="State/Province is required"
                />
                <Input
                  label="Country"
                  type="text"
                  placeholder="Enter country"
                  required
                  value={country.value}
                  onChange={country.onChange}
                  onBlur={country.onBlur}
                  hasError={country.hasError}
                  errorMessage="Country is required"
                />
                <Input
                  label="Postal Code"
                  type="text"
                  placeholder="Enter postal code"
                  required
                  value={postalCode.value}
                  onChange={postalCode.onChange}
                  onBlur={postalCode.onBlur}
                  hasError={postalCode.hasError}
                  errorMessage="Postal code is required"
                />
              </div>
            </div>

            {/* Business Information Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">
                Business Information
              </h2>

              {/* Business Description */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Business Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={businessDescription.value}
                  onChange={businessDescription.onChange}
                  onBlur={businessDescription.onBlur}
                  placeholder="Describe your agency's services, mission, and expertise"
                  rows={4}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                    businessDescription.hasError
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {businessDescription.hasError && (
                  <p className="mt-1 text-sm text-red-600">
                    Business description is required
                  </p>
                )}
              </div>

              {/* Years in Business and Number of Employees Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Years in Business"
                  type="text"
                  placeholder="Enter founding year (e.g., 2020)"
                  required
                  value={yearsInBusiness.value}
                  onChange={yearsInBusiness.onChange}
                  onBlur={yearsInBusiness.onBlur}
                  hasError={yearsInBusiness.hasError}
                  errorMessage="Please enter a valid year"
                />
                <Input
                  label="Number of Employees"
                  type="text"
                  placeholder="Enter number of employees"
                  required
                  value={numberOfEmployees.value}
                  onChange={numberOfEmployees.onChange}
                  onBlur={numberOfEmployees.onBlur}
                  hasError={numberOfEmployees.hasError}
                  errorMessage="Please enter a valid number"
                />
              </div>
            </div>

            {/* Account Information Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">
                Account Information
              </h2>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  required
                  value={password.value}
                  onChange={password.onChange}
                  onBlur={password.onBlur}
                  hasError={password.hasError}
                  errorMessage="Password must be at least 8 characters long"
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm password"
                  required
                  value={confirmPassword.value}
                  onChange={confirmPassword.onChange}
                  onBlur={confirmPassword.onBlur}
                  hasError={confirmPassword.hasError}
                  errorMessage="Passwords do not match"
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-3">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                  I accept the{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms and Conditions
                  </a>{" "}
                  <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="privacy"
                  checked={acceptedPrivacy}
                  onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="privacy" className="ml-2 text-sm text-gray-700">
                  I accept the{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>{" "}
                  <span className="text-red-500">*</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              disabled={!isFormValid}
              onClick={handleSubmit}
              className={`w-full bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200`}
            >
              Create Agency Account
            </button>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/auth?mode=login"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Log In
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencySignupForm;
