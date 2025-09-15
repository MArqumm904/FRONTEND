import { useState, useEffect } from "react";
import { School, GraduationCap, NotebookTabs } from "lucide-react";

const AddEducationForm = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  isEditMode = false,
}) => {
  const [formData, setFormData] = useState({
    schooluniname: "",
    qualification: "",
    field_of_study: "",
    location: "",
    start_year: "",
    end_year: "",
    description: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          schooluniname: "",
          qualification: "",
          field_of_study: "",
          location: "",
          start_year: "",
          end_year: "",
          description: "",
        });
      }
      setError(""); // Reset error on open
    }
  }, [isOpen, initialData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(""); // Clear error on input change
  };

  const handleSave = () => {
    // Check for empty fields
    const emptyField = Object.entries(formData).find(
      ([key, value]) => value.trim() === ""
    );
    if (emptyField) {
      setError("Please fill all fields.");
      return;
    }
    setError("");
    onSave(formData);
  };

  const handleRemove = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-[500px] shadow-xl relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 font-sf">
            {isEditMode ? "Edit Education" : "Add Education"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-4 pt-3 pb-1">
            <div className="bg-red-100 text-red-700 rounded px-3 py-2 text-sm font-sf">
              {error}
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="p-4 space-y-4">
          {/* School/University Name */}
          <div>
            <label className="block text-sm font-medium text-[#707070] mb-1 font-sf">
              School / University Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.schooluniname}
                onChange={(e) =>
                  handleInputChange("schooluniname", e.target.value)
                }
                placeholder="School / University Name"
                className="w-full font-sf border border-gray-300 rounded-md px-3 py-2 text-sm pr-8"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <School className="text-[#4c4c4c] opacity-90" size={18} />
              </div>
            </div>
          </div>

          {/* Qualification */}
          <div>
            <label className="block text-sm font-medium text-[#707070] mb-1 font-sf">
              Qualification
            </label>
            <div className="relative">
              <select
                value={formData.qualification}
                onChange={(e) =>
                  handleInputChange("qualification", e.target.value)
                }
                className="w-full font-sf border border-gray-300 rounded-md px-3 py-2 text-sm cursor-pointer appearance-none pr-8"
              >
                <option value="">Select qualification</option>
                <option value="Bachelor's">Bachelor's</option>
                <option value="Master's">Master's</option>
                <option value="PhD">PhD</option>
                <option value="Diploma">Diploma</option>
                <option value="Certificate">Certificate</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-40">
                <GraduationCap
                  className="text-[#4c4c4c] fill-current opacity-90"
                  size={20}
                />
              </div>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Field of Study */}
          <div>
            <label className="block text-sm font-medium text-[#707070] mb-1 font-sf">
              Field of Study
            </label>
            <input
              type="text"
              value={formData.field_of_study}
              onChange={(e) =>
                handleInputChange("field_of_study", e.target.value)
              }
              placeholder="Computer Science"
              className="w-full border font-sf border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            <div className="absolute right-7 top-[17rem] transform -translate-y-1/2">
              <NotebookTabs className="text-[#4c4c4c] opacity-90" size={18} />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-[#707070] mb-1 font-sf">
              Location
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Karachi, Pakistan"
                className="w-full border font-sf border-gray-300 rounded-md px-3 py-2 text-sm  pr-8"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Start Year and End Year */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#707070] mb-1 font-sf">
                Start Year
              </label>
              <select
                value={formData.start_year}
                onChange={(e) => handleInputChange("start_year", e.target.value)}
                className="w-full font-sf border border-gray-300 rounded-md px-3 py-2 text-sm cursor-pointer appearance-none pr-8"
              >
                <option value="">Select year</option>
                {Array.from({ length: 50 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#707070] mb-1 font-sf">
                End Year
              </label>
              <select
                value={formData.end_year}
                onChange={(e) => handleInputChange("end_year", e.target.value)}
                className="w-full font-sf border border-gray-300 rounded-md px-3 py-2 text-sm cursor-pointer appearance-none pr-8"
              >
                <option value="">Select year</option>
                {Array.from({ length: 50 }, (_, i) => {
                  const year = new Date().getFullYear() - i + 10; // Allow future years for graduation
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#707070] mb-1 font-sf">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Focused on software engineering, AI, and full-stack web development."
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-sf resize-none"
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center p-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            className="bg-[#0017e2] hover:bg-[#0016c4] text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {isEditMode ? "Update Education" : "Save Education"}
          </button>
          <button
            onClick={handleRemove}
            className=" ms-2 border border-[#000] text-black px-6 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {isEditMode ? "Cancel Edit" : "Remove Education"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEducationForm;
