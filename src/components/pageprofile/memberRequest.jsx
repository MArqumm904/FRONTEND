import React, { useState, useEffect } from "react";
import { MapPin, Settings, Loader2 } from "lucide-react";
import ViewMembershipModal from "./view_membership_modal";
import ApproveRequest from "./Approve_request";

// Default fallback image if company logo is not available
const DEFAULT_COMPANY_LOGO = "/default-company-logo.png";

const MemberCard = ({ request, onViewLetter }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const getStatusDisplay = () => {
    if (request.currently_working) {
      return "Currently Working";
    }
    return "";
  };

  const getStatusColor = () => {
    switch (request.status) {
      case "approved":
        return "text-green-700";
      case "rejected":
        return "text-red-700";
      case "pending":
      default:
        return "text-blue-700";
    }
  };

  const getProfilePhotoUrl = () => {
    const profilePhoto = request.user?.profile?.profile_photo;

    if (!profilePhoto) {
      return DEFAULT_COMPANY_LOGO;
    }

    // If it's already a full URL, return as-is
    if (profilePhoto.startsWith("http")) {
      return profilePhoto;
    }

    // Construct the full URL with storage path
    const baseUrl = import.meta.env.VITE_API_BASE_URL.replace("/api", "");
    const fullUrl = `${baseUrl}/storage/${profilePhoto}`;

    // Debug log to see what URL is being generated
    console.log("Profile Photo Path:", profilePhoto);
    console.log("Base URL:", baseUrl);
    console.log("Full Image URL:", fullUrl);

    return fullUrl;
  };

  return (
    <div className="border border-gray-400 rounded-lg bg-white p-5 flex flex-col gap-2 mb-4 relative shadow-sm">
      <div className="flex items-start gap-4">
        {/* User Profile Photo */}
        <img
          src={getProfilePhotoUrl()}
          alt="Profile"
          className="w-14 h-14 rounded-full object-cover bg-gray-100 border border-gray-200"
          onError={(e) => {
            e.target.src = DEFAULT_COMPANY_LOGO;
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-bold text-lg text-black font-sf">
              {request.company_name}
            </span>
            <span className="text-xs text-gray-500 font-sf">
              {formatDate(request.start_date)} –{" "}
              {formatDate(request.end_date) || "Present"}
            </span>
            {getStatusDisplay() && (
              <span
                className={`text-xs font-medium ${getStatusColor()} font-sf cursor-pointer hover:underline`}
              >
                &ndash; {getStatusDisplay()}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="flex items-center text-sm text-gray-700 font-sf">
              <Settings className="w-4 h-4 mr-1 text-gray-600" />
              {request.job_title}
            </span>
            <span className="text-gray-400">|</span>
            <span className="flex items-center text-xs text-gray-500 font-sf">
              <MapPin className="w-4 h-4 mr-1 text-gray-600" />
              {request.location}
            </span>
          </div>
          {/* User Info */}
          <div className="mt-1">
            <span className="text-sm text-gray-600 font-sf">
              Requested by:{" "}
              <span className="font-medium">{request.user?.name}</span>
              <span className="text-gray-400"> ({request.user?.email})</span>
            </span>
          </div>
        </div>
      </div>
      <div className="mt-2 mb-2">
        <p className="text-gray-700 text-lg font-sf">
          {request.responsibilities || "No description provided."}
        </p>
      </div>

      {/* Action Buttons - Only show if status is pending */}
      {(!request.status || request.status === "pending") && (
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            onClick={() => onViewLetter(request)}
            className="flex items-center justify-center px-7 py-1 bg-[#22bb33] hover:bg-[#1e9e2a] text-white text-sm rounded-md font-sf min-w-[110px] border border-[#22bb33] transition-colors duration-150"
          >
            <span className="mr-2 text-lg">✓</span>
            Approve
          </button>
          <button className="flex items-center justify-center px-7 py-1 bg-[#ff2222] hover:bg-[#d11a1a] text-white text-sm rounded-md font-sf min-w-[110px] border border-[#ff2222] transition-colors duration-150">
            <span className="mr-2 text-lg">✗</span>
            Reject
          </button>
        </div>
      )}
    </div>
  );
};
                                                                                              
const MemberRequest = ({ onRequestsUpdate }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showApproveReqPopup, setShowApproveReqPopup] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Fetch membership requests from API
  const fetchMembershipRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token"); // Adjust according to your auth implementation

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/getUserMemberships`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Adjust according to your auth implementation
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch membership requests");
      }

      if (data.success) {
        setRequests(data.data || []);
        if (onRequestsUpdate) {
          onRequestsUpdate(data.data || []);
        }
      } else {
        throw new Error(data.message || "Failed to fetch membership requests");
      }
    } catch (err) {
      console.error("Error fetching membership requests:", err);
      setError(err.message || "Something went wrong while fetching requests");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchMembershipRequests();
  }, []);

  const handleViewLetter = (request) => {
    setSelectedRequest(request);
    setShowApproveReqPopup(true);
  };

  const handleCloseViewModal = () => {
    setShowApproveReqPopup(false);
    setSelectedRequest(null);
  };

  const handleRefresh = () => {
    fetchMembershipRequests();
  };

  // Loading state
  if (loading) {
    return (
      <div className="mt-2 mx-10 flex justify-center items-center py-10">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#0017e7]" />
          <p className="text-gray-600 font-sf">
            Loading membership requests...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mt-2 mx-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 font-sf text-lg mb-2">Error</div>
          <p className="text-red-700 font-sf mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-sf transition-colors duration-150"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (requests.length === 0) {
    return (
      <div className="mt-2 mx-10">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-gray-600 font-sf text-lg mb-2">
            No Membership Requests
          </div>
          <p className="text-gray-500 font-sf mb-4">
            You don't have any membership requests at the moment.
          </p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-[#0017e7] hover:bg-[#0012b7] text-white rounded-md font-sf transition-colors duration-150"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 mx-10">
      {/* Render membership cards */}
      {requests.map((request) => (
        <MemberCard
          key={request.id}
          request={request}
          onViewLetter={handleViewLetter}
        />
      ))}

      {/* Modals */}
      {showApproveReqPopup && selectedRequest && (
        <ApproveRequest
          request={selectedRequest}
          onClose={handleCloseViewModal}
          onSuccess={fetchMembershipRequests}
        />
      )}
    </div>
  );
};

export default MemberRequest;