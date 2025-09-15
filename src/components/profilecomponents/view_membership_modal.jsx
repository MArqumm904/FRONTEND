import React, { useState } from "react";

const dummyPreview =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"; // Placeholder image

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

const ViewMembershipModal = ({ onClose }) => {
  const [letterFile, setLetterFile] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [previewModal, setPreviewModal] = useState({
    open: false,
    image: null,
    label: "",
  });
  const [currentlyWorking, setCurrentlyWorking] = useState(false);

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFile(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openPreview = (image, label) => {
    setPreviewModal({ open: true, image, label });
  };
  const closePreview = () => {
    setPreviewModal({ open: false, image: null, label: "" });
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
          className="absolute top-[18px]  hover right-[18px] text-black hover:text-gray-800 text-3xl"
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
          View Confirmation Letter
        </h2>
        {/* Form Fields */}
        <form className="px-6 pb-6 pt-0">
          <div className="mb-5 mt-6">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="name"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder=""
              className="w-full border border-gray-300 rounded-[6px] px-3 py-[13px] text-[15px] "
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
              placeholder=""
              className="w-full border border-gray-300 rounded-[6px] px-3 py-[13px] text-[15px] "
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
              placeholder=""
              className="w-full border border-gray-300 rounded-[6px] px-3 py-[13px] text-[15px] "
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
                placeholder=""
                className="w-full border border-gray-300 rounded-[6px] px-3 py-[13px] text-[15px] "
                style={{ marginBottom: 0, height: "44px" }}
              />
            </div>
            {!currentlyWorking && (
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
                  placeholder=""
                  className="w-full border border-gray-300 rounded-[6px] px-3 py-[13px] text-[15px] "
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
              checked={currentlyWorking}
              onChange={(e) => setCurrentlyWorking(e.target.checked)}
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
            <input
              id="responsibilities"
              type="text"
              placeholder=""
              className="w-full border border-gray-300 rounded-[6px] px-3 py-[13px] text-[15px] "
              style={{ marginBottom: 0, height: "44px" }}
            />
          </div>
          {/* Attach Confirmation Letter */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Attach Confirmation Letter{" "}
              <span className="text-gray-400">[Optional]</span>
            </label>
            <div className="w-full h-[120px] bg-gray-200 rounded overflow-hidden flex items-center relative group">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={(e) => handleFileChange(e, setLetterFile)}
                title="Upload Confirmation Letter"
              />
              <img
                src={letterFile || dummyPreview}
                alt="Preview"
                className="object-cover w-full h-full pointer-events-none"
                style={{ filter: "grayscale(100%) brightness(0.95)" }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center pointer-events-none" />
              <button
                type="button"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  bg-opacity-80 text-white text-base px-4 py-1 rounded shadow font-medium z-20"
                style={{ pointerEvents: "auto" }}
                onClick={(e) => {
                  e.preventDefault();
                  openPreview(
                    letterFile || dummyPreview,
                    "Confirmation Letter Preview"
                  );
                }}
              >
                View Letter
              </button>
            </div>
          </div>
          {/* Attach Proof Document */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Attach Proof Document{" "}
              <span className="text-gray-400">[Optional]</span>
            </label>
            <div className="w-full h-[120px] bg-gray-200 rounded overflow-hidden flex items-center relative group">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={(e) => handleFileChange(e, setProofFile)}
                title="Upload Proof Document"
              />
              <img
                src={proofFile || dummyPreview}
                alt="Preview"
                className="object-cover w-full h-full pointer-events-none"
                style={{ filter: "grayscale(100%) brightness(0.95)" }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center pointer-events-none" />
              <button
                type="button"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  bg-opacity-80 text-white text-base px-4 py-1 rounded shadow font-medium z-20"
                style={{ pointerEvents: "auto" }}
                onClick={(e) => {
                  e.preventDefault();
                  openPreview(
                    proofFile || dummyPreview,
                    "Proof Document Preview"
                  );
                }}
              >
                View Document
              </button>
            </div>
          </div>
          {/* Action Buttons */}
          <div className=" space-x-2  mt-4">
            <button
              type="submit"
              className="bg-[#0017e7] hover:bg-[#071abf] text-white px-7 py-2 rounded  text-sm flex-1 font-sf"
              style={{ minWidth: "0", height: "44px" }}
            >
              Send Request
            </button>
            <button
              type="button"
              className="border border-black text-black px-7 py-2 rounded text-sm flex-1 bg-white font-sf"
              style={{ minWidth: "0", height: "44px" }}
            >
              Remove Request
            </button>
          </div>
        </form>
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

export default ViewMembershipModal;
