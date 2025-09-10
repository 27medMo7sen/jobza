"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface CountryNationalitySelectProps {
  country: string;
  nationality: string;
  onCountryChange: (country: string) => void;
  onNationalityChange: (nationality: string) => void;
  countryError?: string;
  nationalityError?: string;
  required?: boolean;
}

// country.ts
export interface Country {
  name: string;
  code: string;
  flag: string;
}

// Full list of ISO 3166 countries with emoji flags
export const COUNTRIES: Country[] = [
  { name: "Afghanistan", code: "AF", flag: "🇦🇫" },
  { name: "Albania", code: "AL", flag: "🇦🇱" },
  { name: "Algeria", code: "DZ", flag: "🇩🇿" },
  { name: "Andorra", code: "AD", flag: "🇦🇩" },
  { name: "Angola", code: "AO", flag: "🇦🇴" },
  { name: "Antigua and Barbuda", code: "AG", flag: "🇦🇬" },
  { name: "Argentina", code: "AR", flag: "🇦🇷" },
  { name: "Armenia", code: "AM", flag: "🇦🇲" },
  { name: "Australia", code: "AU", flag: "🇦🇺" },
  { name: "Austria", code: "AT", flag: "🇦🇹" },
  { name: "Azerbaijan", code: "AZ", flag: "🇦🇿" },
  { name: "Bahamas", code: "BS", flag: "🇧🇸" },
  { name: "Bahrain", code: "BH", flag: "🇧🇭" },
  { name: "Bangladesh", code: "BD", flag: "🇧🇩" },
  { name: "Barbados", code: "BB", flag: "🇧🇧" },
  { name: "Belarus", code: "BY", flag: "🇧🇾" },
  { name: "Belgium", code: "BE", flag: "🇧🇪" },
  { name: "Belize", code: "BZ", flag: "🇧🇿" },
  { name: "Benin", code: "BJ", flag: "🇧🇯" },
  { name: "Bhutan", code: "BT", flag: "🇧🇹" },
  { name: "Bolivia", code: "BO", flag: "🇧🇴" },
  { name: "Bosnia and Herzegovina", code: "BA", flag: "🇧🇦" },
  { name: "Botswana", code: "BW", flag: "🇧🇼" },
  { name: "Brazil", code: "BR", flag: "🇧🇷" },
  { name: "Brunei", code: "BN", flag: "🇧🇳" },
  { name: "Bulgaria", code: "BG", flag: "🇧🇬" },
  { name: "Burkina Faso", code: "BF", flag: "🇧🇫" },
  { name: "Burundi", code: "BI", flag: "🇧🇮" },
  { name: "Cabo Verde", code: "CV", flag: "🇨🇻" },
  { name: "Cambodia", code: "KH", flag: "🇰🇭" },
  { name: "Cameroon", code: "CM", flag: "🇨🇲" },
  { name: "Canada", code: "CA", flag: "🇨🇦" },
  { name: "Central African Republic", code: "CF", flag: "🇨🇫" },
  { name: "Chad", code: "TD", flag: "🇹🇩" },
  { name: "Chile", code: "CL", flag: "🇨🇱" },
  { name: "China", code: "CN", flag: "🇨🇳" },
  { name: "Colombia", code: "CO", flag: "🇨🇴" },
  { name: "Comoros", code: "KM", flag: "🇰🇲" },
  { name: "Congo (Congo-Brazzaville)", code: "CG", flag: "🇨🇬" },
  { name: "Congo (Democratic Republic)", code: "CD", flag: "🇨🇩" },
  { name: "Costa Rica", code: "CR", flag: "🇨🇷" },
  { name: "Croatia", code: "HR", flag: "🇭🇷" },
  { name: "Cuba", code: "CU", flag: "🇨🇺" },
  { name: "Cyprus", code: "CY", flag: "🇨🇾" },
  { name: "Czech Republic", code: "CZ", flag: "🇨🇿" },
  { name: "Denmark", code: "DK", flag: "🇩🇰" },
  { name: "Djibouti", code: "DJ", flag: "🇩🇯" },
  { name: "Dominica", code: "DM", flag: "🇩🇲" },
  { name: "Dominican Republic", code: "DO", flag: "🇩🇴" },
  { name: "Ecuador", code: "EC", flag: "🇪🇨" },
  { name: "Egypt", code: "EG", flag: "🇪🇬" },
  { name: "El Salvador", code: "SV", flag: "🇸🇻" },
  { name: "Equatorial Guinea", code: "GQ", flag: "🇬🇶" },
  { name: "Eritrea", code: "ER", flag: "🇪🇷" },
  { name: "Estonia", code: "EE", flag: "🇪🇪" },
  { name: "Eswatini", code: "SZ", flag: "🇸🇿" },
  { name: "Ethiopia", code: "ET", flag: "🇪🇹" },
  { name: "Fiji", code: "FJ", flag: "🇫🇯" },
  { name: "Finland", code: "FI", flag: "🇫🇮" },
  { name: "France", code: "FR", flag: "🇫🇷" },
  { name: "Gabon", code: "GA", flag: "🇬🇦" },
  { name: "Gambia", code: "GM", flag: "🇬🇲" },
  { name: "Georgia", code: "GE", flag: "🇬🇪" },
  { name: "Germany", code: "DE", flag: "🇩🇪" },
  { name: "Ghana", code: "GH", flag: "🇬🇭" },
  { name: "Greece", code: "GR", flag: "🇬🇷" },
  { name: "Grenada", code: "GD", flag: "🇬🇩" },
  { name: "Guatemala", code: "GT", flag: "🇬🇹" },
  { name: "Guinea", code: "GN", flag: "🇬🇳" },
  { name: "Guinea-Bissau", code: "GW", flag: "🇬🇼" },
  { name: "Guyana", code: "GY", flag: "🇬🇾" },
  { name: "Haiti", code: "HT", flag: "🇭🇹" },
  { name: "Honduras", code: "HN", flag: "🇭🇳" },
  { name: "Hungary", code: "HU", flag: "🇭🇺" },
  { name: "Iceland", code: "IS", flag: "🇮🇸" },
  { name: "India", code: "IN", flag: "🇮🇳" },
  { name: "Indonesia", code: "ID", flag: "🇮🇩" },
  { name: "Iran", code: "IR", flag: "🇮🇷" },
  { name: "Iraq", code: "IQ", flag: "🇮🇶" },
  { name: "Ireland", code: "IE", flag: "🇮🇪" },
  { name: "Israel", code: "IL", flag: "🇮🇱" },
  { name: "Italy", code: "IT", flag: "🇮🇹" },
  { name: "Jamaica", code: "JM", flag: "🇯🇲" },
  { name: "Japan", code: "JP", flag: "🇯🇵" },
  { name: "Jordan", code: "JO", flag: "🇯🇴" },
  { name: "Kazakhstan", code: "KZ", flag: "🇰🇿" },
  { name: "Kenya", code: "KE", flag: "🇰🇪" },
  { name: "Kiribati", code: "KI", flag: "🇰🇮" },
  { name: "Kuwait", code: "KW", flag: "🇰🇼" },
  { name: "Kyrgyzstan", code: "KG", flag: "🇰🇬" },
  { name: "Laos", code: "LA", flag: "🇱🇦" },
  { name: "Latvia", code: "LV", flag: "🇱🇻" },
  { name: "Lebanon", code: "LB", flag: "🇱🇧" },
  { name: "Lesotho", code: "LS", flag: "🇱🇸" },
  { name: "Liberia", code: "LR", flag: "🇱🇷" },
  { name: "Libya", code: "LY", flag: "🇱🇾" },
  { name: "Liechtenstein", code: "LI", flag: "🇱🇮" },
  { name: "Lithuania", code: "LT", flag: "🇱🇹" },
  { name: "Luxembourg", code: "LU", flag: "🇱🇺" },
  { name: "Madagascar", code: "MG", flag: "🇲🇬" },
  { name: "Malawi", code: "MW", flag: "🇲🇼" },
  { name: "Malaysia", code: "MY", flag: "🇲🇾" },
  { name: "Maldives", code: "MV", flag: "🇲🇻" },
  { name: "Mali", code: "ML", flag: "🇲🇱" },
  { name: "Malta", code: "MT", flag: "🇲🇹" },
  { name: "Marshall Islands", code: "MH", flag: "🇲🇭" },
  { name: "Mauritania", code: "MR", flag: "🇲🇷" },
  { name: "Mauritius", code: "MU", flag: "🇲🇺" },
  { name: "Mexico", code: "MX", flag: "🇲🇽" },
  { name: "Micronesia", code: "FM", flag: "🇫🇲" },
  { name: "Moldova", code: "MD", flag: "🇲🇩" },
  { name: "Monaco", code: "MC", flag: "🇲🇨" },
  { name: "Mongolia", code: "MN", flag: "🇲🇳" },
  { name: "Montenegro", code: "ME", flag: "🇲🇪" },
  { name: "Morocco", code: "MA", flag: "🇲🇦" },
  { name: "Mozambique", code: "MZ", flag: "🇲🇿" },
  { name: "Myanmar", code: "MM", flag: "🇲🇲" },
  { name: "Namibia", code: "NA", flag: "🇳🇦" },
  { name: "Nauru", code: "NR", flag: "🇳🇷" },
  { name: "Nepal", code: "NP", flag: "🇳🇵" },
  { name: "Netherlands", code: "NL", flag: "🇳🇱" },
  { name: "New Zealand", code: "NZ", flag: "🇳🇿" },
  { name: "Nicaragua", code: "NI", flag: "🇳🇮" },
  { name: "Niger", code: "NE", flag: "🇳🇪" },
  { name: "Nigeria", code: "NG", flag: "🇳🇬" },
  { name: "North Korea", code: "KP", flag: "🇰🇵" },
  { name: "North Macedonia", code: "MK", flag: "🇲🇰" },
  { name: "Norway", code: "NO", flag: "🇳🇴" },
  { name: "Oman", code: "OM", flag: "🇴🇲" },
  { name: "Pakistan", code: "PK", flag: "🇵🇰" },
  { name: "Palau", code: "PW", flag: "🇵🇼" },
  { name: "Palestine", code: "PS", flag: "🇵🇸" },
  { name: "Panama", code: "PA", flag: "🇵🇦" },
  { name: "Papua New Guinea", code: "PG", flag: "🇵🇬" },
  { name: "Paraguay", code: "PY", flag: "🇵🇾" },
  { name: "Peru", code: "PE", flag: "🇵🇪" },
  { name: "Philippines", code: "PH", flag: "🇵🇭" },
  { name: "Poland", code: "PL", flag: "🇵🇱" },
  { name: "Portugal", code: "PT", flag: "🇵🇹" },
  { name: "Qatar", code: "QA", flag: "🇶🇦" },
  { name: "Romania", code: "RO", flag: "🇷🇴" },
  { name: "Russia", code: "RU", flag: "🇷🇺" },
  { name: "Rwanda", code: "RW", flag: "🇷🇼" },
  { name: "Saint Kitts and Nevis", code: "KN", flag: "🇰🇳" },
  { name: "Saint Lucia", code: "LC", flag: "🇱🇨" },
  { name: "Saint Vincent and the Grenadines", code: "VC", flag: "🇻🇨" },
  { name: "Samoa", code: "WS", flag: "🇼🇸" },
  { name: "San Marino", code: "SM", flag: "🇸🇲" },
  { name: "Sao Tome and Principe", code: "ST", flag: "🇸🇹" },
  { name: "Saudi Arabia", code: "SA", flag: "🇸🇦" },
  { name: "Senegal", code: "SN", flag: "🇸🇳" },
  { name: "Serbia", code: "RS", flag: "🇷🇸" },
  { name: "Seychelles", code: "SC", flag: "🇸🇨" },
  { name: "Sierra Leone", code: "SL", flag: "🇸🇱" },
  { name: "Singapore", code: "SG", flag: "🇸🇬" },
  { name: "Slovakia", code: "SK", flag: "🇸🇰" },
  { name: "Slovenia", code: "SI", flag: "🇸🇮" },
  { name: "Solomon Islands", code: "SB", flag: "🇸🇧" },
  { name: "Somalia", code: "SO", flag: "🇸🇴" },
  { name: "South Africa", code: "ZA", flag: "🇿🇦" },
  { name: "South Korea", code: "KR", flag: "🇰🇷" },
  { name: "South Sudan", code: "SS", flag: "🇸🇸" },
  { name: "Spain", code: "ES", flag: "🇪🇸" },
  { name: "Sri Lanka", code: "LK", flag: "🇱🇰" },
  { name: "Sudan", code: "SD", flag: "🇸🇩" },
  { name: "Suriname", code: "SR", flag: "🇸🇷" },
  { name: "Sweden", code: "SE", flag: "🇸🇪" },
  { name: "Switzerland", code: "CH", flag: "🇨🇭" },
  { name: "Syria", code: "SY", flag: "🇸🇾" },
  { name: "Taiwan", code: "TW", flag: "🇹🇼" },
  { name: "Tajikistan", code: "TJ", flag: "🇹🇯" },
  { name: "Tanzania", code: "TZ", flag: "🇹🇿" },
  { name: "Thailand", code: "TH", flag: "🇹🇭" },
  { name: "Timor-Leste", code: "TL", flag: "🇹🇱" },
  { name: "Togo", code: "TG", flag: "🇹🇬" },
  { name: "Tonga", code: "TO", flag: "🇹🇴" },
  { name: "Trinidad and Tobago", code: "TT", flag: "🇹🇹" },
  { name: "Tunisia", code: "TN", flag: "🇹🇳" },
  { name: "Turkey", code: "TR", flag: "🇹🇷" },
  { name: "Turkmenistan", code: "TM", flag: "🇹🇲" },
  { name: "Tuvalu", code: "TV", flag: "🇹🇻" },
  { name: "Uganda", code: "UG", flag: "🇺🇬" },
  { name: "Ukraine", code: "UA", flag: "🇺🇦" },
  { name: "United Arab Emirates", code: "AE", flag: "🇦🇪" },
  { name: "United Kingdom", code: "GB", flag: "🇬🇧" },
  { name: "United States", code: "US", flag: "🇺🇸" },
  { name: "Uruguay", code: "UY", flag: "🇺🇾" },
  { name: "Uzbekistan", code: "UZ", flag: "🇺🇿" },
  { name: "Vanuatu", code: "VU", flag: "🇻🇺" },
  { name: "Vatican City", code: "VA", flag: "🇻🇦" },
  { name: "Venezuela", code: "VE", flag: "🇻🇪" },
  { name: "Vietnam", code: "VN", flag: "🇻🇳" },
  { name: "Yemen", code: "YE", flag: "🇾🇪" },
  { name: "Zambia", code: "ZM", flag: "🇿🇲" },
  { name: "Zimbabwe", code: "ZW", flag: "🇿🇼" },
];

