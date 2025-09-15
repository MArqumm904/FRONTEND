import { useState } from "react";

const allAdminList = [
  {
    name: "Code By Rixa",
    occupation: "iOS Developer",
    avatar:
      "https://images.pexels.com/photos/8078578/pexels-photo-8078578.jpeg?_gl=1*1pvfjge*_ga*OTc3NzE2NDMwLjE3NTQzMjc5MTY.*_ga_8JE65Q40S6*czE3NTQzMjc5MTUkbzEkZzEkdDE3NTQzMjc5NzIkajMkbDAkaDA.",
  },
  {
    name: "Jaiwad singh",
    occupation: "Frontend Developer",
    avatar:
      "https://images.pexels.com/photos/2169427/pexels-photo-2169427.jpeg",
  },
  {
    name: "Sarah Malik",
    occupation: "Full Stack Developer",
    avatar: "https://images.pexels.com/photos/6635041/pexels-photo-6635041.jpeg?_gl=1*1v9ojlb*_ga*OTc3NzE2NDMwLjE3NTQzMjc5MTY.*_ga_8JE65Q40S6*czE3NTQzMjc5MTUkbzEkZzEkdDE3NTQzMjgwNzMkajU0JGwwJGgw",
  },
  {
    name: "Liam Carter",
    occupation: "Mobile App Developer",
    avatar: "https://images.pexels.com/photos/5583874/pexels-photo-5583874.jpeg?_gl=1*1r1ag7x*_ga*OTc3NzE2NDMwLjE3NTQzMjc5MTY.*_ga_8JE65Q40S6*czE3NTQzMjc5MTUkbzEkZzEkdDE3NTQzMjgxMTckajEwJGwwJGgw",
  },
  {
    name: "Emma Johnson",
    occupation: "UI/UX Designer",
    avatar: "👩‍🎨",
  },
  {
    name: "Michael Brown",
    occupation: "Backend Developer",
    avatar: "👨‍💻",
  },
  {
    name: "Lisa Wang",
    occupation: "DevOps Engineer",
    avatar: "👩‍💻",
  },
  {
    name: "David Miller",
    occupation: "Product Manager",
    avatar: "👨‍💼",
  },
  {
    name: "Anna Davis",
    occupation: "QA Engineer",
    avatar: "👩‍💻",
  },
  {
    name: "James Wilson",
    occupation: "Data Scientist",
    avatar: "👨‍🔬",
  },
  {
    name: "Sophie Chen",
    occupation: "Frontend Developer",
    avatar: "👩‍💻",
  },
  {
    name: "Alex Rodriguez",
    occupation: "iOS Developer",
    avatar: "👨‍💻",
  },
];

const Admins = () => {
  const [visibleCount, setVisibleCount] = useState(4);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("admins");

  const handleShowMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 4, allAdminList.length));
      setLoading(false);
    }, 1500);
  };

  const visibleAdmins = allAdminList.slice(0, visibleCount);

  return (
    <div className=" mx-auto  bg-white">
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Group Admins</h2>
      {/* Admin Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {visibleAdmins.map((admin, i) => (
          <div
            key={i}
            className="flex items-center justify-between border border-[#7e7e7e] rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                <img
                  src={admin.avatar}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>

              <div>
                <h4 className="text-xl font-medium text-gray-900">
                  {admin.name}
                </h4>
                <p className="text-sm text-gray-500">{admin.occupation}</p>
              </div>
            </div>
            <button className="text-[#0017e7] text-sm font-medium hover:text-[#0017e7] hover:underline transition-colors">
              • Add Friend
            </button>
          </div>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0017e7]"></div>
          <span className="ml-3 text-gray-600">Loading more admins...</span>
        </div>
      )}

      {/* Show More Button */}
      {!loading && visibleCount < allAdminList.length && (
        <div className="flex">
          <button
            onClick={handleShowMore}
            className="px-6 py-2 border border-black rounded-lg text-black font-medium hover:bg-gray-50 hover:border-black transition-colors"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default Admins;
