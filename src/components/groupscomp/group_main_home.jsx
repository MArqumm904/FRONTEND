import { useState, useEffect, useRef } from "react";
import {
  Edit3,
  MoreHorizontal,
  MapPin,
  BellDot,
  Link,
  Share2,
  Lock,
  Trash2,
  Pin,
  Link2,
  TriangleAlert,
  Ban,
} from "lucide-react";
import NavbarReplica from "../nav";
import Person1 from "../../assets/images/person-1.png";
import Share from "../../assets/images/share.png";
import PostTab from "../profilecomponents/post_tab";
import EditCover from "../groupscomp/editcoverphoto";
import EditProfile from "../groupscomp/editprofile";
import EditIntro from "../groupscomp/editintro";
import ReqMembership from "../profilecomponents/request_membership";
import InviteFriendsToGroup from "../groupscomp/invite_freinds";
import AboutTab from "../groupscomp/about_tabs";
import MediaTabPhotos from "../profilecomponents/media_tab_photos";
import MembersAndAdmins from "../groupscomp/membersandadmins";
import AboutAgencyTab from "../profilecomponents/about_agency_tab";
import Badges from "../profilecomponents/badges";
import BadgesTab from "../profilecomponents/badges_tab";
import VerifiedMembershipsTab from "../profilecomponents/verified_memberships_tab";
import AccountKeySettings from "../profilecomponents/account_key_settings";
import PrivacySettings from "../groupscomp/privacy_settings";
import LanguageSettings from "../profilecomponents/select_language";
import ManageNotification from "../groupscomp/manage_notifications";
import DeleteGroup from "../groupscomp/delete_group";
import DeactivateAccount from "../profilecomponents/deactivate_account";
import HelpCenter from "../profilecomponents/help_center";
import axios from "axios";
import Preloader from "../preloader/Preloader";
import { useParams, useLocation } from "react-router-dom";

const GroupHome = () => {
  const location = useLocation();
  const { id } = useParams();
  const groupId = id;
  const user_id = localStorage.getItem("user_id");

  const textPosts = [
    {
      id: 1,
      type: "text",
      content:
        "Just finished an amazing UI/UX project! Really excited about the results.",
      timestamp: "2024-01-15T10:30:00Z",
      likes: 25,
      comments: 5,
    },
    {
      id: 2,
      type: "text",
      content:
        "Working on some new design patterns today. The creative process never stops!",
      timestamp: "2024-01-14T14:20:00Z",
      likes: 18,
      comments: 3,
    },
  ];

  const imagePosts = [
    {
      id: 3,
      type: "image",
      content: "Check out this new design mockup I created",
      image:
        "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=500&h=400&fit=crop",
      timestamp: "2024-01-13T16:45:00Z",
      likes: 42,
      comments: 8,
    },
  ];

  const videoPosts = [
    {
      id: 4,
      type: "video",
      content: "Behind the scenes of my design process",
      video:
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnail:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=400&fit=crop",
      timestamp: "2024-01-12T09:15:00Z",
      likes: 67,
      comments: 12,
    },
  ];

  const [showeditcoverPopup, setShoweditcoverPopup] = useState(false);
  const [showeditprofilePopup, setShoweditprofilePopup] = useState(false);
  const [currentProfilePhoto, setCurrentProfilePhoto] = useState(null);
  const [showeditintroPopup, setShoweditintroPopup] = useState(false);
  const [showreqmemPopup, setShowreqmemPopup] = useState(false);
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAccountKeySettings, setShowAccountKeySettings] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  const [showManageNotification, setShowManageNotification] = useState(false);
  const [showDeletegroup, setshowDeletegroup] = useState(false);
  const [showDeactivateAccount, setShowDeactivateAccount] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [currentBannerPhoto, setCurrentBannerPhoto] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const number_of_text_posts = textPosts.length;
  const number_of_image_posts = imagePosts.length;
  const number_of_video_posts = videoPosts.length;

  const text_posts_data = textPosts;
  const image_posts_data = imagePosts;
  const video_posts_data = videoPosts;

  const [activeTab, setActiveTab] = useState("Discussion");
  const tabs = ["Discussion", "About", "Members", "Media"];

  const suggestedPeople = [
    {
      id: 1,
      name: "Arshpixels",
      role: "UI/UX Product Designer",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
    },
    {
      id: 2,
      name: "Jaiwad singh",
      role: "WebApp Developer",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop",
    },
    {
      id: 3,
      name: "Code By Rixa",
      role: "QR Developer",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop",
    },
    {
      id: 4,
      name: "Arjit Designs",
      role: "Graphic Designer",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
    },
    {
      id: 5,
      name: "NexusDesigns",
      role: "Brand Photographer",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop",
    },
  ];

  const totalPosts =
    number_of_text_posts + number_of_image_posts + number_of_video_posts;

  const iconRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [groupData, setGroupData] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingOwner, setLoadingOwner] = useState(false);
  const [owner_id, setOwner_id] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  console.log("Comparison:", String(owner_id) === String(user_id));
