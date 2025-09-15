import { useState } from "react";
import { Search, X } from "lucide-react";

export default function AddFriends({ onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [requestedFriends, setRequestedFriends] = useState(new Set());

  const friends = [
    {
      id: 1,
      name: "Liam Carter",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face&auto=format",
    },
    {
      id: 2,
      name: "Sarah Malik",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face&auto=format",
    },
    {
      id: 3,
      name: "Code By Rixa",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format",
    },
    {
      id: 4,
      name: "Jaiwad singh",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face&auto=format",
    },
    {
      id: 5,
      name: "Alex Kim",
      avatar:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=40&h=40&fit=crop&crop=face&auto=format",
    },
    {
      id: 6,
      name: "Arqam Pathaan Legend",
      avatar:
        "https://lh3.googleusercontent.com/a-/ALV-UjXv_R-ALRR7dgASCY4WdhSnVmV_KyhJianRBr6cPr31kUbX9-Cj=s80-p-k-rw-no",
    },
    {
      id: 7,
      name: "Ahmed",
      avatar:
        "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
    },
  ];

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFriend = (friendId) => {
    setRequestedFriends((prev) => new Set([...prev, friendId]));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-md w-full max-w-md mx-auto shadow-xl max-h-[90vh] flex flex-col ">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 ">
          <h2 className="text-lg text-gray-900 font-semibold font-sf ms-2">Add Friends</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 transition-colors rounded-full hover:bg-gray-200"
          >
            <X size={25} className="text-black transition-colors" />
          </button>
        </div>

        {/* Search Bar */}
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
              className="w-full pl-10 pr-4 py-2 border placeholder:text-[#333f7d] placeholder:font-sf bg-[#fcfcff] border-gray-300 rounded-sm focus:outline-none  text-sm"
            />
          </div>
          <h3 className="text-sm font-medium text-gray-600 ms-2 -mb-2 mt-4">
            Suggested
          </h3>
        </div>

        {/* Suggested Section */}
        <div className="p-6 flex-1 overflow-hidden ">
          <div className="max-h-80 overflow-y-auto space-y-1 hide-scrollbar">
            {filteredFriends.map((friend, index) => (
              <div
                key={`${friend.id}-${index}`}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-gray-900 font-sf">
                    {friend.name}
                  </span>
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
                  {requestedFriends.has(friend.id) ? "Invited" : "Invite"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Show message if no results */}
        {filteredFriends.length === 0 && searchTerm && (
          <div className="p-4 text-center text-gray-500 text-sm">
            No friends found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
}
