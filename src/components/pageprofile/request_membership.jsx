import { useState, useEffect, useRef } from "react";
import { X, ChevronDown, Loader2 } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RequestMembershipForm({ onClose }) {
  const [formData, setFormData] = useState({
    companyName: "",
    companyId: null,
    jobTitle: "UI/UX Designer",
    location: "Karachi, Pakistan",
    startDate: "June 2021",
    endDate: "January 2023",
    currentlyWorking: false,
    responsibilities: "Responsible for designing user flows, wireframes, and interactive prototypes.",
  });

  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dropdownRef = useRef(null);

  const getPageIdFromUrl = () => {
    const pathParts = window.location.pathname.split("/");
    return pathParts[pathParts.length - 1];
  };

  const pageId = getPageIdFromUrl();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

  // Fetch companies from API
  useEffect(() => {
    fetchCompanies(1);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const fetchCompanies = async (page) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No token found in localStorage");
        toast.error("Authentication token not found");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/getAffiliationsCompanies?page_id=${pageId}&page=${page}&per_page=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch companies");
      }

      const data = await response.json();
      const newCompanies = data.pages?.data || [];

      setCompanies((prev) => (page === 1 ? newCompanies : [...prev, ...newCompanies]));
      setHasMore(data.pages.current_page < data.pages.last_page);
      setCurrentPage(data.pages.current_page);
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Failed to load companies");
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreCompanies = () => {
    if (hasMore && !isLoading) {
      const nextPage = currentPage + 1;
      fetchCompanies(nextPage);
    }
  };

  const handleCompanySelect = (company) => {
    setFormData((prev) => ({
      ...prev,
      companyName: company.page_name,
      companyId: company.id,
    }));
    setSearchTerm(company.page_name);
    setIsDropdownOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.companyId || !formData.companyName) {
      toast.error("Please select a company");
      return;
    }

    if (!formData.jobTitle.trim()) {
      toast.error("Please enter job title");
      return;
    }

    if (!formData.location.trim()) {
      toast.error("Please enter location");
      return;
    }

    if (!formData.startDate.trim()) {
      toast.error("Please enter start date");
      return;
    }

    if (!formData.currentlyWorking && !formData.endDate.trim()) {
      toast.error("Please enter end date");
      return;
    }

    if (!formData.responsibilities.trim()) {
      toast.error("Please enter responsibilities");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const requestData = {
        companyId: formData.companyId,
        companyName: formData.companyName,
        user_page_id: parseInt(pageId),
        jobTitle: formData.jobTitle,
        location: formData.location,
        startDate: formData.startDate,
        endDate: formData.currentlyWorking ? null : formData.endDate,
        currentlyWorking: formData.currentlyWorking,
        responsibilities: formData.responsibilities,
      };

      console.log("Submitting request:", requestData);

      const response = await fetch(`${API_BASE_URL}/requestCompanyAffiliations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(result.message || "Membership request created successfully!");
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        if (result.errors) {
          // Handle validation errors
          Object.values(result.errors).forEach(errorArray => {
            errorArray.forEach(error => {
              toast.error(error);
            });
          });
        } else {
          toast.error(result.message || "Something went wrong");
        }
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Network error: Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveRequest = () => {
    console.log("Remove request clicked");
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[100vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Request Membership
            </h2>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-black hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <X size={25} />
            </button>
          </div>

          {/* Form */}
          <div className="p-4 space-y-4">
            {/* Company/Organization Name - Searchable Dropdown */}
            <div ref={dropdownRef} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company / Organization Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search companies..."
                  disabled={isSubmitting}
                />
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>

              {/* Dropdown List */}
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {isLoading && companies.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-500 text-center">
                      Loading companies...
                    </div>
                  ) : filteredCompanies.length > 0 ? (
                    <>
                      {filteredCompanies.map((company) => (
                        <div
                          key={company.id}
                          onClick={() => handleCompanySelect(company)}
                          className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm transition-colors flex items-start"
                        >
                          <img 
                            src={`${API_BASE_URL.replace('/api', '')}/storage/${company.page_profile_photo}`} 
                            alt={company.page_name}
                            className="w-6 h-6 rounded-full mr-2 object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <div>
                            <div className="font-medium">{company.page_name}</div>
                            {company.page_category && (
                              <div className="text-xs text-gray-500">{company.page_category}</div>
                            )}
                          </div>
                        </div>
                      ))}
                      {hasMore && !searchTerm && (
                        <div
                          onClick={loadMoreCompanies}
                          className="px-3 py-2 text-center text-sm text-blue-600 hover:bg-blue-50 cursor-pointer border-t"
                        >
                          {isLoading ? "Loading..." : "Load more..."}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500 text-center">
                      No companies found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                placeholder="Job Title"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                placeholder="Location"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="text"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                placeholder="Start Date"
              />
            </div>

            {/* End Date - Only show if NOT currently working */}
            {!formData.currentlyWorking && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="text"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
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
                disabled={isSubmitting}
                className="w-7 h-7 bg-gray-100 border-gray-300 rounded disabled:opacity-50"
                style={{ accentColor: "#8bc53d" }}
              />
              <label
                htmlFor="currentlyWorking"
                className="text-sm font-medium text-gray-700 select-none"
              >
                Currently Working
              </label>
            </div>

            {/* Responsibilities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsibilities
              </label>
              <textarea
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleInputChange}
                rows={3}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50"
                placeholder="Responsibilities"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-[#0017e7] text-white py-2 px-4 rounded-md hover:bg-[#0014cc] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Sending...
                  </>
                ) : (
                  "Send Request"
                )}
              </button>
              <button
                type="button"
                onClick={handleRemoveRequest}
                disabled={isSubmitting}
                className="flex-1 border border-gray-700 bg-gray-100 text-black py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                Remove Request
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}