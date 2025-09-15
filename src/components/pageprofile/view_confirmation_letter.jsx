import { useState } from "react";
import { Upload, X } from "lucide-react";

export default function ViewConfirmationLetter({ onClose }) {
  const [formData, setFormData] = useState({
    Name: "StarTech Pvt Ltd",
    jobTitle: "UI/UX Designer",
    location: "Karachi, Pakistan",
    startDate: "June 2021",
    endDate: "January 2023",
    currentlyWorking: true,
    responsibilities:
      "Responsible for designing user flows, wireframes, and interactive prototypes.",
  });
  const [letterPreview, setLetterPreview] = useState(null);
  const [showLetter, setShowLetter] = useState(false);
  const [uploadedLetter, setUploadedLetter] = useState(null);
  const [documentPreview, setDocumentPreview] = useState(false);
  const [showDocument, setShowDocument] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState(null);

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
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    onClose();
  };

  const handleRemoveRequest = () => {
    console.log("Remove request clicked");
    onClose();
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[100vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-sf font-semibold text-gray-900">
            View Confirmation Letter
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
              Name
            </label>
            <input
              type="text"
              name="Name"
              value={formData.Name}
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

          {/* Upload Certificate */}
          <div>
            <label className="block text-sm font-medium text-[#707070] mb-2 font-sf">
              Attach Confirmation Letter
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center relative overflow-hidden"
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

            {/* Image Preview Modal */}
            {showLetter && letterPreview && (
              <div
                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]"
                onClick={() => setShowLetter(false)}
              >
                <div className="relative max-w-4xl max-h-[90vh] p-4" onClick={handleModalClick}>
                  <button
                    onClick={() => setShowLetter(false)}
                    className="absolute -top-2 -right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 z-10"
                  >
                    ✕
                  </button>
                  <img
                    src={letterPreview}
                    alt="Certificate Preview"
                    className="max-w-96 max-h-96 object-contain rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
          
          
          <div>
            <label className="block text-sm font-medium text-[#707070] mb-2 font-sf">
              Attach Proof Document (Optional)
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center relative overflow-hidden"
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

            {/* Image Preview Modal */}
            {showDocument && documentPreview && (
              <div
                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]"
                onClick={() => setShowDocument(false)}
              >
                <div className="relative max-w-4xl max-h-[90vh] p-4" onClick={handleModalClick} >
                  <button
                    onClick={() => setShowDocument(false)}
                    className="absolute -top-2 -right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 z-10"
                  >
                    ✕
                  </button>
                  <img
                    src={documentPreview}
                    alt="Certificate Preview"
                    className="max-w-96 max-h-96 object-contain rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {/* <div className="flex space-x-3 pt-4">
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
          </div> */}
        </div>
      </div>
    </div>
  );
}
