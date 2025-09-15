import { Search, ArrowLeft } from "lucide-react";

export default function GroupsInterface({ onBack }) {
  const joinedGroups = [
    {
      id: 1,
      name: "Behance Community",
      icon: "Be",
      bgColor: "bg-blue-500",
      textColor: "text-white",
    },
    {
      id: 2,
      name: "Facebook Community",
      icon: "f",
      bgColor: "bg-blue-600",
      textColor: "text-white",
    },
    {
      id: 3,
      name: "Fiver Community",
      icon: "fiver",
      bgColor: "bg-green-500",
      textColor: "text-white",
    },
    {
      id: 4,
      name: "Yahoo Community",
      icon: "Y!",
      bgColor: "bg-purple-600",
      textColor: "text-white",
    },
    {
      id: 5,
      name: "Fiver Community",
      icon: "fiver",
      bgColor: "bg-green-500",
      textColor: "text-white",
    },
  ];

  const suggestedGroups = [
    {
      id: 1,
      name: "Web Development",
      members: "33K members",
      posts: "10+ posts a day",
      icon: "https://images.pexels.com/photos/11035482/pexels-photo-11035482.jpeg?_gl=1*1j3u38l*_ga*MzkyNzI2MjYwLjE3NDY2MzYwNzY.*_ga_8JE65Q40S6*czE3NTI2MDExOTEkbzE2JGcxJHQxNzUyNjAxMjcyJGo0MSRsMCRoMA..",
    },
    {
      id: 2,
      name: "Graphic Design",
      members: "10K members",
      posts: "9+ posts a day",
      icon: "https://images.pexels.com/photos/27167243/pexels-photo-27167243.jpeg?_gl=1*1uwtq9o*_ga*MzkyNzI2MjYwLjE3NDY2MzYwNzY.*_ga_8JE65Q40S6*czE3NTI2MDU1ODckbzE3JGcxJHQxNzUyNjA1NTk4JGo0OSRsMCRoMA..",
    },
    {
      id: 3,
      name: "Wedding Jewellery",
      members: "10K members",
      posts: "9+ posts a day",
      icon: "https://images.pexels.com/photos/17808914/pexels-photo-17808914.jpeg?_gl=1*1nz8bvb*_ga*MzkyNzI2MjYwLjE3NDY2MzYwNzY.*_ga_8JE65Q40S6*czE3NTI2MDU1ODckbzE3JGcxJHQxNzUyNjA1NjE2JGozMSRsMCRoMA..",
    },
    {
      id: 4,
      name: "Leadership Academy",
      members: "10K members",
      posts: "9+ posts a day",
      icon: "https://images.pexels.com/photos/27167243/pexels-photo-27167243.jpeg?_gl=1*1uwtq9o*_ga*MzkyNzI2MjYwLjE3NDY2MzYwNzY.*_ga_8JE65Q40S6*czE3NTI2MDU1ODckbzE3JGcxJHQxNzUyNjA1NTk4JGo0OSRsMCRoMA..",
    },
    {
      id: 5,
      name: "Automotive Workshop",
      members: "10K members",
      posts: "9+ posts a day",
      icon: "https://images.pexels.com/photos/17808914/pexels-photo-17808914.jpeg?_gl=1*1nz8bvb*_ga*MzkyNzI2MjYwLjE3NDY2MzYwNzY.*_ga_8JE65Q40S6*czE3NTI2MDU1ODckbzE3JGcxJHQxNzUyNjA1NjE2JGozMSRsMCRoMA..",
    },
  ];

  return (
    <div className="flex gap-4 min-h-screen">
      {/* Left Panel - Groups */}
      <div className="w-80 space-y-4">
        {/* Groups Header */}
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

        {/* Joined Groups */}
        <div className="bg-white rounded-lg border border-[#7c87bc] p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 font-sf">
              Joined Groups
            </h3>
            <button className="text-blue-600 text-sm hover:underline font-sf">
              See All
            </button>
          </div>
          <div className="border-t border-gray-200 my-5"></div>
          <div className="space-y-3">
            {joinedGroups.map((group) => (
              <div
                key={group.id}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md"
              >
                <div
                  className={`w-10 h-10 rounded-lg ${group.bgColor} flex items-center justify-center`}
                >
                  {group.icon === "Be" && (
                    <span className={`font-bold text-sm ${group.textColor}`}>
                      Be
                    </span>
                  )}
                  {group.icon === "f" && (
                    <span className={`font-bold text-lg ${group.textColor}`}>
                      f
                    </span>
                  )}
                  {group.icon === "fiver" && (
                    <span className={`font-bold text-xs ${group.textColor}`}>
                      fiver
                    </span>
                  )}
                  {group.icon === "Y!" && (
                    <span className={`font-bold text-sm ${group.textColor}`}>
                      Y!
                    </span>
                  )}
                </div>
                <span className="text-gray-800 font-medium truncate">
                  {group.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Suggested Groups */}
      <div className="flex-1">
        <div className="bg-white rounded-lg border border-[#7c87bc] p-6">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-[#707070]" />
            </button>
            <h3 className="text-2xl font-sf font-semibold text-[#707070]">
              Suggested Groups
            </h3>
          </div>
          <div className="border-t border-gray-200 my-5"></div>
          <div className="space-y-4">
            {suggestedGroups.map((group) => (
              <div
                key={group.id}
                className="flex items-center p-4 hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-14  rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={group.icon}
                      alt={group.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 font-sf">
                      {group.name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1 font-sf">
                      {group.members} | {group.posts}
                    </p>
                  </div>
                </div>
                <button className="text-[#0017e7] -ms-2 mb-7 font-medium hover:underline">
                  • Join Group
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
