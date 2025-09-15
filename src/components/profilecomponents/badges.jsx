import React from "react";
import { Gem, X } from "lucide-react";

const Badges = ({ onClose }) => {
  // 8 badges for 2 rows of 4, as in the image
  const badgeArray = Array(8).fill(0);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl pt-0 pb-8 px-6 w-[550px] max-w-full relative border border-[#dbeafe]">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-5 right-6 text-black hover:text-gray-800 focus:outline-none"
          aria-label="Close"
        >
          <X size={32} />
        </button>
        <div className="flex items-center border-b border-[#e5e7eb] pb-4 pt-5 mb-6">
          <h2 className="text-[22px] font-semibold font-sf text-black">My Badges</h2>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-5 justify-items-center">
          {badgeArray.map((_, idx) => (
            <div
              key={idx}
              className="flex items-center bg-[#b6eaf6] rounded-full px-5 py-2 gap-2 min-w-[210px] shadow-sm"
            >
              <Gem size={24} className="text-[#23b2c7]" />
              <span className="text-[#23b2c7] font-medium font-sf text-[16px]">
                Verified Memberships
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Badges;
