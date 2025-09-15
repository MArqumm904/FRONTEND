import { ChevronDown } from "lucide-react";
import BannerImage from "../assets/images/banner-bg.png";
import SecondProfileImage from "../assets/images/profile-2.png";
import SecondBannerImage from "../assets/images/banner-2.jpg";
import SponserImage from "../assets/images/sponsor-image.png";
import SponserImage2 from "../assets/images/sponsor-image-2.png";

const RightSidebar = () => {
  return (
    <div className="space-y-4 ">
      <div className="mb-4">
        <div className="flex items-center">
          <h2 className="text-[0.90rem] font-medium text-gray-400 mr-4">
            YOUR GROUP
          </h2>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
      </div>

      <div className="space-y-4">
        {/* First Page Card - Leadership Academy */}
        <div className="bg-white rounded-lg shadow-lg border border-[#6974b1] overflow-hidden mb-5">
          {/* Header Section with Blue Background */}
          <div className="relative overflow-hidden p-4 h-[95px]">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={BannerImage}
                alt="Scholarship notification background"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Profile Circle with Education Theme */}
          <div className="flex justify-center -mt-8 relative z-10">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-white">
              <div className="w-24 h-24 rounded-full flex items-center justify-center">
                <img
                  src={SecondProfileImage}
                  alt="Profile image"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="text-center px-3 pb-3 pt-2">
            <h4 className="text-xl font-semibold font-sf text-gray-900 mb-1">
              Leadership Academy
            </h4>
            <p className="text-sm text-gray-500 mb-4">4k Followers</p>
            <button className="mt-6 w-full bg-[#0017e7] text-white py-2 rounded-lg font-semibold transition-colors shadow-md hover:bg-[#0012c7]">
              View Your Page
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center">
            <h2 className="text-[0.90rem] font-medium text-gray-400 mr-4">
              YOUR PAGE
            </h2>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
        </div>

        {/* Second Page Card - Similar Design */}
        <div className="bg-white rounded-xl shadow-lg border border-[#6974b1] overflow-hidden">
          {/* Header Section with Background */}
          <div className="relative overflow-hidden p-4 h-[92px]">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={SecondBannerImage}
                alt="Business background"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Profile Circle */}
          <div className="flex justify-center -mt-8 relative z-10">
            <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center border-4 border-white">
              <div className="w-24 h-24 rounded-full flex items-center justify-center">
                <img
                  src={SecondProfileImage}
                  alt="Profile image"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="text-center px-3 pb-3 pt-2">
            <h4 className="text-xl font-semibold font-sf text-gray-900 mb-1">
              Web Developement
            </h4>
            <p className="text-sm text-gray-500 mb-4">
              33K members | 10+ posts a day
            </p>
            <button className="mt-6 w-full bg-[#0017e7] text-white py-2 rounded-lg font-semibold transition-colors shadow-md hover:bg-[#0012c7]">
              View Your Page
            </button>
          </div>
        </div>
      </div>

      {/* Bootcamp Advertisement Card */}
      <div className="bg-white border border-[#6873b0] rounded-lg shadow-lg overflow-hidden mb-7">
        <div className="bg-gray-100 border-b border-blue-400 rounded-t-lg p-4">
          <h2 className="text-gray-600 font-sf text-xl font-medium">Sponsors</h2>
        </div>
        {/* Header Section */}
        <div className="relative p-4">
          {/* Warning Icon and Title */}
          <div className="flex items-center mb-3">
            <div className="w-6 h-6  rounded-full flex items-center justify-center mr-3">
              <span className="text-black font-bold text-lg">🖥️</span>
            </div>
            <h3 className="text-black font-semibold text-xl font-sf">
              "Join UI/UX Design Bootcamp – 50% Off"
            </h3>
          </div>

          {/* Website Link */}
          <p className="text-blue-700 underline text-sm mb-4 cursor-pointer">
            https://www.reallygreatsite.com
          </p>
        </div>

        {/* Main Content Section */}
        <div className="relative flex items-center">
          <img
            src={SponserImage}
            alt="Scholarship notification background"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="bg-white border border-[#6873b0] rounded-lg shadow-lg overflow-hidden mb-7">
       
        {/* Header Section */}
        <div className="relative p-4">
          {/* Warning Icon and Title */}
          <div className="flex items-center mb-3">
            <div className="w-6 h-6  rounded-full flex items-center justify-center mr-3">
              <span className="text-black font-bold text-lg">🖥️</span>
            </div>
            <h3 className="text-black font-semibold text-xl font-sf">
              "Free IT Course - Sponsored by Codelab"
            </h3>
          </div>

          {/* Website Link */}
          <p className="text-blue-700 underline text-sm mb-4 cursor-pointer">
            https://www.careervision.com
          </p>
        </div>

        {/* Main Content Section */}
        <div className="relative flex items-center">
          <img
            src={SponserImage2}
            alt="Scholarship notification background"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Sort By */}
      <div className="flex items-center justify-end text-sm text-gray-500">
        <span className="mr-2">Sort By:</span>
        <button className="flex items-center text-gray-700 font-medium hover:text-gray-900">
          Recent
          <ChevronDown className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;
