import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import ViewMembershipModal from './view_membership_modal';
import BluePeakLogo from '../../assets/images/banner-pro.jpg'; 
import PixelCraftLogo from '../../assets/images/logo.jpg'; 
import CodeHiveLogo from '../../assets/images/banner-2.jpg'; 

const invitations = [
  {
    id: 1,
    companyLogo: BluePeakLogo,
    companyName: 'BluePeak Logistics',
    invitedBy: 'BluePeak Logistics',
    jobTitle: 'Logistics Consultant',
    location: 'Moscow, Russia',
    startDate: 'May 2019',
    endDate: 'Sep 2021',
    description: 'We confirm your consultancy support for our regional operations.',
    status: '',
  },
  {
    id: 2,
    companyLogo: PixelCraftLogo,
    companyName: 'PixelCraft Studio',
    invitedBy: 'PixelCraft Studio',
    jobTitle: 'UI/UX Designer',
    location: 'Paris, United Kingdom',
    startDate: 'Jan 2022',
    endDate: 'Currently Working',
    description: 
      'We\'d like to verify you as our design team lead on the dashboard revamp.',
    status: 'Currently Working',
  },
  {
    id: 3,
    companyLogo: CodeHiveLogo,
    companyName: 'CodeHive Technologies',
    invitedBy: 'CodeHive Technologies',
    jobTitle: 'Backend Developer',
    location: 'Cairo, Egypt',
    startDate: 'March 2021',
    endDate: 'Dec 2023',
    description: 'We want to verify your work on API development during this period.',
    status: '',
  },
];

const InvitationCard = ({ invitation, onViewLetter }) => (
  <div className="border border-gray-400 rounded-lg bg-white p-5 flex flex-col gap-2 mb-4 relative shadow-sm">
    <div className="flex items-start gap-4">
      {/* Logo */}
      <img
        src={invitation.companyLogo}
        alt="Company Logo"
        className="w-14 h-14 rounded-full object-cover bg-gray-100 border border-gray-200"
      />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="font-bold text-lg text-black font-sf">
            Invited by: {invitation.companyName}
          </span>
          <span className="text-xs text-gray-500 font-sf">
            {invitation.startDate} – {invitation.endDate}
          </span>
          {invitation.status && (
            <span className="text-xs font-medium text-blue-700 font-sf cursor-pointer hover:underline">
              &ndash; {invitation.status}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-sm text-gray-700 font-sf">
            {invitation.jobTitle}
          </span>
          <span className="flex items-center text-xs text-gray-500 font-sf">
            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
            {invitation.location}
          </span>
        </div>
      </div>
    </div>
    <div className="mt-2 mb-2">
      <p className="text-gray-700 text-lg font-sf">
        {invitation.description}
      </p>
    </div>
    <div className="mt-2 flex flex-wrap gap-2">
      <button className="flex items-center justify-center px-7 py-1 bg-[#22bb33] hover:bg-[#1e9e2a] text-white text-sm rounded-md font-sf min-w-[110px] border border-[#22bb33] transition-colors duration-150">
        <span className="mr-2 text-lg">✓</span>
        Approve
      </button>
      <button className="flex items-center justify-center px-7 py-1 bg-[#ff2222] hover:bg-[#d11a1a] text-white text-sm rounded-md font-sf min-w-[110px] border border-[#ff2222] transition-colors duration-150">
        <span className="mr-2 text-lg">✗</span>
        Reject
      </button>
      <button className="flex items-center justify-center px-5 py-1 bg-[#0017e7] hover:bg-[#0014c9] text-white text-sm rounded-md font-sf min-w-[170px] border border-[#0037ff] transition-colors duration-150" onClick={onViewLetter}>
        View Confirmation Letter
      </button>
    </div>
  </div>
);

const MembershipInvitationTab = () => {
  const [showViewModal, setShowViewModal] = useState(false);

  const handleViewLetter = () => {
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
  };

  return (
    <div className="mt-2">
      {invitations.map((invitation) => (
        <InvitationCard key={invitation.id} invitation={invitation} onViewLetter={handleViewLetter} />
      ))}
      {showViewModal && (
        <ViewMembershipModal onClose={handleCloseViewModal} />
      )}
    </div>
  );
};

export default MembershipInvitationTab;