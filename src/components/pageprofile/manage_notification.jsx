import React, { useState } from 'react';

const ManageNotification = ({ onClose }) => {
  // State for each toggle
  const [pauseAll, setPauseAll] = useState(false);
  const [agencyNotification, setAgencyNotification] = useState(true);
  const [membershipNotification, setMembershipNotification] = useState(false);
  const [likeNotification, setLikeNotification] = useState(true);
  const [commentNotification, setCommentNotification] = useState(false);
  const [followNotification, setFollowNotification] = useState(true);
  const [mentionNotification, setMentionNotification] = useState(false);
  const [messageNotification, setMessageNotification] = useState(true);

  // Switch with a slightly longer, smoother transition (duration-300)
  const PrivacySwitch = ({ checked, onChange, ariaLabel }) => (
    <button
      className={`relative w-12 h-7 rounded-full transition-colors duration-300 focus:outline-none ${checked ? 'bg-[#0017e7]' : 'bg-gray-300'}`}
      onClick={onChange}
      aria-pressed={checked}
      aria-label={ariaLabel}
      type="button"
    >
      <span
        className={`absolute left-1 top-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${checked ? 'translate-x-5' : ''}`}
      />
    </button>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold font-sf text-gray-900">Manage Notification</h2>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-800 transition-colors rounded-full"
            aria-label="Close"
          >
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        {/* Content */}
        <div className="px-7 py-6 space-y-7">
          {/* Notification Control */}
          <div>
            <div className="font-sf font-medium text-lg mb-3">Notification Control</div>
            <div className="flex items-center justify-between border border-[#a0a0a0] bg-gray-50 rounded-lg px-4 py-3 mb-1">
              <span className="font-sf text-base text-gray-900">Pause all</span>
              <PrivacySwitch checked={pauseAll} onChange={() => setPauseAll(v => !v)} ariaLabel="Pause all notifications" />
            </div>
          </div>
          {/* Platform Notifications */}
          <div>
            <div className="font-sf font-medium text-lg mb-3">Platform Notifications</div>
            <div className="flex items-center justify-between border border-[#a0a0a0] bg-gray-50 rounded-lg px-4 py-3 mb-2">
              <span className="font-sf text-base text-gray-900">Agency Notification</span>
              <PrivacySwitch checked={agencyNotification} onChange={() => setAgencyNotification(v => !v)} ariaLabel="Agency notification" />
            </div>
            <div className="flex items-center justify-between border border-[#a0a0a0] bg-gray-50 rounded-lg px-4 py-3">
              <span className="font-sf text-base text-gray-900">Membership Notification</span>
              <PrivacySwitch checked={membershipNotification} onChange={() => setMembershipNotification(v => !v)} ariaLabel="Membership notification" />
            </div>
          </div>
          {/* Interaction Notifications */}
          <div>
            <div className="font-sf font-medium text-lg mb-3 ">Interaction Notifications</div>
            <div className="flex items-center justify-between border border-[#a0a0a0] bg-gray-50 rounded-lg px-4 py-3 mb-2">
              <span className="font-sf text-base text-gray-900">Like Notification</span>
              <PrivacySwitch checked={likeNotification} onChange={() => setLikeNotification(v => !v)} ariaLabel="Like notification" />
            </div>
            <div className="flex items-center justify-between border border-[#a0a0a0] bg-gray-50 rounded-lg px-4 py-3 mb-2">
              <span className="font-sf text-base text-gray-900">Comment Notification</span>
              <PrivacySwitch checked={commentNotification} onChange={() => setCommentNotification(v => !v)} ariaLabel="Comment notification" />
            </div>
            <div className="flex items-center justify-between border border-[#a0a0a0] bg-gray-50 rounded-lg px-4 py-3 mb-2">
              <span className="font-sf text-base text-gray-900">Follow Notification</span>
              <PrivacySwitch checked={followNotification} onChange={() => setFollowNotification(v => !v)} ariaLabel="Follow notification" />
            </div>
            <div className="flex items-center justify-between border border-[#a0a0a0] bg-gray-50 rounded-lg px-4 py-3 mb-2">
              <span className="font-sf text-base text-gray-900">Mention Notification</span>
              <PrivacySwitch checked={mentionNotification} onChange={() => setMentionNotification(v => !v)} ariaLabel="Mention notification" />
            </div>
            <div className="flex items-center justify-between border border-[#a0a0a0] bg-gray-50 rounded-lg px-4 py-3">
              <span className="font-sf text-base text-gray-900">Message Notification</span>
              <PrivacySwitch checked={messageNotification} onChange={() => setMessageNotification(v => !v)} ariaLabel="Message notification" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageNotification;
