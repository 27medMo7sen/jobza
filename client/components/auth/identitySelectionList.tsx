import React from "react";
import { Users, Briefcase, FileText, LucideIcon } from "lucide-react";
import IdentityItem from "./identityItem";

interface IdentitySelectionListProps {
  selectedIdentity: string | null;
  onIdentitySelect: (identity: string) => void;
}

interface IdentityOption {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  buttonText: string;
  iconBgColor: string;
  href: string;
}

const IdentitySelectionList: React.FC<IdentitySelectionListProps> = ({
  selectedIdentity,
  onIdentitySelect,
}) => {
  const identityOptions: IdentityOption[] = [
    {
      id: "worker",
      icon: Users,
      title: "I'm a Domestic Worker",
      description: "Looking for employment opportunities in domestic work",
      features: [
        "Create your professional profile",
        "Showcase your skills and experience",
        "Connect with verified employers",
        "Access training and certification programs",
        "Secure and reliable employment",
      ],
      buttonText: "Sign Up as Worker",
      iconBgColor: "bg-blue-500/50",
      href: "/auth?mode=workerSignup",
    },
    {
      id: "employer",
      icon: Briefcase,
      title: "I'm an Employer",
      description: "Looking to hire qualified domestic workers",
      features: [
        "Post your household requirements",
        "Access pre-screened workers",
        "Verify worker credentials and references",
        "Manage contracts and payments securely",
        "Connect with placement agencies",
      ],
      buttonText: "Sign Up as Employer",
      iconBgColor: "bg-green-500/50",
      href: "/auth?mode=employerSignup",
    },
    {
      id: "agency",
      icon: FileText,
      title: "I'm an Agency",
      description: "Employment agency managing domestic workers",
      features: [
        "Manage worker pool and affiliations",
        "Process booking requests efficiently",
        "Track placements and performance",
        "Generate financial reports",
        "Access comprehensive analytics",
      ],
      buttonText: "Sign Up as Agency",
      iconBgColor: "bg-purple-500/50",
      href: "/auth?mode=agencySignup",
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {identityOptions.map((option) => (
        <IdentityItem
          key={option.id}
          icon={option.icon}
          title={option.title}
          description={option.description}
          features={option.features}
          buttonText={option.buttonText}
          iconBgColor={option.iconBgColor}
          isSelected={selectedIdentity === option.id}
          onSelect={() => onIdentitySelect(option.id)}
          href={option.href}
        />
      ))}
    </div>
  );
};

export default IdentitySelectionList;
