import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CreateGroupModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    groupName: "",
    description: "",
    industry: "",
    groupType: "",
  });

  const [bannerImage, setBannerImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [showGlobalError, setShowGlobalError] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setShowGlobalError(false);
    setApiError(""); 
  };

  const handleBannerImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBannerImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.groupName.trim() ||
      !formData.description.trim() ||
      !formData.industry.trim() ||
      !formData.groupType.trim()
    ) {
      setShowGlobalError(true);
      setApiError(""); 
      return;
    }

    setShowGlobalError(false);
    setApiError(""); 
    setIsLoading(true);

    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
    if (!userId || !token) {
      setApiError("User not authenticated");
      return;
    }

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("group_name", formData.groupName);
      formDataToSend.append("group_description", formData.description);
      formDataToSend.append("group_type", formData.groupType || "public");
      formDataToSend.append("group_industry", formData.industry);
      formDataToSend.append("user_id", userId);

      if (bannerImage && bannerImage.startsWith("data:")) {
        const response = await fetch(bannerImage);
        const blob = await response.blob();
        formDataToSend.append("group_banner_image", blob, "banner.jpg");
      }

      if (profileImage && profileImage.startsWith("data:")) {
        const response = await fetch(profileImage);
        const blob = await response.blob();
        formDataToSend.append("group_profile_photo", blob, "profile.jpg");
      }

      const response = await axios.post(
        `${API_BASE_URL}/groups`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 🔄 Navigate with state
      navigate("/group_main_home", { state: { groupId: response.data.id } });
      onClose();
    } catch (error) {
      let apiMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "An error occurred while creating the group.";
      setApiError(apiMsg);
      console.error("Error creating group:", apiMsg);
    } finally {
      setIsLoading(false); // Stop loading regardless of success or error
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-medium text-gray-800">Create Group</h2>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-800 text-xl font-bold"
          >
            ✕
          </button>
        </div>
        {(showGlobalError || apiError) && (
          <div className=" px-6 pt-2 -mb-3">
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
              {showGlobalError ? "Please fill all fields." : apiError}
            </div>
          </div>
        )}
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Global Error */}

          {/* Photo Upload Section */}
          <div className="relative mb-5">
            {/* Main Banner Upload */}
            <div className="relative w-full h-32 border-2 border-[#707070]  rounded-lg cursor-pointer hover:border-gray-400 transition-colors overflow-hidden">
              {bannerImage ? (
                <img
                  src={bannerImage}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <svg
                    className="w-8 h-8 text-[#707070] mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-sm text-[#707070]">Upload Photo</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            {/* Profile Picture Upload - overlapping */}
            <div className="absolute -bottom-8 left-5 w-24 h-24 border-2 border-[#707070]  rounded-full cursor-pointer hover:border-gray-400 transition-colors bg-white overflow-hidden">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <svg
                    className="w-4 h-4 text-[#707070]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-xs text-[#707070]">Upload Photo</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 mt-10">
            {/* Group Name */}
            <div>
              <label className="block text-sm font-medium text-[#707070] mb-2">
                Group Name
              </label>
              <input
                type="text"
                name="groupName"
                value={formData.groupName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md "
                placeholder="Enter group name"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#707070] mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md  resize-none"
                placeholder="Enter group description"
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-[#707070] mb-2">
                Industry
              </label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md "
                placeholder="Enter industry"
              />
            </div>

            {/* Group Type */}
            <div>
              <label className="block text-sm font-medium text-[#707070] mb-2">
                Group Type
              </label>
              <select
                name="groupType"
                value={formData.groupType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md "
              >
                <option value="">Select group type</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="secret">Secret</option>
              </select>
            </div>
          </div>

          {/* Create Button */}
          <div className="mt-4 flex">
            <button
              type="submit"
              disabled={isLoading}
              className={`py-2 px-8 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors text-sm flex items-center justify-center ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#0017e7] text-white hover:bg-[#0014c9] focus:ring-[#0017e7]"
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;