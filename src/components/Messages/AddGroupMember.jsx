import { X, Check } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { db } from "../../firebase";
import { ref as dbRef, onValue } from "firebase/database";
import {toast , ToastContainer} from 'react-toastify';
const AddGroupMember = ({ isOpen, onClose, groupId }) => {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const STORAGE_BASE_URL =
    (API_BASE_URL?.replace(/\/?api\/?$/, "") || API_BASE_URL) + "/storage";
  const inputRef = useRef(null);

  const toAvatarUrl = (path) => {
    if (!path) return null;
    if (
      typeof path === "string" &&
      (path.startsWith("http://") || path.startsWith("https://"))
    )
      return path;
    return `${STORAGE_BASE_URL}/${path}`;
  };
  const [onlineStatus, setOnlineStatus] = useState({});
  const presenceListenersRef = useRef({});

  const handleMemberToggle = (user) => {
    setSelectedMembers((prev) => {
      const exists = prev.some((m) => m.id === user.id);
      if (exists) {
        return prev.filter((m) => m.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
    // Keep dropdown open and focus on input
    setShowSuggestions(true);
    inputRef.current?.focus();
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
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/friends/search`, {
        params: { q: query, limit: 8 },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const users = Array.isArray(res.data) ? res.data : [];
      const mapped = users.map((u) => ({
        ...u,
        profile_photo: toAvatarUrl(u.profile_photo),
        isOnline: onlineStatus[u.id] || false,
      }));
      setResults(mapped);
    } catch (e) {
      setResults([]);
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

  const addMembersToGroup = async () => {
    try {
      const token = localStorage.getItem("token");

      if (selectedMembers.length === 0) {
        alert("Please select at least one member to add");
        return;
      }

      const memberIds = selectedMembers.map((member) => member.id);

      const response = await axios.post(
        `${API_BASE_URL}/group-chats/add-member`,
        {
          group_id: groupId,
          members: memberIds,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.success) {
        toast.success("Members added successfully!");
        resetForm();
        onClose();
      } else {
        throw new Error("Failed to add members");
      }
    } catch (error) {
      console.error("Error adding group members:", error);
      toast.error("Failed to add members. Please try again.");
    }
  };

  const resetForm = () => {
    setSelectedMembers([]);
    setInputValue("");
    setShowSuggestions(false);
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
        <ToastContainer />
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl h-[30rem] mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-5 rounded-lg border border-gray-400">
          <h2 className="text-xl font-bold text-gray-900">Add Group Members</h2>
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
            Add group members:
          </label>

          <div className="relative mb-4">
            <input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search users by name or email"
              className="w-full h-14 p-3 border border-gray-500 bg-gray-100 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {/* Suggestions */}
            {showSuggestions && (inputValue || loading) && (
              <div className="w-full max-w-xs mt-2 max-h-64 overflow-y-auto border border-gray-300 rounded-lg bg-white divide-y absolute top-3 right-4 z-10 shadow-lg">
                {loading && (
                  <div className="p-3 text-sm text-gray-500">Searching...</div>
                )}
                {!loading && results.length === 0 && (
                  <div className="p-3 text-sm text-gray-500">
                    No users found
                  </div>
                )}
                {!loading &&
                  results.map((user) => {
                    const isSelected = selectedMembers.some(
                      (m) => m.id === user.id
                    );
                    return (
                      <div
                        key={user.id}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleMemberToggle(user)}
                      >
                        <img
                          src={
                            toAvatarUrl(user.profile_photo) ||
                            "/placeholder.svg"
                          }
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="text-gray-900 font-medium">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {onlineStatus[user.id] ? "Online" : "Offline"}
                          </div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected
                              ? "bg-blue-500 border-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Selected count indicator */}
          {selectedMembers.length > 0 && (
            <div className="text-sm text-gray-500 mb-4">
              {selectedMembers.length} member
              {selectedMembers.length !== 1 ? "s" : ""} selected
            </div>
          )}

          <div className="w-full mt-6 absolute bottom-3 left-0 px-5">
            <button
              onClick={addMembersToGroup}
              disabled={selectedMembers.length === 0}
              className={`w-full px-4 py-2 rounded-lg transition-colors ${
                selectedMembers.length === 0
                  ? "bg-gray-400 cursor-not-allowed text-gray-600"
                  : "bg-[#0017E7] text-white hover:bg-blue-700"
              }`}
            >
              Add Members
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGroupMember;
