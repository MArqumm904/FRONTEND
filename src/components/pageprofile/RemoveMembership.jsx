import React from "react";
import { Loader2 } from "lucide-react";

export default function RemoveMembership({ 
  onCancel, 
  onBlock, 
  name = "Leadership academy",
  isLoading = false 
}) {
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

        {/* Remove Button */}
        <button
          onClick={onBlock}
          disabled={isLoading}
          className="w-full text-red-600 font-semibold py-4 border-t border-gray-200 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isLoading ? "Removing..." : "Remove Membership"}
        </button>

        {/* Cancel Button */}
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="w-full text-gray-800 font-medium py-4 border-t border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}