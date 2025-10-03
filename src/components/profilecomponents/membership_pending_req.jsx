import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/logo.jpg";
import { MapPin, Edit } from "lucide-react";
import ViewMembershipModal from "./view_membership_modal";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditMembershipModal from "../MembershipComponents/EditMembershipModal";

const MembershipCard = ({
  membership,
  onViewLetter,
  onCancelRequest,
  onEditMembership,
  isCanceling,
}) => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const isPending = membership.status === "pending";
  const isCompanyApproved = membership.status === "company_approved";

  // Get base URL from environment variable
  const baseUrl = "http://127.0.0.1:8000/storage";

  // Get profile photo URL with proper base URL
  const profilePhotoUrl = membership.page?.page_profile_photo
    ? `${baseUrl}/${membership.page.page_profile_photo}`
    : Logo;

  return (
    <div className="border border-gray-400 rounded-lg bg-white p-5 flex flex-col gap-2 mb-4 relative shadow-sm">
      <div className="flex items-start gap-4">
        {/* Logo - Now using actual page profile photo */}
        <img
          src={profilePhotoUrl}
          alt="Company Logo"
          className="w-14 h-14 rounded-full object-cover bg-gray-100 border border-gray-200"
          onError={(e) => {
            e.target.src = Logo; // Fallback to default logo if image fails to load
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-bold text-lg text-black font-sf">
              {membership.job_title}
            </span>
            <span className="text-xs text-gray-500 font-sf">
              {formatDate(membership.start_date)} -{" "}
              {membership.currently_working
                ? "Currently working"
                : formatDate(membership.end_date)}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-gray-500 text-sm font-sf">
            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
            <span>{membership.location}</span>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {membership.company_name}
          </div>
        </div>
        {/* Edit Icon */}
        <button
          onClick={() => onEditMembership(membership)}
          className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
          disabled={isCanceling}
        >
          <Edit className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-2 mb-2">
        <p className="text-gray-500 text-base font-sf">
          {membership.responsibilities}
        </p>
      </div>
      <div className="mt-2">
        {isPending && (
          <button
            className="px-4 py-2 bg-white hover:bg-gray-50 text-black text-sm rounded-md font-sf border border-gray-300 flex items-center justify-center gap-2"
            onClick={() => onCancelRequest(membership)}
            disabled={isCanceling}
          >
            {isCanceling ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-gray-600"
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
                Canceling...
              </>
            ) : (
              "Cancel Request"
            )}
          </button>
        )}
        {isCompanyApproved && (
          <button
            className="px-4 py-2 bg-[#0214b5] hover:bg-[#000f82] text-white text-sm rounded-md font-sf"
            onClick={() => onViewLetter(membership)}
          >
            View Confirmation Letter
          </button>
        )}
      </div>
    </div>
  );
};

const MembershipPendingReq = () => {
  const [pendingMemberships, setPendingMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMembership, setEditingMembership] = useState(null);

  useEffect(() => {
    fetchPendingMemberships();
  }, []);

  const fetchPendingMemberships = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/getUserPendingMemberships`,
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
        // Process the data to ensure proper image URLs
        const processedMemberships = response.data.data.map((membership) => ({
          ...membership,
          // Add full URLs for documents and profile photos
          processedDocuments: membership.documents?.map((doc) => ({
            ...doc,
            confirmation_letter_url: doc.confirmation_letter
              ? `http://127.0.0.1:8000/storage/${doc.confirmation_letter}`
              : null,
            proof_document_url: doc.proof_document
              ? `http://127.0.0.1:8000/storage/${doc.proof_document}`
              : null,
          })),
          page: {
            ...membership.page,
            page_profile_photo_url: membership.page?.page_profile_photo
              ? `http://127.0.0.1:8000/storage/${membership.page.page_profile_photo}`
              : null,
          },
        }));

        setPendingMemberships(processedMemberships);
      } else {
        setError(
          response.data.message || "Failed to fetch pending memberships"
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred while fetching data"
      );
      console.error("Error fetching pending memberships:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewLetter = (membership) => {
    // Prepare the membership data with proper URLs for the modal
    const membershipWithUrls = {
      ...membership,
      documents: membership.processedDocuments || membership.documents,
      page: {
        ...membership.page,
        page_profile_photo_url:
          membership.page?.page_profile_photo_url ||
          (membership.page?.page_profile_photo
            ? `http://127.0.0.1:8000/storage/${membership.page.page_profile_photo}`
            : null),
      },
    };

    setSelectedMembership(membershipWithUrls);
    setShowViewModal(true);
  };

  const handleCancelRequest = async (membership) => {
    try {
      setCancelingId(membership.id);
      const token = localStorage.getItem("token");

      const userId = localStorage.getItem("user_id");

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/removemember`,
        {
          page_id: membership.page_id,
          user_id: userId,
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
        // Remove the canceled membership from the list
        setPendingMemberships((prev) =>
          prev.filter((m) => m.id !== membership.id)
        );
        toast.success("Membership request canceled successfully!");
      } else {
        toast.error(response.data.message || "Failed to cancel request");
      }
    } catch (err) {
      console.error("Error canceling membership request:", err);
      toast.error(
        err.response?.data?.message ||
          "An error occurred while canceling the request"
      );
    } finally {
      setCancelingId(null);
    }
  };

  const handleEditMembership = (membership) => {
    setEditingMembership(membership);
    setShowEditModal(true);
  };

  const handleUpdateSuccess = (updatedMembership) => {
    // Update the membership in the list
    setPendingMemberships((prev) =>
      prev.map((m) => (m.id === updatedMembership.id ? updatedMembership : m))
    );
    // toast.success("Membership updated successfully!");
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedMembership(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingMembership(null);
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
      <div className="text-center py-10 text-red-500">
        Error: {error}
        <button
          onClick={fetchPendingMemberships}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (pendingMemberships.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No pending membership requests found.
      </div>
    );
  }

  // Separate memberships by status
  const noLetterMemberships = pendingMemberships.filter(
    (m) => m.status === "pending"
  );
  const letterAttachedMemberships = pendingMemberships.filter(
    (m) => m.status === "company_approved"
  );

  return (
    <>
      <ToastContainer />
      <div className="mt-2">
        {/* No Letter Yet Section */}
        {noLetterMemberships.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">No Letter Attached</h3>
            {noLetterMemberships.map((membership) => (
              <MembershipCard
                key={membership.id}
                membership={membership}
                onViewLetter={handleViewLetter}
                onCancelRequest={handleCancelRequest}
                onEditMembership={handleEditMembership} // Add this prop
                isCanceling={cancelingId === membership.id}
              />
            ))}
          </div>
        )}

        {/* Letter Attached Section */}
        {letterAttachedMemberships.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Letter Attached</h3>
            {letterAttachedMemberships.map((membership) => (
              <MembershipCard
                key={membership.id}
                membership={membership}
                onViewLetter={handleViewLetter}
                onCancelRequest={handleCancelRequest}
                onEditMembership={handleEditMembership} 
                isCanceling={cancelingId === membership.id}
              />
            ))}
          </div>
        )}

        {showViewModal && selectedMembership && (
          <ViewMembershipModal
            invitation={selectedMembership}
            onClose={handleCloseViewModal}
          />
        )}

        {showEditModal && editingMembership && (
          <EditMembershipModal
            membershipId={editingMembership.id}
            onClose={handleCloseEditModal}
            onUpdateSuccess={handleUpdateSuccess}
          />
        )}
      </div>
    </>
  );
};

export default MembershipPendingReq;
