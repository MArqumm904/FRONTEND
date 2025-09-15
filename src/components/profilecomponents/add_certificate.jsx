import { useState, useEffect } from "react";
import { Building2, Upload, FileText } from "lucide-react";

const AddCertificate = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  isEditMode = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    start_year: "",
    end_year: "",
    description: "",
    certificate_photo: null,
  });

  const [uploadedFile, setUploadedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
        setUploadedFile(initialData.certificate_photo);
        // If initial data has an image, set preview
        if (
          initialData.certificate_photo &&
          typeof initialData.certificate_photo === "object"
        ) {
          const reader = new FileReader();
          reader.onload = (e) => setImagePreview(e.target.result);
          reader.readAsDataURL(initialData.certificate_photo);
        } else if (
          initialData.certificate_photo &&
          typeof initialData.certificate_photo === "string"
        ) {
          // If it's a URL from API
          setImagePreview(initialData.certificate_photo);
        }
      } else {
        setFormData({
          title: "",
          organization: "",
          start_year: "",
          end_year: "",
          description: "",
          certificate_photo: null,
        });
        setUploadedFile(null);
        setImagePreview(null);
        setShowPreview(false);
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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setFormData((prev) => ({
        ...prev,
        certificate_photo: file,
      }));

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    }
    setError(""); // Clear error on file upload
  };

  const handleSave = () => {
    // Check for empty fields
    const requiredFields = [
      "title",
      "organization",
      "start_year",
      "end_year",
      "description",
    ];
    const emptyField = requiredFields.find(
      (field) =>
        formData[field] === "" ||
        formData[field] === null ||
        (typeof formData[field] === "string" && formData[field].trim() === "")
    );
    if (emptyField || !uploadedFile) {
      setError("Please fill all fields including certificate photo.");
      return;
    }

    setError("");
    const dataToSave = {
      ...formData,
      certificate_photo: uploadedFile,
      start_year: parseInt(formData.start_year),
      end_year: parseInt(formData.end_year),
    };
    console.log("Saved Data:", dataToSave);
    onSave(dataToSave);
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-[500px] shadow-xl relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 font-sf">
            {isEditMode ? "Edit Certification" : "Add Certification"}
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
          <div className="px-4 pt-3">
            <div className="bg-red-100 text-red-700 rounded px-3 py-2 text-sm font-sf">
              {error}
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[#707070] mb-1 font-sf">
              Title
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Certified UX Designer"
                className="w-full font-sf border border-gray-300 rounded-md px-3 py-2 text-sm pr-8"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <FileText className="text-[#4c4c4c] opacity-90" size={18} />
              </div>
            </div>
          </div>

          {/* Conferring Organization */}
          <div>
            <label className="block text-sm font-medium text-[#707070] mb-1 font-sf">
              Conferring Organization
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.organization}
                onChange={(e) =>
                  handleInputChange("organization", e.target.value)
                }
                placeholder="Google UX Design Certificate"
                className="w-full font-sf border border-gray-300 rounded-md px-3 py-2 text-sm pr-8"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Building2 className="text-[#4c4c4c] opacity-90" size={18} />
              </div>
            </div>
          </div>

          {/* Start Date and End Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#707070] mb-1 font-sf">
                Start Year
              </label>
              <select
                value={formData.start_year || ""}
                onChange={(e) =>
                  handleInputChange(
                    "start_year",
                    e.target.value === "" ? "" : parseInt(e.target.value)
                  )
                }
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
                value={formData.end_year || ""}
                onChange={(e) =>
                  handleInputChange(
                    "end_year",
                    e.target.value === "" ? "" : parseInt(e.target.value)
                  )
                }
                className="w-full font-sf border border-gray-300 rounded-md px-3 py-2 text-sm cursor-pointer appearance-none pr-8"
              >
                <option value="">Select year</option>
                {Array.from({ length: 50 }, (_, i) => {
                  const year = new Date().getFullYear() - i + 1;
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
              placeholder="Practical training in user-centered design, wireframing, and prototyping."
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-sf resize-none"
            />
          </div>

          {/* Upload Certificate */}
          <div>
            <label className="block text-sm font-medium text-[#707070] mb-2 font-sf">
              Upload Certificate
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center relative overflow-hidden"
              style={{
                backgroundImage: imagePreview
                  ? `url(${imagePreview})`
                  : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "top",
              }}
            >
              {/* Dark overlay when image is present */}
              {imagePreview && (
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-md"></div>
              )}

              <input
                type="file"
                id="certificate-upload"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />

              {!imagePreview ? (
                <label
                  htmlFor="certificate-upload"
                  className="cursor-pointer flex flex-col items-center relative z-10"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                    <Upload className="w-5 h-5 text-gray-500" />
                  </div>
                  <span className="text-sm text-[#0017e2] font-medium hover:text-[#0016c4] font-sf">
                    Upload Photo
                  </span>
                </label>
              ) : (
                <div className="relative z-10">
                  <button
                    onClick={() => setShowPreview(true)}
                    className="text-lg tracking-widest text-white font-medium hover:opacity-80 font-sf px-4 py-2 rounded-md"
                  >
                    View Certificate
                  </button>
                  <label
                    htmlFor="certificate-upload"
                    className="block mt-2 text-xs text-white hover:opacity-80 cursor-pointer font-sf"
                  >
                    Change Photo
                  </label>
                </div>
              )}
            </div>

            {/* Image Preview Modal */}
            {showPreview && imagePreview && (
              <div
                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]"
                onClick={() => setShowPreview(false)}
              >
                <div className="relative max-w-4xl max-h-[90vh] p-4">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="absolute -top-2 -right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 z-10"
                  >
                    ✕
                  </button>
                  <img
                    src={imagePreview}
                    alt="Certificate Preview"
                    className="max-w-96 max-h-96 object-contain rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center gap-2 p-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            className="bg-[#0017e2] hover:bg-[#0016c40016c4] text-white px-6 py-2 rounded-md text-sm font-medium transition-colors font-sf"
          >
            {isEditMode ? "Update Certification" : "Save Certification"}
          </button>
          <button
            onClick={handleCancel}
            className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-md text-sm font-medium transition-colors font-sf"
          >
            {isEditMode ? "Cancel Edit" : "Remove Certification"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCertificate;