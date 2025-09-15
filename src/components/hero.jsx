import ProfileCard from "./profilecard";
import Stories from "./storysec";
import CreatePost from "./createpost";
import RightSidebar from "./rightsidebar";
import SidebarMenu from "./sidebarmenu";
import Post from "./post";
import { useState} from "react";

export default function Hero() {
  const [refreshStories,setRefreshStories] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[86rem] mx-auto px-0 md:px-4 py-0 md:py-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left Sidebar - Hidden on mobile */}
          <div className="hidden md:block md:col-span-3 z-40">
            <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
              <ProfileCard />
              <SidebarMenu />
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-1 md:col-span-6">
            {/* Stories - Hidden on mobile */}
            <div className="hidden md:block">
              <Stories />
            </div>

            {/* Always visible on all screens */}
            <CreatePost />
            <Post onStoryUpload={() => console.log("Story uploaded")} />
          </div>

          {/* Right Sidebar - Hidden on mobile */}
          <div className="hidden md:block md:col-span-3 ">
            <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}