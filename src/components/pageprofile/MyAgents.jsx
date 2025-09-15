import React, { useState, useEffect } from "react";
import { X, MapPin, Settings } from "lucide-react";
import AgentNoLetterYet from "./AgentNoLetterYet";
import AgentLetterAttached from "./AgentLetterAttached";
import ViewDetails from "./viewDetails";
const agencyInvitations = [
  {
    id: 1,
    name: "Devsinc",
    invitedBy: true,
    icon: "https://cdn-icons-png.flaticon.com/512/5968/5968770.png",
    role: "Logistics Consultant",
    location: "Moscow, Russia",
    duration: "May 2019",
    status: "Currently Working",
    description:
      "We confirm your consultancy support for our regional operations.",
  },
];

const AgencyCard = ({ agency , showModel}) => (
  <div className="border border-black rounded-lg bg-white p-6 flex flex-col gap-2 mb-5 relative  mx-auto">
    {/* Close Icon */}
    <button
      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      tabIndex={-1}
    >
      <X className="w-7 h-7" />
    </button>
    <div className="flex items-start gap-4">
      {/* Logo */}
      <img
        src={agency.icon}
        alt={agency.name}
        className="w-14 h-14 rounded-full object-cover bg-gray-100 border border-gray-200"
      />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-lg text-black font-sf">
            {agency.name}
          </span>
          <span className="text-xs text-gray-500 font-sf">
            {agency.duration}
          </span>
          {agency.status && (
            <span className="text-xs font-medium text-blue-700 font-sf cursor-pointer hover:underline">
              &ndash; {agency.status}
            </span>
          )}
        </div>
        <div className="flex items-center gap-x-4">
          <div className="flex items-center gap-1 mt-1 text-gray-500 text-sm font-sf">
            <Settings className="w-4 h-4 mr-1 text-gray-400" />
            <span>{agency.role}</span>
          </div>
          <p className="text-gray-600">|</p>
          <div className="flex items-center gap-1 mt-1 text-gray-500 text-sm font-sf">
            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
            <span>{agency.location}</span>
          </div>
        </div>
      </div>
    </div>
    <div className="mt-3 mb-2">
      <p className="text-gray-500 text-xl font-sf">{agency.description}</p>
    </div>
    <div className="mt-2">
      <button
      onClick={showModel}
        className="px-4 py-2 bg-[#0017E7] hover:bg-[#000f82] text-white text-sm rounded-md font-sf"
      >
        View Details
      </button>
    </div>
  </div>
);

const MyAgents = () => {
  const [showDetailsModal , setShowDetailsModal] = useState(false);

  return (
    <div className=" py-4 sm:py-6 px-10  mx-auto mt-4">
      {agencyInvitations.map((agency) => (
        <AgencyCard
          key={agency.id}
          agency={agency}
          showModel={() => setShowDetailsModal(true)}
        />
      ))}

      <div className="mt-10">
        <AgentNoLetterYet />
      </div>
      
      <div className="mt-10">
        <AgentLetterAttached/>
      </div>

      {showDetailsModal && (
        <ViewDetails
          open={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          readable={true}
        />
      )}

    </div>
  );
};

export default MyAgents;
