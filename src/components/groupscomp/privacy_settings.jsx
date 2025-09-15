import React, { useState } from "react";
import { X } from "lucide-react";

const PrivacySettings = ({ onClose }) => {
  const [isPrivate, setIsPrivate] = useState(true);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-md shadow-2xl w-full max-w-md animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 pt-6 pb-4">
          <h2 className="text-2xl font-medium text-black font-sf">
            Private Group
          </h2>
          <button
            className="text-3xl text-black hover:text-gray-800 ml-4"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-7 h-7" />
          </button>
        </div>
        {/* Card */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between border rounded-md px-4 py-3 mb-4 bg-gray-50">
            <span className="font-sf text-lg font-medium text-black">
              Private Account
            </span>
            <button
              className={`relative w-12 h-7 rounded-full transition-colors duration-200 focus:outline-none ${
                isPrivate ? "bg-[#0017e7]" : "bg-gray-300"
              }`}
              onClick={() => setIsPrivate((v) => !v)}
              aria-pressed={isPrivate}
              aria-label="Toggle private account"
            >
              <span
                className={`absolute left-1 top-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                  isPrivate ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
          <div className="text-gray-600 text-md font-sf leading-relaxed">
            Manage who can see your Group and activity. You can control the
            visibility of your education, memberships, and contact info. Choose
            what you want to keep public or private and update your preferences
            anytime.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
