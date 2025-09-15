import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Preloader from '../preloader/Preloader';

const AboutFriendsTab = ({user_id}) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [friendChanged, setFriendChanged] = useState(false);
  const navigate = useNavigate();

  const fetchFriends = async () => {
    try {
      setLoading(true);
      // const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/friends?page=${page}`, {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/friends/${user_id}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch friends');
      }

      const data = await response.json();
      
      // Process profile images
      const processedFriends = data.data.map(friend => {
        let profilePic = "https://randomuser.me/api/portraits/women/44.jpg";
        if (friend.profilePic) {
          const baseUrl = import.meta.env.VITE_API_BASE_URL.replace("/api", "");
          profilePic = friend.profilePic.startsWith("http")
            ? friend.profilePic
            : `${baseUrl}/storage/${friend.profilePic}`;
        }

        let coverImage = "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=120&fit=crop";
        if (friend.coverImage) {
          const baseUrl = import.meta.env.VITE_API_BASE_URL.replace("/api", "");
          coverImage = friend.coverImage.startsWith("http")
            ? friend.coverImage
            : `${baseUrl}/storage/${friend.coverImage}`;
        }

        return {
          ...friend,
          profilePic,
          coverImage,
          subtitle: friend.subtitle || 'No headline provided'
        };
      });

      // setFriends(prev => [...prev, ...processedFriends]);
      setFriends(prev =>
  page === 1 ? processedFriends : [...prev, ...processedFriends]
);

      setHasMore(data.current_page < data.last_page);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }finally{
      setFriendChanged(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, [page , friendChanged]);

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  const viewProfile = (friendId) => {
    // alert(friendId);
    navigate(`/profile/${friendId}`);
    setFriends([])
    setPage(1); 
    setFriendChanged(true);
  };

  if (loading && page === 1) {
   return (
      <div className="bg-white rounded-xl shadow p-6 w-full mx-auto mt-4 border border-[#7c87bc]">
        <h2 className="text-3xl font-bold mb-8 font-sf">Friends</h2>
        <p className="text-gray-500 font-sf">Loading....</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow p-6 w-full mx-auto mt-4 border border-[#7c87bc]">
        <h2 className="text-3xl font-bold mb-8 font-sf">Friends</h2>
        <p className="text-red-500 font-sf">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 w-full mx-auto mt-4 border border-[#7c87bc]">
      <h2 className="text-3xl font-bold mb-8 font-sf">Friends</h2>
      
      {friends.length === 0 && !loading ? (
        <p className="text-gray-500 text-center py-8 font-sf">No friends found</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {friends.map((friend, idx) => (
              <div key={`${friend.id}-${idx}`} className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden flex flex-col items-center">
                {/* Cover Image */}
                <div className="w-full h-28 bg-gray-200 relative">
                  <img 
                    src={friend.coverImage} 
                    alt="Cover" 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=120&fit=crop";
                    }}
                  />
                  {/* Profile Pic */}
                  <div className="absolute left-1/2 -bottom-14 transform -translate-x-1/2">
                    <img 
                      src={friend.profilePic} 
                      alt={friend.name} 
                      className="w-24 h-24 rounded-full border-4 border-white object-cover"
                      onError={(e) => {
                        e.target.src = "https://randomuser.me/api/portraits/women/44.jpg";
                      }}
                    />
                  </div>
                </div>
                <div className="pt-16 pb-6 px-4 flex flex-col items-center w-full">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 font-sf">{friend.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 text-center font-sf">{friend.subtitle}</p>
                </div>
                <div className="w-full px-3 pb-3">
                  <button
                    onClick={() => viewProfile(friend.id)}
                    className="w-full bg-[#0017e7] text-white rounded-lg py-2 font-semibold font-sf hover:bg-[#0012b7] transition-colors"  
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="bg-white border border-[#0017e7] text-[#0017e7] rounded-lg px-6 py-2 font-semibold font-sf hover:bg-[#f0f2ff] transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AboutFriendsTab;