import React from "react";

const Preloader = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Skeleton */}
      <div className="w-full bg-gray-50 border-b border-gray-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between relative">
            {/* Left Section - Logo and Search */}
            <div className="flex items-center space-x-6">
              <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-72 h-12 bg-gray-200 rounded-full animate-pulse"></div>
            </div>

            {/* Center Section - Navigation Icons */}
            <div className="flex items-center space-x-12 absolute left-1/2 transform -translate-x-1/2">
              <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              <div className="w-32 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Top Bar Skeleton */}
      <div className="w-full bg-white border-b border-gray-200 md:hidden">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-7 h-7 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex items-center justify-between px-2 mt-6">
            <div className="w-7 h-7 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-7 h-7 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-7 h-7 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-[86rem] mx-auto px-0 md:px-4 py-0 md:py-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left Sidebar Skeleton - Hidden on mobile */}
            <div className="hidden md:block md:col-span-3">
              <div className="sticky top-4">
                {/* Profile Card Skeleton */}
                <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-4">
                  <div className="flex items-center mb-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-full mr-3 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-center border-t pt-3">
                    <div>
                      <div className="h-6 bg-gray-200 rounded w-8 mx-auto mb-1 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-12 mx-auto animate-pulse"></div>
                    </div>
                    <div>
                      <div className="h-6 bg-gray-200 rounded w-8 mx-auto mb-1 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-16 mx-auto animate-pulse"></div>
                    </div>
                    <div>
                      <div className="h-6 bg-gray-200 rounded w-8 mx-auto mb-1 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-16 mx-auto animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Sidebar Menu Skeleton */}
                <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex items-center gap-3 py-3">
                      <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-span-1 md:col-span-6">
              {/* Stories Skeleton - Hidden on mobile */}
              <div className="hidden md:block mb-4">
                <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
                  <div className="flex gap-3 overflow-hidden">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex-shrink-0">
                        <div className="w-24 h-36 bg-gray-200 rounded-lg animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Create Post Skeleton */}
              <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                <div className="flex gap-4 pt-3 border-t">
                  <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
                </div>
              </div>

              {/* Post Skeletons */}
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-4"
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                  </div>

                  {/* Post Image */}
                  <div className="w-full h-96 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex gap-6">
                      <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Sidebar Skeleton - Hidden on mobile */}
            <div className="hidden md:block md:col-span-3">
              <div className="sticky top-4">
                {/* Group Card Skeleton */}
                <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-4">
                  <div className="h-5 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded-lg mt-3 animate-pulse"></div>
                </div>

                {/* Page Card Skeleton */}
                <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-4">
                  <div className="h-5 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded-lg mt-3 animate-pulse"></div>
                </div>

                {/* Sponsors Skeleton */}
                <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
                  <div className="h-5 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
                  <div className="space-y-3">
                    <div className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
        <div className="flex items-center justify-around py-3">
          <div className="w-7 h-7 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
