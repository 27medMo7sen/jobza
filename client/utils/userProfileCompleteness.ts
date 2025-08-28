import { User } from "@/types/user";
export const getRequiredFields = (role: User["role"]): string[] => {
  const commonFields = ["userName", "email", "profilePicture"];

  switch (role) {
    case "worker":
      return [
        ...commonFields,
        "userName",
        "gender",
        "nationality",
        "dateOfBirth",
        "heighestEducationalLevel",
        "skillSet",
      ];
    case "employer":
      return [
        ...commonFields,
        "phoneNumber",
        "gender",
        "nationality",
        "dateOfBirth",
        "country",
        "householdSize",
        "householdComposition",
        "homeType",
        "serviceRequirements",
        "workingHours",
        "preferredStartDate",
        "budgetRange",
      ];
    case "agency":
      return [
        ...commonFields,
        "agencyType",
        "registrationNumber",
        "licenseNumber",
        "establishmentDate",
        "phoneNumber",
        "nationality",
        "country",
        "streetAddress",
        "city",
        "state",
        "postalCode",
        "businessDescription",
        "yearsInBusiness",
        "numberOfEmployees",
      ];
    case "admin":
      return [
        ...commonFields,
        "userName",
        "gender",
        "nationality",
        "dateOfBirth",
        "department",
        "permissions",
      ];
    default:
      return commonFields;
  }
};

export const calculateProfileCompleteness = (user: User): number => {
  const requiredFields = getRequiredFields(user.role);
  let filledFields = 0;
  let totalFields = requiredFields.length;

  // Check common fields
  if (user.profilePicture && user.profilePicture.trim()) filledFields++;
  if (user.userName && user.userName.trim()) filledFields++;
  if (user.email && user.email.trim()) filledFields++;

  // Check data fields
  const userData = user.data as any;
  requiredFields.forEach((field) => {
    if (
      field === "profilePicture" ||
      field === "userName" ||
      field === "email"
    ) {
      return; // Already checked above
    }

    const value = userData[field];
    if (value !== undefined && value !== null) {
      if (typeof value === "string" && value.trim()) {
        filledFields++;
      } else if (typeof value === "number" && value > 0) {
        filledFields++;
      } else if (Array.isArray(value) && value.length > 0) {
        filledFields++;
      } else if (typeof value === "object" && Object.keys(value).length > 0) {
        // Check if nested object has meaningful values
        const hasValidValues = Object.values(value).some(
          (v) =>
            (typeof v === "string" && v.trim()) ||
            (typeof v === "number" && v > 0)
        );
        if (hasValidValues) filledFields++;
      }
    }
  });

  return Math.round((filledFields / totalFields) * 100);
};