export const CountryNationalitySelect: React.FC<
  CountryNationalitySelectProps
> = ({
  country,
  nationality,
  onCountryChange,
  onNationalityChange,
  countryError,
  nationalityError,
  required = false,
}) => {
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [nationalitySearchTerm, setNationalitySearchTerm] = useState("");

  // Filter countries based on search term (same for both dropdowns)
  const filteredCountries = COUNTRIES.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNationalities = COUNTRIES.filter((country) =>
    country.name.toLowerCase().includes(nationalitySearchTerm.toLowerCase())
  );

  // No synchronization - country and nationality are independent

  const handleCountrySelect = (selectedCountry: string) => {
    onCountryChange(selectedCountry);
    setShowCountryDropdown(false);
    setSearchTerm("");
  };

  const handleNationalitySelect = (selectedNationality: string) => {
    onNationalityChange(selectedNationality);
    setShowNationalityDropdown(false);
    setNationalitySearchTerm("");
  };

  const getSelectedCountry = () => {
    return COUNTRIES.find((c) => c.name === country);
  };

  const getSelectedNationality = () => {
    return COUNTRIES.find((c) => c.name === nationality);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Country Selection */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Country {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
            className={`w-full px-3 py-2 text-left border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              countryError ? "border-red-500" : "border-gray-300"
            }`}
            aria-label="Select country"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getSelectedCountry() && (
                  <span className="mr-2 text-lg">
                    {getSelectedCountry()?.flag}
                  </span>
                )}
                <span
                  className={
                    getSelectedCountry() ? "text-gray-900" : "text-gray-500"
                  }
                >
                  {getSelectedCountry()?.name || "Select Country"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </button>

          {showCountryDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="py-1">
                {filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountrySelect(country.name)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100 flex items-center"
                  >
                    <span className="mr-2 text-lg">{country.flag}</span>
                    <span>{country.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {countryError && (
          <p className="mt-1 text-sm text-red-600">{countryError}</p>
        )}
      </div>

      {/* Nationality Selection */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nationality {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNationalityDropdown(!showNationalityDropdown)}
            className={`w-full px-3 py-2 text-left border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              nationalityError ? "border-red-500" : "border-gray-300"
            }`}
            aria-label="Select nationality"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getSelectedNationality() && (
                  <span className="mr-2 text-lg">
                    {getSelectedNationality()?.flag}
                  </span>
                )}
                <span
                  className={
                    getSelectedNationality() ? "text-gray-900" : "text-gray-500"
                  }
                >
                  {getSelectedNationality()?.name || "Select Nationality"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </button>

          {showNationalityDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Search nationalities..."
                  value={nationalitySearchTerm}
                  onChange={(e) => setNationalitySearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="py-1">
                {filteredNationalities.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleNationalitySelect(country.name)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100 flex items-center"
                  >
                    <span className="mr-2 text-lg">{country.flag}</span>
                    <span>{country.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {nationalityError && (
          <p className="mt-1 text-sm text-red-600">{nationalityError}</p>
        )}
      </div>
    </div>
  );
};
