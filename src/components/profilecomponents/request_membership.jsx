import { useState, useEffect, useRef, useCallback } from "react";
import { X, CheckCircle2 } from "lucide-react";
import axios from "axios";

// Custom hook for infinite scroll
const useInfiniteScroll = (callback, hasMore) => {
  const observer = useRef();

  const lastElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          callback();
        }
      });
      if (node) observer.current.observe(node);
    },
    [callback, hasMore]
  );

  return lastElementRef;
};

function SuccessPopup({ onClose }) {
  // Auto-close after 4.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-xl shadow-2xl px-8 py-8 flex flex-col items-center max-w-sm w-full border border-gray-200 relative">
        <CheckCircle2 size={54} className="text-green-500 mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center font-sf">
          Request Sent!
        </h3>
        <p className="text-gray-700 text-center mb-5 font-sf text-base leading-relaxed">
          Your membership request has been submitted successfully.
          <br />
          We will notify you once it is reviewed.
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-[#0017e7] text-white rounded-md font-sf font-medium hover:bg-[#0014cc] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function RequestMembershipForm({ onClose }) {
  const [formData, setFormData] = useState({
    companyId: "",
    companyName: "",
    jobTitle: "",
    location: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    responsibilities: "",
  });

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showGlobalError, setShowGlobalError] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ITEMS_PER_PAGE = 10;

  // Fetch companies with pagination
  const fetchCompanies = async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/getcompanies`,
        {
          page: pageNum,
          per_page: ITEMS_PER_PAGE,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newCompanies = response.data.data || response.data;

      if (append) {
        setCompanies((prev) => [...prev, ...newCompanies]);
      } else {
        setCompanies(newCompanies);
      }

      // Check if we have more pages
      if (newCompanies.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      if (error.response?.status === 401) {
        console.error("Token might be expired or invalid");
      }
    } finally {
      setLoading(false);
    }
  };

  // Load more companies
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchCompanies(nextPage, true);
    }
  }, [loading, hasMore, page]);

  // Infinite scroll ref
  const lastElementRef = useInfiniteScroll(loadMore, hasMore);

  // Filter companies based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCompanies(companies);
    } else {
      const filtered = companies.filter((company) =>
        company.page_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCompanies(filtered);
    }
  }, [searchTerm, companies]);

  // Initial load
  useEffect(() => {
    fetchCompanies(1, false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "companyId") {
      const selectedCompany = companies.find(
        (company) => company.id.toString() === value
      );
      setFormData((prev) => ({
        ...prev,
        companyId: value,
        companyName: selectedCompany ? selectedCompany.page_name : "",
      }));
      setIsDropdownOpen(false);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
    setShowGlobalError(false);
    setApiError("");
  };

  const handleCompanySelect = (company) => {
    setFormData((prev) => ({
      ...prev,
      companyId: company.id.toString(),
      companyName: company.page_name,
    }));
    setIsDropdownOpen(false);
    setSearchTerm("");
    setShowGlobalError(false);
    setApiError("");
  };

  const handleSubmit = async () => {
    // Check if required fields are filled
    if (
      !formData.companyId.trim() ||
      !formData.companyName.trim() ||
      !formData.jobTitle.trim() ||
      !formData.location.trim() ||
      !formData.startDate.trim() ||
      (!formData.currentlyWorking && !formData.endDate.trim()) ||
      !formData.responsibilities.trim()
    ) {
      setShowGlobalError(true);
      setApiError("");
      return;
    }

    setShowGlobalError(false);
    setApiError("");
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setApiError("Authentication token not found. Please login again.");
        setIsSubmitting(false);
        return;
      }

      // Prepare the data to send to the API
      const requestData = {
        companyId: parseInt(formData.companyId),
        companyName: formData.companyName,
        jobTitle: formData.jobTitle,
        location: formData.location,
        startDate: formData.startDate,
        endDate: formData.currentlyWorking ? null : formData.endDate,
        currentlyWorking: formData.currentlyWorking,
        responsibilities: formData.responsibilities,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/requestmembership`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setShowSuccess(true);
        console.log("Membership request submitted:", response.data);
      } else {
        setApiError(
          response.data.message || "Failed to submit membership request"
        );
      }
    } catch (error) {
      console.error("Error submitting membership request:", error);

      if (error.response?.status === 401) {
        setApiError("Authentication failed. Please login again.");
      } else if (error.response?.status === 409) {
        setApiError(
          error.response.data.message ||
            "You already have a request for this company"
        );
      } else if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        if (validationErrors) {
          const errorMessages = Object.values(validationErrors).flat();
          setApiError(errorMessages.join(", "));
        } else {
          setApiError(error.response.data.message || "Invalid data provided");
        }
      } else {
        setApiError(
          error.response?.data?.message ||
            "Failed to submit membership request. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveRequest = () => {
    console.log("Remove request clicked");
    onClose();
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <>
      {showSuccess && <SuccessPopup onClose={handleSuccessClose} />}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm ${
          showSuccess ? "pointer-events-none opacity-0" : ""
        }`}
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[100vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-sf font-semibold text-gray-900">
              Request Membership
            </h2>
            <button
              onClick={onClose}
              className="text-black hover:text-gray-600 transition-colors"
              disabled={showSuccess || isSubmitting}
            >
              <X size={25} />
            </button>
          </div>

          {/* Global Error Display */}
          {(showGlobalError || apiError) && (
            <div className="px-4 pt-2 -mb-0">
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
                {showGlobalError
                  ? "Please fill all required fields."
                  : apiError}
              </div>
            </div>
          )}

          {/* Form */}
          <div className="p-4 space-y-4">
            {/* Company/Organization Name Dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1 font-sf">
                Company / Organization Name *
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={formData.companyName || searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsDropdownOpen(true)}
                  placeholder="Search or select a company"
                  className="w-full px-3 font-sf py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={showSuccess || isSubmitting}
                />

                {/* Dropdown Arrow */}
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                  disabled={showSuccess || isSubmitting}
                >
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              {/* Dropdown Options */}
              {isDropdownOpen && !showSuccess && !isSubmitting && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredCompanies.length === 0 && !loading ? (
                    <div className="px-3 py-2 text-gray-500 text-sm">
                      No companies found
                    </div>
                  ) : (
                    <>
                      {filteredCompanies.map((company, index) => (
                        <div
                          key={company.id}
                          ref={
                            index === filteredCompanies.length - 1
                              ? lastElementRef
                              : null
                          }
                          onClick={() => handleCompanySelect(company)}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium">{company.page_name}</div>
                          {company.page_category && (
                            <div className="text-xs text-gray-500">
                              {company.page_category}
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Loading indicator */}
                      {loading && (
                        <div className="px-3 py-2 text-center text-gray-500 text-sm">
                          Loading more companies...
                        </div>
                      )}

                      {/* End of results indicator */}
                      {!hasMore && filteredCompanies.length > 0 && (
                        <div className="px-3 py-2 text-center text-gray-400 text-xs border-t">
                          No more companies to load
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
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
                placeholder="UI/UX Designer"
                disabled={showSuccess || isSubmitting}
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
                placeholder="Karachi, Pakistan"
                disabled={showSuccess || isSubmitting}
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
                disabled={showSuccess || isSubmitting}
              />
            </div>

            {/* End Date - Only show if NOT currently working */}
            {!formData.currentlyWorking && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-sf">
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 font-sf py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={showSuccess || isSubmitting}
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
                disabled={showSuccess || isSubmitting}
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
                placeholder="Responsible for designing user flows, wireframes, and interactive prototypes."
                disabled={showSuccess || isSubmitting}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 bg-[#0017e7] font-sf text-white py-2 px-4 rounded-md hover:bg-[#0014cc] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={showSuccess || isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Request"}
              </button>
              <button
                type="button"
                onClick={handleRemoveRequest}
                className="flex-1 border border-gray-700 font-sf bg-gray-100 text-black py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={showSuccess || isSubmitting}
              >
                Remove Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
