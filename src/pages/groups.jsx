import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Plus, Pin } from "lucide-react";
import NavbarReplica from "../components/nav";
import Groupseeall from "../components/groups_see_all";
import Preloader from "../components/preloader/Preloader";

const Groups = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSeeAll, setShowSeeAll] = useState(false);
  const [createdGroups, setCreatedGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSeeAllClick = () => {
    setShowSeeAll(true);
  };
  const handleBackToGroups = () => {
    setShowSeeAll(false);
  };

  // Static joined groups data
  const joinedGroups = [
    {
      id: 1,
      name: "Web Development",
      members: "90 members",
      postsPerDay: "50+ posts a day",
      image:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=60&h=60&fit=crop",
    },
    {
      id: 2,
      name: "Graphic Design",
      members: "120 members",
      postsPerDay: "15+ posts a day",
      image:
        "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=60&h=60&fit=crop",
    },
    {
      id: 3,
      name: "Leadership Academy",
      members: "85 members",
      postsPerDay: "5+ posts a day",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop",
    },
    {
      id: 4,
      name: "Automotive Workshop",
      members: "270 members",
      postsPerDay: "8+ posts a day",
      image:
        "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=60&h=60&fit=crop",
    },
    {
      id: 5,
      name: "Wedding Jewellery",
      members: "60 members",
      postsPerDay: "2+ posts a day",
      image:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=60&h=60&fit=crop",
    },
    {
      id: 6,
      name: "Clothing Store",
      members: "150 members",
      postsPerDay: "12+ posts a day",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=60&h=60&fit=crop",
    },
  ];

  // Fetch created groups data from API
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");

    if (!userId || !token) return;

    setLoading(true);

    fetch(`${import.meta.env.VITE_API_BASE_URL}/groups`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        user_id: userId,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const groups = data.data;

          // Process groups and handle images
          const processedGroups = groups.map((group) => {
            let processedGroup = { ...group };

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

              processedGroup.image = profilePhotoUrl;
            } else {
              // Default image if no profile photo
              processedGroup.image =
                "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png";
            }

            // Format followers count
            processedGroup.followers = `${group.members_count || 0} followers`;

            return processedGroup;
          });

          setCreatedGroups(processedGroups);
        } else {
          console.log("Error fetching groups:", data.message);
          setCreatedGroups([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching groups:", error);
        setCreatedGroups([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const relatedGroups = [
    {
      id: 1,
      name: "Frontend...",
      followers: "30k followers",
      image:
        "https://images.pexels.com/photos/4744755/pexels-photo-4744755.jpeg?_gl=1*p850m*_ga*MzkyNzI2MjYwLjE3NDY2MzYwNzY.*_ga_8JE65Q40S6*czE3NTI2MDExOTEkbzE2JGcxJHQxNzUyNjAxMjAyJGo0OSRsMCRoMA..",
      color: "bg-red-500",
    },
    {
      id: 2,
      name: "Web Creators",
      followers: "40k followers",
      image:
        "https://images.pexels.com/photos/258174/pexels-photo-258174.jpeg?_gl=1*1ixiuno*_ga*MzkyNzI2MjYwLjE3NDY2MzYwNzY.*_ga_8JE65Q40S6*czE3NTI2MDExOTEkbzE2JGcxJHQxNzUyNjAxMjI1JGoyNiRsMCRoMA..",
      color: "bg-purple-500",
    },
    {
      id: 3,
      name: "CodeCraf...",
      followers: "18k followers",
      image:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=40&h=40&fit=crop",
      color: "bg-green-500",
    },
  ];

  const onBackToHome = () => {
    navigate("/");
  };

  const filteredGroups = joinedGroups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Preloader />;
  }

  return (
    <>
      {/* Navbar Placeholder */}
      <NavbarReplica />
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-[86rem] mx-auto px-0 md:px-4 py-0 md:py-4">
          {showSeeAll ? (
            <Groupseeall onBack={handleBackToGroups} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Left Sidebar */}
              <div className="hidden md:block md:col-span-3">
                {/* Groups Section */}
                <div className="bg-white rounded-md border border-[#7c87bc] p-4 mb-4 shadow-lg">
                  <h2 className="text- text-xl font-semibold text-black mb-5 mt-1 font-sf">
                    Groups
                  </h2>
                  <div className="relative">
                    <Search
                      size={20}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2  text-[#2F3C80]"
                    />
                    <input
                      type="text"
                      placeholder="Search Groups"
                      className="w-full bg-[#F5F5FA] text-[#2F3C80] font-medium placeholder-[#2F3C80] rounded-full pl-12 pr-4 py-4 text-sm outline-none"
                    />
                  </div>
                </div>

                {/* Created Groups */}
                <div className="bg-white rounded-md border border-[#7c87bc] mb-4 shadow-lg">
                  <h2 className="text-lg font-semibold text-black px-5 pt-5 font-sf">
                    Created Groups
                  </h2>
                  <div className="border-t border-[#C9D0FF] mt-3" />
                  {/* Full-width line, no padding */}
                  {createdGroups.length > 0 ? (
                    <div>
                      {createdGroups.map((group, idx) => (
                        <div
                          key={group.id}
                          className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                            idx !== createdGroups.length - 1 ? "border-b border-[#E5E7EB]" : ""
                          }`}
                          style={{margin: 0}}
                          onClick={() =>
                            // navigate(`/group_main_home/${group.group_created_by}`, { state: { groupId: group.id } })
                            navigate(`/group_main_home/1`)
                          }
                        >
                          <img
                            src={group.image}
                            alt={group.group_name}
                            className="w-14 h-14 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 font-sf">
                              {group.group_name}
                            </h3>
                            <p className="text-xs text-gray-500 font-sf">
                              {group.followers}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-5">
                      <p className="text-sm text-gray-500 font-sf">
                        No groups created yet
                      </p>
                    </div>
                  )}
                </div>
                {/* Related Groups */}
                <div className="bg-white rounded-md border border-[#7c87bc] mb-4 shadow-lg">
                  {/* header */}
                  <div className="flex items-center justify-between p-4 border-b border-[#7c87bc]">
                    <h2 className="text-lg font-sf font-semibold text-gray-900">
                      Related Groups
                    </h2>
                    <button
                      onClick={handleSeeAllClick}
                      className="text-[#0017e7] text-sm font-medium hover:underline"
                    >
                      See All
                    </button>
                  </div>

                  {/* list */}
                  {relatedGroups.map((group) => (
                    <div
                      key={group.id}
                      className="flex items-center justify-between px-4 py-4"
                    >
                      {/* avatar + title */}
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-full ring-1 ring-gray-300 overflow-hidden flex-shrink-0">
                          <img
                            src={group.image}
                            alt={group.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div>
                          <h3 className="font-medium text-gray-900 text-base leading-tight">
                            {group.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {group.followers}
                          </p>
                        </div>
                      </div>

                      {/* bullet ● + Follow */}
                      <button className="flex items-center space-x-2 group">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2457ff]"></span>
                        <span className="text-[#0017e7] text-sm font-medium group-hover:underline">
                          Follow
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Content */}
              <div className="col-span-1 md:col-span-9">
                <div className="bg-white rounded-lg border border-[#7c87bc] shadow-lg p-5">
                  {/* Header */}
                  <div className="flex items-center mb-5 mt-2">
                    <button
                      onClick={onBackToHome}
                      className="mr-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-sf font-semibold text-gray-900">
                      Joined Groups
                    </h1>
                  </div>
                  {/* Search Bar */}
                  <div className="flex-1 mb-3 relative">
                    <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#343f7b] md:block hidden" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search Groups"
                      className="w-full bg-[#efeff3] font-sf rounded-full md:pl-14 pl-4 pr-4 py-2 md:py-4 text-[#343f7b] placeholder:font-semibold placeholder-[#343f7b] outline-none"
                    />
                  </div>
                  <div className="border-t border-gray-200 my-5"></div>

                  {/* Groups Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredGroups.map((group) => (
                      <div
                        key={group.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-5"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-14 h-14 rounded-lg flex items-center justify-center`}
                            >
                              <img
                                src={group.image}
                                alt={group.name}
                                className="w-14 h-14 rounded-full object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-sm">
                                {group.name}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {group.members} | {group.postsPerDay}
                              </p>
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600 relative w-6 h-6 mt-2 flex items-center justify-center border border-gray-400 rounded-full">
                            <Pin className="w-4 h-4 rotate-45" />
                          </button>
                        </div>

                        <button
                          onClick={() =>
                            navigate("/group-home", {
                              state: { groupId: group.id },
                            })
                          }
                          className="w-full font-sf bg-[#0017e7] text-white py-2 mt-2 rounded-md hover:bg-[#0012b7] transition-colors text-sm"
                        >
                          View Group
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Show message if no groups found */}
                  {filteredGroups.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        No groups found matching your search.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Groups;
