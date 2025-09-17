import { Gem } from "lucide-react";
import React, { useState, useEffect } from "react";
import RemoveMember from "./removeMember";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [removingMemberId, setRemovingMemberId] = useState(null);

  // Extract page ID from URL
  const getPageIdFromUrl = () => {
    const pathParts = window.location.pathname.split("/");
    return pathParts[pathParts.length - 1];
  };

  const fetchMembers = async () => {
    try {
      const pageId = getPageIdFromUrl();
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/getUserApprovedMemberships`,
        { page_id: pageId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMembers(response.data.members || []);
    } catch (error) {
      console.error("Error fetching members:", error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleRemoveClick = (member) => {
    setSelectedMember(member);
    setShowRemoveModal(true);
  };

  const handleCancelRemove = () => {
    setShowRemoveModal(false);
    setSelectedMember(null);
  };

  const handleConfirmRemove = async () => {
    if (!selectedMember) return;

    setRemovingMemberId(selectedMember.user_id);
    setShowRemoveModal(false);

    try {
      const pageId = getPageIdFromUrl();
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/removemember`,
        {
          page_id: pageId,
          user_id: selectedMember.user_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Member removed successfully!");
      fetchMembers(); // Refresh the members list
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member. Please try again.");
    } finally {
      setRemovingMemberId(null);
      setSelectedMember(null);
    }
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

  return (
    <>
      <ToastContainer />{" "}
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-10">
          {members.map((member, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-xl shadow border border-gray-200 overflow-hidden flex flex-col items-center transition-opacity ${
                removingMemberId === member.user_id
                  ? "opacity-50"
                  : "opacity-100"
              }`}
            >
              {/* Cover Image */}
              <div className="w-full h-28 bg-gray-200 relative">
                <img
                  src={
                    "http://127.0.0.1:8000/storage/" + member.cover_photo ||
                    "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=120&fit=crop"
                  }
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                {/* Profile Pic */}
                <div className="absolute left-1/2 -bottom-14 transform -translate-x-1/2">
                  <img
                    src={
                      "http://127.0.0.1:8000/storage/" + member.profile_photo ||
                      "https://randomuser.me/api/portraits/men/32.jpg"
                    }
                    alt={member.name}
                    className="w-24 h-24 rounded-full border-4 border-white object-cover "
                  />
                </div>
              </div>
              <div className="pt-16 pb-6 px-4 flex flex-col items-center w-full">
                <div
                  className={`${
                    member.verified ? "flex items-center gap-x-2 mb-1" : " "
                  }`}
                >
                  <h3 className="font-bold text-lg text-gray-900 font-sf">
                    {member.name}
                  </h3>

                  {member.verified && (
                    <div className="p-2 rounded-full bg-[#BBF1FC]">
                      <Gem className={`w-4 h-4 text-cyan-600`} />
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-4 text-center font-sf">
                  {member.headline || member.job_title}
                </p>
              </div>
              <div className="w-full px-3 pb-3">
                <button
                  onClick={() => handleRemoveClick(member)}
                  disabled={removingMemberId === member.user_id}
                  className="w-full bg-[#0017e7] text-white rounded-lg py-2 font-semibold font-sf hover:bg-[#0012b7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {removingMemberId === member.user_id ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
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
                      Removing...
                    </div>
                  ) : (
                    "Remove Member"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Show message if no members found */}
        {members.length === 0 && !loading && (
          <div className="text-center py-10 text-gray-500">
            No members found for this page.
          </div>
        )}

        {/* Remove Member Modal */}
        {showRemoveModal && (
          <RemoveMember
            onCancel={handleCancelRemove}
            onConfirm={handleConfirmRemove}
            name={selectedMember?.name}
          />
        )}
      </div>
    </>
  );
};

export default MyMembers;
