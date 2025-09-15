import React from "react";
import { Pencil, MapPin, GraduationCap, Book, Trash } from "lucide-react";
import Person from "../../assets/images/karachi-uni.png";

const EducationCard = ({authenticatedUser, user_id,education, onEdit, onDelete }) => {
  return (
    <div className="border border-[#000] rounded-lg p-6 bg-white relative shadow-sm">
      {/* Edit and Delete buttons - positioned like in image */}
      <div className="absolute top-4 right-4 flex gap-2">
        {authenticatedUser === user_id && (
        <>
        <button
          onClick={() => onEdit && onEdit(education)}
          className="p-1.5 text-gray-500 hover:text-gray-600 rounded-full border border-gray-500 hover:border-gray-500 transition-colors"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete && onDelete(education)}
          className="p-1.5 text-red-500 hover:text-red-600 rounded-full border border-red-500 hover:border-red-500 transition-colors"
        >
          <Trash className="w-4 h-4" />
        </button>
        </>
      )}
      </div>

      <div className="flex items-start gap-4">
        {/* University Logo - Green circle with white letter */}
        <div className="w-16 h-16 border border-[#4c4c4c] rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">
            <img src={Person} className="w-10 h-12" />
          </span>
        </div>

        {/* Education Details */}
        <div className="flex-1">
          {/* University Name and Duration on same line */}
          <div className="flex items-baseline mb-1">
            <h3 className="text-lg font-sf font-semibold text-gray-900 pr-4">
              {education.schoolName || education.schooluniname}
            </h3>
            <div className="text-xs font-sf text-gray-500 flex-shrink-0">
              {education.startYear || education.start_year} - {education.endYear || education.end_year}
            </div>
          </div>

          {/* Degree, Field of Study, and Location on same line */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span className="font-sf flex">
              <GraduationCap size={20} className="mr-2" />{" "}
              {education.qualification}
            </span>
            {education.fieldOfStudy && (
              <>
                <span>|</span>
                <span className="font-sf flex">
                  <Book size={18} className="mr-2" />
                  {education.fieldOfStudy}
                </span>
              </>
            )}
            {education.location && (
              <>
                <span>|</span>
                <div className="flex items-center gap-1 font-sf">
                  <MapPin size={18} className="font-sf" />
                  <span className="font-sf flex">{education.location}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Description */}
      {education.description && (
        <div className="mt-2">
          <p className="text-lg text-gray-700 leading-relaxed break-words whitespace-pre-line overflow-x-auto max-w-full">
            {education.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default EducationCard;