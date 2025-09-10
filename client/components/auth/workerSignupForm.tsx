import React, { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import Input from "@/components/auth/input";
import useInput from "@/hooks/use-input";
import Link from "next/link";
import { CountryNationalitySelect } from "./CountryNationalitySelect";
import { GenderSelect } from "./GenderSelect";
import { EducationLevelSelect } from "./EducationLevelSelect";
import { SkillsInput } from "./SkillsInput";
import { useHttp } from "@/hooks/use-http";
import { DrawerOpt } from "./drawerOpt";
// Validation functions
const validateFullName = (value: string): boolean => {
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

const WorkerSignupForm: React.FC = () => {
  // Initialize form inputs with useInput hook
  const fullName = useInput(validateFullName);
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
  const [skills, setSkills] = useState<string[]>([]);

  const { post, isLoading, error } = useHttp();
  const drawerRef = useRef<HTMLButtonElement | null>(null);

  // Available skills for workers
  const availableSkills = [
    "House Cleaning",
    "Deep Cleaning",
    "Laundry & Ironing",
    "Kitchen Cleaning",
    "Elderly Care",
    "Child Care",
    "Pet Care",
    "Garden Maintenance",
    "Cooking",
    "Organization",
    "Window Cleaning",
    "Carpet Cleaning",
    "Bathroom Cleaning",
  ];

  const isFormValid =
    fullName.isValid &&
    email.isValid &&
    phone.isValid &&
    dateOfBirth.isValid &&
    password.isValid &&
    confirmPassword.isValid &&
    country &&
    nationality &&
    gender &&
    educationLevel &&
    skills.length > 0;
  const handleSubmit = async () => {
    // Validate all required fields
    const isFormValid =
      fullName.isValid &&
      email.isValid &&
      phone.isValid &&
      dateOfBirth.isValid &&
      password.isValid &&
      confirmPassword.isValid &&
      country &&
      nationality &&
      gender &&
      educationLevel &&
      skills.length > 0;

    if (isFormValid) {
      const body: any = {
        role: "worker",
        name: fullName.value,
        email: email.value,
        phoneNumber: phone.value,
        country,
        nationality,
        gender,
        dateOfBirth: dateOfBirth.value,
        heighestEducationalLevel: educationLevel,
        skillSet: skills,
        password: password.value,
        confirmPassword: password.value,
      };
      try {
        await post("/auth/worker/signup", body);
        // Persist email/password for OTP verify + auto-login (use sessionStorage)
        if (typeof window !== "undefined") {
          sessionStorage.setItem("signupEmail", email.value);
          sessionStorage.setItem("signupPassword", password.value);
          sessionStorage.setItem("signupRole", "worker");
        }
        // Open OTP drawer
        if (drawerRef.current) drawerRef.current.click();
      } catch (e) {
        // Touch all fields to show validation errors
        fullName.onBlur();
        email.onBlur();
        phone.onBlur();
        dateOfBirth.onBlur();
        password.onBlur();
        confirmPassword.onBlur();
        console.error("Signup failed", e);
      }
    } else {
      // Touch all fields to show validation errors
      fullName.onBlur();
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
      <DrawerOpt drawerRef={drawerRef} />
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
            href={`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/google?role=worker`}
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
            {/* Full Name Field */}
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              required
              value={fullName.value}
              onChange={fullName.onChange}
              onBlur={fullName.onBlur}
              hasError={fullName.hasError}
              errorMessage="Full name must be at least 2 characters"
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
            <CountryNationalitySelect
              country={country}
              nationality={nationality}
              onCountryChange={setCountry}
              onNationalityChange={setNationality}
              required
            />

            {/* Gender and Date of Birth Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GenderSelect value={gender} onChange={setGender} required />
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
            <EducationLevelSelect
              value={educationLevel}
              onChange={setEducationLevel}
              required
            />

            {/* Skills Input */}
            <SkillsInput
              skills={skills}
              onSkillsChange={setSkills}
              availableSkills={availableSkills}
              required
            />

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
              disabled={!isFormValid || isLoading}
              onClick={handleSubmit}
              className={`w-full bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200`}
            >
              {isLoading ? "Creating Account..." : "Create Worker Account"}
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
