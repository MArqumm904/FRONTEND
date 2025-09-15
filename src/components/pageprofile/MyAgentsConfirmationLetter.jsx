import React, { useState, useEffect, useRef } from "react";
import { Upload, X } from "lucide-react";

const MyAgentsConfirmationLetter = ({ open, onClose, agency, readable = true }) => {
  if (!open) return null;

  // Dummy data for demonstration
  const data = agency || {
    name: "Apple Inc.",
    email: "support@apple.com",
    city: "Cupertino",
    country: "United States",
    province: "California",
    district: "Santa Clara County",
    product: "iPhone 15 Pro",
    mainCategory: "Electronics",
    subCategory: "Smartphones",
    subSubCategory: "Flagship",
    startDate: "15th March 2023",
    endDate: "1st July 2024",
    description:
      "The iPhone 15 Pro features a titanium design, A17 Pro chip, 48MP camera system, and USB-C connectivity. It represents Apple's most advanced smartphone technology.",
    agreementImg: "https://media.istockphoto.com/id/1460172015/photo/businessmen-making-handshake-with-partner-greeting-dealing-merger-and-acquisition-business.jpg?s=612x612&w=0&k=20&c=IyQrIahedSW3WKsHSNsqtvX8dnzI1augnrtRrVeN3Dw=",
    confirmationImg: "https://dummyimage.com/600x400/000/fff&text=Confirmation+Letter",
    authorizationDoc: "https://dummyimage.com/600x400/000/fff&text=Authorization+Document"
  };

  // States for edit mode (blank by default)
   const [fields, setFields] = useState({
    name: data.name,
    email: data.email,
    city: data.city,
    country: data.country,
    province: data.province,
    district: data.district,
    product: data.product,
    mainCategory: data.mainCategory,
    subCategory: data.subCategory,
    subSubCategory: data.subSubCategory,
    startDate: data.startDate,
    endDate: data.endDate,
    description: data.description,
  });
  const [currentlyWorking, setCurrentlyWorking] = useState(false);
  const [agreementPreview, setAgreementPreview] = useState(data.agreementImg);
  const [letterPreview, setLetterPreview] = useState(data.confirmationImg);
  const [documentPreview, setDocumentPreview] = useState(data.authorizationDoc);
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
    }else {
      // Populate fields when in readable mode
      setFields({
        name: data.name,
        email: data.email,
        city: data.city,
        country: data.country,
        province: data.province,
        district: data.district,
        product: data.product,
        mainCategory: data.mainCategory,
        subCategory: data.subCategory,
        subSubCategory: data.subSubCategory,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description,
      });
      setAgreementPreview(data.agreementImg);
      setLetterPreview(data.confirmationImg);
      setDocumentPreview(data.authorizationDoc);
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
          <h2 className="text-xl font-semibold font-sf text-gray-900">View Confirmation Letter</h2>
          <button
            className="text-black hover:text-gray-700 ml-2"
            onClick={onClose}
          >
            <X className="w-7 h-7"/>
          </button>
        </div>
        <form className="space-y-4 px-6 py-4">
        
          {/* Attach Agreement */}
          <div>
            <label className="block text-lg text-gray-500 mb-2 font-medium">Attach Agreement Document</label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center py-4 mb-2 cursor-pointer relative overflow-hidden group"
              onClick={handleAgreementAreaClick}
              style={{ minHeight: "180px" }}
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

        </form>
      </div>
    </div>
  );
};

export default MyAgentsConfirmationLetter;