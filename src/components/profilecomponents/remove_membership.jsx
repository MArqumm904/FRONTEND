import React from "react";

const RemoveMembershipModal = ({ membership, onConfirm, onCancel }) => {
  if (!membership) return null;

  const companyName = membership.companyName || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div
        className="
          bg-white 
          rounded-md 
          shadow-lg 
          w-full 
          max-w-lg 
          relative 
          min-w-[340px] 
          border-none 
          p-0
        "
      >
        <div className="flex flex-col items-center px-6 pt-7 pb-2">
          <h3
            className="
              text-[22px] 
              font-semibold 
              text-gray-900 
              mb-[6px] 
              mt-[2px] 
              text-center 
              font-sans 
              tracking-normal
            "
          >
            Remove {companyName} Membership?
          </h3>
          <p
            className="
              text-[15px] 
              text-gray-600 
              text-center 
              font-normal 
              leading-[1.5] 
              mb-[18px] 
              mt-0 
              font-sans 
              max-w-[320px]
            "
          >
            This will revoke your badge, access, and verified status. This may
            affect your profile credibility. Action cannot be undone.
          </p>
        </div>
        {/* Top border */}
        <div className="w-full border-t border-[#e0e0e0]" />
        {/* Remove Membership Button */}
        <button
          className="
            w-full 
            text-[17px] 
            font-medium 
            text-[#e53935] 
            bg-transparent 
            border-none 
            py-[18px] 
            border-b 
            border-[#e0e0e0] 
            cursor-pointer 
            transition-colors 
            outline-none
            hover:bg-red-50
             hover:rounded-md
          "
          onClick={() => onConfirm(membership.id)}
        >
          Remove Membership
        </button>
        {/* Cancel Button */}
        <button
          className="
            w-full 
            text-[17px] 
            font-medium 
            text-[#222] 
            bg-transparent 
            border-none 
            py-[18px] 
            cursor-pointer 
            transition-colors 
            outline-none
            hover:bg-gray-100
            hover:rounded-md
          "
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RemoveMembershipModal;
