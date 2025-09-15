import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Bookmark, Play, Pause } from "lucide-react";
import SidebarMenu from "../components/sidebarmenu";
import ProfileCard from "../components/profilecard";
import NavbarReplica from "../components/nav";
import axios from "axios";

const Saved = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingPosts, setRemovingPosts] = useState(new Set());
  const [playingVideos, setPlayingVideos] = useState(new Set());

  // API base URL from environment
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Function to fetch saved posts from API
  const fetchSavedPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}/getsavedposts`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setSavedPosts(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch saved posts"
      );
      console.error("Error fetching saved posts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch posts on component mount
  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const onBackToHome = () => {
    navigate("/");
  };

  // Function to get media URL
  const getMediaUrl = (mediaFile) => {
    if (!mediaFile) return null;

    if (mediaFile.startsWith("http")) {
      return mediaFile;
    }

    const baseUrl = API_BASE_URL.replace("/api", "");
    return `${baseUrl}/storage/${mediaFile}`;
  };

  // Function to determine media type and get first media
  const getFirstMedia = (mediaArray) => {
    if (!mediaArray || mediaArray.length === 0) return null;
    return mediaArray[0];
  };

  // Helper function to render post content based on type
  const renderPostContent = (post) => {
    if (post.type === "poll" && post.poll) {
      const options = JSON.parse(post.poll.options);
      return (
        <div className="w-full">
          {/* Poll Question */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 text-xl mb-2 font-sf mt-3">
              {post.poll.question || post.content}
            </h3>
          </div>

          {/* Poll Options */}
          <div className="space-y-2 mb-4">
            {options.map((option, index) => (
              <div
                key={index}
                className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="w-4 h-4 rounded-full border-2 border-gray-400 mr-3"></div>
                <span className="text-sm text-gray-700 font-sf">{option}</span>
              </div>
            ))}
          </div>

          {/* Poll Info */}
          <div className="text-xs text-gray-500 mb-2">
            Poll • {options.length} options
          </div>
        </div>
      );
    }

    // Regular post content
    return (
      <h3 className="font-semibold mt-3 text-gray-900 text-xl mb-2 font-sf line-clamp-2">
        {post.content || "No content available"}
      </h3>
    );
  };

  // Updated handleRemovePost function to use savedapost API
  const handleRemovePost = async (savedPostId, postId) => {
    try {
      setRemovingPosts((prev) => new Set(prev).add(savedPostId));

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}/savedapost`,
        {
          post_id: postId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        if (response.data.data.user_saved === false) {
          setTimeout(() => {
            setSavedPosts((prevPosts) =>
              prevPosts.filter((item) => item.saved_post.id !== savedPostId)
            );
            setRemovingPosts((prev) => {
              const newSet = new Set(prev);
              newSet.delete(savedPostId);
              return newSet;
            });
          }, 300);
        } else {
          setRemovingPosts((prev) => {
            const newSet = new Set(prev);
            newSet.delete(savedPostId);
            return newSet;
          });
        }
      }
    } catch (err) {
      setRemovingPosts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(savedPostId);
        return newSet;
      });
      console.error("Error removing saved post:", err);
      setError(
        err.response?.data?.message || "Failed to remove post from saved"
      );
    }
  };

  const handleVideoToggle = (postId) => {
    const videoElement = document.getElementById(`video-${postId}`);
    if (videoElement) {
      if (playingVideos.has(postId)) {
        videoElement.pause();
        setPlayingVideos((prev) => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      } else {
        videoElement.play();
        setPlayingVideos((prev) => new Set(prev).add(postId));
      }
    }
  };

  // Filter posts based on search term
  const filteredPosts = savedPosts.filter(
    (item) =>
      item.post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.post.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.post.poll &&
        item.post.poll.question
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  // Loading state
  if (loading) {
    return (
      <>
        <NavbarReplica />
        <div className="min-h-screen bg-gray-100">
          <div className="max-w-[86rem] mx-auto px-0 md:px-4 py-0 md:py-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="hidden md:block md:col-span-3">
                <ProfileCard />
                <SidebarMenu />
              </div>
              <div className="col-span-1 md:col-span-9">
                <div className="bg-white rounded-lg shadow-sm border border-[#6974b1] p-4 mx-auto">
                  <div className="flex items-center justify-center py-12">
                    <div className="text-gray-500 font-sf">
                      Loading saved posts...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <NavbarReplica />
        <div className="min-h-screen bg-gray-100">
          <div className="max-w-[86rem] mx-auto px-0 md:px-4 py-0 md:py-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="hidden md:block md:col-span-3">
                <ProfileCard />
                <SidebarMenu />
              </div>
              <div className="col-span-1 md:col-span-9">
                <div className="bg-white rounded-lg shadow-sm border border-[#6974b1] p-4 mx-auto">
                  <div className="text-center py-12">
                    <div className="text-red-500 font-sf mb-4">{error}</div>
                    <button
                      onClick={fetchSavedPosts}
                      className="px-4 py-2 bg-[#6974b1] text-white rounded-lg hover:bg-[#5a65a1] transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarReplica />
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-[86rem] mx-auto px-0 md:px-4 py-0 md:py-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left Sidebar - Hidden on mobile */}
            <div className="hidden md:block md:col-span-3">
              <ProfileCard />
              <SidebarMenu />
            </div>

            {/* Main Content */}
            <div className="col-span-1 md:col-span-9">
              <div className="bg-white rounded-lg shadow-sm border border-[#6974b1] p-4 mx-auto">
                {/* Header */}
                <div className="flex items-center mb-6">
                  <button
                    onClick={onBackToHome}
                    className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                  </button>
                  <h1 className="text-2xl font-semibold font-sf text-gray-900">
                    Saved Posts ({savedPosts.length})
                  </h1>
                </div>

                {/* Search Bar */}
                <div className="flex-1 mb-7 relative">
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#343f7b] md:block hidden" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Saved Posts"
                    className="w-full bg-[#efeff3] font-sf rounded-full md:pl-14 pl-4 pr-4 py-2 md:py-4 text-[#343f7b] placeholder-[#343f7b] outline-none"
                  />
                </div>
                <div className="border-t border-gray-200 my-5"></div>

                {/* Saved Posts List */}
                <div className="space-y-4">
                  {filteredPosts.map((item) => {
                    const post = item.post;
                    const savedPost = item.saved_post;
                    const firstMedia = getFirstMedia(post.media);

                    return (
                      <div
                        key={savedPost.id}
                        className={`bg-white rounded-md shadow-sm border border-gray-200 p-2 hover:shadow-md transition-all duration-300 ${
                          removingPosts.has(savedPost.id)
                            ? "opacity-0 transform scale-95"
                            : "opacity-100 transform scale-100"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Post Media - Only show if media exists and not a poll */}
                          {firstMedia && post.type !== "poll" && (
                            <div className="w-44 h-40 rounded-md overflow-hidden flex-shrink-0 relative bg-gray-200">
                              {firstMedia.type === "video" ? (
                                <div className="relative w-full h-full">
                                  <video
                                    id={`video-${post.id}`}
                                    src={getMediaUrl(firstMedia.file)}
                                    className="w-full h-full object-cover"
                                    preload="metadata"
                                    loop
                                    muted
                                    onPlay={() =>
                                      setPlayingVideos((prev) =>
                                        new Set(prev).add(post.id)
                                      )
                                    }
                                    onPause={() =>
                                      setPlayingVideos((prev) => {
                                        const newSet = new Set(prev);
                                        newSet.delete(post.id);
                                        return newSet;
                                      })
                                    }
                                  />
                                  {/* Play/Pause Button Overlay */}
                                  <div
                                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                                    onClick={() => handleVideoToggle(post.id)}
                                  >
                                    <div className="bg-[#fcfcfc] rounded-full p-2 flex items-center justify-center hover:bg-opacity-70 transition-all">
                                      {playingVideos.has(post.id) ? (
                                        <Pause className="w-6 h-6 text-black" />
                                      ) : (
                                        <Play className="w-6 h-6 text-black" />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <img
                                  src={getMediaUrl(firstMedia.file)}
                                  alt="Post"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = "/placeholder-image.png";
                                  }}
                                />
                              )}
                            </div>
                          )}

                          {/* Post Content */}
                          <div className="flex-1 px-5 mb-3">
                            {renderPostContent(post)}

                            {/* User and Date Info */}
                            <p className="text-xs text-gray-500 font-sf">
                              {post.type === "poll" ? "Poll" : "Post"} by{" "}
                              {post.user.name}
                            </p>
                            <p className="text-xs text-gray-400 font-sf mt-1">
                              Saved on{" "}
                              {new Date(
                                savedPost.saved_at
                              ).toLocaleDateString()}
                            </p>

                            {/* Reactions Display */}
                            {post.total_reactions > 0 && (
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-gray-500">
                                  {post.total_reactions} reaction
                                  {post.total_reactions !== 1 ? "s" : ""}
                                </span>
                                {post.current_user_reaction && (
                                  <span className="text-xs text-blue-500 capitalize">
                                    You {post.current_user_reaction}d this
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Bookmark Icon */}
                          <div className="flex-shrink-0">
                            <button
                              onClick={() =>
                                handleRemovePost(savedPost.id, post.id)
                              }
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                              title="Remove from saved"
                            >
                              <Bookmark
                                className={`w-6 h-6 fill-current transition-colors duration-200 ${
                                  removingPosts.has(savedPost.id)
                                    ? "text-black"
                                    : "text-[#fccf1a]"
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Show message if no posts found */}
                {filteredPosts.length === 0 && !loading && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 font-sf">
                      {searchTerm
                        ? "No saved posts found matching your search."
                        : "No saved posts yet."}
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

export default Saved;
