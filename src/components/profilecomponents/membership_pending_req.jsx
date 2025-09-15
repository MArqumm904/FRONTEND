import React, { useState } from 'react';
import Logo from '../../assets/images/logo.jpg';
import { MapPin } from 'lucide-react';
import ViewMembershipModal from './view_membership_modal';

const pendingMemberships = [
  {
    id: 1,
    jobTitle: 'UI/UX Designer',
    companyName: 'StarTech Pvt Ltd',
    location: 'Karachi, Pakistan',
    startDate: 'June 2021',
    endDate: 'Currently working',
    description: 'Responsible for designing user flows, wireframes, and interactive prototypes.',
    status: 'Currently working',
  },
  {
    id: 2,
    jobTitle: 'MERN Developer',
    companyName: 'StarTech Pvt Ltd',
    location: 'Islamabad, Pakistan',
    startDate: 'June 2024',
    endDate: 'Currently working',
    description: 'Responsible for designing user flows, wireframes, and interactive prototypes.',
    status: 'Currently working',
  },
];

const PendingMembershipCard = ({ membership, onViewLetter }) => (
  <div className="border border-gray-400 rounded-lg bg-white p-5 flex flex-col gap-2 mb-4 relative shadow-sm">
    <div className="flex items-start gap-4">
      {/* Logo */}
      <img
        src={Logo}
        alt="Company Logo"
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

const MembershipPendingReq = () => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState(null);

  const handleViewLetter = (membership) => {
    setSelectedMembership(membership);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedMembership(null);
  };

  return (
    <div className="mt-2">
      {pendingMemberships.map((membership) => (
        <PendingMembershipCard key={membership.id} membership={membership} onViewLetter={handleViewLetter} />
      ))}
      {showViewModal && (
        <ViewMembershipModal onClose={handleCloseViewModal} />
      )}
    </div>
  );
};

export default MembershipPendingReq;