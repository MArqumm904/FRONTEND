import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, Lock, User, Mail, Settings, Shield, Store, Users, Briefcase, FileText, Layers, BookOpen } from 'lucide-react';

const sections = [
  {
    key: 'account',
    label: 'Account Settings',
    icon: <Lock className="w-5 h-5 mr-2" />,
    content: (
      <div className="pt-2 pb-2">
        {/* Nested Accordion: Change your name, email, or username */}
        <Accordion
          title="Change your name, email, or username"
          defaultOpen={true}
        >
          <div className="bg-[#f8fafc] border border-[#5a5a5a] rounded-md p-4 mb-3 text-[13px] text-gray-700 font-sf">
            <div className="mb-2">You can update your basic account details at any time by following these steps:</div>
            <ol className="list-decimal list-inside mb-2 pl-2">
              <li>Go to your profile <a href="#" className="text-[#0017e7] underline font-medium">settings</a>.</li>
              <li>Tap your profile picture → <span className="font-medium text-[#0017e7]">Settings → Account Info</span>.</li>
              <li>Select the field you want to change.<br/>
                <span className="block ml-4">• <span className="font-medium text-[#0017e7]">Name:</span> Update your full name displayed on your profile.</span>
                <span className="block ml-4">• <span className="font-medium text-[#0017e7]">Email:</span> Enter your new email and verify it.</span>
                <span className="block ml-4">• <span className="font-medium text-[#0017e7]">Username:</span> Choose a unique username for your public profile URL.</span>
              </li>
              <li><span className="font-medium text-[#0017e7]">Save</span>  your changes.</li>
            </ol>
            <div className="text-xs text-gray-500">Your updates will be applied immediately. You may need to <a href="#" className="text-[#0017e7] underline font-medium">verify your email</a>.</div>
          </div>
        </Accordion>
        <Accordion title="Delete your account">
          <div className="bg-[#f8fafc] border border-[#5a5a5a] rounded-md p-3 text-[13px] text-gray-700 font-sf">
            <span>To delete your account, go to Settings &gt; Account Info &gt; Delete Account. Follow the on-screen instructions.</span>
          </div>
        </Accordion>
        <Accordion title="Update preferences">
          <div className="bg-[#f8fafc] border border-[#5a5a5a] rounded-md p-3 text-[13px] text-gray-700 font-sf">
            <span>Manage your notification, privacy, and display preferences from your account settings.</span>
          </div>
        </Accordion>
      </div>
    ),
  },
  {
    key: 'login',
    label: 'Login & Recovery Settings',
    icon: <User className="w-5 h-5 mr-2" />,
  },
  {
    key: 'privacy',
    label: 'Privacy & Safety',
    icon: <Shield className="w-5 h-5 mr-2" />,
  },
  {
    key: 'marketplace',
    label: 'Marketplace',
    icon: <Store className="w-5 h-5 mr-2" />,
  },
  {
    key: 'groups',
    label: 'Groups',
    icon: <Users className="w-5 h-5 mr-2" />,
  },
  {
    key: 'marketplace2',
    label: 'Marketplace',
    icon: <Store className="w-5 h-5 mr-2" />,
  },
  {
    key: 'mc',
    label: 'MC',
    icon: <Layers className="w-5 h-5 mr-2" />,
  },
  {
    key: 'agents',
    label: 'Agents / Agencies',
    icon: <Briefcase className="w-5 h-5 mr-2" />,
  },
  {
    key: 'pages',
    label: 'Pages',
    icon: <FileText className="w-5 h-5 mr-2" />,
  },
  {
    key: 'membership',
    label: 'Membership',
    icon: <BookOpen className="w-5 h-5 mr-2" />,
  },
];

function Accordion({ title, children, defaultOpen }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="mb-2">
      <button
        className="w-full flex items-center justify-between py-2 px-3 bg-white border border-[#5a5a5a] rounded-md font-sf text-[15px] font-medium text-gray-900 focus:outline-none hover:bg-gray-50 transition"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <span>{title}</span>
        {open ? <ChevronUp className="w-5 h-5 fill-[#000]" /> : <ChevronDown className="w-5 h-5 fill-[#000]" />}
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  );
}

const HelpCenter = ({ onClose }) => {
  const [openSection, setOpenSection] = useState('account');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md min-w-[350px] animate-fadeIn relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 pt-6 pb-4">
          <h2 className="text-lg font-semibold text-black font-sf">Help Center</h2>
          <button
            className="text-2xl text-black hover:text-gray-800 ml-4"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* Accordion Sections */}
        <div className="px-4 py-5 max-h-[80vh] overflow-y-auto hide-scrollbar">
          {sections.map((section) => (
            <div key={section.key} className="mb-1">
              <button
                className={`w-full flex items-center justify-between py-3 px-3 bg-white border border-[#a0a0a0] rounded-md font-sf text-[15px] font-medium text-gray-900 focus:outline-none hover:bg-gray-50 transition ${openSection === section.key ? 'shadow' : ''}`}
                onClick={() => setOpenSection(openSection === section.key ? '' : section.key)}
                type="button"
              >
                <span className="flex items-center">{section.icon}{section.label}</span>
                {openSection === section.key ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {openSection === section.key && section.content && (
                <div className="mt-2 ml-1">{section.content}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;