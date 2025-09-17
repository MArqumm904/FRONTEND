import { useState, useEffect, useRef, useCallback } from "react";
import { Upload, X, ChevronDown, Loader2 } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";

export default function ReqMembers({ onClose }) {
  const [formData, setFormData] = useState({
    selectedEntity: null,
    companyName: "",
    jobTitle: "",
    location: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    responsibilities: "",
    confirmation_letter: null,
    proof_document: null,
  });

  const [entities, setEntities] = useState({
    pages: [],
    users: [],
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    hasMorePages: true,
    hasMoreUsers: true,
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const observerRef = useRef(null);

  const [letterPreview, setLetterPreview] = useState(null);
  const [showLetter, setShowLetter] = useState(false);
  const [uploadedLetter, setUploadedLetter] = useState(null);
  const [documentPreview, setDocumentPreview] = useState(null);
  const [showDocument, setShowDocument] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const { id } = useParams(); 

  const getPageIdFromUrl = () => {
    const pathParts = window.location.pathname.split("/");
    return pathParts[pathParts.length - 1];
  };

  const pageId = getPageIdFromUrl();

  // Fetch entities from API
  const fetchEntities = useCallback(
    async (page = 1, isLoadMore = false) => {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const token = localStorage.getItem("token");

        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/getCompaniesandUsers`,
          {
            page_id: pageId,
            page: page,
            per_page: 10,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;

        if (isLoadMore) {
          setEntities((prev) => ({
            pages: [...prev.pages, ...data.pages.data],
            users: [...prev.users, ...data.users.data],
          }));
        } else {
          setEntities({
            pages: data.pages.data,
            users: data.users.data,
          });
        }

        setPagination((prev) => ({
          ...prev,
          page: page,
          hasMorePages: data.pages.current_page < data.pages.last_page,
          hasMoreUsers: data.users.current_page < data.users.last_page,
        }));
      } catch (error) {
        console.error("Error fetching entities:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [pageId]
  );

  // Initial fetch
  useEffect(() => {
    fetchEntities(1, false);
  }, [fetchEntities]);

  // Handle infinite scroll
  const lastItemRef = useCallback(
    (node) => {
      if (loadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          (pagination.hasMorePages || pagination.hasMoreUsers)
        ) {
          fetchEntities(pagination.page + 1, true);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loadingMore, pagination, fetchEntities]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEntitySelect = (entity, type) => {
    setFormData((prev) => ({
      ...prev,
      selectedEntity: entity,
      companyName: type === "page" ? entity.page_name : entity.name,
    }));
    setDropdownOpen(false);
    setSearchQuery("");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredEntities = {
    pages: entities.pages.filter((page) =>
      page.page_name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    users: entities.users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
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
      }
    }
  };

  const handleSubmit = async () => {
  // Validate required fields
  if (
    !formData.selectedEntity ||
    !formData.jobTitle ||
    !formData.location ||
    !formData.startDate ||
    !formData.responsibilities ||
    !formData.confirmation_letter ||
    !formData.proof_document
  ) {
    alert("Please fill all required fields");
    return;
  }

  setSubmitting(true);

  try {
    const token = localStorage.getItem("token");
    const formDataToSend = new FormData();

    const entityId = formData.selectedEntity.id;
    
    formDataToSend.append("user_page_id", entityId); // This is the key change
    formDataToSend.append("companyId", id);
    formDataToSend.append("companyName", formData.companyName);
    formDataToSend.append("jobTitle", formData.jobTitle);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("startDate", formData.startDate);
    formDataToSend.append("responsibilities", formData.responsibilities);
    formDataToSend.append(
      "currentlyWorking",
      formData.currentlyWorking ? 1 : 0
    );

    if (!formData.currentlyWorking && formData.endDate) {
      formDataToSend.append("endDate", formData.endDate);
    }

    // Append files
    formDataToSend.append(
      "confirmation_letter",
      formData.confirmation_letter
    );
    formDataToSend.append("proof_document", formData.proof_document);

    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/requestMembershipCompanySide`,
      formDataToSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      toast.success("Membership request submitted successfully!");
      onClose();
    } else {
      toast.error("Failed to submit request: " + response.data.message);
    }
  } catch (error) {
    console.error("API Error:", error);
    if (error.response?.data?.errors) {
      const errorMessages = Object.values(error.response.data.errors)
        .flat()
        .join("\n");
      alert("Validation errors:\n" + errorMessages);
    } else {
      alert("Something went wrong. Please try again.");
    }
  } finally {
    setSubmitting(false);
  }
};

  const handleRemoveRequest = () => {
    console.log("Remove request clicked");
    onClose();
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[100vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-sf font-semibold text-gray-900">
              Request Members
            </h2>
            <button
              onClick={onClose}
              className="text-black hover:text-gray-600 transition-colors"
              disabled={submitting}
            >
              <X size={25} />
            </button>
          </div>

          {/* Form */}
          <div className="p-4 space-y-4">
            {/* Company/User Selection Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-sf">
                Select User or Company *
              </label>
              <div
                className="w-full px-3 font-sf py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span
                  className={
                    formData.selectedEntity ? "text-gray-900" : "text-gray-500"
                  }
                >
                  {formData.selectedEntity
                    ? "page_name" in formData.selectedEntity
                      ? formData.selectedEntity.page_name
                      : formData.selectedEntity.name
                    : "Select a user or company"}
                </span>
                <ChevronDown size={16} className="text-gray-500" />
              </div>

              {dropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {/* Search Input */}
                  <div className="sticky top-0 bg-white p-2 border-b">
                    <input
                      type="text"
                      placeholder="Search users or companies..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {loading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="animate-spin h-5 w-5 text-blue-500" />
                    </div>
                  ) : (
                    <>
                      {/* Companies List */}
                      {filteredEntities.pages.length > 0 && (
                        <div className="p-2">
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Companies
                          </div>
                          {filteredEntities.pages.map((page, index) => (
                            <div
                              key={`page-${page.id}`}
                              className="p-2 hover:bg-gray-100 cursor-pointer rounded-md"
                              onClick={() => handleEntitySelect(page, "page")}
                            >
                              {page.page_name}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Users List */}
                      {filteredEntities.users.length > 0 && (
                        <div className="p-2">
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Users
                          </div>
                          {filteredEntities.users.map((user, index) => (
                            <div
                              key={`user-${user.id}`}
                              className="p-2 hover:bg-gray-100 cursor-pointer rounded-md"
                              onClick={() => handleEntitySelect(user, "user")}
                              ref={
                                index === filteredEntities.users.length - 1
                                  ? lastItemRef
                                  : null
                              }
                            >
                              {user.name}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Loading More Indicator */}
                      {loadingMore && (
                        <div className="flex justify-center py-2">
                          <Loader2 className="animate-spin h-5 w-5 text-blue-500" />
                        </div>
                      )}

                      {/* No Results */}
                      {filteredEntities.pages.length === 0 &&
                        filteredEntities.users.length === 0 && (
                          <div className="p-4 text-center text-gray-500">
                            No results found
                          </div>
                        )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Company/Organization Name (read-only, populated from selection) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-sf">
                User / Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full px-3 font-sf py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
                placeholder="Company / Organization Name"
                readOnly
              />
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-sf">
                Job Title *
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
                Location *
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
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-3 font-sf py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  type="date"
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
                Responsibilities *
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
                Attach Confirmation Letter *
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
                }}
              >
                {/* Dark overlay when image is present */}
                {letterPreview && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-md"></div>
                )}

                <input
                  type="file"
                  id="letter-upload"
                  accept=".jpg,.jpeg,.png,.gif"
                  onChange={handleLetterUpload}
                  className="hidden"
                  disabled={submitting}
                />

                {!letterPreview ? (
                  <label
                    htmlFor="letter-upload"
                    className="cursor-pointer flex flex-col justify-center items-center relative z-10"
                  >
                    <div className="w-10 h-10 flex items-center justify-center mb-2">
                      <Upload className="w-6 h-6 text-gray-900" />
                    </div>
                    <span className="text-sm text-gray-900 font-medium hover:text-[#0016c4] font-sf">
                      Upload Letter
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      (JPEG, PNG, JPG, GIF)
                    </span>
                  </label>
                ) : (
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="text-white mb-2">
                      {uploadedLetter?.name}
                    </span>
                    <button
                      onClick={() => setShowLetter(true)}
                      className="text-lg tracking-widest text-white font-medium hover:opacity-80 font-sf px-4 py-2 rounded-md bg-blue-600 mb-2"
                    >
                      View Letter
                    </button>
                    <label
                      htmlFor="letter-upload"
                      className="text-sm text-white underline cursor-pointer"
                    >
                      Change File
                    </label>
                  </div>
                )}
              </div>

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
                      alt="Confirmation Letter Preview"
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Upload Proof Document */}
            <div>
              <label className="block text-sm font-medium text-[#707070] mb-2 font-sf">
                Attach Proof Document *
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
                }}
              >
                {/* Dark overlay when image is present */}
                {documentPreview && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-md"></div>
                )}

                <input
                  type="file"
                  id="document-upload"
                  accept=".jpg,.jpeg,.png,.gif"
                  onChange={handleDocumentUpload}
                  className="hidden"
                  disabled={submitting}
                />

                {!documentPreview ? (
                  <label
                    htmlFor="document-upload"
                    className="cursor-pointer flex flex-col justify-center items-center relative z-10"
                  >
                    <div className="w-10 h-10 flex items-center justify-center mb-2">
                      <Upload className="w-6 h-6 text-gray-900" />
                    </div>
                    <span className="text-sm text-gray-900 font-medium hover:text-[#0016c4] font-sf">
                      Upload Document
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      (JPEG, PNG, JPG, GIF)
                    </span>
                  </label>
                ) : (
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="text-white mb-2">
                      {uploadedDocument?.name}
                    </span>
                    <button
                      onClick={() => setShowDocument(true)}
                      className="text-lg tracking-widest text-white font-medium hover:opacity-80 font-sf px-4 py-2 rounded-md bg-blue-600 mb-2"
                    >
                      View Document
                    </button>
                    <label
                      htmlFor="document-upload"
                      className="text-sm text-white underline cursor-pointer"
                    >
                      Change File
                    </label>
                  </div>
                )}
              </div>

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
                      alt="Proof Document Preview"
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-[#0017e7] font-sf text-white py-2 px-4 rounded-md hover:bg-[#0014cc] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Submitting...
                  </>
                ) : (
                  "Send Request"
                )}
              </button>
              <button
                type="button"
                onClick={handleRemoveRequest}
                disabled={submitting}
                className="flex-1 border border-gray-700 font-sf bg-gray-100 text-black py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
