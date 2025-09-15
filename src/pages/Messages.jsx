import { useEffect, useRef, useState } from "react";
import ChatWelcome from "../components/Messages/ChatWelcome";
import ChatList from "../components/Messages/ChatList";
import StartChat from "../components/Messages/StartChat";
import StartGroupChat from "../components/Messages/StartGroupChat";
import ChatArea from "../components/Messages/ChatArea";
import Navbar from "../components/nav";
import { db } from "../firebase";
import {
  ref as dbRef,
  onValue,
  onDisconnect,
  set,
  serverTimestamp,
} from "firebase/database";
import GroupChatArea from "../components/Messages/GroupChatArea";

export default function Messages() {
  const [isStartChatOpen, setIsStartChatOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [forceScroll, setForceScroll] = useState(false);
  const chatListRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isChatCreated, setIsChatCreated] = useState(false);
  const [groups, setGroups] = useState([]);
  const [lastClearedAt, setLastClearedAt] = useState(null);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setForceScroll(true); // Trigger immediate scroll
  };

  useEffect(() => {
    if (forceScroll) {
      setForceScroll(false);
    }
  }, [forceScroll]);

  // Global presence initializer to avoid race conditions
  useEffect(() => {
    const currentUserId = Number(localStorage.getItem("user_id"));
    if (!currentUserId) return;
    const userStatusRef = dbRef(db, `status/${currentUserId}`);
    const connectedRef = dbRef(db, `.info/connected`);
    const unsubscribe = onValue(connectedRef, (snap) => {
      if (snap.val() === false) return;
      onDisconnect(userStatusRef)
        .set({ online: false, last_changed: serverTimestamp() })
        .then(() => {
          set(userStatusRef, { online: true, last_changed: serverTimestamp() });
        });
    });
    return () => {
      set(userStatusRef, { online: false, last_changed: serverTimestamp() });
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  const handleChatCreated = (chatData) => {
    setIsStartChatOpen(false);
    setSelectedChat(chatData);
    setIsChatCreated(true); // Directly set the selected chat
  };

  const handleBackToChatList = () => {
    setSelectedChat(null);
    // Add small delay to ensure ChatList is rendered before scrolling
    setTimeout(() => {
      if (chatListRef.current?.scrollToTop) {
        chatListRef.current.scrollToTop();
      }
    }, 50);
  };

  const handleClearChat = () => {
    setLastClearedAt(Date.now());
  };

  return (
    <>
      {activeTab === 0 ? (
        <StartChat
          isOpen={isStartChatOpen}
          onClose={() => setIsStartChatOpen(false)}
          onChatCreated={handleChatCreated}
        />
      ) : (
        <StartGroupChat
          isOpen={isStartChatOpen}
          onClose={() => setIsStartChatOpen(false)}
          onChatCreated={() => setIsChatCreated(true)}
        />
      )}

      <div className="w-full md:h-screen">
        <Navbar />
        <div className="flex md:h-screen md:p-10 md:gap-6">
          {/* Left Sidebar - Messages */}
          <ChatList
            ref={chatListRef}
            onStartChat={(tab) => {
              setActiveTab(tab);
              setIsStartChatOpen(true);
            }}
            onSelectChat={handleSelectChat}
            isChatSelected={!!selectedChat}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isChatCreated={isChatCreated}
            groups={groups}
            setGroups={setGroups}
            onClearedChat={lastClearedAt}
          />
          {selectedChat ? (
            selectedChat.isGroup ? (
              <GroupChatArea
                chat={selectedChat}
                onBack={handleBackToChatList}
                forceScroll={forceScroll}
                key={selectedChat.id}
                groups={groups}
                setGroups={setGroups}
              />
            ) : (
              <ChatArea
                chat={selectedChat}
                onBack={handleBackToChatList}
                forceScroll={forceScroll}
                key={selectedChat.id}
                setLastClearedAt={setLastClearedAt}
                onClearChat={handleClearChat}
              />
            )
          ) : (
            <ChatWelcome onStartChat={() => setIsStartChatOpen(true)} />
          )}
        </div>
      </div>
    </>
  );
}
