import React, { useState, useEffect, useRef } from "react";
import { Upload } from "lucide-react";

const RequestAgentModal = ({ open, onClose, agency, readable = true }) => {
  if (!open) return null;

  // Dummy data for demonstration
  const data = agency || {
    name: "Iphone",
    email: "support@iphone.com",
    city: "Karachi",
    country: "Pakistan",
    province: "Sindh",
    district: "Karachi South",
    product: "Iphone 15",
    mainCategory: "Electronics",
    subCategory: "Smartphones",
    subSubCategory: "Infinix",
    startDate: "15th March 2023",
    endDate: "1st July 2024",
    description:
      "A line of sleek, high-performance smartphones built for modern life. Features include advanced cameras, fast charging, and iOS security.",
    agreementImg: "https://dummyimage.com/300x80/cccccc/000000&text=View+Agreement",
    confirmationImg: "https://dummyimage.com/300x80/cccccc/000000&text=View+Letter",
  };

  // States for edit mode (blank by default)
  const [fields, setFields] = useState({
    name: "",
    email: "",
    city: "",
    country: "",
    province: "",
    district: "",
    product: "",
    mainCategory: "",
    subCategory: "",
    subSubCategory: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [currentlyWorking, setCurrentlyWorking] = useState(false);
  const [agreementPreview, setAgreementPreview] = useState(null);
  const [letterPreview, setLetterPreview] = useState(null);
  const [documentPreview, setDocumentPreview] = useState(null);
  const agreementInputRef = useRef();
  const letterInputRef = useRef();
  const documentInputRef = useRef();

  useEffect(() => {
    if (!readable) {
      setFields({
        name: "",
        email: "",
        city: "",
        country: "",
        province: "",
        district: "",
        product: "",
        mainCategory: "",
        subCategory: "",
        subSubCategory: "",
        startDate: "",
        endDate: "",
        description: "",
      });
      setCurrentlyWorking(false);
      setAgreementPreview(null);
      setLetterPreview(null);
      setDocumentPreview(null);
    }
  }, [readable, open]);

  // Input/textarea class for both modes
  const inputClass =
    "w-full rounded border border-gray-300 text-sm px-3 py-2 font-sf bg-white transition disabled:bg-gray-100 disabled:text-gray-500";
  const inputReadOnlyClass = readable ? "bg-gray-100 text-black cursor-not-allowed font-sf" : "bg-white text-gray-900 font-sf";

  // Handler for edit mode
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for checkbox
  const handleCheckbox = (e) => {
    setCurrentlyWorking(e.target.checked);
    if (e.target.checked) {
      setFields((prev) => ({ ...prev, endDate: "" }));
    }
  };

  // Handler for agreement file upload
  const handleAgreementUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setAgreementPreview(url);
    }
  };
  const handleAgreementAreaClick = () => {
    if (!readable && agreementInputRef.current) {
      agreementInputRef.current.click();
    }
  };

  // Handler for letter file upload
  const handleLetterUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setLetterPreview(url);
    }
  };
  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setDocumentPreview(url);
    }
  };
  const handleLetterAreaClick = () => {
    if (!readable && letterInputRef.current) {
      letterInputRef.current.click();
    }
  };
  const handleDocumentAreaClick = () => {
    if (!readable && documentInputRef.current) {
      documentInputRef.current.click();
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-lg hide-scrollbar shadow-lg w-full max-w-lg p-0 relative overflow-y-auto max-h-[95vh] border border-[#7c87bc]">
        {/* Header: Flex row, left heading, right close */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-blue-100">
          <h2 className="text-xl font-semibold font-sf text-gray-900">Request Agent</h2>
          <button
            className="text-black hover:text-gray-700 ml-2"
            onClick={onClose}
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <form className="space-y-4 px-6 py-4">
          {/* Company Organization */}
          <div>
            <label className="block text-sm text-gray-500 mb-1 font-sf">Name / Company Organization</label>
            <input
              name="name"
              value={fields.name}
              readOnly={readable}
              className={`${inputClass} ${inputReadOnlyClass}`}
              onChange={!readable ? handleChange : undefined}
            />
          </div>
          {/* Email */}
          <div>
            <label className="block text-sm text-gray-500 mb-1 font-sf">Email</label>
            <input
              name="email"
              value={fields.email}
              readOnly={readable}
              className={`${inputClass} ${inputReadOnlyClass}`}
              onChange={!readable ? handleChange : undefined}
            />
          </div>
          {/* City / Country */}
          <div className="grid grid-cols-2 gap-4">
            
            <div>
              <label className="block text-sm text-gray-500 mb-1 font-sf">Country</label>
              <input
                name="country"
                value={fields.country}
                readOnly={readable}
                className={`${inputClass} ${inputReadOnlyClass}`}
                onChange={!readable ? handleChange : undefined}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1 font-sf">Governate</label>
              <input
                name="province"
                value={fields.province}
                readOnly={readable}
                className={`${inputClass} ${inputReadOnlyClass}`}
                onChange={!readable ? handleChange : undefined}
              />
            </div>
          </div>
          {/* Governate / District */}
          <div className="grid grid-cols-2 gap-4">
            
            <div>
              <label className="block text-sm text-gray-500 mb-1 font-sf">City</label>
              <input
                name="city"
                value={fields.city}
                readOnly={readable}
                className={`${inputClass} ${inputReadOnlyClass}`}
                onChange={!readable ? handleChange : undefined}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1 font-sf">District</label>
              <input
                name="district"
                value={fields.district}
                readOnly={readable}
                className={`${inputClass} ${inputReadOnlyClass}`}
                onChange={!readable ? handleChange : undefined}
              />
            </div>
          </div>
          {/* Product Name */}
          <div>
            <label className="block text-sm text-gray-500 mb-1 font-sf">Product Name</label>
            <input
              name="product"
              value={fields.product}
              readOnly={readable}
              className={`${inputClass} ${inputReadOnlyClass}`}
              onChange={!readable ? handleChange : undefined}
            />
          </div>
          {/* Main Category */}
          <div>
              <label className="block text-sm text-gray-500 mb-1 font-sf">Main Category</label>
              <input
                name="mainCategory"
                value={fields.mainCategory}
                readOnly={readable}
                className={`${inputClass} ${inputReadOnlyClass}`}
                onChange={!readable ? handleChange : undefined}
              />
            </div>
          {/* Sub/Sub-Sub Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1 font-sf">Sub Category</label>
              <input
                name="subCategory"
                value={fields.subCategory}
                readOnly={readable}
                className={`${inputClass} ${inputReadOnlyClass}`}
                onChange={!readable ? handleChange : undefined}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1 font-sf">Sub-Subcategory (Optional)</label>
              <input
                name="subSubCategory"
                value={fields.subSubCategory}
                readOnly={readable}
                className={`${inputClass} ${inputReadOnlyClass}`}
                onChange={!readable ? handleChange : undefined}
              />
            </div>
          </div>
          {/* Start Date */}
          <div>
            <label className="block text-sm text-gray-500 mb-1 font-sf">Start Date</label>
            <input
              name="startDate"
              value={fields.startDate}
              readOnly={readable}
              className={`${inputClass} ${inputReadOnlyClass}`}
              onChange={!readable ? handleChange : undefined}
            />
          </div>
          {/* End Date (conditionally rendered) */}
          {!currentlyWorking && (
            <div>
              <label className="block text-sm text-gray-500 mb-1 font-sf">End Date</label>
              <input
                name="endDate"
                value={fields.endDate}
                readOnly={readable}
                className={`${inputClass} ${inputReadOnlyClass}`}
                onChange={!readable ? handleChange : undefined}
              />
            </div>
          )}
          {/* Currently Working Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="currentlyWorking"
              checked={currentlyWorking}
              onChange={handleCheckbox}
              className="w-7 h-7 font-sf bg-gray-100 border-gray-300 rounded "
              style={{ accentColor: "#8bc53d" }}
              disabled={readable}
            />
            <label htmlFor="currentlyWorking" className="text-sm text-gray-700 font-sf select-none">
              Currently Working
            </label>
          </div>
          {/* Product Description */}
          <div>
            <label className="block text-sm text-gray-500 mb-1 font-sf">Product Description</label>
            <textarea
              name="description"
              value={fields.description}
              readOnly={readable}
              className={`${inputClass} ${inputReadOnlyClass} min-h-[60px] resize-none`}
              onChange={!readable ? handleChange : undefined}
            />
          </div>
          {/* Attach Agreement */}
          <div>
            <label className="block text-sm text-gray-500 mb-1 font-sf">Attach Agreement</label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center py-4 mb-2 cursor-pointer relative overflow-hidden group"
              onClick={handleAgreementAreaClick}
              style={{ minHeight: "112px" }}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={agreementInputRef}
                onChange={handleAgreementUpload}
                disabled={readable}
              />
              {agreementPreview ? (
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={agreementPreview}
                    alt="Agreement Preview"
                    className="w-full h-full object-cover"
                    style={{ borderRadius: "0.5rem" }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <span className="text-white text-xl font-semibold font-sf">View Agreement</span>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-gray-400 mb-1 z-10" />
                  <span className="text-gray-600 text-sm font-sf z-10">Upload Agreement</span>
                </>
              )}
            </div>
          </div>
          {/* Attach Agent's Commercial Registration */}
          <div>
            <label className="block text-sm text-gray-500 mb-1 font-sf">Attach Confirmation Letter</label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center py-4 mb-2 cursor-pointer relative overflow-hidden group"
              onClick={handleLetterAreaClick}
              style={{ minHeight: "112px" }}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={letterInputRef}
                onChange={handleLetterUpload}
                disabled={readable}
              />
              {letterPreview ? (
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={letterPreview}
                    alt="Letter Preview"
                    className="w-full h-full object-cover"
                    style={{ borderRadius: "0.5rem" }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <span className="text-white text-xl font-semibold font-sf">View Letter</span>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-gray-400 mb-1 z-10" />
                  <span className="text-gray-600 text-sm font-sf z-10">Upload Letter</span>
                </>
              )}
            </div>
          </div>
          
          {/* Attach Brand Authorization Document */}
          <div>
            <label className="block text-sm text-gray-500 mb-1 font-sf">Attach Brand Authorization Document</label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center py-4 mb-2 cursor-pointer relative overflow-hidden group"
              onClick={handleDocumentAreaClick}
              style={{ minHeight: "112px" }}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={documentInputRef}
                onChange={handleDocumentUpload}
                disabled={readable}
              />
              {documentPreview ? (
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={documentPreview}
                    alt="Letter Preview"
                    className="w-full h-full object-cover"
                    style={{ borderRadius: "0.5rem" }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <span className="text-white text-xl font-semibold font-sf">View Document</span>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-gray-400 mb-1 z-10" />
                  <span className="text-gray-600 text-sm font-sf z-10">Upload Document</span>
                </>
              )}
            </div>
          </div>
          {/* Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              className="w-40 bg-[#0214b5] hover:bg-[#000f82] text-white font-medium py-2 rounded text-sm transition-colors font-sf"
              disabled={readable}
            >
              Send Request
            </button>
            <button
              type="button"
              className="w-40 border-black border bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium py-2 rounded text-sm transition-colors font-sf"
              onClick={onClose}
            >
              Remove Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestAgentModal;