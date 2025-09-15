import { X, ChevronLeft, ImagePlus, Check, CameraIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { db } from "../../firebase";
import { ref as dbRef, set } from "firebase/database";

const EditGroupDetail = ({ group, isOpen, onClose, onUpdate }) => {
  const [groupName, setGroupName] = useState(group?.name || "");
  const [groupPhoto, setGroupPhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(group?.avatar || null);
  const [isLoading, setIsLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const STORAGE_BASE_URL =
    (API_BASE_URL?.replace(/\/?api\/?$/, "") || API_BASE_URL) + "/storage";
  const fileInputRef = useRef(null);

  const toAvatarUrl = (path) => {
    if (!path) return null;
    if (
      typeof path === "string" &&
      (path.startsWith("http://") || path.startsWith("https://"))
    )
      return path;
    return `${STORAGE_BASE_URL}/${path}`;
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGroupPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const updateGroupDetails = async () => {
    if (!groupName.trim()) {
      alert("Please enter a group name");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", groupName);
      if (groupPhoto) {
        formData.append("photo", groupPhoto);
      }

      const response = await axios.post(
        `${API_BASE_URL}/group-chats/${group.id}/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.success) {
        const updatedGroup = response.data.group;

        // Update Firebase data
        await set(dbRef(db, `groups/${group.id}/info`), {
          groupName: updatedGroup.name,
          photo: updatedGroup.photo ? toAvatarUrl(updatedGroup.photo) : null,
        });

        // Call the callback with the updated group data
        onUpdate?.({
          ...group,
          name: updatedGroup.name,
          avatar: updatedGroup.photo
            ? toAvatarUrl(updatedGroup.photo)
            : group.avatar,
          created_by: updatedGroup.created_by,
          members: updatedGroup.members
        });

        onClose();
      }
    } catch (error) {
      console.error("Error updating group details:", error);
      alert("Failed to update group details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl h-[30rem] mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-5 rounded-lg border border-gray-400">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-gray-900">
              Edit Group Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-7 h-7 text-gray-700" />
          </button>
        </div>

        <div className="p-6 h-[calc(100%-80px)] overflow-y-auto relative">
          {/* Content */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative">
              <div
                onClick={triggerFileInput}
                className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden"
              >
                {previewPhoto ? (
                  <div className="relative">
                    <img
                      src={previewPhoto}
                      alt="Group preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute flex items-center justify-center bg-black/50 gap-x-2 text-white top-0 left-0 w-full h-full">
                      <CameraIcon />
                      <h1>Upload Photo2</h1>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-x-2 text-[#707070]">
                    <CameraIcon />
                    <h1>Upload Photo1</h1>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Name:
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="w-full h-14 p-3 border border-gray-500 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className=" flex justify-center">
            <button
              onClick={updateGroupDetails}
              disabled={!groupName}
              className={`px-6 py-3 w-full rounded-lg transition-colors ${
                !groupName
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#0017E7] text-white hover:bg-blue-700"
              }`}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditGroupDetail;
