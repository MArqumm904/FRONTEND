import React, { useState, useEffect } from "react";
import { X, MapPin, Settings, Loader2 } from "lucide-react";
import ViewConfirmationLetter from "./view_confirmation_letter";
import RemoveMembership from "./RemoveMembership";

const AgencyCard = ({ agency, setShowConfLetterPopup, removeMembership, isRemoving }) => (
  <div className="border border-black rounded-lg bg-white p-6 flex flex-col gap-2 mb-5 relative mx-auto">
    <button
      onClick={removeMembership}
      disabled={isRemoving}
      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      tabIndex={-1}
    >
      {isRemoving ? (
        <Loader2 className="w-7 h-7 animate-spin" />
      ) : (
        <X className="w-7 h-7" />
      )}
    </button>
    <div className="flex items-start gap-4">
      <img
        src={'http://127.0.0.1:8000/storage/'+agency.page?.page_profile_photo || "https://cdn-icons-png.flaticon.com/512/5968/5968770.png"}
        alt={agency.company_name || "Company"}
        className="w-14 h-14 rounded-full object-cover bg-gray-100 border border-gray-200"
      />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-lg text-black font-sf">
            {agency.company_name || "N/A"}
          </span>
          <span className="text-xs text-gray-500 font-sf">
            {agency.start_date && (agency.end_date || agency.currently_working ? 
              `${agency.start_date} - ${agency.currently_working ? 'Present' : agency.end_date}` : 
              agency.start_date || 'N/A')}
          </span>
          {agency.currently_working && (
            <span className="text-xs font-medium text-blue-700 font-sf cursor-pointer hover:underline">
              &ndash; Currently Working
            </span>
          )}
        </div>
        <div className="flex items-center gap-x-4">
          <div className="flex items-center gap-1 mt-1 text-gray-500 text-sm font-sf">
            <Settings className="w-4 h-4 mr-1 text-gray-400" />
            <span>{agency.job_title || "N/A"}</span>
          </div>
          <p className="text-gray-600">|</p>
          <div className="flex items-center gap-1 mt-1 text-gray-500 text-sm font-sf">
            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
            <span>{agency.location || "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
    <div className="mt-3 mb-2">
      <p className="text-gray-500 text-xl font-sf">
        {agency.responsibilities || "No description provided"}
      </p>
    </div>
    <div className="mt-2">
      <button
        className="px-4 py-2 bg-[#0017E7] hover:bg-[#000f82] text-white text-sm rounded-md font-sf"
        onClick={() => setShowConfLetterPopup(agency)}
      >
        View Confirmation Letter
      </button>
    </div>
  </div>
);

const CompanyAffiliations = () => {
  const [affiliations, setAffiliations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [showConfLetterPopup, setShowConfLetterPopup] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [removeLoading, setRemoveLoading] = useState(false);

  const getPageIdFromUrl = () => {
    const pathParts = window.location.pathname.split("/");
    return pathParts[pathParts.length - 1];
  };

  const pageId = getPageIdFromUrl();

  useEffect(() => {
    fetchCompanyAffiliations();
  }, []);

  const fetchCompanyAffiliations = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Authentication token not found');
      }

      if (!pageId) {
        throw new Error('Page ID not found');
      }

      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

      const response = await fetch(`${baseUrl}/getCompanyAffiliations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          page_id: pageId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status && result.data) {
        setAffiliations(result.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching company affiliations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (agency) => {
    setSelectedAgency(agency);
    setShowConfLetterPopup(true);
  };

  const handleRemoveClick = (member) => {
    setSelectedMember(member);
    setShowRemoveModal(true);
  };

  const handleCancelRemove = () => {
    setShowRemoveModal(false);
    setSelectedMember(null);
    setRemovingId(null);
  };

  const handleConfirmRemove = async () => {
    if (!selectedMember) return;

    try {
      setRemoveLoading(true);
      setRemovingId(selectedMember.id);

      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

      const response = await fetch(`${baseUrl}/removeCompanyMembership`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          membership_id: selectedMember.id
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status) {
        // Remove the affiliation from the local state
        setAffiliations(prev => prev.filter(affiliation => affiliation.id !== selectedMember.id));
        setShowRemoveModal(false);
        setSelectedMember(null);
      } else {
        throw new Error(result.message || 'Failed to remove membership');
      }
    } catch (err) {
      console.error('Error removing company membership:', err);
      alert(`Error removing membership: ${err.message}`);
    } finally {
      setRemoveLoading(false);
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="mt-2 mx-10 flex justify-center items-center py-10">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#0017e7]" />
          <p className="text-gray-600 font-sf">
            Loading company affiliations...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-2 mx-10 flex justify-center items-center py-10">
        <div className="flex flex-col items-center gap-4">
          <p className="text-red-600 font-sf">Error: {error}</p>
          <button
            onClick={fetchCompanyAffiliations}
            className="px-4 py-2 bg-[#0017E7] hover:bg-[#000f82] text-white text-sm rounded-md font-sf"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (affiliations.length === 0) {
    return (
      <div className="mt-2 mx-10 flex justify-center items-center py-10">
        <p className="text-gray-600 font-sf">No company affiliations found</p>
      </div>
    );
  }

  return (
    <div className="py-4 sm:py-6 px-10 mx-auto mt-4">
      {affiliations.map((agency) => (
        <AgencyCard
          key={agency.id}
          agency={agency}
          setShowConfLetterPopup={handleViewDetails}
          removeMembership={() => handleRemoveClick(agency)}
          isRemoving={removingId === agency.id}
        />
      ))}

      {showConfLetterPopup && selectedAgency && (
        <ViewConfirmationLetter
          onClose={() => {
            setShowConfLetterPopup(false);
            setSelectedAgency(null);
          }}
          agencyData={selectedAgency}
        />
      )}

      {showRemoveModal && (
        <RemoveMembership
          onCancel={handleCancelRemove}
          onBlock={handleConfirmRemove}
          name={selectedMember?.company_name}
          isLoading={removeLoading}
        />
      )}
    </div>
  );
};

export default CompanyAffiliations;