import { useState, useEffect } from "react";
import { Upload, X, CheckCircle } from "lucide-react";
import axios from "axios";

export default function ApproveRequest({ request, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    Name: "",
    jobTitle: "",
    location: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    responsibilities: "",
  });
  const [letterPreview, setLetterPreview] = useState(null);
  const [showLetter, setShowLetter] = useState(false);
  const [uploadedLetter, setUploadedLetter] = useState(null);
  const [documentPreview, setDocumentPreview] = useState(false);
  const [showDocument, setShowDocument] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState({});

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  // Populate form data when request prop changes
  useEffect(() => {
    if (request) {
      setFormData({
        Name: request.user?.name || "",
        jobTitle: request.job_title || "",
        location: request.location || "",
        startDate: formatDate(request.start_date),
        endDate: formatDate(request.end_date),
        currentlyWorking: request.currently_working || false,
        responsibilities: request.responsibilities || "",
      });
    }
  }, [request]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLetterUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedLetter(file);
      setFormData((prev) => ({
        ...prev,
        confirmation_letter: file,
      }));

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setLetterPreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setLetterPreview(null);
      }

      // Clear error when file is selected
      if (errors.confirmation_letter) {
        setErrors((prev) => ({ ...prev, confirmation_letter: null }));
      }
    }
  };

  const handleDocumentUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedDocument(file);
      setFormData((prev) => ({
        ...prev,
        proof_document: file,
      }));

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setDocumentPreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setDocumentPreview(null);
      }

      // Clear error when file is selected
      if (errors.proof_document) {
        setErrors((prev) => ({ ...prev, proof_document: null }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!uploadedLetter) {
      newErrors.confirmation_letter = "Confirmation letter is required";
    }

    if (!uploadedDocument) {
      newErrors.proof_document = "Proof document is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Get token from localStorage or your auth system
      const token = localStorage.getItem("token"); // Adjust according to your auth implementation

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("membership_id", request.id);
      formDataToSend.append("confirmation_letter", uploadedLetter);
      formDataToSend.append("proof_document", uploadedDocument);

      // Make API call using axios
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/storecompaniesresponses`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Adjust according to your auth implementation
            Accept: "application/json",
            "Content-Type": "multipart/form-data", // axios automatically sets this for FormData
          },
        }
      );

      if (response.data.success) {
        setShowSuccessModal(true);
        if (onSuccess) {
          onSuccess(); // This will refresh the membership requests
        }
      } else {
        // Handle API errors
        if (response.data.errors) {
          setErrors(response.data.errors);
        } else {
          alert(response.data.message || "An error occurred while submitting");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      // Handle axios error response
      if (error.response) {
        const { data } = error.response;
        if (data.errors) {
          setErrors(data.errors);
        } else {
          alert(data.message || "An error occurred while submitting");
        }
      } else {
        alert("Network error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveRequest = () => {
    console.log("Remove request clicked");
    onClose();
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onClose();
    if (onSuccess) {
      onSuccess(); 
    }
  };

  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[70] backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3 font-sf">
            Request Approved!
          </h3>
          <p className="text-gray-600 mb-6 font-sf">
            You have successfully approved it. Now when the admin approves it,
            that member will become your member.
          </p>
          <button
            onClick={handleSuccessClose}
            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors font-sf"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[95vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-sf font-semibold text-gray-900">
              Approve Request
            </h2>
            <button
              onClick={onClose}
              className="text-black hover:text-gray-600 transition-colors"
              disabled={isLoading}
            >
              <X size={25} />
            </button>
          </div>

          {/* Form */}
          <div className="p-4 space-y-4">
            {/* Company/Organization Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-sf">
                Name
              </label>
              <input
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleInputChange}
                disabled={true}
                className="w-full px-3 font-sf py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                placeholder="Name"
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
                disabled={true}
                onChange={handleInputChange}
                className="w-full px-3 font-sf py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
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
                disabled={true}
                className="w-full px-3 font-sf py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
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
                disabled={true}
                className="w-full px-3 font-sf py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                placeholder="Start Date"
              />
            </div>

            {/* End Date - Only show if NOT currently working */}
            {!formData.currentlyWorking && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-sf">
                  End Date
                </label>
                <input
                  type="text"
                  name="endDate"
                  disabled={true}
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 font-sf py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
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
                disabled={true}
                className="w-7 h-7 font-sf bg-gray-100 border-gray-300 rounded"
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
                disabled={true}
                className="w-full px-3 py-2 border font-sf border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50"
                placeholder="Responsibilities"
              />
            </div>

            {/* Upload Confirmation Letter */}
            <div>
              <label className="block text-sm font-medium text-[#707070] mb-2 font-sf">
                Attach Confirmation Letter{" "}
                <span className="text-red-500">*</span>
              </label>
              <div
                className={`border-2 border-dashed ${
                  errors.confirmation_letter
                    ? "border-red-300"
                    : "border-gray-300"
                } rounded-md p-6 text-center relative overflow-hidden`}
                style={{
                  backgroundImage: letterPreview
                    ? `url(${letterPreview})`
                    : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "top",
                }}
              >
                {/* Dark overlay when image is present */}
                {letterPreview && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-md"></div>
                )}

                <input
                  type="file"
                  id="letter-upload"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleLetterUpload}
                  className="hidden"
                />

                {!letterPreview ? (
                  <label
                    htmlFor="letter-upload"
                    className="cursor-pointer flex justify-center items-center relative z-10"
                  >
                    <div className="w-10 h-10 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-gray-900" />
                    </div>
                    <span className="text-sm text-gray-900 font-medium hover:text-[#0016c4] font-sf">
                      Upload Letter
                    </span>
                  </label>
                ) : (
                  <div className="relative z-10">
                    <button
                      onClick={() => setShowLetter(true)}
                      className="text-lg tracking-widest text-white font-medium hover:opacity-80 font-sf px-4 py-2 rounded-md"
                    >
                      View Letter
                    </button>
                  </div>
                )}
              </div>
              {errors.confirmation_letter && (
                <p className="mt-1 text-sm text-red-600 font-sf">
                  {errors.confirmation_letter}
                </p>
              )}

              {/* Image Preview Modal */}
              {showLetter && letterPreview && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]"
                  onClick={() => setShowLetter(false)}
                >
                  <div
                    className="relative max-w-4xl max-h-[90vh] p-4"
                    onClick={handleModalClick}
                  >
                    <button
                      onClick={() => setShowLetter(false)}
                      className="absolute -top-2 -right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 z-10"
                    >
                      ✕
                    </button>
                    <img
                      src={letterPreview}
                      alt="Letter Preview"
                      className="max-w-96 max-h-96 object-contain rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Upload Proof Document */}
            <div>
              <label className="block text-sm font-medium text-[#707070] mb-2 font-sf">
                Attach Proof Document <span className="text-red-500">*</span>
              </label>
              <div
                className={`border-2 border-dashed ${
                  errors.proof_document ? "border-red-300" : "border-gray-300"
                } rounded-md p-6 text-center relative overflow-hidden`}
                style={{
                  backgroundImage: documentPreview
                    ? `url(${documentPreview})`
                    : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "top",
                }}
              >
                {/* Dark overlay when image is present */}
                {documentPreview && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-md"></div>
                )}

                <input
                  type="file"
                  id="document-upload"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleDocumentUpload}
                  className="hidden"
                />

                {!documentPreview ? (
                  <label
                    htmlFor="document-upload"
                    className="cursor-pointer flex justify-center items-center relative z-10"
                  >
                    <div className="w-10 h-10 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-gray-900" />
                    </div>
                    <span className="text-sm text-gray-900 font-medium hover:text-[#0016c4] font-sf">
                      Upload Document
                    </span>
                  </label>
                ) : (
                  <div className="relative z-10">
                    <button
                      onClick={() => setShowDocument(true)}
                      className="text-lg tracking-widest text-white font-medium hover:opacity-80 font-sf px-4 py-2 rounded-md"
                    >
                      View Document
                    </button>
                  </div>
                )}
              </div>
              {errors.proof_document && (
                <p className="mt-1 text-sm text-red-600 font-sf">
                  {errors.proof_document}
                </p>
              )}

              {/* Image Preview Modal */}
              {showDocument && documentPreview && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]"
                  onClick={() => setShowDocument(false)}
                >
                  <div
                    className="relative max-w-4xl max-h-[90vh] p-4"
                    onClick={handleModalClick}
                  >
                    <button
                      onClick={() => setShowDocument(false)}
                      className="absolute -top-2 -right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 z-10"
                    >
                      ✕
                    </button>
                    <img
                      src={documentPreview}
                      alt="Document Preview"
                      className="max-w-96 max-h-96 object-contain rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full py-2 px-4 rounded-md font-sf transition-colors ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#0017e7] hover:bg-[#0014cc] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                } text-white`}
              >
                {isLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && <SuccessModal />}
    </>
  );
}
