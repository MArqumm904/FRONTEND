import React from "react";

export default function RemoveMembership({ onCancel, onBlock, name = "Leadership academy" }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-lg h-auto rounded-xl shadow-lg text-center overflow-hidden pt-6">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2 px-6">
          Remove {name} Membership?
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-6 px-6">
          This will revoke your badge, access, and verified status. This may
          <br />
          affect your profile credibility. Action cannot be undone.
        </p>

        {/* Block Button */}
        <button
          onClick={onBlock}
          className="w-full text-red-600 font-semibold py-4 border-t border-gray-200 hover:bg-red-50"
        >
          Remove Membership
        </button>

        {/* Cancel Button */}
        <button
          onClick={onCancel}
          className="w-full text-gray-800 font-medium py-4 border-t border-gray-200 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
