import { X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { db } from "../../firebase";
import { ref as dbRef, onValue } from "firebase/database";

const StartChat = ({ isOpen, onClose, onChatCreated }) => {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [results, setResults] = useState([]);
  const [otherUser, setOtherUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const STORAGE_BASE_URL =
    (API_BASE_URL?.replace(/\/?api\/?$/, "") || API_BASE_URL) + "/storage";

  const toAvatarUrl = (path) => {
    if (!path) return null;
    if (
      typeof path === "string" &&
      (path.startsWith("http://") || path.startsWith("https://"))
    )
      return path;
    return `${STORAGE_BASE_URL}/${path}`;
  };
  const [onlineStatus, setOnlineStatus] = useState({}); // { [userId]: boolean }
  const presenceListenersRef = useRef({});

  const handleContactSelect = (contact) => {
    setInputValue("");
    setShowSuggestions(false);
    onClose?.();
    onChatCreated?.({
      id: contact.id,
      user_id: contact.id,
      name: contact.name,
      avatar: toAvatarUrl(contact.profile_photo),
      isOnline: !!contact.is_online,
      time: "",
      last_message: "",
    });
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const searchUsers = async (query) => {
    if (!query || query.trim().length === 0) {
      setResults([]);
      setOtherUser([]);
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/friends/search`, {
        params: { q: query, limit: 8 },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const users = Array.isArray(res.data.friends) ? res.data.friends : [];
      const otherUsers = Array.isArray(res.data.users) ? res.data.users : [];

      const mapped = users.map((u) => ({
        ...u,
        profile_photo: toAvatarUrl(u.profile_photo),
      }));
      const otherUsersMapped = otherUsers.map((u) => ({
        ...u,
        profile_photo: toAvatarUrl(u.profile_photo),
      }));
      setResults(mapped);
      setOtherUser(otherUsersMapped);
    } catch (e) {
      setResults([]);
      setOtherUser([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useMemo(() => debounce(searchUsers, 300), []);

  useEffect(() => {
    if (!isOpen) return;
    debouncedSearch(inputValue);
  }, [inputValue, isOpen]);

  // Realtime presence for search results
  useEffect(() => {
    if (!isOpen) return;
    const currentIds = new Set((results || []).map((u) => Number(u.id)));

    // Subscribe to new ids
    results.forEach((u) => {
      const userId = Number(u.id);
      if (!presenceListenersRef.current[userId]) {
        const sRef = dbRef(db, `status/${userId}`);
        const unsub = onValue(sRef, (snap) => {
          const val = snap.val();
          setOnlineStatus((prev) => ({
            ...prev,
            [userId]: Boolean(val?.online),
          }));
        });
        presenceListenersRef.current[userId] = unsub;
      }
    });

    // Unsubscribe removed ids
    Object.keys(presenceListenersRef.current).forEach((idStr) => {
      const id = Number(idStr);
      if (!currentIds.has(id)) {
        const unsub = presenceListenersRef.current[id];
        if (typeof unsub === "function") unsub();
        delete presenceListenersRef.current[id];
        setOnlineStatus((prev) => {
          const { [id]: _omit, ...rest } = prev;
          return rest;
        });
      }
    });
  }, [results, isOpen]);

  // Cleanup on close/unmount
  useEffect(() => {
    if (isOpen) return;
    Object.values(presenceListenersRef.current).forEach(
      (unsub) => typeof unsub === "function" && unsub()
    );
    presenceListenersRef.current = {};
    setOnlineStatus({});
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl h-[30rem] mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-5 rounded-lg border border-gray-400">
          <h2 className="text-xl font-bold text-gray-900">Start a Chat</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-7 h-7 text-gray-700" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 h-[calc(100%-80px)] overflow-y-auto relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To:
          </label>

          {/* Input Field */}
          <div className="relative mb-4">
            <input
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Search users by name or email"
              className="w-full h-14 p-3 border border-gray-500 bg-gray-100 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {/* Suggestions */}
            {showSuggestions && (inputValue || loading) && (
              <div className="w-full max-w-xs mt-2 max-h-64 overflow-y-auto border border-gray-300 rounded-lg bg-white divide-y absolute top-3 right-4 z-10 shadow-lg">
                {loading && (
                  <div className="p-3 text-sm text-gray-500">Searching...</div>
                )}
                {!loading && results.length === 0 && otherUser.length === 0 && (
                  <div className="p-3 text-sm text-gray-500">
                    No users found
                  </div>
                )}
                {!loading && results.length > 0 && otherUser.length > 0 && (
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-100">
                    Friends
                  </div>
                )}
                {!loading &&
                  results.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => handleContactSelect(u)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left"
                    >
                      <img
                        src={toAvatarUrl(u.profile_photo) || "/placeholder.svg"}
                        alt={u.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="text-gray-900 font-medium">
                          {u.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {onlineStatus[u.id] ? "Online" : "Offline"}
                        </div>
                      </div>
                    </button>
                  ))}
                {!loading && otherUser.length > 0 && results.length > 0 && (
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-100">
                    Other Users
                  </div>
                )}
                {!loading &&
                  otherUser.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => handleContactSelect(u)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left"
                    >
                      <img
                        src={toAvatarUrl(u.profile_photo) || "/placeholder.svg"}
                        alt={u.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="text-gray-900 font-medium">
                          {u.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {onlineStatus[u.id] ? "Online" : "Offline"}
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartChat;
