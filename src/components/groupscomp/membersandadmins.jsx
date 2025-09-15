import React, { useState, useEffect } from "react";
import Admins from "../groupscomp/admintab";
import Members from "../groupscomp/members";

const MembersTabs = () => {
  const [activeTab, setActiveTab] = useState("admins");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay (you can replace this with actual API load if needed)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // 1 second delay

    return () => clearTimeout(timer);
  }, [activeTab]); // Reload on tab change

  return (
    <div className="bg-white rounded-xl shadow p-6 w-full mx-auto mt-4 border border-[#7c87bc]">
      {/* Main Heading */}
      <h2 className="text-3xl font-bold text-gray-900 font-sf mb-1">Members</h2>

      {/* Tabs (Admins | All members) */}
      <div className="flex space-x-8 border-b mt-5 mb-6 font-sf">
        <button
          className={`pb-2 text-md font-medium ${
            activeTab === "admins"
              ? "border-b-2 border-[#0017e7] text-[#0017e7]"
              : "text-gray-600"
          }`}
          onClick={() => {
            setLoading(true);
            setActiveTab("admins");
          }}
        >
          Admins
        </button>
        <button
          className={`pb-2 text-md font-medium ${
            activeTab === "members"
              ? "border-b-2 border-[#0017e7] text-[#0017e7]"
              : "text-gray-600"
          }`}
          onClick={() => {
            setLoading(true);
            setActiveTab("members");
          }}
        >
          All members
        </button>
      </div>

      {/* Loader or Content */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <svg
            className="animate-spin h-8 w-8 text-[#0017e7]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      ) : activeTab === "admins" ? (
        <Admins />
      ) : (
        <Members />
      )}
    </div>
  );
};

export default MembersTabs;
