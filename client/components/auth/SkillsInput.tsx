"use client";

import React, { useState } from "react";
import { X, Plus } from "lucide-react";

interface SkillsInputProps {
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
  availableSkills: string[];
  error?: string;
  required?: boolean;
}

export const SkillsInput: React.FC<SkillsInputProps> = ({
  skills,
  onSkillsChange,
  availableSkills,
  error,
  required = false,
}) => {
  const [showAvailableSkills, setShowAvailableSkills] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter available skills based on search term and exclude already selected skills
  const filteredAvailableSkills = availableSkills.filter(
    (skill) =>
      skill.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !skills.includes(skill)
  );

  const handleAddSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      onSkillsChange([...skills, skill]);
    }
    setSearchTerm("");
    setShowAvailableSkills(false);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onSkillsChange(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleAddCustomSkill = () => {
    if (searchTerm.trim() && !skills.includes(searchTerm.trim())) {
      onSkillsChange([...skills, searchTerm.trim()]);
      setSearchTerm("");
      setShowAvailableSkills(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filteredAvailableSkills.length === 1) {
        handleAddSkill(filteredAvailableSkills[0]);
      } else if (
        searchTerm.trim() &&
        !availableSkills.includes(searchTerm.trim())
      ) {
        handleAddCustomSkill();
      }
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Skills {required && <span className="text-red-500">*</span>}
      </label>

      {/* Selected Skills Display */}
      <div className="min-h-[40px] p-3 border border-gray-300 rounded-md bg-gray-50">
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-2 hover:text-blue-600 focus:outline-none"
                  aria-label={`Remove ${skill}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-500 text-sm">No skills selected</span>
        )}
      </div>

      {/* Skills Input and Available Skills */}
      <div className="relative">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search or add skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowAvailableSkills(true)}
            onKeyPress={handleKeyPress}
            className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowAvailableSkills(!showAvailableSkills)}
            className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle available skills"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Available Skills Dropdown */}
        {showAvailableSkills && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            <div className="p-2">
              <div className="text-xs text-gray-500 mb-2">
                Available Skills ({filteredAvailableSkills.length})
              </div>
              {filteredAvailableSkills.length > 0 ? (
                <div className="space-y-1">
                  {filteredAvailableSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleAddSkill(skill)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100 text-sm rounded"
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              ) : searchTerm.trim() ? (
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={handleAddCustomSkill}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100 text-sm rounded text-blue-600"
                  >
                    + Add "{searchTerm.trim()}" as custom skill
                  </button>
                </div>
              ) : (
                <div className="text-sm text-gray-500 py-2">
                  No available skills found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Skills Count */}
      <div className="text-xs text-gray-500">
        {skills.length} skill{skills.length !== 1 ? "s" : ""} selected
      </div>
    </div>
  );
};
