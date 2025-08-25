import React from "react";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
interface IdentityItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  buttonText: string;
  isSelected: boolean;
  onSelect: () => void;
  iconBgColor: string;
  href: string;
}

const IdentityItem: React.FC<IdentityItemProps> = ({
  icon: Icon,
  title,
  description,
  features,
  buttonText,
  isSelected,
  onSelect,
  iconBgColor,
  href,
}) => {
  return (
    <div
      className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 flex-1  ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={onSelect}
    >
      <div className="flex flex-col items-center text-center mb-6">
        <div
          className={`w-16 h-16 rounded-full ${iconBgColor} flex items-center justify-center mb-4`}
        >
          <Icon size={28} className="text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>

      <div className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start text-sm text-gray-700">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
              <svg
                className="w-2.5 h-2.5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-left">{feature}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-auto">
        <Link
          href={href}
          className={`w-full flex-1 py-3 px-4 rounded-lg font-medium transition-colors duration-200 cursor-pointer text-center ${
            isSelected
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-primary text-white hover:bg-blue-700"
          }`}
        >
          {buttonText}
          <span className="ml-2">→</span>
        </Link>
      </div>
    </div>
  );
};

export default IdentityItem;
