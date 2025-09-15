import React, { useState, useEffect } from "react";
import { Pencil, X, Trash } from "lucide-react";

const CertificateCard = ({authenticatedUser,user_id, certificate, onEdit, onDelete }) => {
  const [showCertificate, setShowCertificate] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  console.log(certificate);


  useEffect(() => {
    if (showCertificate) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showCertificate]);

const handleViewCertificate = () => {
  if (certificate.certificate_photo) {
    if (certificate.certificate_photo instanceof File) {
      const previewUrl = URL.createObjectURL(certificate.certificate_photo);
      setImageUrl(previewUrl);
      setShowCertificate(true);
    }
    else if (typeof certificate.certificate_photo === 'string') {
      const baseUrl = import.meta.env.VITE_API_BASE_URL.replace("/api", "/storage/");
      const finalUrl = `${baseUrl}${certificate.certificate_photo}`;
      setImageUrl(finalUrl);
      setShowCertificate(true);
    }
  }
};


  const handleCloseCertificate = () => {
    setShowCertificate(false);
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      setImageUrl(null);
    }
  };

  return (
    <>
      <div className="border border-[#000] rounded-lg p-6 bg-white hover:shadow-sm transition-shadow relative mt-5">
        {/* Edit and Delete Buttons - side by side in top right */}
        {authenticatedUser === user_id && (
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={onEdit}
            className="p-1.5 text-gray-500 hover:text-gray-600 rounded-full border border-gray-500 hover:border-gray-500 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete && onDelete(certificate)}
            className="p-1.5 text-red-500 hover:text-red-600 rounded-full border border-red-500 hover:border-red-500 transition-colors"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
        )}

        {/* Certificate Content */}
        <div className="pr-12">
          {/* Header with Logo and Title */}
          <div className="flex items-start mb-4">
            {/* Coursera Logo */}
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <span className="text-white font-bold text-xs">coursera</span>
            </div>

            {/* Title and Date */}
            <div className="flex-1">
              <div className="flex items-start mb-1">
                <h3 className="text-xl font-semibold text-gray-900 font-sf">
                  {certificate.title}
                </h3>
                <span className="text-sm text-gray-600 font-sf mt-2 ml-4 flex-shrink-0">
                  {certificate.start_year} - {certificate.end_year}
                </span>
              </div>

              {/* Organization with checkmark */}
              <div className="flex items-center text-gray-600 mb-3">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-sf">
                  {certificate.organization}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {certificate.description && (
            <p className="text-gray-700 text-lg font-sf leading-relaxed mb-4">
              {certificate.description}
            </p>
          )}

          {/* View Certificate Button */}
          <button
            onClick={handleViewCertificate}
            disabled={!certificate.certificate_photo}
            className={`px-4 py-2 font-sf rounded text-sm transition-colors ${certificate.certificate_photo
              ? "bg-[#0017e7] text-white hover:bg-[#0014c9]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            View Certificate
          </button>
        </div>
      </div>

      {/* Certificate Viewer Modal */}
      {showCertificate && imageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
          <div className="relative max-w-4xl max-h-full m-4">
            {/* Close Button */}
            <button
              onClick={handleCloseCertificate}
              className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Certificate Image */}
            <img
              src={imageUrl}
              alt="Certificate"
              className="max-w-96 max-h-96 object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CertificateCard;