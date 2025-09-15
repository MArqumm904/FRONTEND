import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Plus, Pin } from "lucide-react";
import NavbarReplica from "../components/nav";
import Groupseeall from "../components/groups_see_all";
import axios from "axios";

const Pages = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [createdPages, setCreatedPages] = useState([]);
  const pages = [
    {
      id: 1,
      name: "Leadership Academy",
      followers: "4K followers",
      image: "/api/placeholder/60/60",
      coverImage:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=120&fit=crop",
      notification: "Get a Notification Scholarship",
    },
    {
      id: 2,
      name: "Automotive Workshop",
      followers: "27K followers",
      image: "/api/placeholder/60/60",
      coverImage:
        "https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=300&h=120&fit=crop",
      logo: "CARSERVICE tuning & repair",
    },
    {
      id: 3,
      name: "Wedding Jewellery",
      followers: "12K followers",
      image: "/api/placeholder/60/60",
      coverImage:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=120&fit=crop",
      collection: "NEW MUGHAL COLLECTIONS",
    },
    {
      id: 4,
      name: "Clothing Store",
      followers: "14K followers",
      image: "/api/placeholder/60/60",
      coverImage:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=120&fit=crop",
      collection: "SUMMER SEASON Collections",
    },
  ];
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

  // const createdGroups = [
  //   {
  //     id: 1,
  //     name: "Pixel Code",
  //     followers: "20k followers",
  //     image:
  //       "https://images.pexels.com/photos/11035482/pexels-photo-11035482.jpeg?_gl=1*1j3u38l*_ga*MzkyNzI2MjYwLjE3NDY2MzYwNzY.*_ga_8JE65Q40S6*czE3NTI2MDExOTEkbzE2JGcxJHQxNzUyNjAxMjcyJGo0MSRsMCRoMA..",
  //     color: "bg-blue-600",
  //   },
  // ];

  console.log("createdPages",createdPages);

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

  const handleRedirect = () => {
    navigate("/pageprofile");
  };

  const filteredGroups = joinedGroups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchCreatedPages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/pages`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data;

        console.log("response", data);

        if (data.success) {
          console.log("data", data.data);

          const baseUrl = import.meta.env.VITE_API_BASE_URL.replace("/api", "");
          const pagesWithPhotos = data.data.map((page) => ({
            ...page,
            page_profile_photo: page.page_profile_photo
              ? page.page_profile_photo.startsWith("http")
                ? page.page_profile_photo
                : `${baseUrl}/storage/${page.page_profile_photo}`
              : null,
            page_cover_photo: page.page_cover_photo
              ? page.page_cover_photo.startsWith("http")
                ? page.page_cover_photo
                : `${baseUrl}/storage/${page.page_cover_photo}`
              : null,
          }));

          console.log("pagesWithPhotos", pagesWithPhotos);
          
          setCreatedPages(pagesWithPhotos);
        }
      } catch (error) {
        console.log("Faild to fetch Pages", error);
      }
    };

    fetchCreatedPages();
  }, []);

  const handlePageClick = (id) => {
    navigate(`/pageprofile/${id}`);
  }

  return (
    <>
      {/* Navbar Placeholder */}
      <NavbarReplica />
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-[86rem] mx-auto px-0 md:px-4 py-0 md:py-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left Sidebar */}
            <div className="hidden md:block md:col-span-3">
              {/* Groups Section */}
              <div className="bg-white rounded-md border border-[#7c87bc] p-4 mb-4 shadow-lg">
                <h2 className="text- text-xl font-semibold text-black mb-5 mt-1 font-sf">
                  Pages
                </h2>
                <div className="relative">
                  <Search
                    size={20}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2  text-[#2F3C80]"
                  />
                  <input
                    type="text"
                    placeholder="Search Pages"
                    className="w-full bg-[#F5F5FA] text-[#2F3C80] font-medium placeholder-[#2F3C80] rounded-full pl-12 pr-4 py-4 text-sm outline-none"
                  />
                </div>
              </div>

              {/* Created Groups */}
              <div className="bg-white rounded-md border border-[#7c87bc] mb-4 shadow-lg">
                <h2 className="text-lg font-semibold text-black px-5 pt-5 font-sf">
                  Created Pages
                </h2>
                <div className="border-t border-[#C9D0FF] mt-3" />{" "}
                {/* Full-width line, no padding */}
                {createdPages.map((page) => (
                  <div
                    key={page.id}
                    className="flex items-center gap-3 px-4 py-5 cursor-pointer"
                    onClick={() => handlePageClick(page.id , page.owner_id)}
                  >
                    <img
                      src={page.page_profile_photo}
                      alt={page.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 font-sf">
                        {page.page_name}
                      </h3>
                      <p className="text-xs text-gray-500 font-sf">
                        {page.followers || "50k followers"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Related Groups */}
              <div className="bg-white rounded-md border border-[#7c87bc] mb-4 shadow-lg">
                {/* header */}
                <div className="flex items-center justify-between p-4 border-b border-[#7c87bc]">
                  <h2 className="text-lg font-sf font-semibold text-gray-900">
                    Related Pages
                  </h2>
                  <button className="text-[#0017e7] text-sm font-medium hover:underline">
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
                    Follow Pages
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
                  {pages.map((page) => (
                    <div
                      key={page.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                    >
                      {/* Cover Image Section */}
                      <div className="relative h-24 bg-gradient-to-r from-blue-400 to-blue-600 overflow-hidden">
                        <img
                          src={page.coverImage}
                          alt={page.name}
                          className="w-full h-full object-cover"
                        />

                        {/* Notification Badge for Leadership Academy */}
                        {page.notification && (
                          <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                            {page.notification}
                          </div>
                        )}

                        {/* Car Service Logo */}
                        {page.logo && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-cyan-400 text-2xl font-bold">
                                CARSERVICE
                              </div>
                              <div className="text-white text-sm">
                                tuning & repair
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Collection Text */}
                        {page.collection && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-white text-sm font-medium">
                                {page.collection}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="p-4">
                        <div className="flex items-start space-x-3 mb-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                            <img
                              src={page.image}
                              alt={page.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm mb-1">
                              {page.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {page.followers}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={handleRedirect}
                          className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          View Page
                        </button>
                      </div>
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
        </div>
      </div>
    </>
  );
};

export default Pages;
