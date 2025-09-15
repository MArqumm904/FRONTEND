import { useState } from "react";
import { X } from "lucide-react";

export default function RequestMembershipForm({ onClose }) {
  const [formData, setFormData] = useState({
    companyName: "StarTech Pvt Ltd",
    jobTitle: "UI/UX Designer",
    location: "Karachi, Pakistan",
    startDate: "June 2021",
    endDate: "January 2023",
    currentlyWorking: false,
    responsibilities:
      "Responsible for designing user flows, wireframes, and interactive prototypes.",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    onClose();
  };

  const handleRemoveRequest = () => {
    console.log("Remove request clicked");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[100vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-sf font-semibold text-gray-900">
            Request Membership
          </h2>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-600 transition-colors"
          >
            <X size={25} />
          </button>
        </div>

        {/* Form */}
        <div className="p-4 space-y-4">
          {/* Company/Organization Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-sf">
              Company / Organization Name
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className="w-full px-3 font-sf py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Company / Organization Name"
            />
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-sf">
              Job Title
            </label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              className="w-full px-3 font-sf py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Job Title"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-sf">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 font-sf py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Location"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-sf">
              Start Date
            </label>
            <input
              type="text"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full px-3 font-sf py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Start Date"
            />
          </div>

          {/* End Date */}
          {/* End Date - Only show if NOT currently working */}
          {!formData.currentlyWorking && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-sf">
                End Date
              </label>
              <input
                type="text"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-3 font-sf py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="End Date"
              />
            </div>
          )}

          {/* Currently Working Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="currentlyWorking"
              id="currentlyWorking"
              checked={formData.currentlyWorking}
              onChange={handleInputChange}
              className="w-7 h-7 font-sf bg-gray-100 border-gray-300 rounded "
              style={{ accentColor: "#8bc53d" }}
            />
            <label
              htmlFor="currentlyWorking"
              className="text-sm font-medium text-gray-700 select-none font-sf"
            >
              Currently Working
            </label>
          </div>

          {/* Responsibilities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-sf">
              Responsibilities
            </label>
            <textarea
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border font-sf border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Responsibilities"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 bg-[#0017e7] font-sf text-white py-2 px-4 rounded-md hover:bg-[#0014cc] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors "
            >
              Send Request
            </button>
            <button
              type="button"
              onClick={handleRemoveRequest}
              className="flex-1 border border-gray-700 font-sf bg-gray-100 text-black py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Remove Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
