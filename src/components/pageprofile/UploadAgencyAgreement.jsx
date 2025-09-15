import React, { useRef } from "react";
import { Upload } from "lucide-react";

const UploadAgencyAgreement = ({ open, onClose }) => {
  const agreementInputRef = useRef();
  const legalProofInputRef = useRef();
  const documentInputRef = useRef();

  if (!open) return null;

  const handleAgreementClick = () => {
    agreementInputRef.current.click();
  };

  const handleLegalProofClick = () => {
    legalProofInputRef.current.click();
  };

  const handleDocumentClick = () => {
    documentInputRef.current.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border p-6 rounded-t-lg rounded-b-2xl border-gray-400">
          <h2 className="text-xl font-semibold text-gray-900">Upload Agreement</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Agreement Upload Section */}
        <p className="text-gray-500 text-base mb-1 px-6">Attach Agreement Document</p>
        <div className="mb-6 px-6">
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
            onClick={handleAgreementClick}
          >
            <input 
              type="file" 
              ref={agreementInputRef} 
              className="hidden" 
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
            />
            <div className="flex items-center gap-x-2">
                <Upload className="w-5 h-5 text-gray-800" />
                <p className="text-gray-600 font-medium">Upload Agreement</p>
            </div>
          </div>
        </div>

        {/* Legal Registration Proof Section */}
        <p className="text-gray-500 text-base mb-1 px-6">Attach Legal Registration Proof</p>
        <div className="mb-6 px-6">
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
            onClick={handleLegalProofClick}
          >
            <input 
              type="file" 
              ref={legalProofInputRef} 
              className="hidden" 
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
            />
            <div className="flex items-center gap-x-2">
                <Upload className="w-5 h-5 text-gray-800" />
                <p className="text-gray-600 font-medium">Upload Agreement</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-start mt-8 gap-x-2 px-6 mb-8">
            <button 
            className="px-4 py-2 bg-[#0017E7] text-white rounded-md transition flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Send Request
          </button>
          <button 
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            onClick={onClose}
          >
            Remove Request
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default UploadAgencyAgreement;