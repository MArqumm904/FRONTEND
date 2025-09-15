import React, { useState, useEffect } from "react";
import img1 from "../../assets/images/add_Story.png";
import img2 from "../../assets/images/addtostory.png";
import img3 from "../../assets/images/avatorr.png";
import img4 from "../../assets/images/banner-2.jpg";
import img5 from "../../assets/images/banner-bg.png";
import img6 from "../../assets/images/banner-pro.jpg";
import img7 from "../../assets/images/behance.jpg";
import img8 from "../../assets/images/bellicon.png";
import PostComment from "../post_comment";

const photos = [img1, img2, img3, img4, img5, img6, img7, img8];

const videos = [
  {
    thumbnail: img4,
    views: "1.1k views",
  },
  {
    thumbnail: img5,
    views: "12.5k views",
  },
  {
    thumbnail: img6,
    views: "135k views",
  },
  {
    thumbnail: img7,
    views: "1.90k views",
  },
];

const media_tab_photos = ({ pageId }) => {
  const [activeTab, setActiveTab] = useState("Photos");
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState({
    photos: false,
    videos: false,
  });
  const [error, setError] = useState({
    photos: null,
    videos: null,
  });

  useEffect(() => {
    if (pageId) {
      fetchMedia(activeTab);
    }
  }, [pageId, activeTab]);

  useEffect(() => {
    if (showCommentPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showCommentPopup]);

  const handleImageClick = (img) => {
    setSelectedImage(img);
    setShowCommentPopup(true);
  };

  const fetchMedia = async (type) => {
    // Skip if already loading or already has data
    if (
      loading[type.toLowerCase()] ||
      (type === "Photos" && photos.length > 0) ||
      (type === "Videos" && videos.length > 0)
    ) {
      return;
    }

    setLoading((prev) => ({ ...prev, [type.toLowerCase()]: true }));
    setError((prev) => ({ ...prev, [type.toLowerCase()]: null }));

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/pages/getMedia`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            pageId,
            type: type.toLowerCase(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const baseUrl = import.meta.env.VITE_API_BASE_URL.replace("/api", "");
      if (type === "Photos") {
        const formattedPhotos = data.media.map((item) => {
          const profilePhotoUrl = item.url.startsWith("http")
            ? item.url
            : `${baseUrl}/storage/${item.url}`;
          return profilePhotoUrl;
        });
        setPhotos(formattedPhotos);
      } else {
        const formattedVideos = data.media.map((item) => {
          const thumbnailUrl = item.thumbnail.startsWith("http")
            ? item.thumbnail
            : `${baseUrl}/storage/${item.thumbnail}`;
          return {
            thumbnail: thumbnailUrl,
            views: item.views,
          };
        });
        setVideos(formattedVideos);
      }
    } catch (err) {
      console.error(`Error fetching ${type}:`, err);
      setError((prev) => ({ ...prev, [type.toLowerCase()]: err.message }));

      // Fallback to default data
      if (type === "Photos") {
        setPhotos([]);
      } else {
        setVideos([]);
      }
    } finally {
      setLoading((prev) => ({ ...prev, [type.toLowerCase()]: false }));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 w-full mx-auto mt-6 border border-[#7c87bc]">
      {/* Header */}
      <h2 className="text-2xl font-semibold font-sf mb-2">Media</h2>
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`px-4 py-2 font-sf -mb-px font-medium text-[#0017e7] border-b-2 transition-all duration-200 ${
            activeTab === "Photos"
              ? "border-[#0017e7]"
              : "border-transparent text-gray-500"
          }`}
          onClick={() => setActiveTab("Photos")}
        >
          Photos
        </button>
        <button
          className={`px-4 py-2 font-sf -mb-px font-medium border-b-2 transition-all duration-200 ${
            activeTab === "Videos"
              ? "border-[#0017e7] text-[#0017e7]"
              : "border-transparent text-gray-500"
          }`}
          onClick={() => setActiveTab("Videos")}
        >
          Videos
        </button>
      </div>
      {/* Content */}
      {activeTab === "Photos" && (
        <>
          <h3 className="text-2xl font-sf font-semibold mb-4 mt-2">Photos</h3>
          <div className="grid grid-cols-4 gap-4">
            {photos.map((src, idx) => (
              <div
                key={idx}
                className="rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-200 bg-gray-100 aspect-square flex items-center justify-center cursor-pointer"
                onClick={() => handleImageClick(src)}
              >
                <img
                  src={src}
                  alt={`Photo ${idx + 1} ${src}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </>
      )}
      {activeTab === "Videos" && (
        <>
          <h3 className="text-2xl font-sf font-semibold mb-4 mt-2">Videos</h3>
          <div className="flex flex-row gap-6">
            {videos.map((video, idx) => (
              <div
                key={idx}
                className="rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-200 bg-gray-900 w-56 flex-shrink-0 relative"
                style={{ minHeight: 340 }}
              >
                <video
                  src={video.thumbnail}
                  alt="Video thumbnail"
                  className="object-cover w-full h-full"
                  style={{ minHeight: 340, maxHeight: 340 }}
                />
                {/* Strong blue gradient shade at the bottom */}
                <div
                  className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-end"
                  style={{
                    height: "90px",
                    background:
                      "linear-gradient(0deg, rgba(0,23,231,0.85) 5%, rgba(0,23,231,0.0) 90%)",
                  }}
                >
                  <div className="flex items-center text-white text-base font-semibold gap-2 mb-3 ms-8 mt-auto w-full justify-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <span>{video.views}</span>
                  </div>
                </div>
              </div>
            ))}
            {/* <video
              src="http://localhost:8000/storage/reels/videos/WhAU9N8zL2ujhGAk2f7uKPC24oYwMeaXUmVt2wKV.mp4"
              className="w-[400px] h-auto object-cover cursor-pointer !z-[999] border border-black" 
              autoPlay={true}
              loop
            /> */}
{/* 
            <video
              width="320"
              height="240"
              controls
              autoPlay
              loop
              // muted
              // style={{
              //   transform: "translateZ(0)", // Force hardware acceleration
              //   willChange: "transform",
              // }}
            >
              <source
                src="http://localhost:8000/storage/reels/videos/WhAU9N8zL2ujhGAk2f7uKPC24oYwMeaXUmVt2wKV.mp4"
                type="video/mp4"
              />
            </video> */}
          </div>
        </>
      )}
      {/* PostComment Modal */}
      {showCommentPopup && (
        <PostComment
          post_image={selectedImage}
          onClose={() => setShowCommentPopup(false)}
        />
      )}
    </div>
  );
};

export default media_tab_photos;
