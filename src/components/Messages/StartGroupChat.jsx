import { X, ChevronLeft, ImagePlus, Check, CameraIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { db } from "../../firebase";
import { ref as dbRef, onValue, set, serverTimestamp } from "firebase/database";

const StartGroupChat = ({ isOpen, onClose, onChatCreated }) => {
  const [step, setStep] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupPhoto, setGroupPhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const STORAGE_BASE_URL =
    (API_BASE_URL?.replace(/\/?api\/?$/, "") || API_BASE_URL) + "/storage";
  const fileInputRef = useRef(null);
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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGroupPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
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
      const users = Array.isArray(res.data.friends) ? res.data.friends : [];
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

  const createGroupChat = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = Number(localStorage.getItem("user_id")); // Get current user ID

      // Basic validation
      if (!groupName.trim()) {
        alert("Please enter a group name");
        return;
      }

      if (selectedMembers.length < 2) {
        alert("Please select at least 2 members");
        return;
      }

      const formData = new FormData();
      formData.append("name", groupName);
      selectedMembers.forEach((member) => {
        formData.append("members[]", member.id);
      });
      if (groupPhoto) {
        formData.append("photo", groupPhoto);
      }

      const response = await axios.post(
        `${API_BASE_URL}/group-chats`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.success) {
        const group = response.data.group;
        const groupId = group.id;

        // Prepare Firebase data structure
        const groupData = {
          info: {
            groupId: groupId,
            groupName: group.name,
            createdBy: userId, // Use the current user's ID
            createdAt: Date.now() / 1000,
            photo: group.photo ? toAvatarUrl(group.photo) : null,
          },
          members: selectedMembers.reduce((acc, member) => {
            acc[member.id] = true;
            return acc;
          }, {}),
          messages: {},
        };

        // Ensure creator is included in members
        if (!groupData.members[userId]) {
          groupData.members[userId] = true;
        }

        // Save to Firebase
        await set(dbRef(db, `groups/${groupId}`), groupData);

        // Call the callback with the created group data
        onChatCreated?.({
          id: groupId,
          name: group.name,
          avatar: group.photo ? toAvatarUrl(group.photo) : null,
          isGroup: true,
          members: selectedMembers,
          time: "",
          last_message: "",
        });

        // Reset form and close modal
        resetForm();
        onClose(); // This will trigger the parent component to close the modal
      }
    } catch (error) {
      console.error("Error creating group chat:", error);
      alert("Failed to create group chat. Please try again.");
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedMembers([]);
    setGroupName("");
    setGroupPhoto(null);
    setPreviewPhoto(null);
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
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl h-[30rem] mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-5 rounded-lg border border-gray-400">
          <div className="flex items-center">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="mr-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
            )}
            <h2 className="text-xl font-bold text-gray-900">
              {step === 1 ? "Add Group Members" : "Group Details"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-7 h-7 text-gray-700" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 h-[calc(100%-80px)] overflow-y-auto relative">
          {step === 1 ? (
            <>
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
                      <div className="p-3 text-sm text-gray-500">
                        Searching...
                      </div>
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

              {selectedMembers.length > 0 && (
                <div className="mt-4 w-full absolute bottom-3 left-0 px-4">
                  <button
                    onClick={() => setStep(2)}
                    className="w-full px-6 py-3 bg-[#0017E7] text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div
                    onClick={triggerFileInput}
                    className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden"
                  >
                    {previewPhoto ? (
                      <div className="relative">
                        <img
                          src={previewPhoto}
                          alt="Group preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute flex items-center justify-center bg-black/50 gap-x-2 text-white top-0 left-0 w-full h-full">
                          <CameraIcon />
                          <h1>Upload Photo</h1>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-x-2 text-[#707070]">
                        <CameraIcon />
                        <h1>Upload Photo</h1>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Name:
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className="w-full h-14 p-3 border border-gray-500 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={createGroupChat}
                  disabled={!groupName || selectedMembers.length < 2}
                  className={`px-6 py-3 w-full rounded-lg transition-colors ${
                    !groupName || selectedMembers.length < 2
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Create
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartGroupChat;
