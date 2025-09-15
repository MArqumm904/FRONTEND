import React, { useState, useRef } from "react";
import {
  X,
  Camera,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Trash2,
  Crop,
} from "lucide-react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditProfile = ({
  onClose,
  currentProfilePhoto,
  onProfileUpdate,
  groupId,
}) => {
  const [selectedImage, setSelectedImage] = useState(
    currentProfilePhoto || null
  );
  const [originalFile, setOriginalFile] = useState(null);
  const [currentStep, setCurrentStep] = useState(currentProfilePhoto ? 2 : 1);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Store the original file
      setOriginalFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setCurrentStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleCropImage = () => {
    setCurrentStep(3);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleDeleteImage = async () => {
    if (currentProfilePhoto) {
      setIsLoading(true);
      const UserId = localStorage.getItem("user_id"); 
      const token = localStorage.getItem("token");

      if (!UserId || !token) {
        console.error("Group or user not authenticated");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.delete(
          `${API_BASE_URL}/groups/${groupId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            data: {
              group_profile_photo: "delete",
            },
          }
        );

        if (
          response.data &&
          response.data.deleted_fields?.includes("group_profile_photo")
        ) {
          if (onProfileUpdate) {
            onProfileUpdate(null); 
          }
        }
      } catch (error) {
        console.error("Error removing group profile photo:", error);
        alert("Failed to remove group profile photo. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    setSelectedImage(null);
    setOriginalFile(null);
    setCurrentStep(1);
    setZoom(1);
    setRotation(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    console.log("Received groupId on edit profile photo group:", groupId);
    if (!selectedImage) {
      onClose();
      return;
    }

    setIsLoading(true);
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      setIsLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      let fileToSend;

      if (originalFile) {
        fileToSend = originalFile;
      } else if (selectedImage instanceof File) {
        fileToSend = selectedImage;
      } else {
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        fileToSend = new File([blob], "profile_photo.jpg", { type: blob.type });
      }

      if (fileToSend && fileToSend.size > 0) {
        // ✅ Fixed: Use correct field name that matches backend expectation
        formDataToSend.append("group_profile_photo", fileToSend);

        const response = await axios.post(
          `${API_BASE_URL}/groups/${groupId}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data && onProfileUpdate) {
          onProfileUpdate(selectedImage);
        }

        onClose();
      } else {
        throw new Error("Invalid image data");
      }
    } catch (error) {
      alert("Failed to update group photo. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDone = async () => {
    await handleSave();
  };

  const closeModal = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 w-1/3 max-w-[90vw] max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center ">
          <h2 className="text-xl font-semibold font-sf">
            {currentStep === 1
              ? "Profile Picture"
              : currentStep === 2
              ? "Profile Picture"
              : "Crop Image"}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-700 hover:text-gray-900 "
          >
            <X size={25} />
          </button>
        </div>
        <div className="border-t border-gray-200 my-5"></div>

        {/* Step 1: Upload */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-8">
              <div className="border-2 border-gray-300 rounded-full w-56 h-56 flex items-center justify-center bg-gray-50">
                <button
                  onClick={handleUploadClick}
                  className="flex flex-col items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Camera size={25} />
                  <span>Upload Photo</span>
                </button>
              </div>
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleSave}
                disabled={!selectedImage || isLoading}
                className="bg-[#0017e7] text-white px-6 py-1 rounded-md hover:bg-[#000f96] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCropImage}
                disabled={!selectedImage}
                className="border-black flex bg-gray-200 text-black px-6 py-1 rounded-md hover:bg-gray-300 transition-colors border disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Crop size={22} className="mr-2" />
                Crop Image
              </button>
              <button
                onClick={onClose}
                className="border border-gray-400 text-gray-700 px-6 py-1 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
          </div>
        )}

        {/* Step 2: Preview */}
        {currentStep === 2 && selectedImage && (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="relative rounded-full overflow-hidden w-56 h-56 flex items-center justify-center">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="text-center">
                    <button
                      onClick={handleUploadClick}
                      className="flex flex-col items-center gap-2 text-white font-bold hover:text-gray-50 transition-colors"
                    >
                      <Camera size={25} />
                      <span>Upload Photo</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center justify-center bg-[#0017e7] text-white px-5 py-1 rounded-lg hover:bg-[#000f96] transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>

                <button
                  onClick={handleCropImage}
                  className="flex items-center justify-center border border-gray-400 text-black px-4 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Crop className="mr-2" size={20} /> Crop Image
                </button>

                <button
                  onClick={handleDeleteImage}
                  disabled={isLoading}
                  className="flex items-center justify-center border border-gray-400 text-black px-4 py-1 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={16} className="mr-2" />
                  {isLoading ? "Removing..." : "Clear Image"}
                </button>

                <button
                  onClick={onClose}
                  className="flex items-center justify-center border border-gray-400 text-gray-700 px-4 py-1 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Crop */}
        {currentStep === 3 && selectedImage && (
          <div className="space-y-4">
            {/* Circular Crop Preview */}
            <div className=" rounded-lg p-2  flex items-center justify-center overflow-hidden">
              <div className="relative">
                {/* Circular mask container */}
                <div
                  className="w-64 h-64 rounded-full overflow-hidden shadow-lg border"
                  style={{
                    background: "white",
                  }}
                >
                  <img
                    src={selectedImage}
                    alt="Crop preview"
                    className="w-full h-full object-cover transition-transform duration-200"
                    style={{
                      transform: `scale(${zoom}) rotate(${rotation}deg)`,
                      transformOrigin: "center center",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Crop Controls */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zoom
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleZoomOut}
                    className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    <ZoomOut size={16} />
                  </button>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1"
                    style={{
                      accentColor: "#0017e7",
                    }}
                  />
                  <button
                    onClick={handleZoomIn}
                    className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    <ZoomIn size={16} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Straighten
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRotate}
                    className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    <RotateCcw size={16} />
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="1"
                    value={rotation}
                    onChange={(e) => setRotation(parseInt(e.target.value))}
                    className="flex-1"
                    style={{
                      accentColor: "#0017e7",
                    }}
                  />
                  <span className="text-sm text-gray-600 min-w-[40px]">
                    {rotation}°
                  </span>
                </div>
              </div>
            </div>

            {/* Done Button */}
            <div className="flex gap-2">
              <button
                onClick={handleDone}
                disabled={isLoading}
                className="flex-1 bg-[#0017e7] text-white py-3 px-6 rounded-lg hover:bg-[#0015d3] transition-colors disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Done"}
              </button>
              <button
                onClick={handleDeleteImage}
                disabled={isLoading}
                className="flex bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <Trash2 size={20} className="mr-2" />
                {isLoading ? "Removing..." : "Delete"}
              </button>
              <button
                onClick={onClose}
                className="flex border border-gray-400 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
