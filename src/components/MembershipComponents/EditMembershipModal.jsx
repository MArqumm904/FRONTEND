import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const EditMembershipModal = ({ onClose, membershipId, onUpdateSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    job_title: "",
    location: "",
    start_date: "",
    end_date: "",
    currently_working: false,
    responsibilities: "",
    confirmation_letter: null,
    proof_document: null,
  });
  const [previewModal, setPreviewModal] = useState({
    open: false,
    image: null,
    label: "",
  });

  useEffect(() => {
    fetchMembershipData();
  }, [membershipId]);

  const fetchMembershipData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/getMembership/${membershipId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        const membership = response.data.data;
        
        // Format dates for input fields
        const formatDateForInput = (dateString) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        };

        setFormData({
          job_title: membership.job_title || "",
          location: membership.location || "",
          start_date: formatDateForInput(membership.start_date),
          end_date: formatDateForInput(membership.end_date),
          currently_working: membership.currently_working || false,
          responsibilities: membership.responsibilities || "",
          confirmation_letter: null,
          proof_document: null,
        });
      } else {
        toast.error(response.data.message || "Failed to fetch membership data");
        onClose();
      }
    } catch (err) {
      console.error("Error fetching membership:", err);
      toast.error(
        err.response?.data?.message || "An error occurred while fetching data"
      );
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === "file") {
      setFormData(prev => ({
        ...prev,
        [name]: files[0] || null
      }));
    } else if (type === "checkbox") {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.job_title || !formData.location || !formData.start_date || !formData.responsibilities) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.currently_working && !formData.end_date) {
      toast.error("End date is required when not currently working");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const submitData = new FormData();
      submitData.append('job_title', formData.job_title);
      submitData.append('location', formData.location);
      submitData.append('start_date', formData.start_date);
      
      // Handle end date - only include if not currently working
      if (!formData.currently_working && formData.end_date) {
        submitData.append('end_date', formData.end_date);
      } else {
        submitData.append('end_date', '');
      }
      
      // Convert boolean to string for FormData compatibility
      submitData.append('currently_working', formData.currently_working ?  1 : 0);
      submitData.append('responsibilities', formData.responsibilities);

      if (formData.confirmation_letter) {
        submitData.append('confirmation_letter', formData.confirmation_letter);
      }

      if (formData.proof_document) {
        submitData.append('proof_document', formData.proof_document);
      }

      console.log('Submitting data:', {
        job_title: formData.job_title,
        location: formData.location,
        start_date: formData.start_date,
        end_date: formData.currently_working ? '' : formData.end_date,
        currently_working: formData.currently_working.toString(),
        responsibilities: formData.responsibilities,
        has_confirmation_letter: !!formData.confirmation_letter,
        has_proof_document: !!formData.proof_document
      });

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/updateMembership/${membershipId}`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Membership updated successfully!");
        onUpdateSuccess(response.data.data);
        onClose();
      } else {
        toast.error(response.data.message || "Failed to update membership");
      }
    } catch (err) {
      console.error("Error updating membership:", err);
      if (err.response?.data?.errors) {
        // Display validation errors
        const errors = err.response.data.errors;
        Object.values(errors).forEach(errorArray => {
          errorArray.forEach(error => toast.error(error));
        });
      } else {
        toast.error(
          err.response?.data?.message || "An error occurred while updating membership"
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const openPreview = (image, label) => {
    if (!image) return;
    setPreviewModal({ open: true, image, label });
  };

  const closePreview = () => {
    setPreviewModal({ open: false, image: null, label: "" });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <div className="flex justify-center items-center py-8">
            <svg
              className="animate-spin h-8 w-8 text-[#0017e7]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          </div>
          <p className="text-center text-gray-600">Loading membership data...</p>
        </div>
      </div>
    );
  }

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
          className="absolute top-[18px] right-[18px] text-black hover:text-gray-800 text-3xl"
          onClick={onClose}
          style={{ lineHeight: "1" }}
          disabled={saving}
        >
          &times;
        </button>

        {/* Title */}
        <h2
          className="text-lg font-sf font-semibold px-6 pt-6 pb-4 text-left border-b border-gray-200"
          style={{ marginBottom: 0 }}
        >
          Edit Membership
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-0">
          {/* Job Title */}
          <div className="mb-5 mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              name="job_title"
              value={formData.job_title}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-[6px] px-3 py-[13px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#0017e7] focus:border-transparent"
              style={{ marginBottom: 0, height: "44px" }}
              required
            />
          </div>

          {/* Location */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-[6px] px-3 py-[13px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#0017e7] focus:border-transparent"
              style={{ marginBottom: 0, height: "44px" }}
              required
            />
          </div>

          {/* Start Date & End Date */}
          <div className="mb-5 flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-[6px] px-3 py-[13px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#0017e7] focus:border-transparent"
                style={{ marginBottom: 0, height: "44px" }}
                required
              />
            </div>
            {!formData.currently_working && (
              <div className="flex-1 mt-4 sm:mt-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-[6px] px-3 py-[13px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#0017e7] focus:border-transparent"
                  style={{ marginBottom: 0, height: "44px" }}
                  required={!formData.currently_working}
                />
              </div>
            )}
          </div>

          {/* Currently Working Checkbox */}
          <div className="flex items-center mb-5">
            <input
              type="checkbox"
              name="currently_working"
              checked={formData.currently_working}
              onChange={handleInputChange}
              className="w-7 h-7 font-sf border-gray-300 rounded mr-2 focus:ring-[#0017e7]"
              style={{ accentColor: "#8bc53d" }}
            />
            <label className="text-sm font-medium select-none">
              Currently Working
            </label>
          </div>

          {/* Responsibilities */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsibilities *
            </label>
            <textarea
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleInputChange}
              rows="3"
              className="w-full border border-gray-300 rounded-[6px] px-3 py-[13px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#0017e7] focus:border-transparent resize-none"
              style={{ marginBottom: 0 }}
              required
            />
          </div>

          {/* Confirmation Letter Upload */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmation Letter
            </label>
            <input
              type="file"
              name="confirmation_letter"
              onChange={handleInputChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              className="w-full border border-gray-300 rounded-[6px] px-3 py-[13px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#0017e7] focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#0017e7] file:text-white hover:file:bg-[#071abf]"
              style={{ marginBottom: 0, height: "auto" }}
            />
            <p className="text-xs text-gray-500 mt-1">
              Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
            </p>
          </div>

          {/* Proof Document Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proof Document
            </label>
            <input
              type="file"
              name="proof_document"
              onChange={handleInputChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              className="w-full border border-gray-300 rounded-[6px] px-3 py-[13px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#0017e7] focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#0017e7] file:text-white hover:file:bg-[#071abf]"
              style={{ marginBottom: 0, height: "auto" }}
            />
            <p className="text-xs text-gray-500 mt-1">
              Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 mt-4">
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-7 py-2 rounded text-sm flex-1 font-sf transition-colors"
              style={{ minWidth: "0", height: "44px" }}
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#0017e7] hover:bg-[#071abf] text-white px-7 py-2 rounded text-sm flex-1 font-sf transition-colors flex items-center justify-center gap-2"
              style={{ minWidth: "0", height: "44px" }}
              disabled={saving}
            >
              {saving ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>

        {/* Image Preview Modal */}
        {previewModal.open && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
            <div className="rounded-lg max-w-lg w-full p-4 relative">
              <button
                className="absolute -top-8 right-3 text-white hover:bg-[#3d3d3d] p-1 rounded-full hover:text-white text-3xl transition-all duration-300"
                onClick={closePreview}
              >
                &times;
              </button>
              <div className="flex flex-col items-center">
                <img
                  src={previewModal.image}
                  alt={previewModal.label}
                  className="max-h-[60vh] w-auto rounded mb-2"
                />
                <div className="text-sm text-white font-semibold">
                  {previewModal.label}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditMembershipModal;