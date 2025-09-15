import { useState } from "react";

const ManageNotifications = ({ onClose }) => {
  const [newpost, setnewpost] = useState(true);
  const [commentonyourpost, setcommentonyourpost] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold font-sf text-gray-900">
            Manage Notification
          </h2>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-800 transition-colors rounded-full"
            aria-label="Close"
          >
            <svg
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Content */}
        <div className="px-7 py-6">
          <div className="flex items-center justify-between border border-[#a0a0a0] rounded-md px-4 py-3 mb-4 bg-gray-50 mt-2">
            <span className="font-sf text-base text-gray-900">
              New Post in Group
            </span>
            <button
              className={`relative w-12 h-7 rounded-full transition-colors duration-200 focus:outline-none ${
                newpost ? "bg-[#0017e7]" : "bg-gray-300"
              }`}
              onClick={() => setnewpost((v) => !v)}
              aria-pressed={newpost}
              aria-label="Toggle private account"
            >
              <span
                className={`absolute left-1 top-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                  newpost ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between border border-[#a0a0a0] rounded-md px-4 py-3 mb-4 bg-gray-50 mt-2">
            <span className="font-sf text-base text-gray-900">
              Comment on Your Group Post
            </span>
            <button
              className={`relative w-12 h-7 rounded-full transition-colors duration-200 focus:outline-none ${
                commentonyourpost ? "bg-[#0017e7]" : "bg-gray-300"
              }`}
              onClick={() => setcommentonyourpost((v) => !v)}
              aria-pressed={commentonyourpost}
              aria-label="Toggle private account"
            >
              <span
                className={`absolute left-1 top-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                  commentonyourpost ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between border border-[#a0a0a0] rounded-md px-4 py-3 mb-4 bg-gray-50 mt-2">
            <span className="font-sf text-base text-gray-900">
              Group Join Request Approved
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
        </div>
      </div>
    </div>
  );
};

export default ManageNotifications;
