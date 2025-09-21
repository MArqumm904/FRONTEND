import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, MapPin, Loader2 } from "lucide-react";
import Avatar from "../../assets/images/avatorr.png";
import RemoveMembershipModal from "./remove_membership";
import DocumentViewModal from "./DocumentViewModal";
import MembershipPendingReq from "./membership_pending_req";
import MembershipInvitationTab from "./membership_invitation_tab";
import { toast, ToastContainer } from "react-toastify";

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

const MembershipCard = ({ membership, onRemove, onViewLetter, isRemoving }) => {
  // Extract company name based on membership type
  const getCompanyName = () => {
    if (membership.page && membership.page.page_name) {
      return membership.page.page_name;
    }
    return membership.company_name || "Unknown Company";
  };

  // Check if documents exist
  const hasDocuments = membership.documents && membership.documents.length > 0;

  return (
    <div className="border border-[#000] rounded-lg bg-white p-5 flex flex-col gap-2 mb-4 relative shadow-sm">
      {/* Close Icon */}
      <button
        className="absolute top-4 hover:bg-gray-100 rounded-full p-1 right-4 text-gray-900 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        tabIndex={-1}
        onClick={() => onRemove(membership)}
        disabled={isRemoving}
      >
        {isRemoving ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <X className="w-6 h-6" />
        )}
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
              {membership.job_title || membership.jobTitle}
            </span>
            <span className="text-xs text-gray-500 font-sf">
              {membership.start_date
                ? new Date(membership.start_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  })
                : ""}{" "}
              -{" "}
              {membership.currently_working
                ? "Present"
                : membership.end_date
                ? new Date(membership.end_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  })
                : ""}
            </span>
            {membership.currently_working && (
              <span className="text-xs font-medium text-blue-700 font-sf cursor-pointer hover:underline">
                &ndash; Currently working
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-bold text-lg text-black font-sf">
              {getCompanyName()}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-gray-500 text-sm font-sf">
            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
            <span>{membership.location}</span>
          </div>
        </div>
      </div>
      <div className="mt-2 mb-2">
        <p className="text-gray-500 text-base font-sf">
          {membership.responsibilities || membership.description}
        </p>
      </div>
      <div className="mt-2 flex gap-2">
        <button
          className={`px-4 py-2 text-sm rounded-md font-sf ${
            hasDocuments
              ? "bg-[#0214b5] hover:bg-[#000f82] text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={() => hasDocuments && onViewLetter(membership)}
          disabled={!hasDocuments}
        >
          {hasDocuments ? "View Documents" : "No Documents Available"}
        </button>
        {hasDocuments && (
          <div className="flex items-center">
            <span className="text-xs text-green-600 font-sf">
              • {membership.documents.length} document(s) available
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const VerifiedMembershipsTab = () => {
  const [activeTab, setActiveTab] = useState("verified");
  const [cards, setCards] = useState([]);
  const [membershipToRemove, setMembershipToRemove] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState(null);

  useEffect(() => {
    fetchConfirmedMemberships();
  }, []);

  const fetchConfirmedMemberships = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/getUserConfirmedMemberships`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        // Normalize the data before combining
        const normalizedUserMemberships = response.data.data.user_memberships?.map(normalizeMembership) || [];
        const normalizedPageMemberships = response.data.data.page_memberships?.map(normalizeMembership) || [];
        
        // Combine both arrays from the response
        const allMemberships = [
          ...normalizedUserMemberships,
          ...normalizedPageMemberships
        ];
        setCards(allMemberships);
      } else {
        setError(
          response.data.message || "Failed to fetch confirmed memberships"
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred while fetching data"
      );
      console.error("Error fetching confirmed memberships:", err);
    } finally {
      setLoading(false);
    }
  };

  const normalizeMembership = (membership) => {
    // For user_memberships that have a nested page object
    if (membership.page) {
      return {
        id: membership.id,
        page_id: membership.page_id,
        user_id: membership.user_id,
        company_name: membership.page.page_name || membership.company_name || "Unknown Company",
        job_title: membership.job_title,
        location: membership.location,
        start_date: membership.start_date,
        end_date: membership.end_date,
        currently_working: membership.currently_working,
        responsibilities: membership.responsibilities,
        status: membership.status,
        created_at: membership.created_at,
        updated_at: membership.updated_at,
        page: membership.page,
        documents: membership.documents || []
      };
    }
    
    if (membership.page && membership.page.page_name) {
      return {
        ...membership,
        company_name: membership.page.page_name,
        documents: membership.documents || []
      };
    }

    return {
      ...membership,
      documents: membership.documents || []
    };
  };

  const removeMember = async (membership) => {
    try {
      setRemovingId(membership.id);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/removemember`,
        {
          page_id: membership.page_id,
          user_id: membership.user_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        // Remove the membership from the local state
        setCards((prev) => prev.filter((card) => card.id !== membership.id));
        setMembershipToRemove(null);
        toast.success("Member removed successfully");
      } else {
        throw new Error(response.data.message || "Failed to remove member");
      }
    } catch (err) {
      console.error("Error removing member:", err);
      toast.error(err.response?.data?.message || "Failed to remove member");
    } finally {
      setRemovingId(null);
    }
  };

  useEffect(() => {
    if (membershipToRemove || showDocumentModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [membershipToRemove, showDocumentModal]);

  const handleRemoveClick = (membership) => {
    setMembershipToRemove(membership);
  };

  const handleConfirmRemove = () => {
    if (membershipToRemove) {
      removeMember(membershipToRemove);
    }
  };

  const handleCancelRemove = () => {
    setMembershipToRemove(null);
  };

  const handleViewLetter = (membership) => {
    setSelectedMembership(membership);
    setShowDocumentModal(true);
  };

  const handleCloseDocumentModal = () => {
    setShowDocumentModal(false);
    setSelectedMembership(null);
  };

  // Loading state
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

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow p-4 sm:p-6 mx-auto mt-4 border border-[#7c87bc]">
        <h2 className="text-2xl font-semibold mb-5 font-sf text-gray-900">
          Verified Memberships
        </h2>
        <div className="text-center py-10 text-red-500 font-sf">
          Error: {error}
          <button
            onClick={fetchConfirmedMemberships}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-sf"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 sm:p-6 mx-auto mt-4 border border-[#7c87bc]">
      <ToastContainer />
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
                isRemoving={removingId === membership.id}
              />
            ))
          )}
        </div>
      )}
      {activeTab === "pending" && <MembershipPendingReq />}
      {activeTab === "invitations" && <MembershipInvitationTab />}
      {/* Remove Membership Modal */}
      {membershipToRemove && (
        <RemoveMembershipModal
          membership={membershipToRemove}
          onConfirm={handleConfirmRemove}
          onCancel={handleCancelRemove}
        />
      )}
      {/* Document View Modal */}
      {showDocumentModal && selectedMembership && (
        <DocumentViewModal 
          onClose={handleCloseDocumentModal} 
          membership={selectedMembership}
        />
      )}
    </div>
  );
};

export default VerifiedMembershipsTab;