console.log("owner_id type:", typeof owner_id, "value:", owner_id);
console.log("user_id type:", typeof user_id, "value:", user_id);

  useEffect(() => {
    setLoadingOwner(true);
    const token = localStorage.getItem("token");
    fetch(`${import.meta.env.VITE_API_BASE_URL}/groups/owner/${groupId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setOwner_id(`${data.data}`);
        } else {
          console.log("Error fetching group Owner:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching group Owner:", error);
      })
      .finally(() => {
        setLoadingOwner(false);
      });
  }, [groupId]);

  useEffect(() => {
    const fetchGroupData = async () => {
      const userId = localStorage.getItem("user_id");
      const token = localStorage.getItem("token");

      if (!userId || !token) return;

      setLoadingGroups(true);

      try {
        if (groupId) {
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/groups/${groupId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                user_id: user_id === owner_id ? user_id : owner_id,
              },
            }
          );

          const data = await response.json();

          if (data.success && data.data) {
            const group = data.data;
            setGroupData(group);

            // Handle profile photo
            if (group.group_profile_photo) {
              const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(
                "/api",
                ""
              );
              const profilePhotoUrl = group.group_profile_photo.startsWith(
                "http"
              )
                ? group.group_profile_photo
                : `${baseUrl}/storage/${group.group_profile_photo}`;

              setCurrentProfilePhoto(profilePhotoUrl);
            }

            // Handle banner image
            if (group.group_banner_image) {
              const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(
                "/api",
                ""
              );
              const bannerPhotoUrl = group.group_banner_image.startsWith("http")
                ? group.group_banner_image
                : `${baseUrl}/storage/${group.group_banner_image}`;

              setCurrentBannerPhoto(bannerPhotoUrl);
            }
          } else {
            console.log("Error fetching group:", data.message);
          }
        } else {
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/groups`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                user_id: userId,
              },
            }
          );
          const data = await response.json();
          if (data.success && data.data && data.data.length > 0) {
            const firstGroup = data.data[0];
            setGroupData(firstGroup);

            // Handle profile photo
            if (firstGroup.group_profile_photo) {
              const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(
                "/api",
                ""
              );
              const profilePhotoUrl = firstGroup.group_profile_photo.startsWith(
                "http"
              )
                ? firstGroup.group_profile_photo
                : `${baseUrl}/storage/${firstGroup.group_profile_photo}`;

              setCurrentProfilePhoto(profilePhotoUrl);
            }

            // Handle banner image
            if (firstGroup.group_banner_image) {
              const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(
                "/api",
                ""
              );
              const bannerPhotoUrl = firstGroup.group_banner_image.startsWith(
                "http"
              )
                ? firstGroup.group_banner_image
                : `${baseUrl}/storage/${firstGroup.group_banner_image}`;

              setCurrentBannerPhoto(bannerPhotoUrl);
            }
            setGroups(data.data);
          } else {
            setGroups([]);
          }
        }
      } catch (error) {
        console.error("ERROR fetching groups : ", error);
        setGroups([]);
      } finally {
        setLoadingGroups(false);
      }
    };

    if (owner_id !== null) {
      fetchGroupData();
    }
  }, [owner_id, refreshTrigger]);

  useEffect(() => {
    // Check if both owner_id and groupData are loaded
    if (owner_id !== null && groupData !== null) {
      setIsDataLoaded(true);
    }
  }, [owner_id, groupData]);

  useEffect(() => {
    if (
      showeditcoverPopup ||
      showeditprofilePopup ||
      showeditintroPopup ||
      showreqmemPopup ||
      showAccountKeySettings ||
      showPrivacySettings ||
      showLanguageSettings ||
      showManageNotification ||
      showDeletegroup ||
      showDeactivateAccount ||
      showHelpCenter
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [
    showeditcoverPopup,
    showeditprofilePopup,
    showeditintroPopup,
    showreqmemPopup,
    showAccountKeySettings,
    showPrivacySettings,
    showLanguageSettings,
    showManageNotification,
    showDeletegroup,
    showDeactivateAccount,
    showHelpCenter,
  ]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        !event.target.closest(".profile-dropdown-menu") &&
        !event.target.closest(".profile-dropdown-toggle")
      ) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleDropdownToggle = () => {
    if (!showDropdown && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right - 256,
      });
    }
    setShowDropdown((prev) => !prev);
  };

  const handleEditIntroClose = () => {
    setShoweditintroPopup(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  if (loadingGroups) {
    return <Preloader />;
  }

  if (loadingGroups || loadingOwner || !isDataLoaded) {
    return <Preloader />;
  }

  if (!groupData) {
    return <Preloader />;
  }

  return (
    <>
      {showeditcoverPopup && (
        <EditCover
          onClose={() => setShoweditcoverPopup(false)}
          currentCoverPhoto={currentBannerPhoto}
          groupId={groupId}
          onCoverUpdate={(newBanner) => {
            setCurrentBannerPhoto(newBanner);
            setGroupData((prev) => ({
              ...prev,
              group_banner_image: newBanner,
            }));
          }}
        />
      )}
      {showeditprofilePopup && (
        <EditProfile
          onClose={() => setShoweditprofilePopup(false)}
          currentProfilePhoto={currentProfilePhoto}
          groupId={groupId}
          onProfileUpdate={(newPhoto) => {
            setCurrentProfilePhoto(newPhoto);
            setGroupData((prev) => ({
              ...prev,
              group_profile_photo: newPhoto,
            }));
          }}
        />
      )}
      {showeditintroPopup && (
        <EditIntro
          initialData={{
            name: showeditintroPopup.name,
            location: showeditintroPopup.location,
          }}
          groupId={groupId}
          onClose={handleEditIntroClose}
        />
      )}

      {showreqmemPopup && (
        <InviteFriendsToGroup onClose={() => setShowreqmemPopup(false)} />
      )}
      {showBadgesModal && <Badges onClose={() => setShowBadgesModal(false)} />}
      {showAccountKeySettings && (
        <AccountKeySettings onClose={() => setShowAccountKeySettings(false)} />
      )}
      {showPrivacySettings && (
        <PrivacySettings onClose={() => setShowPrivacySettings(false)} />
      )}
      {showLanguageSettings && (
        <LanguageSettings onClose={() => setShowLanguageSettings(false)} />
      )}
      {showManageNotification && (
        <ManageNotification onClose={() => setShowManageNotification(false)} />
      )}
      {showDeletegroup && (
        <DeleteGroup onClose={() => setshowDeletegroup(false)} />
      )}
      {showDeactivateAccount && (
        <DeactivateAccount onClose={() => setShowDeactivateAccount(false)} />
      )}
      {showHelpCenter && (
        <HelpCenter onClose={() => setShowHelpCenter(false)} />
      )}
      <NavbarReplica />
      <div className="min-h-screen bg-gray-100">
        
        <div className="max-w-[86rem] mx-auto px-0 md:px-4 py-0 md:py-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Main Profile Section */}
            <div className="col-span-1 md:col-span-8">
              <div className="bg-white rounded-lg border border-[#7c87bc] shadow-lg overflow-hidden">
                {/* Cover Photo */}
                <div className="relative h-48 bg-gradient-to-r from-gray-800 to-gray-900 overflow-hidden">
                  <img
                    src={
                      currentBannerPhoto ||
                      (groupData && groupData.group_banner_image) ||
                      "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                    }
                    alt="Group Cover"
                    className="w-full h-full object-cover"
                  />
                  {owner_id === user_id && (
                    <button
                      onClick={() => setShoweditcoverPopup(true)}
                      className="absolute top-4 right-4 border border-[#707070] bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100 transition-all"
                    >
                      <Edit3 className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
                </div>

                {/* Profile Info */}
                <div className="px-10 pb-6">
                  {/* Profile Picture */}
                  <div className="relative -mt-16 mb-4">
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden">
                      <img
                        src={
                          currentProfilePhoto ||
                          (groupData && groupData.group_profile_photo) ||
                          "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {owner_id === user_id && (
                      <button
                        onClick={() => setShoweditprofilePopup(true)}
                        className="absolute bottom-2 -right-5 bg-white border border-[#707070] p-2 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        <Edit3 className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                  </div>

                  <div className="relative mb-12 bg-white rounded-md mt-5">
                    {/* Edit Button */}
                    {owner_id === user_id && (
                      <button
                        onClick={() =>
                          setShoweditintroPopup({
                            show: true,
                            name: groupData.group_name,
                            location: groupData.location,
                          })
                        }
                        className="absolute top-10 -right-5 bg-white border border-[#707070] p-2 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        <Edit3 className="w-4 h-4 text-gray-600" />
                      </button>
                    )}

                    {/* Name and Title */}
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-3xl font-bold text-black font-sf">
                        {groupData.group_name || "Loading..."}
                      </span>
                    </div>

                    <div className="flex items-center text-[#636363] mb-2">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span className="text-lg">
                        {groupData.location || "No Location Found."}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 ">
                    {owner_id === user_id ? (
                      <button
                        onClick={() => setShowreqmemPopup(true)}
                        className=" bg-[#0017e7] text-white py-2.5 px-6 rounded-md hover:bg-[#0012b7] transition-colors  font-sf"
                      >
                        Invite Friends
                      </button>
                    ) : (
                      <button className=" bg-[#0017e7] text-white py-2.5 px-6 rounded-md hover:bg-[#0012b7] transition-colors  font-sf">
                        Join Group
                      </button>
                    )}
                    <button className="px-6 py-2.5 border border-black text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-sf font-medium">
                      Add a post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Suggested For You */}
            <div className="hidden md:block md:col-span-4">
              <div className="bg-white rounded-lg border border-[#7c87bc] shadow-lg">
                <div className="p-5 border-b border-[#7c87bc]">
                  <h2 className="text-md font-medium font-sf text-[#707070]">
                    Suggested For You
                  </h2>
                </div>

                <div className="p-5">
                  <div className="space-y-5">
                    {suggestedPeople.map((person) => (
                      <div
                        key={person.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={person.image}
                            alt={person.name}
                            className="w-14 h-14 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-medium text-gray-900 text-md font-sf">
                              {person.name}
                            </h3>
                            <p className="text-xs text-gray-500 font-sf">
                              {person.role}
                            </p>
                          </div>
                        </div>
                        <button className="text-[#0017e7] text-sm font-medium hover:text-[#0012b7] transition-colors">
                          • Connect
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs - Full Width Below Grid */}
          <div className="mt-4">
            <div className="col-span-12">
              <div className="bg-white rounded-lg border border-[#7c87bc] shadow-lg overflow-hidden">
                <div className="px-6 py-5 pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-10">
                      {tabs.map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`text-lg font-sf font-medium transition-colors relative ${
                            activeTab === tab
                              ? "text-[#0017e7] border-b-2 border-[#0017e7] pb-4"
                              : "text-gray-500 hover:text-gray-700 pb-4"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                    <div className="relative mb-3">
                      <button
                        className="profile-dropdown-toggle text-black hover:text-gray-600 transition-colors"
                        onClick={handleDropdownToggle}
                        type="button"
                        ref={iconRef}
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* DROPDOWN */}
          {showDropdown && user_id === owner_id ? (
            <div className="profile-dropdown-menu absolute right-24  -mt-8 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-40 py-2">
              <button
                className="flex items-center w-full px-4 py-2 text-black hover:bg-gray-100"
                onClick={() => {
                  setShowPrivacySettings(true);
                  setShowDropdown(false);
                }}
              >
                <Lock className="w-5 h-5 mr-3" /> Privacy Setting
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-black hover:bg-gray-100"
                onClick={() => {
                  setShowManageNotification(true);
                  setShowDropdown(false);
                }}
              >
                <BellDot className="w-5 h-5 mr-3" /> Manage Notification
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-black hover:bg-gray-100"
                onClick={() => {
                  setShowDropdown(false);
                }}
              >
                <Share2 className="w-5 h-5 mr-3" /> Share Group
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-[#ff0000] hover:bg-gray-100"
                onClick={() => {
                  setshowDeletegroup(true);
                  setShowDropdown(false);
                }}
              >
                <Trash2 className="w-5 h-5 mr-3" /> Delete Group
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-black hover:bg-gray-100"
                onClick={() => setShowDropdown(false)}
              >
                <Link className="w-5 h-5 mr-3" /> Copy Group Link
              </button>
            </div>
          ) : showDropdown && user_id !== owner_id ? (
            <div className="profile-dropdown-menu absolute right-24  -mt-8 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-40 py-2">
              <button
                className="flex items-center w-full px-4 py-2 text-black hover:bg-gray-100"
                onClick={() => {
                  setShowDropdown(false);
                }}
              >
                <Pin className="w-5 h-5 mr-3 rotate-45" /> Pin Group
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-black hover:bg-gray-100"
                onClick={() => {
                  setShowDropdown(false);
                }}
              >
                <img src={Share} className="w-6 h-5 mr-3" /> Share Group
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-[#ff0000] hover:bg-gray-100"
                onClick={() => {
                  setShowDropdown(false);
                }}
              >
                <TriangleAlert className="w-5 h-5 mr-3" /> Report Group
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-black hover:bg-gray-100"
                onClick={() => setShowDropdown(false)}
              >
                <Link2 className="w-6 h-6 mr-3 -rotate-45" /> Copy Group Link
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-black hover:bg-gray-100"
                onClick={() => setShowDropdown(false)}
              >
                <Ban className="w-5 h-5 mr-3" /> Block this Group
              </button>
            </div>
          ) : null}
          {/* Tab Content */}
          {activeTab === "Discussion" && (
            <PostTab
              number_of_text_posts={number_of_text_posts}
              number_of_image_posts={number_of_image_posts}
              number_of_video_posts={number_of_video_posts}
              text_posts_data={text_posts_data}
              image_posts_data={image_posts_data}
              video_posts_data={video_posts_data}
            />
          )}
          {activeTab === "About" && (
            <AboutTab groupId={groupId} owner_id={owner_id} />
          )}
          {activeTab === "Members" && <MembersAndAdmins />}
          {activeTab === "Media" && <MediaTabPhotos groupId={groupId} />}
        </div>
      </div>
    </>
  );
};

export default GroupHome;
