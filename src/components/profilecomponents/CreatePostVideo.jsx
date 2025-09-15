import { useState, useRef } from "react";
import { X, Plus, Play, Pause, Hash } from "lucide-react";
import CreateVideoPost from "../../assets/images/create_post_image.png"; // Default video placeholder image
import Person1 from "../../assets/images/person-1.png";
import axios from "axios";

export default function CreatePostVideo({ onClose, selectedVideo,profileId,userData }) {
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState([]); // Changed to array for better tag management
  const [currentSelectedVideo, setCurrentSelectedVideo] =
    useState(selectedVideo);
  const [thumbnail, setThumbnail] = useState(null); // New state for thumbnail
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [postType, setPostType] = useState(""); // "reel" or "post"
  const [showTypeSelection, setShowTypeSelection] = useState(true);
  const [hashtagInput, setHashtagInput] = useState(""); // Separate input state
  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null); // New ref for thumbnail input
  const videoRef = useRef(null);

  const handleAddVideoClick = () => {
    fileInputRef.current.click();
  };

  const handleThumbnailClick = () => {
    thumbnailInputRef.current.click();
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const thumbnailUrl = URL.createObjectURL(file);
      setThumbnail({
        file: file,
        url: thumbnailUrl,
        name: file.name,
      });
    }
  };

  const handleRemoveThumbnail = () => {
    if (thumbnail && thumbnail.url) {
      URL.revokeObjectURL(thumbnail.url);
    }
    setThumbnail(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setCurrentSelectedVideo({
        file: file,
        url: videoUrl,
        name: file.name,
      });
    }
  };

  const handleRemoveVideo = () => {
    if (currentSelectedVideo && currentSelectedVideo.url) {
      URL.revokeObjectURL(currentSelectedVideo.url);
    }
    setCurrentSelectedVideo(null);
    setIsPlaying(false);
  };

  const handlePostTypeSelect = (type) => {
    setPostType(type);
    setShowTypeSelection(false);
  };

  const handlePost = async () => {
    if (!currentSelectedVideo || !currentSelectedVideo.file) {
      alert("Please select a video first!");
      return;
    }

    // For reels, check if thumbnail is required
    if (postType === "reel" && (!thumbnail || !thumbnail.file)) {
      alert("Please select a thumbnail for your reel!");
      return;
    }

    setIsPosting(true);

    try {
      const token = localStorage.getItem("token");

      // Create FormData for file upload
      const formData = new FormData();

      if (postType === "reel") {
        // For reels - use the /uploadreel endpoint
        formData.append("description", description.trim() || "");

        // Convert hashtags array to tags array (without # symbol for backend)
        const tagsArray = hashtags.map((tag) => tag.replace("#", ""));
        tagsArray.forEach((tag, index) => {
          formData.append(`tags[${index}]`, tag);
        });

        formData.append("visibility", "public");
        formData.append("video", currentSelectedVideo.file);
        formData.append("thumbnail", thumbnail.file); // Required for reels

        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/uploadreel`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.status === true) {
          console.log("Reel uploaded successfully:", response.data);
          if (window.refreshPosts) {
            window.refreshPosts();
          }
          resetForm();
          if (onClose) onClose();
        }
      } else {
        // For regular video posts - use existing endpoint
        formData.append("content", description.trim() || "");
        formData.append("type", "video");
        formData.append("visibility", "public");
        formData.append("video", currentSelectedVideo.file);
        formData.append("profile_id", profileId);

        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/user/profile/videoposts`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 201) {
          console.log("Video post created successfully:", response.data);
          if (window.refreshPosts) {
            window.refreshPosts();
          }
          resetForm();
          if (onClose) onClose();
        }
      }
    } catch (error) {
      if (error.response) {
        console.error(
          `Error creating ${postType === "reel" ? "reel" : "video post"}:`,
          error.response.data
        );
        alert(
          error.response.data.message ||
            `Failed to create ${postType === "reel" ? "reel" : "video post"}`
        );
      } else if (error.request) {
        console.error("Network error:", error.request);
        alert("Network error. Please try again.");
      } else {
        console.error("Error:", error.message);
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setIsPosting(false);
    }
  };

  const resetForm = () => {
    if (currentSelectedVideo && currentSelectedVideo.url) {
      URL.revokeObjectURL(currentSelectedVideo.url);
    }
    if (thumbnail && thumbnail.url) {
      URL.revokeObjectURL(thumbnail.url);
    }
    setDescription("");
    setHashtags([]);
    setCurrentSelectedVideo(null);
    setIsPlaying(false);
    setPostType("");
    setShowTypeSelection(true);
    setThumbnail(null);
  };

  const handleClose = () => {
    resetForm();
    if (onClose) onClose();
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoClick = () => {
    togglePlayPause();
  };

  // Post Type Selection Screen
  if (showTypeSelection) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
        <div className="bg-white backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header with Brand Color */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-[#0017e7] opacity-5"></div>
            <div className="relative flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-[#0017e7]">
                  Create Video Content
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Choose your sharing style
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200 hover:rotate-90"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Selection Options with Enhanced Design */}
          <div className="p-6">
            <div className="space-y-4">
              {/* Reel Option */}
              <button
                onClick={() => handlePostTypeSelect("reel")}
                className="group w-full p-5 border-2 border-gray-200 rounded-2xl hover:border-[#0017e7] hover:shadow-lg transition-all duration-300 text-left relative overflow-hidden hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-[#0017e7] opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-[#0017e7] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <Play size={24} className="text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-white border-2 border-[#0017e7] rounded-full flex items-center justify-center">
                      <span className="text-[#0017e7] text-xs font-bold">
                        ✦
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg group-hover:text-[#0017e7] transition-colors duration-200">
                      Create Reel
                    </h4>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      Short-form vertical video with trending hashtags
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-1 bg-[#0017e7]/10 text-[#0017e7] text-xs rounded-full font-medium">
                        Trending
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                        Viral Ready
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-400 group-hover:text-[#0017e7] transition-colors duration-200">
                    <svg
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Post Option */}
              <button
                onClick={() => handlePostTypeSelect("post")}
                className="group w-full p-5 border-2 border-gray-200 rounded-2xl hover:border-[#0017e7] hover:shadow-lg transition-all duration-300 text-left relative overflow-hidden hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-[#0017e7] opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-white border-2 border-[#0017e7] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <Play size={24} className="text-[#0017e7]" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#0017e7] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg group-hover:text-[#0017e7] transition-colors duration-200">
                      Create Post
                    </h4>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      Professional video post with detailed description
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-1 bg-white border border-[#0017e7] text-[#0017e7] text-xs rounded-full font-medium">
                        Professional
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                        Detailed
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-400 group-hover:text-[#0017e7] transition-colors duration-200">
                    <svg
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </button>
            </div>

            {/* Footer Note */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-[#0017e7] rounded-full animate-pulse"></div>
                <span>
                  Choose the format that best suits your content style
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="video/*"
        className="hidden"
      />

      {/* Hidden thumbnail input */}
      <input
        type="file"
        ref={thumbnailInputRef}
        onChange={handleThumbnailChange}
        accept="image/*"
        className="hidden"
      />

      {/* Modal */}
      <div className="bg-white rounded-md shadow-xl w-full max-w-md max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-sf">
              Create {postType === "reel" ? "Reel" : "Post"}
            </h2>
            {postType === "reel" && (
              <span className="px-2 py-1 bg-[#0017e7] text-white text-xs rounded-full">
                Reel
              </span>
            )}
          </div>
          <button
            onClick={handleClose}
            className="text-black hover:text-gray-700 hover:bg-gray-100 rounded-full p-1"
            disabled={isPosting}
          >
            <X size={25} />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 mt-4 -mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src={userData.profile_photo}
                className="w-full h-full object-cover"
                alt="User"
              />
            </div>
            <span className="font-medium text-gray-900 font-sf">
              {userData.name || ""}
            </span>
          </div>
        </div>

        {/* Description/Hashtags Input */}
        <div className="p-4 space-y-2">
          {/* Description for both reel and post */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a description for your content..."
              className="w-full h-14 p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-0 focus:border-gray-300"
              disabled={isPosting}
            />
          </div>

          {/* Thumbnail upload for reels */}
          {postType === "reel" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reel Thumbnail <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {thumbnail ? (
                  <div className="relative">
                    <img
                      src={thumbnail.url}
                      alt="Reel thumbnail"
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveThumbnail}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      disabled={isPosting}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleThumbnailClick}
                    className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-[#0017e7] hover:text-[#0017e7] transition-colors"
                    disabled={isPosting}
                  >
                    <svg
                      className="w-8 h-8 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      Upload Thumbnail
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      Required for reels
                    </span>
                  </button>
                )}
                <p className="text-xs text-gray-500">
                  Upload a thumbnail for your reel (JPG, JPEG, PNG - Max 5MB)
                </p>
              </div>
            </div>
          )}

          {/* Hashtags only for reels */}
          {postType === "reel" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Hashtags
              </label>
              <div className="relative">
                <Hash
                  size={20}
                  className="absolute left-3 top-[1.1rem] text-gray-400"
                />
                <input
                  type="text"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Tab" || e.key === "Enter") {
                      e.preventDefault();
                      if (hashtagInput.trim()) {
                        const newTag = hashtagInput.trim().startsWith("#")
                          ? hashtagInput.trim()
                          : `#${hashtagInput.trim()}`;
                        setHashtags((prev) => [...prev, newTag]);
                        setHashtagInput("");
                      }
                    }
                  }}
                  placeholder="Type hashtag and press Enter (e.g., funny, viral, trending)"
                  className="w-full h-14 pl-10 pr-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-0 focus:border-gray-300"
                  disabled={isPosting}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Type a word and press Tab or Enter to create hashtags
              </p>

              {/* Display current hashtags */}
              {hashtags && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {hashtags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          const tags = hashtags.filter((_, i) => i !== index);
                          setHashtags(tags);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Post Preview */}
        <div className="px-4 pb-4">
          <div className="bg-black rounded-lg overflow-hidden relative">
            {/* Top buttons */}
            <div className="absolute top-3 left-3 justify-between items-start right-3 flex gap-2 z-10">
              <button
                onClick={handleAddVideoClick}
                className="flex font-sf bg-[#fcfcfc] bg-opacity-90 text-[#000000] px-3 py-1 rounded-sm text-sm hover:bg-opacity-100 transition-all"
                disabled={isPosting}
              >
                <Plus size={20} className="mr-1" /> Add Video
              </button>
              {currentSelectedVideo && (
                <button
                  onClick={handleRemoveVideo}
                  className="bg-[#fcfcfc] bg-opacity-90 text-[#000000] w-8 h-8 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all"
                  disabled={isPosting}
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Video Display */}
            <div className="relative">
              <div className="text-center">
                {currentSelectedVideo ? (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      src={currentSelectedVideo.url}
                      className="w-full h-auto object-cover max-h-96 cursor-pointer"
                      onClick={handleVideoClick}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      controls={false}
                      preload="metadata"
                    />
                    {/* Play/Pause Overlay */}
                    <div
                      className="absolute inset-0 flex items-center justify-center cursor-pointer"
                      onClick={handleVideoClick}
                    >
                      <div className="bg-[#fcfcfc] bg-opacity-95 rounded-full p-3 hover:bg-opacity-70 transition-all">
                        {isPlaying ? (
                          <Pause size={32} className="text-black" />
                        ) : (
                          <Play size={32} className="text-black" />
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={CreateVideoPost}
                    alt="Default video post placeholder"
                    className="w-full h-auto object-cover max-h-96"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Post Button */}
        <div className="p-4 sticky bottom-0 bg-white border-t">
          <button
            onClick={handlePost}
            disabled={
              !currentSelectedVideo ||
              isPosting ||
              (postType === "reel" && !thumbnail)
            }
            className={`w-full py-3 rounded-md font-medium transition-colors ${
              currentSelectedVideo &&
              !isPosting &&
              (postType !== "reel" || thumbnail)
                ? postType === "reel"
                  ? "bg-[#0017e7] text-white hover:bg-[#0014cc]"
                  : "bg-[#0017e7] text-white hover:bg-[#0014cc]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isPosting
              ? "Posting..."
              : `Post ${postType === "reel" ? "Reel" : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}
