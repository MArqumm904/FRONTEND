import { useRef, useState, useEffect } from "react";
import {
  Search,
  User,
  Moon,
  LogOut,
  Globe,
  Shield,
  UserCog,
} from "lucide-react";
import Logo from "../assets/images/logo.jpg";
import Homeicon from "../assets/images/home.png";
import Marketplace from "../assets/images/market.png";
import Hand from "../assets/images/hand.png";
import Upload from "../assets/images/upload.png";
import Message from "../assets/images/message.png";
import Groups from "../assets/images/groups.png";
import Bellicon from "../assets/images/bellicon.png";
import AddFriends from "./addfriends";
import { Link, useNavigate } from "react-router-dom";
import Person1 from "../assets/images/person-1.png";
import axios from "axios";
import PrivacySettings from "./profilecomponents/privacy_settings";
import LanguageSettings from "./profilecomponents/select_language";

export default function Navbar({ onLatestDataFetched }) {
  const navigate = useNavigate();
  const [showaddfriendsPopup, setShowaddfriendsPopup] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  const [latestPage, setLatestPage] = useState(null);
  const [latestGroup, setLatestGroup] = useState(null);

  const ToProfile = () => {
    navigate(`/profile/${localStorage.getItem("user_id")}`);
  };

  const onBackToHome = () => {
    navigate("/");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      window.location.href = `/browse?q=${encodeURIComponent(
        inputValue.trim()
      )}`;
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_email");
      navigate("/login");
    } catch (e) {
      alert("Logout failed. Please try again.");
    }
  };

  const profileFix = (url) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL.replace("/api", "");
    return `${baseUrl}/storage/${url}`;
  };

  useEffect(() => {
    if (showaddfriendsPopup || showLanguageSettings) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    function handleClickOutside(event) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
      }
    }
    if (showProfileDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showaddfriendsPopup, showLanguageSettings, showProfileDropdown]);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    fetch(`${import.meta.env.VITE_API_BASE_URL}/user/profile/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
        setLatestPage(data.latest_page);
        setLatestGroup(data.latest_group);

        // 👇 Pass both values upward together
        if (onLatestDataFetched)
          onLatestDataFetched({
            latest_page: data.latest_page,
            latest_group: data.latest_group,
          });
      })
      .catch(() => {
        setLatestPage(null);
        setLatestGroup(null);
        if (onLatestDataFetched)
          onLatestDataFetched({ latest_page: null, latest_group: null });
      });
  }, []);

  console.log("userData", userData);
  return (
    <>
      {showaddfriendsPopup && (
        <AddFriends onClose={() => setShowaddfriendsPopup(false)} />
      )}
      {showPrivacySettings && (
        <PrivacySettings onClose={() => setShowPrivacySettings(false)} />
      )}
      {showLanguageSettings && (
        <LanguageSettings onClose={() => setShowLanguageSettings(false)} />
      )}
      {/* Desktop/Tablet Navbar */}
      <div className="w-full bg-gray-50 border-b border-gray-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between relative">
            {/* Left Section - Logo and Search */}
            <div className="flex items-center space-x-6">
              {/* Logo - Multi-colored diamond shape */}
              <div className="flex items-center">
                <div className="w-10 h-10">
                  <img
                    src={Logo}
                    alt="Custom Icon"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <div className="flex items-center bg-[#efeff3] rounded-full px-4 py-3 w-72">
                  <Search className="w-5 h-5 text-[#333f7d] mr-3" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="bg-transparent outline-none text-[#333f7d] placeholder-[#333f7d] text-sm w-full"
                  />
                </div>
              </div>
            </div>

            {/* Center Section - Navigation Icons */}
            <div className="flex items-center space-x-12 absolute left-1/2 transform -translate-x-1/2">
              {/* Home Icon - Active */}
              <div className="flex flex-col items-center cursor-pointer relative">
                <img
                  src={Homeicon}
                  onClick={onBackToHome}
                  alt="Custom Icon"
                  className="w-9 h-full object-cover"
                />
                <div className="absolute -bottom-6 w-12 h-[3px] bg-[#0017e7] rounded-full"></div>
              </div>

              {/* Users Icon */}
              <div className="flex flex-col items-center cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition-colors">
                <img
                  src={Marketplace}
                  alt="Custom Icon"
                  className="w-9 h-full object-cover"
                />
              </div>

              {/* Hand Heart Icon */}
              <div className="flex flex-col items-center cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition-colors">
                <img
                  src={Hand}
                  alt="Custom Icon"
                  className="w-9 h-full object-cover"
                />
              </div>
            </div>

            {/* Right Section - Add Friends Button and Profile */}
            <div
              className="flex items-center space-x-4"
              ref={profileDropdownRef}
            >
              {/* Add Friends Button */}
              <button
                onClick={() => setShowaddfriendsPopup(true)}
                className="bg-[#efeff3] border border-[#333f7d] rounded-full px-6 py-3 text-[#333f7d] text-sm font-medium hover:bg-[#e5e5e9] transition-colors shadow-sm"
              >
                Add Friends
              </button>
              {/* Profile Icon */}
              <div
                onClick={() => setShowProfileDropdown((prev) => !prev)}
                className="relative"
                style={{ display: "flex", alignItems: "center" }}
              >
                <div className="w-12 h-12 bg-[#e4e4e4] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e4e4e4] transition-colors overflow-hidden">
                  <img
                    src={
                      userData ? profileFix(userData.profile.profile_photo) : ""
                    }
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                {/* Up Arrow Icon */}
                <span className="absolute -bottom-1 -right-3 -translate-x-1/2 bg-white rounded-full p-0 flex items-center justify-center  cursor-pointer">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{
                      transition: "transform 0.2s",
                      transform: showProfileDropdown
                        ? "rotate(180deg)"
                        : "none",
                    }}
                  >
                    <path
                      d="M8 14l4-4 4 4"
                      stroke="#222"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {/* Dropdown Menu */}
                {showProfileDropdown && (
                  <div
                    className="absolute right-0 top-14 w-80 bg-white rounded-md shadow-2xl border border-[#0017e7] z-50 animate-fade-in"
                    style={{ boxShadow: "0 2px 24px 0 rgba(0,0,0,0.10)" }}
                  >
                    <div
                      className="flex flex-col items-start p-5 border border-[#0017e7] rounded-md m-2 mb-0 bg-white"
                      style={{ width: "calc(100% - 16px)" }}
                    >
                      <div className="flex items-center w-full">
                        <img
                          src={
                            userData
                              ? profileFix(userData.profile.profile_photo)
                              : ""
                          }
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover mr-3"
                        />
                        <div>
                          <div className="font-bold text-[17px] leading-tight text-[#222]">
                            {userData.user.name}
                          </div>
                          <div className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                            <span>UI/UX Designer</span>
                            <span className="text-xs">•</span>
                            <span>{userData && userData.profile.location}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={ToProfile}
                        className="mt-4 w-full px-4 py-2 bg-[#0017e7] text-white rounded font-medium text-sm shadow-none border border-[#0017e7] hover:bg-[#0017e7] transition-colors"
                        style={{ height: "36px" }}
                      >
                        View Your Profile
                      </button>
                    </div>
                    <div className="flex flex-col gap-1 px-0 py-4">
                      <button
                        onClick={() => setShowPrivacySettings(true)}
                        className="flex items-center gap-3 text-[#222] py-2 px-6 bg-transparent hover:bg-gray-100 rounded-none text-[17px] font-normal"
                      >
                        <UserCog className="w-6 h-6 text-[#222]" />
                        <span className="flex-1 text-left">
                          Privacy Setting
                        </span>
                      </button>
                      <button
                        onClick={() => setShowLanguageSettings(true)}
                        className="flex items-center gap-3 text-[#222] py-2 px-6 bg-transparent hover:bg-gray-100 rounded-none text-[17px] font-normal"
                      >
                        <Globe className="w-6 h-6 text-[#222]" />
                        <span className="flex-1 text-left">Language</span>
                      </button>
                      <button className="flex items-center gap-3 text-[#222] py-2 px-6 bg-transparent hover:bg-gray-100 rounded-none text-[17px] font-normal">
                        <Shield className="w-6 h-6 text-[#222]" />
                        <span className="flex-1 text-left">Premium</span>
                      </button>
                      <div
                        className="flex items-center gap-3 text-[#222] py-2 px-6 bg-transparent hover:bg-gray-100 rounded-none text-[17px] font-normal"
                        // Prevent dropdown from closing when clicking on the dark mode row
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Moon className="w-6 h-6 text-[#222]" />
                        <span className="flex-1 text-left">Dark Mode</span>
                        {/* iOS style toggle - now switchable and doesn't close dropdown */}
                        <label
                          className="relative inline-flex items-center cursor-pointer ml-2"
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isDarkMode}
                            onChange={() => setIsDarkMode((prev) => !prev)}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-6  border border-gray-400 bg-gray-200 rounded-full peer peer-checked:bg-[#0019e9] transition-colors"></div>
                          <div
                            className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full transition-all shadow"
                            style={{
                              background: isDarkMode ? "white" : "blue",
                              border: "1px solid #ccc",
                              transform: isDarkMode
                                ? "translateX(16px)"
                                : "translateX(0)",
                              transition: "transform 0.2s, background 0.2s",
                            }}
                          ></div>
                        </label>
                      </div>
                      <button
                        className="flex items-center gap-3 text-[#222] py-2 px-6 bg-transparent hover:bg-gray-100 rounded-none text-[17px] font-normal"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-6 h-6 text-[#222]" />
                        <span className="flex-1 text-left">Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="w-full bg-white border-b border-gray-200 md:hidden">
        <div className="px-4 py-3">
          {/* First Row - Logo, Profile, Search, Menu */}
          <div className="flex items-center justify-between mb-4">
            {/* Logo/Text */}
            <div className="flex items-center">
              <h1 className="text-green-600 font-bold text-xl">AHMEED</h1>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-2">
              {/* Profile Icon */}
              <div className="w-7 h-7 bg-[#e4e4e4] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e4e4e4] transition-colors relative overflow-hidden">
                <img
                  src={Person1}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
                {/* Up Arrow Icon */}
                <span className="absolute bottom-0 right-0 bg-white rounded-full p-0.5 shadow flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M8 14l4-4 4 4"
                      stroke="#222"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>

              {/* Search Icon */}
              <div className="w-8 h-8 flex items-center justify-center cursor-pointer">
                <Search className="w-6 h-6 text-gray-600" />
              </div>

              {/* Menu Icon */}
              <div className="w-8 h-8 flex items-center justify-center cursor-pointer">
                <div className="flex flex-col space-y-1">
                  <div className="w-4 h-0.5 bg-gray-600 rounded"></div>
                  <div className="w-3 h-0.5 bg-gray-600 rounded"></div>
                  <div className="w-4 h-0.5 bg-gray-600 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row - Plus, Messages, Persons, Notification */}
          <div className="flex items-center justify-between px-2 mt-6">
            {/* Plus Icon */}
            <div className="flex items-center justify-center cursor-pointer">
              <img src={Upload} className="w-7 h-7 object-contain" />
            </div>

            {/* Messages Icon */}
            <Link
              to="/messages"
              className="flex items-center justify-center cursor-pointer relative"
            >
              <img src={Message} className="w-7 h-7 object-contain" />
              <div className="absolute -top-1 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">2</span>
              </div>
            </Link>

            {/* Persons Icon */}
            <div className="w-10 h-10 flex items-center justify-center cursor-pointer relative">
              <img src={Groups} className="w-8 h-8 object-contain" />
              <div className="absolute top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">2</span>
              </div>
            </div>

            {/* Notification Icon */}
            <div className="w-10 h-10 flex items-center justify-center cursor-pointer relative">
              <img src={Bellicon} className="w-7 h-7 object-contain" />
              <div className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
        <div className="flex items-center justify-around py-3">
          {/* Home Icon - Active */}
          <div className="flex flex-col items-center cursor-pointer p-2 relative">
            <img src={Homeicon} alt="Home" className="w-7 h-7 object-cover" />
            <div className="absolute top-10 w-6 h-[2px] bg-[#0017e7] rounded-full"></div>
          </div>

          {/* Marketplace Icon */}
          <div className="flex flex-col items-center cursor-pointer p-2">
            <img
              src={Marketplace}
              alt="Marketplace"
              className="w-8 h-8 object-cover"
            />
          </div>

          {/* Settings Icon */}
          <div className="flex flex-col items-center cursor-pointer p-2">
            {/* <Settings className="w-7 h-7 text-gray-600" /> */}
            <img src={Hand} alt="Settings" className="w-8 h-8 object-cover" />
          </div>
        </div>
      </div>
    </>
  );
}
