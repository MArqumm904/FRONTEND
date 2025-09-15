import React, { useState, useEffect } from "react";
import { X, MapPin, Settings } from "lucide-react";
import ViewConfirmationLetter from "./view_confirmation_letter";
import RemoveMembership from "./RemoveMembership";

const agencyInvitations = [
  {
    id: 1,
    name: "Devsinc",
    invitedBy: true,
    icon: "https://cdn-icons-png.flaticon.com/512/5968/5968770.png",
    role: "Logistics Consultant",
    location: "Moscow, Russia",
    duration: "May 2019 - Sep 2021",
    status: null,
    description:
      "We confirm your consultancy support for our regional operations.",
  },
  {
    id: 2,
    name: "PixelCraft Studio",
    invitedBy: true,
    icon: "https://cdn-icons-png.flaticon.com/512/5968/5968705.png",
    role: "UI/UX Designer",
    location: "Perth, United Kingdom",
    duration: "Jan 2023",
    status: "Currently Working",
    description:
      "We'd like to verify you as our design team lead on the dashboard revamp.",
  },
  {
    id: 3,
    name: "CodeHive Technologies",
    invitedBy: true,
    icon: "https://cdn-icons-png.flaticon.com/512/5968/5968706.png",
    role: "Backend Developer",
    location: "Cairo, Egypt",
    duration: "March 2021 - Dec 2023",
    status: null,
    description:
      "We want to verify your work on API development during this period.",
  },
];

const AgencyCard = ({ agency, invitation, setShowConfLetterPopup, removeMembership }) => (
  <div className="border border-black rounded-lg bg-white p-6 flex flex-col gap-2 mb-5 relative  mx-auto">
    {/* Close Icon */}
    <button
      onClick={removeMembership}
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
        className="px-4 py-2 bg-[#0017E7] hover:bg-[#000f82] text-white text-sm rounded-md font-sf"
        onClick={() => setShowConfLetterPopup(true)}
      >
        View Confirmation Letter
      </button>
    </div>
  </div>
);

const CompanyAffiliations = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showConfLetterPopup, setShowConfLetterPopup] = useState(false);

  const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    
    const handleRemoveClick = (member) => {
      setSelectedMember(member);
      setShowRemoveModal(true);
    };
  
    const handleCancelRemove = () => {
      setShowRemoveModal(false);
      setSelectedMember(null);
    };
  
    const handleConfirmRemove = () => {
      setShowRemoveModal(false);
      setSelectedMember(null);
    };
    

  const handleViewDetails = (agency) => {
    setSelectedAgency(agency);
    setShowConfLetterPopup(true);
  };


  useEffect(() => {
    if (showModal || showRequestModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showModal, showRequestModal]);

  return (
    <div className=" py-4 sm:py-6 px-10  mx-auto mt-4">
      {agencyInvitations.map((agency) => (
        <AgencyCard
          key={agency.id}
          agency={agency}
          invitation={true}
          setShowConfLetterPopup={handleViewDetails}
          removeMembership={() => handleRemoveClick(agency)}
        />
      ))}

      {showConfLetterPopup && (
        <ViewConfirmationLetter onClose={() => setShowConfLetterPopup(false)} />
      )}

      {showRemoveModal && (
              <RemoveMembership
                onCancel={handleCancelRemove}
                onBlock={handleConfirmRemove}
                name={selectedMember?.name}
              />
            )}

    </div>
  );
};

export default CompanyAffiliations;
