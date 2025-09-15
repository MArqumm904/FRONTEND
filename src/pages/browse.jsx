import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Grid3X3, User, Flag, Users } from "lucide-react";
import NavbarReplica from "../components/nav";

const Browse = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState("browse");

  const navigationItems = [
    {
      id: "browse",
      label: "Browse all",
      icon: Grid3X3,
    },
    {
      id: "people",
      label: "People",
      icon: User,
    },
    {
      id: "pages",
      label: "Pages",
      icon: Flag,
    },
    {
      id: "groups",
      label: "Groups",
      icon: Users,
    },
  ];

  const people = [
    {
      id: 1,
      name: "Aman Zain",
      title: "Full Stack Developer at DevCore",
      location: "Lahore, Pakistan",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "Sara Javed",
      title: "Graphic Designer",
      location: "London, United Kingdom",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuNhTZJTtkR6b-ADMhmzPvVwaLuLdz273wvQ&s",
    },
    {
      id: 3,
      name: "Sarah Malik",
      title: "UI/UX Designer at Kerone",
      location: "Karachi, Pakistan",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
  ];
  const groups = [
    {
      id: 1,
      name: "Tech Enthusiasts",
      title: "Latest Tech Trends & Developer Discussions",
      location: "Global",
      avatar:
        "https://www.pikpng.com/pngl/b/403-4037854_facebook-groups-group-fb-png-clipart.png",
    },
    {
      id: 2,
      name: "Freelancers Hub",
      title: "Networking Group for Freelancers Worldwide",
      location: "Remote",
      avatar:
        "https://tinuiti.com/wp-content/uploads/2023/12/fb-groups-logo1.png",
    },
    {
      id: 3,
      name: "UI/UX Designers Unite",
      title: "Design Tips, Tools & Portfolio Reviews",
      location: "Online Community",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSb6t_94pvr1Ph4nOOLUn1ik04VD-dsrp7cdw&s",
    },
  ];
  const pages = [
    {
      id: 1,
      name: "Dan Studio",
      location: "Toronto, Canada",
      title: "Web developer Agency",
      avatar:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: 2,
      name: "Niche",
      location: "New Delhi, India",
      title: "Web developer Agency",
      avatar:
        "https://img.freepik.com/premium-photo/poster-company-company-with-word-company-it_1115474-114758.jpg?w=360",
    },
    {
      id: 3,
      name: "aclitec",
      location: "Moscow, Russia",
      title: "Web developer Agency",
      avatar:
        "https://static.vecteezy.com/system/resources/previews/046/593/914/non_2x/creative-logo-design-for-real-estate-company-vector.jpg",
    },
  ];

  const onBackToHome = () => {
    navigate("/");
  };

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
              <div className="bg-white rounded-md border border-[#7c87bc] p-5 mb-4 shadow-lg">
                <h2 className="text-xl font-semibold text-black mb-5 mt-1 font-sf">
                  Browse All
                </h2>
                <div className="relative">
                  <Search
                    size={20}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2  text-[#2F3C80]"
                  />
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full bg-[#F5F5FA] text-[#2F3C80] font-medium placeholder-[#2F3C80] rounded-full pl-12 pr-4 py-4 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg border border-[#7c87bc] shadow-sm mb-4">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedItem(item.id);
                      }}
                      className={`w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors ${
                        selectedItem === item.id ? "bg-[#f0f0f0]" : ""
                      }`}
                    >
                      <IconComponent className="w-7 h-7 text-black" />
                      <span className="text-black font-sf">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Content */}
            <div className="col-span-1 md:col-span-9">
              {(selectedItem === "people" || selectedItem === "browse") && (
                <div className=" bg-white rounded-lg border border-[#7c87bc] shadow-sm">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={onBackToHome}
                        className="p-2 -ms-3 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                      </button>
                      <h2 className="text-xl font-semibold text-gray-900 font-sf">
                        People
                      </h2>
                    </div>
                    <button className="text-[#0017e7] text-sm font-sf font-medium hover:text-blue-700">
                      See all
                    </button>
                  </div>

                  {/* People List */}
                  <div className="divide-y divide-gray-100">
                    {people.map((person) => (
                      <div
                        key={person.id}
                        className="p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          {/* Avatar */}
                          <div className="w-20 h-20 rounded-sm border border-[#abafb3] overflow-hidden bg-gray-200 flex-shrink-0">
                            <img
                              src={person.avatar}
                              alt={person.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 mt-2">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-gray-900 text-lg font-sf">
                                {person.name}
                              </h3>
                              <button className="text-[#0017e7] text-sm font-medium hover:text-blue-700 font-sf">
                                • Follow
                              </button>
                            </div>

                            <div className="flex items-center text-sm text-gray-500 space-x-1">
                              <svg
                                className="w-5 h-5 text-[#707070]"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span>{person.title}</span>
                              <div className="flex items-center text-sm text-[#707070] space-x-1 mb-1 ">
                                <svg
                                  className="w-5 h-5 text-[#707070] ms-3"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span>{person.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pages List */}
              {(selectedItem === "pages" || selectedItem === "browse") && (
                <div className={`bg-white rounded-lg border border-[#7c87bc] shadow-sm ${selectedItem === "browse" ? "mt-5" : ""}`}>
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold text-gray-900 font-sf">
                        Pages
                      </h2>
                    </div>
                    <button className="text-[#0017e7] text-sm font-sf font-medium hover:text-blue-700">
                      See all
                    </button>
                  </div>

                  {/* People List */}
                  <div className="divide-y divide-gray-100">
                    {pages.map((page) => (
                      <div
                        key={page.id}
                        className="p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          {/* Avatar */}
                          <div className="w-20 h-20 rounded-sm border border-[#abafb3] overflow-hidden bg-gray-200 flex-shrink-0">
                            <img
                              src={page.avatar}
                              alt={page.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 mt-2">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-gray-900 text-lg font-sf">
                                {page.name}
                              </h3>
                              <button className="text-[#0017e7] text-sm font-medium hover:text-blue-700 font-sf">
                                • Follow
                              </button>
                            </div>

                            <div className="flex items-center text-sm text-gray-500 space-x-1">
                              <svg
                                className="w-5 h-5 text-[#707070]"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span>{page.title}</span>
                              <div className="flex items-center text-sm text-[#707070] space-x-1 mb-1 ">
                                <svg
                                  className="w-5 h-5 text-[#707070] ms-3"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span>{page.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grooups List */}
              {(selectedItem === "groups" || selectedItem === "browse") && (
                <div className={`bg-white rounded-lg border border-[#7c87bc] shadow-sm ${selectedItem === "browse" ? "mt-5" : ""}`}>
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold text-gray-900 font-sf">
                        Groups
                      </h2>
                    </div>
                    <button className="text-[#0017e7] text-sm font-sf font-medium hover:text-blue-700">
                      See all
                    </button>
                  </div>

                  {/* People List */}
                  <div className="divide-y divide-gray-100">
                    {groups.map((group) => (
                      <div
                        key={group.id}
                        className="p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          {/* Avatar */}
                          <div className="w-20 h-20 rounded-sm border border-[#abafb3] overflow-hidden bg-gray-200 flex-shrink-0">
                            <img
                              src={group.avatar}
                              alt={group.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 mt-2">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-gray-900 text-lg font-sf">
                                {group.name}
                              </h3>
                              <button className="text-[#0017e7] text-sm font-medium hover:text-blue-700 font-sf">
                                • Follow
                              </button>
                            </div>

                            <div className="flex items-center text-sm text-gray-500 space-x-1">
                              <svg
                                className="w-5 h-5 text-[#707070]"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span>{group.title}</span>
                              <div className="flex items-center text-sm text-[#707070] space-x-1 mb-1 ">
                                <svg
                                  className="w-5 h-5 text-[#707070] ms-3"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span>{group.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Browse;
