import React, { useState } from 'react';
import { MapPin, Settings } from 'lucide-react';
import ViewMembershipModal from './view_membership_modal';
import BluePeakLogo from '../../assets/images/banner-pro.jpg'; 
import PixelCraftLogo from '../../assets/images/logo.jpg'; 
import CodeHiveLogo from '../../assets/images/banner-2.jpg'; 
import ViewAgentsDetails from './ViewAgentsDetails';
import UploadAgentAgreement from './UploadAgentAgreement';

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

const InvitationCard = ({ invitation , showModel }) => (
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
            Requested by: {invitation.companyName}
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
          <span className="flex items-center text-sm text-gray-700 font-sf">
            <Settings className="w-4 h-4 mr-1 text-gray-600"/>
            {invitation.jobTitle}
          </span>
          <span className='text-gray-400'>|</span>
          <span className="flex items-center text-xs text-gray-500 font-sf">
            <MapPin className="w-4 h-4 mr-1 text-gray-600" />
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

const AgentsRequests = () => {
   const [showDetailsModal , setShowDetailsModal] = useState(false);
   const [showUploadModal , setShowUploadModal] = useState(false);
   
      const handleUpload = () => {
       setShowUploadModal(true);
       setShowDetailsModal(false);
      }
  return (
    <div className="mt-2 px-10">
      {invitations.map((invitation) => (
        <InvitationCard key={invitation.id} invitation={invitation} showModel={() => setShowDetailsModal(true)}  />
      ))}

      {showDetailsModal && (
        <ViewAgentsDetails
          open={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          readable={true}
          onAgreementUpload={handleUpload}
        />
      )}

      {showUploadModal && (
        <UploadAgentAgreement open={showUploadModal} onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  );
};

export default AgentsRequests;