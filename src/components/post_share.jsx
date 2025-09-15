import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  X,
  Link,
  MessageCircle,
  Facebook,
  Instagram,
  Check,
} from "lucide-react";
import Twitter from "../assets/images/twitter.png";
import Whatsapp from "../assets/images/whatsapp.png";

// expects props: post (object containing at least { id, type, image/video/content })
export default function ShareComponent({ onClose, post }) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [friends, setFriends] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const STORAGE_BASE_URL = (API_BASE_URL?.replace(/\/?api\/?$/, '') || API_BASE_URL) + '/storage';

  const toAvatarUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${STORAGE_BASE_URL}/${path}`;
  };

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/friends`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          params: { per_page: 100 }
        });
        const list = (res.data?.data || []).map((f) => ({
          id: f.id,
          name: f.name,
          role: f.subtitle || '',
          image: toAvatarUrl(f.profilePic),
        }));
        setFriends(list);
      } catch (e) {
        setFriends([]);
      }
    };
    fetchFriends();
  }, [API_BASE_URL]);

  const socialOptions = [
    {
      icon: <Link className="w-6 h-6 text-gray-600" />,
      label: "Copy Link",
    },
    {
      icon: <img src={Twitter} alt="Twitter" className="w-6 h-6 text-black" />,
      label: "X",
    },
    {
      icon: <img src={Whatsapp} alt="Twitter" className="w-6 h-6 text-black" />,
      label: "WhatsApp",
    },
    {
      icon: <Facebook className="w-6 h-6 text-black" />,
      label: "Facebook",
    },
    {
      icon: <Instagram className="w-6 h-6 text-black" />,
      label: "Instagram",
    },
  ];

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSend = async () => {
    setIsSending(true);
    try {
      const token = localStorage.getItem('token');
      const baseUrl = API_BASE_URL.replace('/api', '');
      const payloads = selectedUsers.map((receiverId) => {
        // Determine thumbnail if available
        let thumbnail = null;
        if (post?.type === 'image' && post?.image) thumbnail = post.image;
        if (post?.type === 'video' && post?.thumbnail) thumbnail = post.thumbnail;
        if (thumbnail && !thumbnail.startsWith('http')) thumbnail = `${baseUrl}${thumbnail.startsWith('/storage') ? '' : '/'}${thumbnail}`;

        return {
          receiver_id: receiverId,
          post_id: post?.id,
          post_type: post?.type || 'text',
          message: message,
          thumbnail: thumbnail,
        };
      });

      // Fire requests sequentially to keep it simple and reliable
      for (const body of payloads) {
        await fetch(`${API_BASE_URL}/messages/post`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
      }

    setShowSuccess(true);
    setTimeout(() => {
        setMessage('');
      setSelectedUsers([]);
      setShowSuccess(false);
        onClose?.();
      }, 1200);
    } catch (e) {
      // no-op
    } finally {
      setIsSending(false);
    }
  };

  const filteredUsers = (friends || []).filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm z-50 ">
      <div className="bg-white rounded-md w-full max-w-xl mx-4 py-2 shadow-xl relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b ">
          <h2 className="text-lg font-semibold text-gray-900 ms-2 font-sf">
            Share
          </h2>
          <button
            onClick={onClose}
            className="text-black mr-1 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1"
          >
            <X size={25} />
          </button>
        </div>

        {/* Success Overlay */}
        {showSuccess && (
          <div className="absolute inset-0 bg-white flex items-center justify-center z-10 rounded-md">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0017e7] rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <p className="text-xl font-semibold text-gray-800 font-sf">
                Message sent successfully!
              </p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="p-4 px-6 border-b">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#343f7b]"
              size={20}
            />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full font-sf placeholder:text-[#343f7b] pl-12 pr-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="max-h-64 overflow-y-auto hide-scrollbar">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex border-b items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleUserSelection(user.id)}
            >
              <div className="flex items-center space-x-3 ">
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full ${user.bgColor} flex items-center justify-center text-white font-semibold`}
                    >
                      {user.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.role}</p>
                </div>
              </div>
              <div className="relative ">
                <input
                  type="radio"
                  name="selectedUser"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => toggleUserSelection(user.id)}
                  className="w-6 h-6 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                {selectedUsers.includes(user.id) && (
                  <div className="absolute inset-0 h-6 bg-[#0017e7] rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section - Fixed height container */}
        <div className="border-t h-32">
          {/* Message Input - Only show when user is selected */}
          {selectedUsers.length > 0 && (
            <>
              <div className="p-3">
                <textarea
                  placeholder="Write a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="font-sf w-full p-3  border-gray-200 rounded-lg resize-none focus:outline-none  focus:border-transparent"
                  rows="1"
                />
              </div>
              <div className="px-3 pb-4">
                <button
                  onClick={handleSend}
                  disabled={isSending}
                  className="font-sf w-full bg-[#0017e7] text-white py-3 rounded-lg hover:bg-[#0014ce] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSending ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send"
                  )}
                </button>
              </div>
            </>
          )}

          {/* Social Share Options - Only show when no user is selected */}
          {selectedUsers.length === 0 && (
            <div className="p-8 h-full flex items-center">
              <div className="flex justify-between items-center w-full ">
                {socialOptions.map((option, index) => (
                  <button
                    key={index}
                    className="flex flex-col items-center space-y-1 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      {option.icon}
                    </div>

                    <span className="text-xs text-gray-600">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
