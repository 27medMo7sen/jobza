import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import Input from "@/components/auth/input";
import useInput from "@/hooks/use-input";
import Link from "next/link";
// Validation functions
const validateUsername = (value: string): boolean => {
  return (
    value.length >= 3 && value.length <= 20 && /^[a-zA-Z0-9_]+$/.test(value)
  );
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

const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

const WorkerSignupForm: React.FC = () => {
  // Initialize form inputs with useInput hook
  const username = useInput(validateUsername);
  const email = useInput(validateEmail);
  const phone = useInput(validatePhone);
  const dateOfBirth = useInput(validateRequired);
  const password = useInput(validatePassword);
  const confirmPassword = useInput(
    (value: string) => value === password.value && value.length >= 8
  );

  // Dropdown states
  const [country, setCountry] = useState("");
  const [nationality, setNationality] = useState("");
  const [gender, setGender] = useState("");
  const [educationLevel, setEducationLevel] = useState("");

  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showEducationDropdown, setShowEducationDropdown] = useState(false);

  const countries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Japan",
    "Other",
  ];
  const nationalities = [
    "American",
    "British",
    "Canadian",
    "Australian",
    "German",
    "French",
    "Japanese",
    "Other",
  ];
  const genders = ["Male", "Female", "Non-binary", "Prefer not to say"];
  const educationLevels = [
    "None",
    "Primary",
    "Secondary",
    "Vocational",
    "University",
  ];

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case "country":
        setCountry(value);
        break;
      case "nationality":
        setNationality(value);
        break;
      case "gender":
        setGender(value);
        break;
      case "educationLevel":
        setEducationLevel(value);
        break;
    }
  };
  const isFormValid =
    username.isValid &&
    email.isValid &&
    phone.isValid &&
    dateOfBirth.isValid &&
    password.isValid &&
    confirmPassword.isValid &&
    country &&
    nationality &&
    gender &&
    educationLevel;
  const handleSubmit = () => {
    // Validate all required fields
    const isFormValid =
      username.isValid &&
      email.isValid &&
      phone.isValid &&
      dateOfBirth.isValid &&
      password.isValid &&
      confirmPassword.isValid &&
      country &&
      nationality &&
      gender &&
      educationLevel;

    if (isFormValid) {
      const formData = {
        username: username.value,
        email: email.value,
        phone: phone.value,
        country,
        nationality,
        gender,
        dateOfBirth: dateOfBirth.value,
        educationLevel,
        password: password.value,
      };
      console.log("Form submitted:", formData);
    } else {
      // Touch all fields to show validation errors
      username.onBlur();
      email.onBlur();
      phone.onBlur();
      dateOfBirth.onBlur();
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
              Join as a Worker
            </h1>
            <p className="text-gray-600">
              Create your professional profile (pending admin approval)
            </p>
          </div>

          {/* Google Sign Up Button */}
          <Link
            href="http://localhost:3000/auth/google?role=worker"
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
            {/* Username Field */}
            <Input
              label="Username"
              type="text"
              placeholder="Enter username"
              required
              value={username.value}
              onChange={username.onChange}
              onBlur={username.onBlur}
              hasError={username.hasError}
              errorMessage="Username must be 3-20 characters long and contain only letters, numbers, and underscores"
            />

            {/* Email and Phone Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email Address"
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
                value={phone.value}
                onChange={phone.onChange}
                onBlur={phone.onBlur}
                hasError={phone.hasError}
                errorMessage="Please enter a valid phone number"
              />
            </div>

            {/* Country and Nationality Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between"
                >
                  <span className={country ? "text-gray-900" : "text-gray-500"}>
                    {country || "Select country"}
                  </span>
                  <ChevronDown size={20} className="text-gray-400" />
                </button>
                {showCountryDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    {countries.map((country) => (
                      <button
                        key={country}
                        type="button"
                        onClick={() => {
                          handleInputChange("country", country);
                          setShowCountryDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left text-black hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Nationality <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setShowNationalityDropdown(!showNationalityDropdown)
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between"
                >
                  <span
                    className={nationality ? "text-gray-900" : "text-gray-500"}
                  >
                    {nationality || "Select nationality"}
                  </span>
                  <ChevronDown size={20} className="text-gray-400" />
                </button>
                {showNationalityDropdown && (
                  <div className="absolute z-10 w-full mt-1 text-black bg-white border border-gray-300 rounded-lg shadow-lg">
                    {nationalities.map((nationality) => (
                      <button
                        key={nationality}
                        type="button"
                        onClick={() => {
                          handleInputChange("nationality", nationality);
                          setShowNationalityDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {nationality}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Gender and Date of Birth Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowGenderDropdown(!showGenderDropdown)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between"
                >
                  <span className={gender ? "text-gray-900" : "text-gray-500"}>
                    {gender || "Select gender"}
                  </span>
                  <ChevronDown size={20} className="text-gray-400" />
                </button>
                {showGenderDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    {genders.map((gender) => (
                      <button
                        key={gender}
                        type="button"
                        onClick={() => {
                          handleInputChange("gender", gender);
                          setShowGenderDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left text-black hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Input
                label="Date of Birth"
                type="date"
                required
                value={dateOfBirth.value}
                onChange={dateOfBirth.onChange}
                onBlur={dateOfBirth.onBlur}
                hasError={dateOfBirth.hasError}
                errorMessage="Please select your date of birth"
              />
            </div>

            {/* Education Level */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Highest Education Level <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowEducationDropdown(!showEducationDropdown)}
                className="w-full px-3 py-3 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between"
              >
                <span
                  className={educationLevel ? "text-gray-900" : "text-gray-500"}
                >
                  {educationLevel || "Select your education level"}
                </span>
                <ChevronDown size={20} className="text-gray-400" />
              </button>
              {showEducationDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {educationLevels.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => {
                        handleInputChange("educationLevel", level);
                        setShowEducationDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 text-black first:rounded-t-lg last:rounded-b-lg"
                    >
                      {level}
                    </button>
                  ))}
                </div>
              )}
            </div>

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

            {/* Submit Button */}
            <button
              type="button"
              disabled={!isFormValid}
              onClick={handleSubmit}
              className={`w-full bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200`}
            >
              Create Worker Account
            </button>
          </div>
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
  );
};

export default WorkerSignupForm;
