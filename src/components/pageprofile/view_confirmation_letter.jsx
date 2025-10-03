import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";

export default function ViewConfirmationLetter({ onClose, agencyData }) {
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
  const [documentPreview, setDocumentPreview] = useState(null);
  const [showDocument, setShowDocument] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState(null);

  useEffect(() => {
    if (agencyData) {
      console.log("Agency Data:", agencyData); // Debug log
      console.log("Agency Documents:", agencyData.documents); // Debug log
      
      setFormData({
        Name: agencyData.company_name || "",
        jobTitle: agencyData.job_title || "",
        location: agencyData.location || "",
        startDate: agencyData.start_date ? formatDate(agencyData.start_date) : "",
        endDate: agencyData.end_date ? formatDate(agencyData.end_date) : "",
        currentlyWorking: agencyData.currently_working || false,
        responsibilities: agencyData.responsibilities || "",
      });

      // Set confirmation letter preview if available
      if (agencyData.documents && agencyData.documents.length > 0) {
        console.log("Documents found:", agencyData.documents); // Debug log
        
        // Last document use karo (most recent)
        const latestDocument = agencyData.documents[agencyData.documents.length - 1];
        console.log("Latest Document:", latestDocument); // Debug log
        
        // Confirmation Letter
        if (latestDocument.confirmation_letter) {
          const fullUrl = latestDocument.confirmation_letter.startsWith('http') 
            ? latestDocument.confirmation_letter 
            : `http://127.0.0.1:8000/storage/${latestDocument.confirmation_letter}`;
          
          console.log("Confirmation Letter URL:", fullUrl); // Debug log
          setLetterPreview(fullUrl);
          setUploadedLetter({ name: 'Confirmation Letter', url: fullUrl });
        }

        // Proof Document
        if (latestDocument.proof_document) {
          const fullUrl = latestDocument.proof_document.startsWith('http') 
            ? latestDocument.proof_document 
            : `http://127.0.0.1:8000/storage/${latestDocument.proof_document}`;
          
          console.log("Proof Document URL:", fullUrl); // Debug log
          setDocumentPreview(fullUrl);
          setUploadedDocument({ name: 'Proof Document', url: fullUrl });
        }
      } else {
        console.log("No documents found in agency data"); // Debug log
      }
    }
  }, [agencyData]);

  // Date format karne ka function
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString;
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const getFileExtension = (url) => {
    if (!url) return '';
    try {
      // URL se filename extract karo
      const filename = url.split('/').pop();
      return filename.split('.').pop().toLowerCase();
    } catch (error) {
      return '';
    }
  };

  const isImageFile = (url) => {
    const extension = getFileExtension(url);
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension);
  };

  const isPdfFile = (url) => {
    const extension = getFileExtension(url);
    return extension === 'pdf';
  };

  const renderDocumentPreview = (url, type) => {
    if (!url) return null;

    if (isImageFile(url)) {
      return (
        <img
          src={url}
          alt={`${type} Preview`}
          className="max-w-full max-h-96 object-contain rounded-lg"
        />
      );
    } else if (isPdfFile(url)) {
      return (
        <div className="w-full h-96">
          <iframe
            src={url}
            className="w-full h-full rounded-lg"
            title={`${type} Preview`}
          />
        </div>
      );
    } else {
      return (
        <div className="text-center p-4">
          <p className="text-gray-600">Document format not supported for preview</p>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Download Document
          </a>
        </div>
      );
    }
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
              readOnly
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
              readOnly
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
              readOnly
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
              readOnly
            />
          </div>

          {/* End Date - Only show if NOT currently working */}
          {!formData.currentlyWorking && formData.endDate && (
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
                readOnly
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
              className="w-7 h-7 font-sf bg-gray-100 border-gray-300 rounded"
              style={{ accentColor: "#8bc53d" }}
              disabled
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
              readOnly
            />
          </div>

          {/* Upload Certificate */}
          <div>
            <label className="block text-sm font-medium text-[#707070] mb-2 font-sf">
              Confirmation Letter
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center relative overflow-hidden">
              {letterPreview ? (
                <div className="relative">
                  <div className="mb-3">
                    {isImageFile(letterPreview) ? (
                      <img
                        src={letterPreview}
                        alt="Confirmation Letter Preview"
                        className="max-w-32 max-h-32 object-contain mx-auto rounded"
                      />
                    ) : (
                      <div className="bg-gray-100 p-4 rounded mx-auto max-w-32">
                        <p className="text-sm text-gray-600">
                          {isPdfFile(letterPreview) ? 'PDF Document' : 'Document'}
                        </p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowLetter(true)}
                    className="px-4 py-2 bg-[#0017E7] text-white rounded-md hover:bg-[#000f82] font-sf"
                  >
                    View Letter
                  </button>
                </div>
              ) : (
                <div className="text-sm text-gray-500 font-sf">
                  No confirmation letter attached
                </div>
              )}
            </div>

            {/* Document Preview Modal */}
            {showLetter && letterPreview && (
              <div
                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]"
                onClick={() => setShowLetter(false)}
              >
                <div className="relative max-w-4xl max-h-[90vh] p-4 bg-white rounded-lg" onClick={handleModalClick}>
                  <button
                    onClick={() => setShowLetter(false)}
                    className="absolute -top-2 -right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 z-10 border border-gray-300"
                  >
                    ✕
                  </button>
                  <div className="p-4">
                    <h3 className="text-lg font-sf font-semibold mb-4">Confirmation Letter</h3>
                    {renderDocumentPreview(letterPreview, 'Confirmation Letter')}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Proof Document */}
          <div>
            <label className="block text-sm font-medium text-[#707070] mb-2 font-sf">
              Proof Document (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center relative overflow-hidden">
              {documentPreview ? (
                <div className="relative">
                  <div className="mb-3">
                    {isImageFile(documentPreview) ? (
                      <img
                        src={documentPreview}
                        alt="Proof Document Preview"
                        className="max-w-32 max-h-32 object-contain mx-auto rounded"
                      />
                    ) : (
                      <div className="bg-gray-100 p-4 rounded mx-auto max-w-32">
                        <p className="text-sm text-gray-600">
                          {isPdfFile(documentPreview) ? 'PDF Document' : 'Document'}
                        </p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowDocument(true)}
                    className="px-4 py-2 bg-[#0017E7] text-white rounded-md hover:bg-[#000f82] font-sf"
                  >
                    View Document
                  </button>
                </div>
              ) : (
                <div className="text-sm text-gray-500 font-sf">
                  No proof document attached
                </div>
              )}
            </div>

            {/* Document Preview Modal */}
            {showDocument && documentPreview && (
              <div
                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]"
                onClick={() => setShowDocument(false)}
              >
                <div className="relative max-w-4xl max-h-[90vh] p-4 bg-white rounded-lg" onClick={handleModalClick}>
                  <button
                    onClick={() => setShowDocument(false)}
                    className="absolute -top-2 -right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 z-10 border border-gray-300"
                  >
                    ✕
                  </button>
                  <div className="p-4">
                    <h3 className="text-lg font-sf font-semibold mb-4">Proof Document</h3>
                    {renderDocumentPreview(documentPreview, 'Proof Document')}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}