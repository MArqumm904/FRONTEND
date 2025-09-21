import React, { useState, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";
import ViewMembershipModal from "./view_membership_modal";
import BluePeakLogo from "../../assets/images/banner-pro.jpg";
import PixelCraftLogo from "../../assets/images/logo.jpg";
import CodeHiveLogo from "../../assets/images/banner-2.jpg";

// API function to update membership status
const updateMembershipStatus = async (userPageId, pageId, status) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/membershipstatususerside`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          user_page_id: userPageId,
          page_id: pageId,
          status: status,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update membership status");
    }

    return data;
  } catch (err) {
    console.error("Error updating membership status:", err);
    throw err;
  }
};

const InvitationCard = ({ invitation, onViewLetter, onStatusUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleApprove = async () => {
    setIsUpdating(true);
    try {
      await updateMembershipStatus(
        invitation.user_page_id,
        invitation.page_id,
        "company_approved"
      );
      onStatusUpdate(invitation.id, "company_approved");
    } catch (error) {
      console.error("Error approving membership:", error);
      alert("Failed to approve membership. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async () => {
    setIsUpdating(true);
    try {
      await updateMembershipStatus(
        invitation.user_page_id,
        invitation.page_id,
        "rejected"
      );
      onStatusUpdate(invitation.id, "rejected");
    } catch (error) {
      console.error("Error rejecting membership:", error);
      alert("Failed to reject membership. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="border border-gray-400 rounded-lg bg-white p-5 flex flex-col gap-2 mb-4 relative shadow-sm">
      <div className="flex items-start gap-4">
        <img
          src={invitation.companyLogo || BluePeakLogo}
          alt="Company Logo"
          className="w-14 h-14 rounded-full object-cover bg-gray-100 border border-gray-200"
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-bold text-lg text-black font-sf">
              Invited by: {invitation.page.page_name}
            </span>
            <span className="text-xs text-gray-500 font-sf">
              {new Date(invitation.start_date).toLocaleDateString()} –
              {invitation.currently_working
                ? "Present"
                : new Date(invitation.end_date).toLocaleDateString()}
            </span>
            {invitation.currently_working && (
              <span className="text-xs font-medium text-blue-700 font-sf cursor-pointer hover:underline">
                Currently Working
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-sm text-gray-700 font-sf">
              {invitation.job_title}
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
          {invitation.responsibilities ||
            "We confirm your work with our company during this period."}
        </p>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          onClick={handleApprove}
          disabled={isUpdating}
          className="flex items-center justify-center px-7 py-2 bg-[#22bb33] hover:bg-[#1e9e2a] text-white text-sm rounded-md font-sf min-w-[110px] border border-[#22bb33] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <span className="mr-2 text-lg">✓</span>
          )}
          Approve
        </button>
        <button
          onClick={handleReject}
          disabled={isUpdating}
          className="flex items-center justify-center px-7 py-2 bg-[#ff2222] hover:bg-[#d11a1a] text-white text-sm rounded-md font-sf min-w-[110px] border border-[#ff2222] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <span className="mr-2 text-lg">✗</span>
          )}
          Reject
        </button>
        <button
          className="flex items-center justify-center px-5 py-2 bg-[#0017e7] hover:bg-[#0014c9] text-white text-sm rounded-md font-sf min-w-[170px] border border-[#0037ff] transition-colors duration-150"
          onClick={() => onViewLetter(invitation)}
        >
          View Confirmation Letter
        </button>
      </div>
    </div>
  );
};

const MembershipInvitationTab = () => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMembershipInvitations();
  }, []);

  const fetchMembershipInvitations = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/getCompaniesMemberships`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch membership invitations"
        );
      }

      if (data.success) {
        setInvitations(data.data || []);
      } else {
        throw new Error(
          data.message || "Failed to fetch membership invitations"
        );
      }
    } catch (err) {
      console.error("Error fetching membership invitations:", err);
      setError(
        err.message || "Something went wrong while fetching invitations"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewLetter = (invitation) => {
    setSelectedInvitation(invitation);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedInvitation(null);
  };

  const handleStatusUpdate = (id, status) => {
    // Remove the invitation from the list after successful status update
    setInvitations(prevInvitations => 
      prevInvitations.filter(invitation => invitation.id !== id)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <svg
          className="animate-spin h-8 w-8 text-[#0017e7]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-2 mx-10 flex justify-center items-center py-10">
        <div className="text-center">
          <p className="text-red-500 font-sf mb-4">Error: {error}</p>
          <button
            onClick={fetchMembershipInvitations}
            className="px-4 py-2 bg-[#0017e7] text-white rounded-md font-sf"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="mt-2 mx-10 flex justify-center items-center py-10">
        <div className="text-center">
          <p className="text-gray-600 font-sf">
            No pending membership invitations found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2">
      {invitations.map((invitation) => (
        <InvitationCard
          key={invitation.id}
          invitation={invitation}
          onViewLetter={handleViewLetter}
          onStatusUpdate={handleStatusUpdate}
        />
      ))}
      {showViewModal && selectedInvitation && (
        <ViewMembershipModal 
          onClose={handleCloseViewModal} 
          invitation={selectedInvitation}
        />
      )}
    </div>
  );
};

export default MembershipInvitationTab;