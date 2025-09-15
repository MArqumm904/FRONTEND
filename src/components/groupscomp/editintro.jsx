import { useState, useEffect } from "react";
import { X, UsersRound, MapPin } from "lucide-react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EditIntro({ onClose, initialData, groupId }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setLocation(initialData.location || "");
    }
  }, [initialData]);

  const handleSaveOrUpdate = async () => {
    try {
      const payload = {
        group_name: name,
        location: location,
      };

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}/groups/${groupId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Updated successfully:", response.data);
      onClose();
    } catch (error) {
      console.error("Error updating group:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-5 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-sf font-semibold text-gray-900">
            Edit Intro
          </h2>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-800 transition-colors"
          >
            <X size={25} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 font-sf">
              Group Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setIsEdited(true);
                }}
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md font-sf"
                placeholder="Enter your name"
              />
              <UsersRound
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#626262]"
                size={22}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-sf">
              Group Location
            </label>
            <div className="relative">
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setIsEdited(true);
                }}
                className="w-full px-3 font-sf py-2 pr-10 border border-gray-300 rounded-md"
                placeholder="Enter your location"
              />
              <MapPin
                className="absolute right-3 top-2.5 text-[#626262]"
                size={22}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-gray-200">
          <button
            onClick={handleSaveOrUpdate}
            className="w-32 bg-[#0017e7] text-white py-2 px-4 rounded-md hover:bg-[#0013c4] transition-colors font-medium"
          >
            {isEdited ? "Update Intro" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
