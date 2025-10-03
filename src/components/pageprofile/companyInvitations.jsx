import React, { useState, useEffect } from 'react';
import { MapPin, Settings, Loader2 } from 'lucide-react';
import ViewMembershipModal from './view_membership_modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CompanyInvitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [approvingId, setApprovingId] = useState(null); // Track which invitation is being approved
  const [rejectingId, setRejectingId] = useState(null); // Track which invitation is being rejected

  useEffect(() => {
    fetchCompanyInvitations();
  }, []);

  const getPageIdFromUrl = () => {
    const pathParts = window.location.pathname.split("/");
    return pathParts[pathParts.length - 1];
  };

  const pageId = getPageIdFromUrl();

  const fetchCompanyInvitations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getCompanyInvitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          page_id: pageId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch invitations');
      }

      if (data.success) {
        // Transform API data to match component structure
        const transformedInvitations = data.data.map((membership, index) => ({
          id: membership.id || index + 1,
          companyLogo: membership.page?.page_profile_photo || `https://via.placeholder.com/56?text=${membership.page?.id || 'C'}`,
          companyName: membership.company_name || 'Unknown Company',
          invitedBy: membership.company_name || 'Unknown Company',
          jobTitle: membership.role || 'Member',
          location: membership.location || 'Location not specified',
          startDate: membership.start_date || 'Not specified',
          endDate: membership.end_date || 'Currently Working',
          description: membership.description || `We'd like to verify your ${membership.role || 'membership'} with our company.`,
          status: membership.status || '',
          membershipData: membership // Keep original data for modal
        }));
        
        setInvitations(transformedInvitations);
      } else {
        // Agar success false hai but 404 nahi hai (no invitations found)
        if (response.status === 404) {
          setInvitations([]); // Empty array set karo, error nahi
        } else {
          throw new Error(data.message || 'Failed to fetch invitations');
        }
      }
    } catch (err) {
      // Specific check for "No pending invitations" message
      if (err.message.includes('No pending invitations')) {
        setInvitations([]); // Empty invitations, no error
      } else {
        setError(err.message);
        console.error('Error fetching company invitations:', err);
        toast.error('Failed to load invitations');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewLetter = (invitation) => {
    setShowViewModal(true);
    // You can pass the invitation data to modal if needed
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
  };

  const handleApprove = async (invitationId) => {
    try {
      setApprovingId(invitationId);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/approvedCompanyInvitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: invitationId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to approve invitation');
      }

      if (data.success) {
        toast.success('Invitation approved successfully!');
        
        // Update local state to remove the approved invitation
        setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
        
      } else {
        throw new Error(data.message || 'Failed to approve invitation');
      }
    } catch (err) {
      console.error('Error approving invitation:', err);
      toast.error(err.message || 'Failed to approve invitation');
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (invitationId) => {
    try {
      setRejectingId(invitationId);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/rejectCompanyInvitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: invitationId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reject invitation');
      }

      if (data.success) {
        toast.success('Invitation rejected successfully!');
        
        setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
        
      } else {
        throw new Error(data.message || 'Failed to reject invitation');
      }
    } catch (err) {
      console.error('Error rejecting invitation:', err);
      toast.error(err.message || 'Failed to reject invitation');
    } finally {
      setRejectingId(null);
    }
  };

  const InvitationCard = ({ invitation, onViewLetter }) => {
    const isApproving = approvingId === invitation.id;
    const isRejecting = rejectingId === invitation.id;
    const isProcessing = isApproving || isRejecting;

    return (
      <div className="border border-gray-400 rounded-lg bg-white p-5 flex flex-col gap-2 mb-4 relative shadow-sm">
        <div className="flex items-start gap-4">
          {/* Logo */}
          <img
            src={'http://127.0.0.1:8000/storage/'+invitation.companyLogo}
            alt="Company Logo"
            className="w-14 h-14 rounded-full object-cover bg-gray-100 border border-gray-200"
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/56?text=${invitation.companyName?.charAt(0) || 'C'}`;
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-bold text-lg text-black font-sf">
                Invited by: {invitation.companyName}
              </span>
              <span className="text-xs text-gray-500 font-sf">
                {invitation.startDate} – {invitation.endDate}
              </span>
              {invitation.status && (
                <span className="text-xs font-medium text-blue-700 font-sf cursor-pointer hover:underline">
                  &ndash; {invitation.status}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="flex items-center text-sm text-gray-700 font-sf">
                <Settings className="w-4 h-4 mr-1 text-gray-600"/>
                {invitation.jobTitle}
              </span>
              <span className='text-gray-400'>|</span>
              <span className="flex items-center text-xs text-gray-500 font-sf">
                <MapPin className="w-4 h-4 mr-1 text-gray-600" />
                {invitation.location}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-2 mb-2">
          <p className="text-gray-700 text-lg font-sf">
            {invitation.description}
          </p>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <button 
            onClick={() => handleApprove(invitation.id)}
            disabled={isProcessing}
            className="flex items-center justify-center px-7 py-1 bg-[#22bb33] hover:bg-[#1e9e2a] text-white text-sm rounded-md font-sf min-w-[110px] border border-[#22bb33] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApproving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <span className="mr-2 text-lg">✓</span>
            )}
            {isApproving ? 'Approving...' : 'Approve'}
          </button>
          <button 
            onClick={() => handleReject(invitation.id)}
            disabled={isProcessing}
            className="flex items-center justify-center px-7 py-1 bg-[#ff2222] hover:bg-[#d11a1a] text-white text-sm rounded-md font-sf min-w-[110px] border border-[#ff2222] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRejecting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <span className="mr-2 text-lg">✗</span>
            )}
            {isRejecting ? 'Rejecting...' : 'Reject'}
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="mt-2 mx-10 flex justify-center items-center py-10">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#0017e7]" />
          <p className="text-gray-600 font-sf">
            Loading membership requests...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-2 mx-10 flex justify-center items-center py-10">
        <div className="flex flex-col items-center gap-4">
          <p className="text-red-600 font-sf">
            Error: {error}
          </p>
          <button 
            onClick={fetchCompanyInvitations}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="mt-2 mx-10 flex justify-center items-center py-10">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
            <Settings className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-600 font-sf text-lg">
            No pending company invitations
          </p>
          <p className="text-gray-500 font-sf text-sm">
            When companies invite you, they'll appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-2 px-10">
        {invitations.map((invitation) => (
          <InvitationCard 
            key={invitation.id} 
            invitation={invitation} 
            onViewLetter={() => handleViewLetter(invitation)} 
          />
        ))}
        {showViewModal && (
          <ViewMembershipModal onClose={handleCloseViewModal} />
        )}
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
};

export default CompanyInvitations;