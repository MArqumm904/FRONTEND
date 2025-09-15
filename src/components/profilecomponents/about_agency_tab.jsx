import React, { useState, useEffect } from "react";
import AgencyDetailsModal from "./about_agency_tab_details";
import RequestAgencyModal from "./about_request_agency";
import { X, MapPin } from "lucide-react";

const affiliatedAgencies = [
  {
    id: 1,
    name: "Iphone",
    icon: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    location: "Hyderabad, Pakistan",
    duration: "June 2021",
    status: "Currently working",
    description:
      "Responsible for designing user flows, wireframes, and interactive prototypes.",
    email: "support@iphone.com",
    city: "Karachi",
    country: "Pakistan",
    province: "Sindh",
    district: "Karachi South",
    product: "Iphone 15",
    mainCategory: "Electronics",
    subCategory: "Smartphone",
    startDate: "19th March 2023",
    endDate: "1st July 2024",
    productDescription:
      "A line of sleek, high-performance smartphones built for modern life. Features include advanced cameras, fast charging, and iOS security.",
    agreementImg:
      "https://dummyimage.com/300x80/cccccc/000000&text=View+Agreement",
    confirmationImg:
      "https://dummyimage.com/300x80/cccccc/000000&text=View+Letter",
  },
];

const agencyInvitations = [
  {
    id: 1,
    name: "BluePeak Logistics",
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
    duration: "Jan 2023 -",
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

const TabButton = ({ active, onClick, children }) => (
  <button
    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors duration-200 focus:outline-none ${
      active
        ? "border-blue-600 text-blue-700"
        : "border-transparent text-gray-500 hover:text-blue-600"
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

const AgencyCard = ({ agency, invitation, onViewDetails }) => (
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
        <div className="flex items-center gap-1 mt-1 text-gray-500 text-sm font-sf">
          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
          <span>{agency.location}</span>
        </div>
      </div>
    </div>
    <div className="mt-3 mb-2">
      <p className="text-gray-500 text-xl font-sf">{agency.description}</p>
    </div>
    <div className="mt-2">
      <button
        className="px-4 py-2 bg-[#0214b5] hover:bg-[#000f82] text-white text-sm rounded-md font-sf"
        onClick={() => onViewDetails(agency)}
      >
        View Details
      </button>
    </div>
  </div>
);

const AboutAgencyTab = () => {
  const [activeTab, setActiveTab] = useState("affiliated");
  const [showModal, setShowModal] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const handleViewDetails = (agency) => {
    setSelectedAgency(agency);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAgency(null);
  };

  const handleOpenRequestModal = () => {
    setShowRequestModal(true);
  };
  const handleCloseRequestModal = () => {
    setShowRequestModal(false);
  };

  useEffect(() => {
    if (showModal || showRequestModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showModal, showRequestModal]);

  return (
    <div className="bg-white rounded-xl shadow p-4 sm:p-6  mx-auto mt-4 border border-[#7c87bc]">
      <h2 className="text-2xl font-semibold mb-2 font-sf text-gray-900">
        My Agencies
      </h2>
      <div className="flex items-center border-b font-sf border-gray-200 mb-4">
        <TabButton
          active={activeTab === "affiliated"}
          onClick={() => setActiveTab("affiliated")}
        >
          Affiliated Agencies
        </TabButton>
        <TabButton
          active={activeTab === "invitations"}
          onClick={() => setActiveTab("invitations")}
        >
          Agencies Invitations
        </TabButton>
      </div>
      {activeTab === "affiliated" && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-sf font-semibold ">
              Affiliated Agencies
            </h3>
            <button
              onClick={handleOpenRequestModal}
              className="px-3 py-1.5 bg-white border border-black text-black rounded hover:bg-blue-50 transition-colors text-sm font-medium"
            >
              Request Agencies
            </button>
          </div>
          {affiliatedAgencies.map((agency) => (
            <AgencyCard
              key={agency.id}
              agency={agency}
              invitation={false}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}
      {activeTab === "invitations" && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold mb-3 font-sf">
              Agencies Invitations
            </h3>
            <button
              onClick={handleOpenRequestModal}
              className="px-3 py-1.5 bg-white border border-black text-black rounded hover:bg-blue-50 transition-colors text-sm font-medium"
            >
              Request Agencies
            </button>
          </div>
          {agencyInvitations.map((agency) => (
            <AgencyCard
              key={agency.id}
              agency={agency}
              invitation={true}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}
      {/* Modal Integration */}
      <AgencyDetailsModal
        open={showModal}
        onClose={handleCloseModal}
        agency={selectedAgency}
        readable={true}
      />
      <RequestAgencyModal
        open={showRequestModal}
        onClose={handleCloseRequestModal}
        agency={null}
        readable={false}
      />
    </div>
  );
};

export default AboutAgencyTab;
