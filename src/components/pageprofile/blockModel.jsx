import React from "react";

export default function BlockModal({ onCancel, onBlock, name = "Leadership academy" }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-lg h-auto rounded-xl shadow-lg text-center px-6 pt-6">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Block {name}?
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-6">
          They won't be able to find your profile, posts or story on ahmeed.
          <br />
          ahmeed won’t let them know you blocked them.
        </p>

        {/* Block Button */}
        <button
          onClick={onBlock}
          className="w-full text-red-600 font-semibold py-4 border-t border-gray-200 hover:bg-red-50"
        >
          Block
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
