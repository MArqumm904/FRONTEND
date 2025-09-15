import { useState, useEffect } from "react";
import { X, UserRoundCog, MapPin } from "lucide-react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export default function EditIntro({ onClose, initialData, userId }) {
  const [formData, setFormData] = useState({
    name: "",
    headline: "",
    location: "",
  });

  const [isEdited, setIsEdited] = useState(false);

  // Prefill from props
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsEdited(true);
  };

  const handleSaveOrUpdate = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/profile/${userId}`, formData);
      console.log("Updated successfully:", response.data);
      onClose();
    } catch (error) {
      console.error("Error updating intro:", error);
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-sf">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-sf focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>

          {/* Working As */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-sf">
              Working As
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.headline}
                onChange={(e) => handleInputChange("headline", e.target.value)}
                className="w-full px-3 font-sf py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your job title"
              />
              <UserRoundCog
                className="absolute right-3 top-2.5 text-[#626262]"
                size={22}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-sf">
              Location
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
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