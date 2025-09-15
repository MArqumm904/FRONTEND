import React, { useState, useEffect } from "react";
import { X, MapPin } from "lucide-react";
import Avatar from "../../assets/images/avatorr.png";
import RemoveMembershipModal from "./remove_membership";
import ViewMembershipModal from "./view_membership_modal";
import MembershipPendingReq from "./membership_pending_req";
import MembershipInvitationTab from "./membership_invitation_tab";

const TabButton = ({ active, onClick, children }) => (
  <button
    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors duration-200 focus:outline-none ${
      active
        ? "border-[#0017e7] text-[#0014c9]"
        : "border-transparent text-gray-500 hover:text-[#0017e7]"
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

const memberships = [
  {
    id: 1,
    jobTitle: "UI/UX Designer",
    companyName: "StarTech Pvt Ltd",
    location: "Karachi, Pakistan",
    startDate: "June 2021",
    endDate: "Currently working",
    description:
      "Responsible for designing user flows, wireframes, and interactive prototypes.",
    status: "Currently working",
  },
  {
    id: 2,
    jobTitle: "UI/UX Designer",
    companyName: "StarTech Pvt Ltd",
    location: "Karachi, Pakistan",
    startDate: "June 2021",
    endDate: "Currently working",
    description:
      "Responsible for designing user flows, wireframes, and interactive prototypes.",
    status: "Currently working",
  },
];

const MembershipCard = ({ membership, onRemove, onViewLetter }) => (
  <div className="border border-[#000] rounded-lg bg-white p-5 flex flex-col gap-2 mb-4 relative shadow-sm">
    {/* Close Icon */}
    <button
      className="absolute top-4 hover:bg-gray-100 rounded-full p-1 right-4 text-gray-900 hover:text-gray-800"
      tabIndex={-1}
      onClick={() => onRemove(membership)}
    >
      <X className="w-6 h-6" />
    </button>
    <div className="flex items-start gap-4">
      {/* Avatar */}
      <img
        src={Avatar}
        alt="Avatar"
        className="w-14 h-14 rounded-full object-cover bg-gray-100 border border-gray-200"
      />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="font-bold text-lg text-black font-sf">
            {membership.jobTitle}
          </span>
          <span className="text-xs text-gray-500 font-sf">
            {membership.startDate} - {membership.endDate}
          </span>
          {membership.status && (
            <span className="text-xs font-medium text-blue-700 font-sf cursor-pointer hover:underline">
              &ndash; {membership.status}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1 text-gray-500 text-sm font-sf">
          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
          <span>{membership.location}</span>
        </div>
      </div>
    </div>
    <div className="mt-2 mb-2">
      <p className="text-gray-500 text-base font-sf">
        {membership.description}
      </p>
    </div>
    <div className="mt-2">
      <button className="px-4 py-2 bg-[#0214b5] hover:bg-[#000f82] text-white text-sm rounded-md font-sf" onClick={() => onViewLetter(membership)}>
        View Confirmation Letter
      </button>
    </div>
  </div>
);

const VerifiedMembershipsTab = () => {
  const [activeTab, setActiveTab] = useState("verified");
  const [cards, setCards] = useState(memberships);
  const [membershipToRemove, setMembershipToRemove] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState(null);

  useEffect(() => {
    if (
        membershipToRemove || showViewModal
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [membershipToRemove, showViewModal]);

  const handleRemoveClick = (membership) => {
    setMembershipToRemove(membership);
  };

  const handleConfirmRemove = (id) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
    setMembershipToRemove(null);
  };

  const handleCancelRemove = () => {
    setMembershipToRemove(null);
  };

  const handleViewLetter = (membership) => {
    setSelectedMembership(membership);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedMembership(null);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 sm:p-6 mx-auto mt-4 border border-[#7c87bc]">
      <h2 className="text-2xl font-semibold mb-5 font-sf text-gray-900">
        Verified Memberships
      </h2>
      <div className="flex items-center border-b font-sf border-gray-200 mb-4">
        <TabButton
          active={activeTab === "verified"}
          onClick={() => setActiveTab("verified")}
        >
          Verified Roles
        </TabButton>
        <TabButton
          active={activeTab === "pending"}
          onClick={() => setActiveTab("pending")}
        >
          Pending Requests
        </TabButton>
        <TabButton
          active={activeTab === "invitations"}
          onClick={() => setActiveTab("invitations")}
        >
          Membership Invitations
        </TabButton>
      </div>
      {activeTab === "verified" && (
        <div className="mt-2">
          {cards.length === 0 ? (
            <div className="text-center text-gray-500 font-sf py-8">
              No verified memberships found.
            </div>
          ) : (
            cards.map((membership) => (
              <MembershipCard
                key={membership.id}
                membership={membership}
                onRemove={handleRemoveClick}
                onViewLetter={handleViewLetter}
              />
            ))
          )}
        </div>
      )}
      {activeTab === "pending" && (
        <MembershipPendingReq />
      )}
      {activeTab === "invitations" && (
        <MembershipInvitationTab />
      )}
      {/* Remove Membership Modal */}
      <RemoveMembershipModal
        membership={membershipToRemove}
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
      />
      {/* View Membership Modal */}
      {showViewModal && (
        <ViewMembershipModal onClose={handleCloseViewModal} />
      )}
    </div>
  );
};

export default VerifiedMembershipsTab;
