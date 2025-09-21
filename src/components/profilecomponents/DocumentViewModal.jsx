import React, { useState } from "react";

const ImagePreviewModal = ({ open, onClose, image, label }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className=" rounded-lg max-w-lg w-full p-4 relative">
        <button
          className="absolute -top-8 right-3 text-white hover:bg-[#3d3d3d] p-1 rounded-full  hover:text-white text-3xl transition-all duration-300"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          <img
            src={image}
            alt={label}
            className="max-h-[60vh] w-auto rounded mb-2"
          />
          <div className="text-sm text-white font-semibold">{label}</div>
        </div>
      </div>
    </div>
  );
};

const DocumentViewModal = ({ onClose, membership }) => {
  const [previewModal, setPreviewModal] = useState({
    open: false,
    image: null,
    label: "",
  });
  
  // Get base URL from environment variable
  const baseUrl = "http://127.0.0.1:8000/storage";
  
  // Get document URLs with proper base URL
  const confirmationLetterUrl = membership.documents && membership.documents.length > 0 && membership.documents[0].confirmation_letter
    ? `${baseUrl}/${membership.documents[0].confirmation_letter}`
    : null;
    
  const proofDocumentUrl = membership.documents && membership.documents.length > 0 && membership.documents[0].proof_document
    ? `${baseUrl}/${membership.documents[0].proof_document}`
    : null;

  const openPreview = (image, label) => {
    if (!image) return;
    setPreviewModal({ open: true, image, label });
  };
  
  const closePreview = () => {
    setPreviewModal({ open: false, image: null, label: "" });
  };

  // Get company name properly
  const getCompanyName = () => {
    if (membership.page && membership.page.page_name) {
      return membership.page.page_name;
    }
    return membership.company_name || "Unknown Company";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-0 relative hide-scrollbar"
        style={{
          maxHeight: "calc(100vh - 32px)",
          height: "auto",
          overflowY: "auto",
        }}
      >
        {/* Close Button */}
        <button
          className="absolute top-[18px] hover right-[18px] text-black hover:text-gray-800 text-3xl"
          onClick={onClose}
          style={{ lineHeight: "1" }}
        >
          &times;
        </button>
        {/* Title */}
        <h2
          className="text-lg font-sf font-semibold px-6 pt-6 pb-4 text-left border-b border-gray-200"
          style={{ marginBottom: 0 }}
        >
          View Documents
        </h2>
        {/* Form Fields */}
        <div className="px-6 pb-6 pt-0">
          <div className="mb-5 mt-6">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="name"
            >
              Company Name
            </label>
            <input
              id="name"
              type="text"
              value={getCompanyName()}
              readOnly
              className="w-full border border-gray-300 rounded-[6px] px-3 py-[13px] text-[15px] bg-gray-100"
              style={{ marginBottom: 0, height: "44px" }}
            />
          </div>
          <div className="mb-5">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="jobTitle"
            >
              Job Title
            </label>
            <input
              id="jobTitle"
              type="text"
              value={membership.job_title || ""}
              readOnly
              className="w-full border border-gray-300 rounded-[6px] px-3 py-[13px] text-[15px] bg-gray-100"
              style={{ marginBottom: 0, height: "44px" }}
            />
          </div>
          <div className="mb-5">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="location"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              value={membership.location || ""}
              readOnly
              className="w-full border border-gray-300 rounded-[6px] px-3 py-[13px] text-[15px] bg-gray-100"
              style={{ marginBottom: 0, height: "44px" }}
            />
          </div>
          {/* Start Date & End Date */}
          <div className="mb-5 flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="startDate"
              >
                Start Date
              </label>
              <input
                id="startDate"
                type="text"
                value={membership.start_date ? new Date(membership.start_date).toLocaleDateString() : ""}
                readOnly
                className="w-full border border-gray-300 rounded-[6px] px-3 py-[13px] text-[15px] bg-gray-100"
                style={{ marginBottom: 0, height: "44px" }}
              />
            </div>
            {!membership.currently_working && (
              <div className="flex-1 mt-4 sm:mt-0">
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="endDate"
                >
                  End Date
                </label>
                <input
                  id="endDate"
                  type="text"
                  value={membership.end_date ? new Date(membership.end_date).toLocaleDateString() : ""}
                  readOnly
                  className="w-full border border-gray-300 rounded-[6px] px-3 py-[13px] text-[15px] bg-gray-100"
                  style={{ marginBottom: 0, height: "44px" }}
                />
              </div>
            )}
          </div>
          {/* Checkbox */}
          <div className="flex items-center mb-5">
            <input
              type="checkbox"
              id="currentlyWorking"
              className="w-7 h-7 font-sf bg-gray-100 border-gray-300 rounded mr-2"
              style={{ accentColor: "#8bc53d" }}
              checked={membership.currently_working || false}
              readOnly
            />
            <label
              htmlFor="currentlyWorking"
              className="text-sm font-medium select-none"
            >
              Currently Working
            </label>
          </div>
          <div className="mb-5">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="responsibilities"
            >
              Responsibilities
            </label>
            <textarea
              id="responsibilities"
              value={membership.responsibilities || ""}
              readOnly
              className="w-full border border-gray-300 rounded-[6px] px-3 py-[13px] text-[15px] bg-gray-100"
              rows="3"
            />
          </div>
          
          {/* Document Section */}
          {(!confirmationLetterUrl && !proofDocumentUrl) ? (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-500 font-sf">No documents available for this membership.</p>
            </div>
          ) : (
            <>
              {/* Attach Confirmation Letter */}
              {confirmationLetterUrl && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">
                    Confirmation Letter
                  </label>
                  <div className="w-full h-[120px] bg-gray-200 rounded overflow-hidden flex items-center relative">
                    <img
                      src={confirmationLetterUrl}
                      alt="Confirmation Letter"
                      className="object-cover w-full h-full"
                      style={{ filter: "grayscale(100%) brightness(0.95)" }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center" />
                    <button
                      type="button"
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-opacity-80 text-white text-base px-4 py-1 rounded shadow font-medium"
                      onClick={() => openPreview(confirmationLetterUrl, "Confirmation Letter")}
                    >
                      View Letter
                    </button>
                  </div>
                </div>
              )}
              {/* Attach Proof Document */}
              {proofDocumentUrl && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">
                    Proof Document
                  </label>
                  <div className="w-full h-[120px] bg-gray-200 rounded overflow-hidden flex items-center relative">
                    <img
                      src={proofDocumentUrl}
                      alt="Proof Document"
                      className="object-cover w-full h-full"
                      style={{ filter: "grayscale(100%) brightness(0.95)" }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center" />
                    <button
                      type="button"
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-opacity-80 text-white text-base px-4 py-1 rounded shadow font-medium"
                      onClick={() => openPreview(proofDocumentUrl, "Proof Document")}
                    >
                      View Document
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* Action Buttons */}
          <div className="flex space-x-2 mt-4">
            <button
              type="button"
              className="bg-[#0017e7] hover:bg-[#071abf] text-white px-7 py-2 rounded text-sm flex-1 font-sf"
              style={{ minWidth: "0", height: "44px" }}
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
        {/* Image Preview Modal */}
        <ImagePreviewModal
          open={previewModal.open}
          onClose={closePreview}
          image={previewModal.image}
          label={previewModal.label}
        />
      </div>
    </div>
  );
};

export default DocumentViewModal;