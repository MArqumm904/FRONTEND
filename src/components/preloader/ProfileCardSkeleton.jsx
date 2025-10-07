import React from "react";

const ProfileCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow border border-[#6974b1] p-6 mb-4">
      <div className="flex items-center mb-4">
        {/* Profile Photo Skeleton */}
        <div className="w-20 h-20 rounded-full mr-3 bg-gray-200 animate-pulse"></div>
        
        {/* Profile Info Skeleton */}
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
        </div>
      </div>

      {/* Stats Section Skeleton */}
      <div className="flex justify-between text-center border-t pt-3">
        <div>
          <div className="h-7 bg-gray-200 rounded w-8 mx-auto mb-1 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-12 mx-auto animate-pulse"></div>
        </div>
        <div>
          <div className="h-7 bg-gray-200 rounded w-8 mx-auto mb-1 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-16 mx-auto animate-pulse"></div>
        </div>
        <div>
          <div className="h-7 bg-gray-200 rounded w-8 mx-auto mb-1 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-16 mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCardSkeleton;