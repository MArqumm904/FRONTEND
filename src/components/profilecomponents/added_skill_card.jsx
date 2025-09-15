import React from "react";
import { Pencil, Sparkle, Trash } from "lucide-react";

const SkillCard = ({ authenticatedUser,user_id,skill, onEdit, onDelete }) => {
  return (
    <div className="border border-[#000] rounded-lg p-6 bg-white relative shadow-sm">
      {/* Edit button */}
      {authenticatedUser === user_id && (
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => onEdit && onEdit(skill)}
          className="p-1.5 text-gray-500 hover:text-gray-600 rounded-full border border-gray-500 hover:border-gray-500 transition-colors bg-white"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete && onDelete(skill)}
          className="p-1.5 text-red-500 hover:text-red-600 rounded-full border border-red-500 hover:border-red-500 transition-colors"
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>
      )}
      <div className="flex items-start gap-4">
        {/* Skill Icon */}
        <div className="w-16 h-16 border border-[#4c4c4c] rounded-full flex items-center justify-center flex-shrink-0 bg-white">
          <img
            src="https://cdn.sanity.io/images/599r6htc/regionalized/5094051dac77593d0f0978bdcbabaf79e5bb855c-1080x1080.png?w=540&h=540&q=75&fit=max&auto=format"
            alt="Skill Icon"
            className="w-10 h-10 rounded-full"
          />
        </div>

        {/* Skill Details */}
        <div className="flex-1">
          {/* Skill Name and Level */}
          <div className="mb-1">
            <h3 className="text-lg font-sf font-semibold text-gray-900">
              {skill.skill || skill.name || skill.title || "Unnamed Skill"}
            </h3>
            {(skill.proficiency || skill.level) && (
              <div className="text-sm font-sf text-gray-500 flex items-center gap-1 mt-1">
                <Sparkle size={20} className="mr-1" />
                {skill.proficiency || skill.level}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Description */}
      {(skill.description || skill.desc) && (
        <p className="text-lg font-sf text-gray-700 leading-relaxed mt-3  ">
          {skill.description || skill.desc}
        </p>
      )}
    </div>
  );
};

export default SkillCard;
