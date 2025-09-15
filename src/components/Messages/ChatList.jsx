import { ChevronLeft, Dot, Search } from "lucide-react";
import DP from "../../assets/images/diddy.jpeg";
import newchat from "../../assets/images/newchat.png";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import {
  ref as dbRef,
  query,
  limitToLast,
  onChildAdded,
  onValue,
  onDisconnect,
  set,
  serverTimestamp,
} from "firebase/database";

const ChatList = forwardRef(
  (
    {
      onSelectChat,
      onStartChat,
      isChatSelected,
      activeTab,
      setActiveTab,
      isChatCreated,
      groups,
      setGroups,
      onClearedChat,
    },
    outerRef
  ) => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSelected, setIsSelected] = useState(null);
    const firstChatRef = useRef(null);
    const navigate = useNavigate();
    const currentUserId = Number(localStorage.getItem("user_id"));
    const [lastMessages, setLastMessages] = useState({}); // { [friendId]: { content, timestamp, sender_id } }
    const listenersRef = useRef([]);
    const presenceListenersRef = useRef([]);
    const [onlineStatus, setOnlineStatus] = useState({}); // { [friendId]: boolean }
    const typingListenersRef = useRef([]);
    const [isTyping, setIsTyping] = useState({}); // { [friendId]: boolean }
    const [lastRead, setLastRead] = useState({}); // { [friendId]: unixSeconds }
    const [hasUnread, setHasUnread] = useState({}); // { [friendId]: boolean }
    // const [groups, setGroups] = useState([]);
    const [groupLastMessages, setGroupLastMessages] = useState({});
    const [groupFetched, setGroupFetched] = useState(false);

    const timeAgo = (unixSeconds) => {
      if (!unixSeconds) return "";
      const diffMs = Date.now() - Number(unixSeconds) * 1000;
      if (diffMs < 0) return "now";
      const seconds = Math.floor(diffMs / 1000);
      if (seconds < 60) return "now";
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h`;
      const days = Math.floor(hours / 24);
      return `${days}d`;
    };

    useEffect(() => {
      if (onClearedChat) {
        // Clear the lastMessages state for all conversations
        setLastMessages({});

        // Also clear the group last messages if in group tab
        if (activeTab === 1) {
          setGroupLastMessages({});
        }
      }
    }, [onClearedChat, activeTab]);

    // Re-render every minute so timeAgo updates
    const [_, setClock] = useState(0);
    useEffect(() => {
      const t = setInterval(() => setClock(Date.now()), 60000);
      return () => clearInterval(t);
    }, []);

    useEffect(() => {
      if (activeTab === 1) {
        if (groupFetched && !isChatCreated) return;
        setGroupFetched(true);
        const fetchGroups = async () => {
          try {
            setLoading(true);
            const response = await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/group-chats`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (!response.ok) {
              throw new Error("Failed to fetch groups");
            }

            const data = await response.json();

            console.log(data);

            const processed = (data?.data || []).map((group) => {
              let avatar = group.photo;
              if (avatar && !avatar.startsWith("http")) {
                const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(
                  /\/api\/?$/,
                  ""
                );
                avatar = `${baseUrl}${group.photo}`;
              }

              return {
                id: group.id,
                created_by: group.created_by,
                name: group.name,
                message: "",
                time: "",
                avatar: avatar,
                isGroup: true,
                members: group.members || [],
              };
            });

            setGroups(processed);
            setLoading(false);

            // Setup Firebase listeners for each group
            processed.forEach((group) => {
              const groupId = group.id;

              // Last message listener
              const messagesRef = dbRef(db, `groups/${groupId}/messages`);
              const q = query(messagesRef, limitToLast(1));
              const unsub = onChildAdded(q, (snapshot) => {
                const payload = snapshot.val();
                setGroupLastMessages((prev) => ({
                  ...prev,
                  [groupId]: {
                    content: payload?.text ?? "",
                    timestamp: payload?.timestamp ?? null,
                    sender_id: payload?.sender_id ?? null,
                    read_by: payload?.read_by ?? [],
                  },
                }));
              });
              listenersRef.current.push(unsub);

              // Last read listener for this group
              const readRef = dbRef(
                db,
                `lastRead/group_${groupId}/${currentUserId}`
              );
              const unsubRead = onValue(readRef, (snap) => {
                setLastRead((prev) => ({
                  ...prev,
                  [groupId]: snap.val() || 0,
                }));
              });
              typingListenersRef.current.push(unsubRead);
            });
          } catch (error) {
            console.error(error);
            setGroups([]);
            setLoading(false);
          }
        };

        fetchGroups();
      }
    }, [activeTab, currentUserId, isChatCreated]);

    useEffect(() => {
      const fetchFriends = async () => {
        try {
          setLoading(true);
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/friends?page=1`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch friends");
          }

          const data = await response.json();

          const timeOptions = ["2m", "10m", "1h", "2h", "yesterday", "2w"];
          const processed = (data?.data || []).map((friend, index) => {
            let profilePic = DP;
            if (friend.profilePic) {
              const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(
                "/api",
                ""
              );
              profilePic = friend.profilePic.startsWith("http")
                ? friend.profilePic
                : `${baseUrl}/storage/${friend.profilePic}`;
            }

            return {
              id: friend.id,
              name: friend.name,
              message: "",
              time: "",
              avatar: profilePic,
              isOnline:
                typeof friend.isOnline === "boolean"
                  ? friend.isOnline
                  : index % 2 === 0,
            };
          });

          setConversations(processed);
          setLoading(false);

          // Attach Firebase listeners for each conversation's last message
          // Cleanup existing listeners
          listenersRef.current.forEach(
            (unsub) => typeof unsub === "function" && unsub()
          );
          listenersRef.current = [];

          if (!onClearedChat) {
            processed.forEach((conv) => {
              const friendId = Number(conv.id);
              const chatId =
                currentUserId < friendId
                  ? `chat_${currentUserId}_${friendId}`
                  : `chat_${friendId}_${currentUserId}`;
              const messagesRef = dbRef(db, `chats/${chatId}/messages`);
              const q = query(messagesRef, limitToLast(1));
              const unsub = onChildAdded(q, (snapshot) => {
                const payload = snapshot.val();
                const deletedBy = payload?.deleted_by || [];
                const isDeletedByMe = deletedBy.includes(currentUserId);

                if (!isDeletedByMe) {
                  setLastMessages((prev) => ({
                    ...prev,
                    [conv.id]: {
                      content: payload?.text ?? "",
                      timestamp: payload?.timestamp ?? null,
                      sender_id: payload?.sender_id ?? null,
                    },
                  }));
                }
              });
              listenersRef.current.push(unsub);

              // Friend presence listener at /status/{friendId}
              const statusRef = dbRef(db, `status/${friendId}`);
              const unsubPresence = onValue(statusRef, (snap) => {
                const val = snap.val();
                setOnlineStatus((prev) => ({
                  ...prev,
                  [conv.id]: Boolean(val?.online),
                }));
              });
              presenceListenersRef.current.push(unsubPresence);

              // Friend typing listener per chat
              const typingRef = dbRef(db, `typing/${chatId}/${friendId}`);
              const unsubTyping = onValue(typingRef, (snap) => {
                setIsTyping((prev) => ({
                  ...prev,
                  [conv.id]: Boolean(snap.val()),
                }));
              });
              typingListenersRef.current.push(unsubTyping);

              // Last read listener for this chat
              const readRef = dbRef(db, `lastRead/${chatId}/${currentUserId}`);
              const unsubRead = onValue(readRef, (snap) => {
                setLastRead((prev) => ({
                  ...prev,
                  [friendId]: snap.val() || 0,
                }));
              });
              typingListenersRef.current.push(unsubRead);
            });
          }
        } catch (error) {
          console.error(error);
          setConversations([]);
          setLoading(false);
        }
      };

      fetchFriends();
      return () => {
        listenersRef.current.forEach(
          (unsub) => typeof unsub === "function" && unsub()
        );
        listenersRef.current = [];
        presenceListenersRef.current.forEach(
          (unsub) => typeof unsub === "function" && unsub()
        );
        presenceListenersRef.current = [];
        typingListenersRef.current.forEach(
          (unsub) => typeof unsub === "function" && unsub()
        );
        typingListenersRef.current = [];
      };
    }, [currentUserId, onClearedChat]);

    // Compute unread flags when last message or last read changes
    useEffect(() => {
      const map = {};
      conversations.forEach((c) => {
        const fid = Number(c.id);
        const last = lastMessages[fid];
        const read = lastRead[fid] || 0;
        map[fid] = Boolean(
          last &&
            last.sender_id === fid &&
            Number(last.timestamp || 0) > Number(read)
        );
      });
      groups.forEach((g) => {
        const groupId = g.id;
        const last = groupLastMessages[groupId];
        const read = lastRead[groupId] || 0;

        map[groupId] = Boolean(
          last &&
            last.sender_id !== currentUserId &&
            (!last.read_by || !last.read_by.includes(currentUserId)) &&
            Number(last.timestamp || 0) > Number(read)
        );
      });

      setHasUnread(map);
    }, [
      conversations,
      groups,
      lastMessages,
      groupLastMessages,
      lastRead,
      currentUserId,
    ]);
    // }, [conversations, lastMessages, lastRead]);

    // Set current user's presence at /status/{currentUserId}
    useEffect(() => {
      if (!currentUserId) return;
      const userStatusRef = dbRef(db, `status/${currentUserId}`);
      const connectedRef = dbRef(db, `.info/connected`);
      const unsubscribe = onValue(connectedRef, (snap) => {
        if (snap.val() === false) return;
        onDisconnect(userStatusRef)
          .set({ online: false, last_changed: serverTimestamp() })
          .then(() => {
            set(userStatusRef, {
              online: true,
              last_changed: serverTimestamp(),
            });
          });
      });

      return () => {
        set(userStatusRef, { online: false, last_changed: serverTimestamp() });
        if (typeof unsubscribe === "function") unsubscribe();
      };
    }, [currentUserId]);

    const handleChatSelect = (chat) => {
      setIsSelected(chat.id);
      onSelectChat(chat);

      if (activeTab === 0) {
        const friendId = Number(chat.id);
        const chatId =
          currentUserId < friendId
            ? `chat_${currentUserId}_${friendId}`
            : `chat_${friendId}_${currentUserId}`;

        set(
          dbRef(db, `lastRead/${chatId}/${currentUserId}`),
          Math.floor(Date.now() / 1000)
        );
      } else {
        // For groups
        set(
          dbRef(db, `lastRead/group_${chat.id}/${currentUserId}`),
          Math.floor(Date.now() / 1000)
        );
      }

      // Force ChatArea to scroll to bottom by passing a flag
      onSelectChat({ ...chat, forceScroll: true });
    };

    const handleBack = () => {
      navigate("/");
    };

    useImperativeHandle(outerRef, () => ({
      scrollToTop: () => {
        if (firstChatRef.current) {
          firstChatRef.current.scrollIntoView({ behavior: "smooth" });
        }
      },
    }));

    return (
      <div
        className={`max-md:w-full md:w-[30%] flex flex-col ${
          isChatSelected ? "max-md:hidden" : ""
        }`}
      >
        {/* Header */}
        <div className="md:bg-white md:border md:border-[#28388F] rounded-md">
          <div className="flex items-center justify-between px-4 md:py-2 max-md:border-b max-md:border-gray-400 max-md:py-3">
            <ChevronLeft onClick={handleBack} className="md:hidden w-8 h-8" />
            <h1 className="max-md:hidden text-2xl font-semibold text-gray-900">
              Messages
            </h1>
            <h1 className="md:hidden text-2xl font-semibold text-gray-900">
              Chats
            </h1>
            <button
              onClick={() => onStartChat(activeTab)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <img src={newchat} className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-2 pb-3 max-md:mt-6 max-md:px-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#343F7B]" />
              <input
                type="text"
                placeholder="Search Conversations"
                className="w-full pl-10 pr-4 py-2.5 bg-[#EFEFF3] rounded-full border-0 focus:outline-none focus:ring-1 focus:ring-[#343F7B] text-gray-700 text-sm placeholder-[#343F7B]"
              />
            </div>
          </div>
        </div>

        <div className="md:bg-white md:border md:border-[#28388F] rounded-md md:mt-2">
          <div className="flex items-center justify-start gap-x-2 px-4 md:py-2 max-md:border-b max-md:border-gray-400 max-md:py-3">
            <button
              onClick={() => setActiveTab(0)}
              className={`${
                activeTab === 0
                  ? "text-white bg-[#0017E7]"
                  : "text-gray-500 border border-[#28388F]"
              } px-5 py-1 rounded-full font-medium`}
            >
              Messages
            </button>
            <button
              onClick={() => setActiveTab(1)}
              className={`${
                activeTab === 1
                  ? "text-white bg-[#0017E7]"
                  : "text-gray-500 border border-[#28388F]"
              } px-5 py-1 rounded-full font-medium`}
            >
              Group Chat
            </button>
          </div>
        </div>
        {/* Conversations List */}
        <div
          ref={outerRef}
          className="md:bg-white md:border md:border-[#28388F] rounded-md flex-1 overflow-y-auto md:mt-2 hide-scrollbar"
        >
          {loading ? (
            <div className="p-4 text-center text-gray-600">Loading...</div>
          ) : activeTab === 0 ? (
            conversations && conversations.length > 0 ? (
              conversations.map((conversation, index) => (
                <div
                  ref={index === 0 ? firstChatRef : null}
                  key={conversation.id}
                  onClick={() => {
                    onSelectChat(conversation);
                    handleChatSelect(conversation);
                    // Mark as read immediately
                    const friendId = Number(conversation.id);
                    const chatId =
                      currentUserId < friendId
                        ? `chat_${currentUserId}_${friendId}`
                        : `chat_${friendId}_${currentUserId}`;
                    set(
                      dbRef(db, `lastRead/${chatId}/${currentUserId}`),
                      Math.floor(Date.now() / 1000)
                    );
                  }}
                  className={`flex items-center p-4 hover:bg-gray-50 ${
                    hasUnread[conversation.id]
                      ? "md:bg-green-100"
                      : isSelected === conversation.id
                      ? "md:bg-[#EAEAEA]"
                      : ""
                  } cursor-pointer transition-colors border-b border-gray-50 last:border-b-0`}
                >
                  <img
                    src={conversation.avatar || "/placeholder.svg"}
                    alt={conversation.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {conversation.name}
                      </h3>
                      {isTyping[conversation.id] ? (
                        <span className="text-xs text-green-600 animate-pulse">
                          typing...
                        </span>
                      ) : (
                        onlineStatus[conversation.id] && (
                          <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )
                      )}
                    </div>
                    <div className="flex items-center md:justify-between mt-1">
                      <p
                        className={`text-sm truncate ${
                          hasUnread[conversation.id]
                            ? "text-green-600 font-semibold"
                            : onlineStatus[conversation.id]
                            ? "text-black"
                            : "text-gray-600"
                        }`}
                      >
                        {lastMessages[conversation.id]?.content ||
                          conversation.message}
                      </p>
                      <span className="flex items-center text-sm text-gray-500">
                        {(timeAgo(lastMessages[conversation.id]?.timestamp) ||
                          conversation.time) && (
                          <>
                            <Dot className="w-3.5 h-3.5" />
                            {timeAgo(
                              lastMessages[conversation.id]?.timestamp
                            ) || conversation.time}
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No Chats</div>
            )
          ) : groups && groups.length > 0 ? (
            groups.map((group, index) => (
              <div
                ref={index === 0 ? firstChatRef : null}
                key={group.id}
                onClick={() => {
                  onSelectChat(group);
                  handleChatSelect(group);
                }}
                className={`flex items-center p-4 hover:bg-gray-50 ${
                  hasUnread[group.id]
                    ? "md:bg-green-100"
                    : isSelected === group.id
                    ? "md:bg-[#EAEAEA]"
                    : ""
                } cursor-pointer transition-colors border-b border-gray-50 last:border-b-0`}
              >
                <img
                  src={group.avatar || "/placeholder.svg"}
                  alt={group.name}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {group.name}
                    </h3>
                  </div>
                  <div className="flex items-center md:justify-between mt-1">
                    <p
                      className={`text-sm truncate ${
                        hasUnread[group.id]
                          ? "text-green-600 font-semibold"
                          : onlineStatus[group.id]
                          ? "text-black"
                          : "text-gray-600"
                      }`}
                    >
                      {groupLastMessages[group.id]?.content || group.message}
                    </p>
                    <span className="flex items-center text-sm text-gray-500">
                      {(timeAgo(groupLastMessages[group.id]?.timestamp) ||
                        group.time) && (
                        <>
                          <Dot className="w-3.5 h-3.5" />
                          {timeAgo(groupLastMessages[group.id]?.timestamp) ||
                            group.time}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No Groups</div>
          )}
        </div>
      </div>
    );
  }
);

export default ChatList;
