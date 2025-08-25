import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import Input from "./input";
import useInput from "@/hooks/use-input";
import Link from "next/link";

// Validation functions
const validateName = (value: string): boolean => {
  return value.trim().length >= 2;
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

const validateNumber = (value: string): boolean => {
  return !isNaN(Number(value)) && Number(value) >= 0;
};

const EmployerSignupForm: React.FC = () => {
  // Initialize form inputs with useInput hook
  const userName = useInput(validateName);
  const email = useInput(validateEmail);
  const phone = useInput(validatePhone);
  const password = useInput(validatePassword);
  const confirmPassword = useInput(
    (value: string) => value === password.value && value.length >= 8
  );
  const dateOfBirth = useInput(validateRequired);
  const householdSize = useInput(validateNumber);
  const adults = useInput(validateNumber);
  const children = useInput(validateNumber);
  const infants = useInput(validateNumber);
  const elderly = useInput(validateNumber);
  const workingHours = useInput(validateRequired);
  const minAmount = useInput(validateNumber);
  const maxAmount = useInput(validateNumber);

  // Dropdown states
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");
  const [country, setCountry] = useState("");
  const [homeType, setHomeType] = useState("");
  const [currency, setCurrency] = useState("");
  const [preferredStartDate, setPreferredStartDate] = useState("");

  // Checkbox states for service requirements
  const [serviceRequirements, setServiceRequirements] = useState({
    housekeeping: false,
    cooking: false,
    childcare: false,
    elderlyCare: false,
    petCare: false,
    gardening: false,
  });

  // Dropdown visibility states
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showHomeTypeDropdown, setShowHomeTypeDropdown] = useState(false);
  const [showWorkingHoursDropdown, setShowWorkingHoursDropdown] =
    useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  // Dropdown options
  const genders = ["Male", "Female", "Non-binary", "Prefer not to say"];
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
  const homeTypes = [
    "Apartment",
    "House",
    "Villa",
    "Townhouse",
    "Condo",
    "Other",
  ];
  const workingHoursOptions = [
    "Full-time (8+ hours)",
    "Part-time (4-8 hours)",
    "Flexible hours",
    "Live-in",
    "Weekends only",
  ];
  const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "Other"];

  const handleDropdownChange = (field: string, value: string) => {
    switch (field) {
      case "gender":
        setGender(value);
        setShowGenderDropdown(false);
        break;
      case "nationality":
        setNationality(value);
        setShowNationalityDropdown(false);
        break;
      case "country":
        setCountry(value);
        setShowCountryDropdown(false);
        break;
      case "homeType":
        setHomeType(value);
        setShowHomeTypeDropdown(false);
        break;
      case "currency":
        setCurrency(value);
        setShowCurrencyDropdown(false);
        break;
    }
  };

  const handleServiceRequirementChange = (service: string) => {
    setServiceRequirements((prev) => ({
      ...prev,
      [service]: !prev[service as keyof typeof prev],
    }));
  };
  const isFormValid =
    userName.isValid &&
    email.isValid &&
    phone.isValid &&
    password.isValid &&
    confirmPassword.isValid &&
    dateOfBirth.isValid &&
    householdSize.isValid &&
    adults.isValid &&
    children.isValid &&
    infants.isValid &&
    elderly.isValid &&
    workingHours.isValid &&
    minAmount.isValid &&
    maxAmount.isValid &&
    gender &&
    nationality &&
    country &&
    homeType &&
    currency &&
    preferredStartDate;
  const handleSubmit = () => {
    // Validate all required fields

    if (isFormValid) {
      const formData = {
        userName: userName.value,
        email: email.value,
        phone: phone.value,
        dateOfBirth: dateOfBirth.value,
        gender,
        nationality,
        country,
        householdSize: householdSize.value,
        householdComposition: {
          adults: adults.value,
          children: children.value,
          infants: infants.value,
          elderly: elderly.value,
        },
        homeType,
        serviceRequirements,
        workingHours: workingHours.value,
        preferredStartDate,
        budgetRange: {
          min: minAmount.value,
          max: maxAmount.value,
          currency,
        },
      };
      console.log("Employer form submitted:", formData);
    } else {
      // Touch all fields to show validation errors
      userName.onBlur();
      email.onBlur();
      phone.onBlur();
      password.onBlur();
      confirmPassword.onBlur();
      dateOfBirth.onBlur();
      householdSize.onBlur();
      adults.onBlur();
      children.onBlur();
      infants.onBlur();
      elderly.onBlur();
      workingHours.onBlur();
      minAmount.onBlur();
      maxAmount.onBlur();
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
              Join as an Employer
            </h1>
            <p className="text-gray-600">Create your employer account</p>
          </div>

          {/* Google Sign Up Button */}
          <Link
            href="http://localhost:3000/auth/google?role=employer"
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

          {/* Create Employer Account Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Create Employer Account
            </h2>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Name Fields */}
            <Input
              label="User Name"
              type="text"
              placeholder="Enter user name"
              required
              value={userName.value}
              onChange={userName.onChange}
              onBlur={userName.onBlur}
              hasError={userName.hasError}
              errorMessage="User name must be at least 2 characters"
            />

            {/* Email and Phone */}
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
                value={phone.value}
                onChange={phone.onChange}
                onBlur={phone.onBlur}
                hasError={phone.hasError}
                errorMessage="Please enter a valid phone number"
              />
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

            {/* Date of Birth, Gender, Nationality */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              {/* Gender Dropdown */}
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
                    {genders.map((genderOption) => (
                      <button
                        key={genderOption}
                        type="button"
                        onClick={() =>
                          handleDropdownChange("gender", genderOption)
                        }
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {genderOption}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Nationality Dropdown */}
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
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    {nationalities.map((nationalityOption) => (
                      <button
                        key={nationalityOption}
                        type="button"
                        onClick={() =>
                          handleDropdownChange("nationality", nationalityOption)
                        }
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {nationalityOption}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Country */}
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
                  {countries.map((countryOption) => (
                    <button
                      key={countryOption}
                      type="button"
                      onClick={() =>
                        handleDropdownChange("country", countryOption)
                      }
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {countryOption}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Household Size */}
            <Input
              label="Household Size"
              type="number"
              placeholder="Number of people in household"
              required
              value={householdSize.value}
              onChange={householdSize.onChange}
              onBlur={householdSize.onBlur}
              hasError={householdSize.hasError}
              errorMessage="Please enter a valid household size"
            />

            {/* Household Composition */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-4">
                Household Composition
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Input
                  label="Adults"
                  type="number"
                  placeholder="0"
                  value={adults.value}
                  onChange={adults.onChange}
                  onBlur={adults.onBlur}
                  hasError={adults.hasError}
                  errorMessage="Valid number required"
                />
                <Input
                  label="Children"
                  type="number"
                  placeholder="0"
                  value={children.value}
                  onChange={children.onChange}
                  onBlur={children.onBlur}
                  hasError={children.hasError}
                  errorMessage="Valid number required"
                />
                <Input
                  label="Infants"
                  type="number"
                  placeholder="0"
                  value={infants.value}
                  onChange={infants.onChange}
                  onBlur={infants.onBlur}
                  hasError={infants.hasError}
                  errorMessage="Valid number required"
                />
                <Input
                  label="Elderly"
                  type="number"
                  placeholder="0"
                  value={elderly.value}
                  onChange={elderly.onChange}
                  onBlur={elderly.onBlur}
                  hasError={elderly.hasError}
                  errorMessage="Valid number required"
                />
              </div>
            </div>

            {/* Home Type */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Home Type <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowHomeTypeDropdown(!showHomeTypeDropdown)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between"
              >
                <span className={homeType ? "text-gray-900" : "text-gray-500"}>
                  {homeType || "Select home type"}
                </span>
                <ChevronDown size={20} className="text-gray-400" />
              </button>
              {showHomeTypeDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {homeTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleDropdownChange("homeType", type)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Service Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-4">
                Service Requirements <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries({
                  housekeeping: "Housekeeping",
                  cooking: "Cooking",
                  childcare: "Childcare",
                  elderlyCare: "Elderly Care",
                  petCare: "Pet Care",
                  gardening: "Gardening",
                }).map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={
                        serviceRequirements[
                          key as keyof typeof serviceRequirements
                        ]
                      }
                      onChange={() => handleServiceRequirementChange(key)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Working Hours and Preferred Start Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Working Hours Dropdown */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Working Hours <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setShowWorkingHoursDropdown(!showWorkingHoursDropdown)
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between"
                >
                  <span
                    className={
                      workingHours.value ? "text-gray-900" : "text-gray-500"
                    }
                  >
                    {workingHours.value || "Select working hours"}
                  </span>
                  <ChevronDown size={20} className="text-gray-400" />
                </button>
                {showWorkingHoursDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    {workingHoursOptions.map((hours) => (
                      <button
                        key={hours}
                        type="button"
                        onClick={() => {
                          workingHours.onChange({
                            target: { value: hours },
                          } as any);
                          setShowWorkingHoursDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {" "}
                        bg-b
                        {hours}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Preferred Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Preferred Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={preferredStartDate}
                  onChange={(e) => setPreferredStartDate(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-4">
                Budget Range
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Min Amount"
                  type="number"
                  placeholder="0"
                  value={minAmount.value}
                  onChange={minAmount.onChange}
                  onBlur={minAmount.onBlur}
                  hasError={minAmount.hasError}
                  errorMessage="Please enter a valid amount"
                />
                <Input
                  label="Max Amount"
                  type="number"
                  placeholder="0"
                  value={maxAmount.value}
                  onChange={maxAmount.onChange}
                  onBlur={maxAmount.onBlur}
                  hasError={maxAmount.hasError}
                  errorMessage="Please enter a valid amount"
                />

                {/* Currency Dropdown */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Currency <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrencyDropdown(!showCurrencyDropdown)
                    }
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between"
                  >
                    <span
                      className={currency ? "text-gray-900" : "text-gray-500"}
                    >
                      {currency || "Currency"}
                    </span>
                    <ChevronDown size={20} className="text-gray-400" />
                  </button>
                  {showCurrencyDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      {currencies.map((curr) => (
                        <button
                          key={curr}
                          type="button"
                          onClick={() => handleDropdownChange("currency", curr)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                        >
                          {curr}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`w-full bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200`}
            >
              Create Employer Account
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

export default EmployerSignupForm;
