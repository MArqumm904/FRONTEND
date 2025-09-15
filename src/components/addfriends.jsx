import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import axios from "axios";

export default function AddFriends({ onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [requestedFriends, setRequestedFriends] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace("/api", "");

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    setError(null);

    axios
      .post(
        `${import.meta.env.VITE_API_BASE_URL}/users/getrandomusers`,
        { limit: 5 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (!isMounted) return;
        const fetched = res.data.users.map((user) => {
          let profilePic = "https://randomuser.me/api/portraits/women/44.jpg"; // Default image
          
          if (user.profile?.profile_photo) {
            profilePic = user.profile.profile_photo.startsWith("http")
              ? user.profile.profile_photo
              : `${BASE_URL}/storage/${user.profile.profile_photo}`;
          }

          return {
            id: user.id,
            name: user.name,
            avatar: profilePic,
            subtitle: user.profile?.headline || "No headline provided",
          };
        });
        setSuggestedFriends(fetched);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError("Failed to fetch suggestions.");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredFriends = suggestedFriends.filter((friend) =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFriend = (friendId) => {
    setRequestedFriends((prev) => new Set([...prev, friendId]));

    axios
      .post(
        `${import.meta.env.VITE_API_BASE_URL}/friends/send`,
        { friend_id: friendId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        console.log("Friend request sent:", res.data);
      })
      .catch((err) => {
        console.error("Failed to send request:", err);
        setRequestedFriends((prev) => {
          const updated = new Set(prev);
          updated.delete(friendId);
          return updated;
        });
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-md w-full max-w-md mx-auto shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg text-gray-900 font-sf ms-2">Add Friends</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 transition-colors rounded-full hover:bg-gray-200"
          >
            <X size={25} className="text-black transition-colors" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#333f7d]"
              size={20}
            />
            <input
              type="text"
              placeholder="Search Friends"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border placeholder:text-[#333f7d] placeholder:font-sf bg-[#fcfcff] border-gray-300 rounded-sm focus:outline-none text-sm"
            />
          </div>
          <h3 className="text-sm font-medium text-gray-600 ms-2 -mb-2 mt-4">
            Suggested
          </h3>
        </div>

        {/* Suggested Section */}
        <div className="p-6 flex-1 overflow-hidden">
          <div className="max-h-80 overflow-y-auto space-y-1 hide-scrollbar">
            {loading && (
              <div className="text-center text-sm text-gray-500">Loading...</div>
            )}
            {error && (
              <div className="text-center text-sm text-red-500">{error}</div>
            )}
            {!loading &&
              !error &&
              filteredFriends.map((friend, index) => (
                <div
                  key={`${friend.id}-${index}`}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://randomuser.me/api/portraits/women/44.jpg";
                      }}
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900 font-sf block">
                        {friend.name}
                      </span>
                      <span className="text-xs text-gray-500 font-sf">
                        {friend.subtitle}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddFriend(friend.id)}
                    disabled={requestedFriends.has(friend.id)}
                    className={`px-4 py-1 rounded font-sf text-sm transition-colors ${
                      requestedFriends.has(friend.id)
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-[#0017e7] text-white hover:bg-[#0013c6]"
                    }`}
                  >
                    {requestedFriends.has(friend.id) ? "Requested" : "Add"}
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* No results */}
        {filteredFriends.length === 0 && searchTerm && (
          <div className="p-4 text-center text-gray-500 text-sm">
            No friends found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
}