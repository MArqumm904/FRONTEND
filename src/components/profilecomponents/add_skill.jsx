import { useState, useEffect } from "react";

const AddSkillForm = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  isEditMode = false,
}) => {
  const [formData, setFormData] = useState({
    skill: "",
    proficiency: "",
    description: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Ensure all values are strings to prevent validation issues
        setFormData({
          skill: initialData.skill || "",
          proficiency: initialData.proficiency || "",
          description: initialData.description || "",
        });
      } else {
        setFormData({
          skill: "",
          proficiency: "",
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
    const emptyFields = Object.entries(formData).filter(
      ([key, value]) => !value || (typeof value === 'string' && value.trim() === "")
    );
    
    if (emptyFields.length > 0) {
      const fieldNames = emptyFields.map(([key]) => key).join(", ");
      setError(`Please fill all fields: ${fieldNames}`);
      return;
    }
    setError("");
    onSave(formData);
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-[450px] shadow-xl relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 font-sf">
            {isEditMode ? "Edit Skill" : "Add Skill"}
          </h2>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-800 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-4 pt-3">
            <div className="bg-red-100 text-red-700 rounded px-3 py-2 text-sm font-sf">
              {error}
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="p-4 space-y-4 mt-1">
          {/* Skill Name */}
          <div>
            <label className="block text-sm text-[#707070] font-medium mb-1 font-sf">
              Skill
            </label>
            <input
              type="text"
              value={formData.skill}
              onChange={(e) => handleInputChange("skill", e.target.value)}
              placeholder="e.g. UX Design"
              className="w-full font-sf border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* Skill Proficiency */}
          <div>
            <label className="block text-sm font-medium text-[#707070] mb-1 font-sf ">
              Skill Proficiency
            </label>
            <div className="relative">
              <select
                value={formData.proficiency}
                onChange={(e) => handleInputChange("proficiency", e.target.value)}
                className="w-full font-sf  border border-gray-300 rounded-md px-3 py-2 text-sm cursor-pointer appearance-none pr-8"
              >
                <option value="">Select proficiency</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
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

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#707070] mb-1 font-sf">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your skill..."
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-sf resize-none"
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center p-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            className="bg-[#0017e7] font-sf hover:bg-[#0013c4] text-white px-6 py-2 rounded-md text-sm transition-colors"
          >
            {isEditMode ? "Update Skill" : "Save Skill"}
          </button>
          <button
            onClick={handleCancel}
            className="ms-2 border font-sf border-[#000] text-black px-6 py-2 rounded-md text-sm transition-colors"
          >
            {isEditMode ? "Cancel Edit" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSkillForm;