import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Message from "../assets/images/message.png";
import Persons from "../assets/images/persons.png";
import Bellicon from "../assets/images/bellicon.png";
import Videoicon from "../assets/images/videoicon.png";
import Upload from "../assets/images/upload.png";
import Saved from "../assets/images/saved.png";
import PostCreatePoll from "../components/createpost_poll";
import Groups from "../assets/images/groups.png";
import Flag from "../assets/images/flag.png";
import Behance from "../assets/images/behance.jpg";
import Fb from "../assets/images/fb.png";
import Fiverr from "../assets/images/fiverr.jpg";
import Yahoo from "../assets/images/yahoo.jpg";
import { CirclePlus } from "lucide-react";
import { db } from "../firebase";
import {
  ref as dbRef,
  query,
  limitToLast,
  onChildAdded,
  onValue,
  serverTimestamp,
  set,
} from "firebase/database";
import PostCreate from "../components/createpost_text";
import GroupCreate from "../components/groupscomp/create_group_modal";
import PageCreate from "../components/groupscomp/create_page_modal";

const SidebarMenu = () => {
  const navigate = useNavigate();
  const [showPostCreatePopup, setShowPostCreatePopup] = useState(false);
  const [showGroupCreatePopup, setShowGroupCreatePopup] = useState(false);
  const [showPageCreatePopup, setShowPageCreatePopup] = useState(false);
  const [showPostPollPopup, setShowPostPollPopup] = useState(false);
  const [unreadPeersCount, setUnreadPeersCount] = useState(0);
  const [friends, setFriends] = useState([]);
  const currentUserId = Number(localStorage.getItem("user_id"));
  const messageListenersRef = useState([])[0];
  const readListenersRef = useState([])[0];

  const onBackToHome = () => {
    navigate("/friends");
  };
  const Gotonoti = () => {
    navigate("/notifications");
  };
  const Gotosavedposts = () => {
    navigate("/saved");
  };
  const Gotogroups = () => {
    navigate("/groups");
  };
  const goToMessages = () => {
    navigate("/messages");
  };
  const Gotopages = () => {
    navigate("/pages");
  };
  const GotoReels = () => {
    navigate("/reels");
  };
  const handleGroupCreate = () => {
    setShowGroupCreatePopup(true);
  };
  const handlePageCreate = () => {
    setShowPageCreatePopup(true);
  };

  useEffect(() => {
    if (showPostCreatePopup || showGroupCreatePopup || showPageCreatePopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showPostCreatePopup, showGroupCreatePopup, showPageCreatePopup]);

  // Fetch friends for chat IDs
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/friends?page=1`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await res.json();
        const list = (data?.data || []).map((f) => ({
          id: Number(f.id),
          name: f.name,
        }));
        setFriends(list);
      } catch (e) {
        setFriends([]);
      }
    };
    fetchFriends();
    return () => {
      // cleanup listeners when unmount
      messageListenersRef.forEach((u) => typeof u === "function" && u());
      readListenersRef.forEach((u) => typeof u === "function" && u());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Attach realtime last message and lastRead listeners
  useEffect(() => {
    if (!currentUserId || friends.length === 0) return;

    // Clear previous listeners
    messageListenersRef.forEach((u) => typeof u === "function" && u());
    readListenersRef.forEach((u) => typeof u === "function" && u());
    messageListenersRef.length = 0;
    readListenersRef.length = 0;

    const lastMessageByFriend = {};
    const lastReadByFriend = {};

    const recompute = () => {
      let count = 0;
      friends.forEach((f) => {
        const last = lastMessageByFriend[f.id];
        const lastRead = lastReadByFriend[f.id] || 0;
        if (
          last &&
          last.sender_id === f.id &&
          Number(last.timestamp || 0) > Number(lastRead)
        ) {
          count += 1;
        }
      });
      setUnreadPeersCount(count);
    };

    friends.forEach((f) => {
      const friendId = Number(f.id);
      const chatId =
        currentUserId < friendId
          ? `chat_${currentUserId}_${friendId}`
          : `chat_${friendId}_${currentUserId}`;

      // Last message listener
      const messagesRef = dbRef(db, `chats/${chatId}/messages`);
      const q = query(messagesRef, limitToLast(1));
      const unsubMsg = onChildAdded(q, (snap) => {
        const val = snap.val() || {};
        lastMessageByFriend[friendId] = val;
        recompute();
      });
      messageListenersRef.push(unsubMsg);

      // Last read listener
      const readRef = dbRef(db, `lastRead/${chatId}/${currentUserId}`);
      const unsubRead = onValue(readRef, (snap) => {
        lastReadByFriend[friendId] = snap.val() || 0;
        recompute();
      });
      readListenersRef.push(unsubRead);
    });
  }, [friends, currentUserId]);
  const menuItems = [
    {
      icon: Message,
      label: "Messages",
      count: unreadPeersCount,
      bgColor: "bg-[#ff0000]",
      onClick: goToMessages,
    },
    {
      icon: Persons,
      label: "Friends",
      count: 5,
      bgColor: "bg-[#ff0000]",
      onClick: onBackToHome,
    },
    {
      icon: Bellicon,
      label: "Notifications",
      count: 3,
      bgColor: "bg-[#ff0000]",
      onClick: Gotonoti,
    },
    {
      icon: Videoicon,
      label: "Video/Reels",
      bgColor: "bg-[#ff0000]",
      onClick: GotoReels,
    },
    {
      icon: Upload,
      label: "Create Post",
      bgColor: "bg-[#ff0000]",
      onClick: () => setShowPostCreatePopup(true),
    },
    {
      icon: Saved,
      label: "Saved",
      bgColor: "bg-[#ff0000]",
      onClick: Gotosavedposts,
    },
    {
      icon: Groups,
      label: "Groups",
      bgColor: "bg-[#ff0000]",
      onClick: Gotogroups,
    },
    {
      icon: Flag,
      label: "Pages",
      bgColor: "bg-[#ff0000]",
      onClick: Gotopages,
    },
  ];

  const handleClosePollPopup = () => {
    setShowPostPollPopup(false);
    setShowPostCreatePopup(false);
  };

  return (
    <div className="min-h-screen ">
      {showPostCreatePopup && (
        <PostCreate
          onClose={() => setShowPostCreatePopup(false)}
          onOpenPoll={() => setShowPostPollPopup(true)}
        />
      )}
      {showPostPollPopup && <PostCreatePoll onClose={handleClosePollPopup} />}
      {showGroupCreatePopup && (
        <GroupCreate
          isOpen={showGroupCreatePopup}
          onClose={() => setShowGroupCreatePopup(false)}
        />
      )}
      {showPageCreatePopup && (
        <PageCreate
          isOpen={showPageCreatePopup}
          onClose={() => setShowPageCreatePopup(false)}
        />
      )}
      {/* Main Menu */}
      <div className="bg-white rounded-lg shadow-sm border border-[#6974b1] p-2 mb-4">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={index}
              className="flex items-center p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
              onClick={item.onClick}
            >
              <div className="relative mr-3">
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-7 h-7 object-contain"
                />
                {item.count > 0 && (
                  <div
                    className={`absolute -top-2 -right-2 w-5 h-5 ${item.bgColor} rounded-full flex items-center justify-center`}
                  >
                    <span className="text-white text-xs font-bold">
                      {item.count}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-gray-700 font-medium">{item.label}</span>
            </div>
          );
        })}
      </div>

      {/* Create Group Button */}
      <div className="bg-white rounded-lg shadow-sm border border-[#6974b1] p-2 mb-3">
        <div
          className="flex items-center p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
          onClick={handleGroupCreate}
        >
          <div className="mr-3">
            <CirclePlus className="font-sf w-7 h-7 text-[#0017e7]" />
          </div>
          <span className="text-gray-700 font-sf font-medium">
            Create Group
          </span>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-[#6974b1] p-2 mb-3">
        <div
          className="flex items-center p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
          onClick={handlePageCreate}
        >
          <div className="mr-3">
            <CirclePlus className="font-sf w-7 h-7 text-[#0017e7]" />
          </div>
          <span className="text-gray-700 font-sf font-medium">
            Create pages
          </span>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-[#6974b1] p-4">
        <h3 className="font-sf text-gray-500 font-medium text-sm uppercase tracking-wide mb-4">
          JOINED GROUPS
        </h3>

        <div className="space-y-3">
          <div className="flex items-center hover:bg-gray-50 cursor-pointer p-2 rounded-lg transition-colors">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
              <img
                src={Behance}
                className="w-10 h-10 rounded-lg object-contain"
              />
            </div>
            <span className="text-gray-900 font-medium font-sf">
              Behance Communit..
            </span>
          </div>

          <div className="flex items-center hover:bg-gray-50 cursor-pointer p-2 rounded-lg transition-colors">
            <div className="w-10 h-10 bg-[#1977f3] rounded-lg flex items-center justify-center mr-3">
              {/* <span className="text-white font-bold text-lg">f</span> */}
              <img src={Fb} className="w-10 h-10 rounded-lg object-contain" />
            </div>
            <span className="text-gray-900 font-medium font-sf">
              Facebook Communi..
            </span>
          </div>

          <div className="flex items-center hover:bg-gray-50 cursor-pointer p-2 rounded-lg transition-colors">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
              <img
                src={Fiverr}
                className="w-10 h-10 rounded-lg object-contain"
              />
            </div>
            <span className="text-gray-900 font-medium font-sf">
              Fiver Community
            </span>
          </div>

          <div className="flex items-center hover:bg-gray-50 cursor-pointer p-2 rounded-lg transition-colors">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
              <img
                src={Yahoo}
                className="w-10 h-10 rounded-lg object-contain"
              />
            </div>
            <span className="text-gray-900 font-medium font-sf">
              Yahoo Community
            </span>
          </div>
        </div>

        <div className="ms-2 pt-3">
          <button className="text-gray-500 hover:text-gray-700 font-medium font-sf">
            See More
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;
