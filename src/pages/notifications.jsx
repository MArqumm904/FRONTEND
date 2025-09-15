import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SidebarMenu from "../components/sidebarmenu";
import ProfileCard from "../components/profilecard";
import NavbarReplica from "../components/nav";
import cross from "../assets/images/cross_icon.png";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingRequests, setProcessingRequests] = useState(new Set());
  const [acceptedRequests, setAcceptedRequests] = useState(new Set());
  const [rejectedRequests, setRejectedRequests] = useState(new Set());

  // Function to format time
  const formatTime = (createdAt) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diffInSeconds = Math.floor((now - createdDate) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Categorize notifications by time
  const categorizeByTime = (createdAt) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diffInHours = Math.floor((now - createdDate) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return "today";
    if (diffInHours < 48) return "yesterday";
    return "thisweek";
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Fetch received friend requests
        const receivedResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/friends/received`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Fetch sent friend requests (accepted/rejected)
        const sentResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/friends/sent`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!receivedResponse.ok || !sentResponse.ok) {
          throw new Error('Failed to fetch notifications');
        }

        const receivedData = await receivedResponse.json();
        const sentData = await sentResponse.json();
        
        // Transform received friend requests
        const receivedNotifications = receivedData.map(request => {
          let profilePhoto = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
          if (request.user?.profile?.profile_photo) {
            const baseUrl = import.meta.env.VITE_API_BASE_URL.replace("/api", "");
            profilePhoto = request.user.profile.profile_photo.startsWith("http")
              ? request.user.profile.profile_photo
              : `${baseUrl}/storage/${request.user.profile.profile_photo}`;
          }

          return {
            id: `friend-request-${request.id}`,
            type: categorizeByTime(request.created_at),
            user: request.user?.name || 'Unknown User',
            action: "sent you a friend request.",
            time: formatTime(request.created_at),
            avatar: profilePhoto,
            hasActions: true,
            hasViewButton: false,
            requestId: request.id,
            profileData: request.user?.profile || null,
            category: 'received',
            createdAt: request.created_at
          };
        });

        // Transform sent friend requests (accepted/rejected)
        const sentNotifications = sentData.map(request => {
          let profilePhoto = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
          if (request.friend?.profile?.profile_photo) {
            const baseUrl = import.meta.env.VITE_API_BASE_URL.replace("/api", "");
            profilePhoto = request.friend.profile.profile_photo.startsWith("http")
              ? request.friend.profile.profile_photo
              : `${baseUrl}/storage/${request.friend.profile.profile_photo}`;
          }

          const actionText = request.status === 'accepted' 
            ? "accepted your friend request! 🎉" 
            : "declined your friend request.";

          return {
            id: `sent-request-${request.id}`,
            type: categorizeByTime(request.updated_at),
            user: request.friend?.name || 'Unknown User',
            action: actionText,
            time: formatTime(request.updated_at),
            avatar: profilePhoto,
            hasActions: false,
            hasViewButton: false,
            requestId: request.id,
            profileData: request.friend?.profile || null,
            category: 'sent',
            status: request.status,
            createdAt: request.updated_at
          };
        });

        // Combine and sort all notifications by time
        const allNotifications = [...receivedNotifications, ...sentNotifications]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setNotifications(allNotifications);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleAcceptRequest = async (requestId) => {
    setProcessingRequests(prev => new Set([...prev, `accept-${requestId}`]));
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/friends/${requestId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to accept friend request');
      }

      setAcceptedRequests(prev => new Set([...prev, requestId]));
      toast.success('🎉 Friend request accepted! You are now connected.', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error('Accept error:', err);
      toast.error('❌ Failed to accept friend request. Please try again.', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(`accept-${requestId}`);
        return newSet;
      });
    }
  };

  const handleRejectRequest = async (requestId) => {
    setProcessingRequests(prev => new Set([...prev, `reject-${requestId}`]));
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/friends/${requestId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reject friend request');
      }

      setRejectedRequests(prev => new Set([...prev, requestId]));
      toast.success('✋ Friend request declined.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error('Reject error:', err);
      toast.error('❌ Failed to reject friend request. Please try again.', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(`reject-${requestId}`);
        return newSet;
      });
    }
  };

  const onBackToHome = () => {
    navigate("/");
  };

  // Group notifications by time category
  const groupedNotifications = {
    today: notifications.filter(n => n.type === "today"),
    yesterday: notifications.filter(n => n.type === "yesterday"),
    thisweek: notifications.filter(n => n.type === "thisweek")
  };

  const renderNotificationItem = (notification) => {
    const isAcceptProcessing = processingRequests.has(`accept-${notification.requestId}`);
    const isRejectProcessing = processingRequests.has(`reject-${notification.requestId}`);
    const isAccepted = acceptedRequests.has(notification.requestId);
    const isRejected = rejectedRequests.has(notification.requestId);
    
    return (
      <div
        key={notification.id}
        className={`bg-white border border-[#bcbcbc] rounded-lg p-4 mb-3 shadow-sm transition-all duration-200 ${
          (isAcceptProcessing || isRejectProcessing) ? 'opacity-70' : 'opacity-100'
        }`}
      >
        <div className="flex items-center gap-3 relative">
          <img
            src={notification.avatar}
            alt={notification.user}
            className="w-20 h-20 rounded-full flex-shrink-0"
          />

          <div className="flex-0 min-w-0 mt-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-md text-gray-900 font-sf">
                    <span className="font-semibold">{notification.user}</span>{" "}
                    {notification.category === 'received' ? (
                      isAccepted ? "is now your friend! 🎉" : 
                      isRejected ? "friend request was declined." : 
                      notification.action
                    ) : (
                      notification.action
                    )}
                  </p>
                  <span className={`text-xs font-semibold ml-3 flex-shrink-0 ${
                    notification.time === "Just now" ? "text-[#0017e7]" : "text-[#707070]"
                  }`}>
                    {notification.time}
                  </span>
                </div>
                {notification.profileData?.headline && (
                  <p className="text-sm text-gray-500 mt-1">
                    {notification.profileData.headline}
                  </p>
                )}
              </div>
            </div>

            {/* Action buttons for received friend requests only */}
            {notification.category === 'received' && !isAccepted && !isRejected && (
              <div className="flex gap-2 mt-3">
                <button 
                  onClick={() => handleAcceptRequest(notification.requestId)}
                  disabled={isAcceptProcessing || isRejectProcessing}
                  className={`font-sf px-4 py-1 bg-gradient-to-b from-green-400 to-green-600 text-white text-sm font-medium rounded-lg hover:from-green-400 hover:to-green-700 transition-all duration-200 flex items-center gap-2 shadow-sm ${
                    (isAcceptProcessing || isRejectProcessing) ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
                  }`}
                >
                  {isAcceptProcessing ? (
                    <>
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      ✓ Approve
                    </>
                  )}
                </button>
                <button 
                  onClick={() => handleRejectRequest(notification.requestId)}
                  disabled={isAcceptProcessing || isRejectProcessing}
                  className={`font-sf px-6 py-1 bg-gradient-to-b from-red-400 to-red-600 text-white text-sm font-medium rounded-lg hover:from-red-400 hover:to-red-800 transition-all duration-200 flex items-center gap-2 shadow-sm ${
                    (isAcceptProcessing || isRejectProcessing) ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
                  }`}
                >
                  {isRejectProcessing ? (
                    <>
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <img src={cross} className="w-3 h-3" alt="" /> Reject
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Status display for received requests */}
            {notification.category === 'received' && isAccepted && (
              <div className="mt-3">
                <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <p className="text-green-700 text-sm font-medium">
                    ✅ You are now friends with {notification.user}
                  </p>
                </div>
              </div>
            )}

            {notification.category === 'received' && isRejected && (
              <div className="mt-3">
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                  <p className="text-gray-600 text-sm font-medium">
                    ❌ Friend request declined
                  </p>
                </div>
              </div>
            )}

            {/* Status display for sent requests */}
            {notification.category === 'sent' && (
              <div className="mt-3">
                {notification.status === 'accepted' ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <p className="text-green-700 text-sm font-medium">
                      🎉 Great! You're now connected with {notification.user}
                    </p>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    <p className="text-red-700 text-sm font-medium">
                      😔 {notification.user} declined your friend request
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600 font-sf">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-500 font-sf">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavbarReplica />
      <ToastContainer />
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-[86rem] mx-auto px-0 md:px-4 py-0 md:py-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="hidden md:block md:col-span-3">
              <ProfileCard />
              <SidebarMenu />
            </div>

            <div className="col-span-1 md:col-span-9">
              <div className="bg-white rounded-lg shadow-sm border border-[#6974b1] p-4 mx-auto">
                <div className="flex items-center mb-6">
                  <button
                    onClick={onBackToHome}
                    className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                  </button>
                  <h1 className="text-2xl font-semibold font-sf text-gray-900">
                    Notifications
                  </h1>
                </div>

                <div className="space-y-6">
                  {/* Today Section */}
                  {groupedNotifications.today.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-3 font-sf">
                        Today
                      </h2>
                      <div className="bg-white rounded-lg overflow-hidden">
                        {groupedNotifications.today.map(renderNotificationItem)}
                      </div>
                    </div>
                  )}

                  {/* Yesterday Section */}
                  {groupedNotifications.yesterday.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-3 font-sf">
                        Yesterday
                      </h2>
                      <div className="bg-white rounded-lg overflow-hidden">
                        {groupedNotifications.yesterday.map(renderNotificationItem)}
                      </div>
                    </div>
                  )}

                  {/* This Week Section */}
                  {groupedNotifications.thisweek.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-3 font-sf">
                        This Week
                      </h2>
                      <div className="bg-white rounded-lg overflow-hidden">
                        {groupedNotifications.thisweek.map(renderNotificationItem)}
                      </div>
                    </div>
                  )}

                  {/* No notifications */}
                  {notifications.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500 font-sf">
                        No notifications found.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notifications;