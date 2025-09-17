import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  Pause,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  Volume2,
  ThumbsUp,
  AlertTriangle,
} from "lucide-react";
import SidebarMenu from "../components/sidebarmenu";
import ProfileCard from "../components/profilecard";
import NavbarReplica from "../components/nav";
import ShareIcon from "../assets/images/share.png";
import ReelComments from ".././components/ReelsComponents/reels_comments";
import axios from "axios";

const SCROLL_THRESHOLD = 0.75;
const PLAY_PAUSE_DELAY = 800;
const DROPDOWN_WIDTH = 180;
const MAX_REELS_LIMIT = 50;

// Helper to resolve URLs like in group_main_home.jsx
const resolveMediaUrl = (path) => {
  if (!path) return null;
  if (typeof path === "string" && path.startsWith("http")) return path;
  const base = (import.meta.env.VITE_API_BASE_URL || "").replace("/api", "");
  return `${base}/storage/${path}`;
};

// Utility functions
const formatCount = (num) =>
  num >= 1000 ? `${(num / 1000).toFixed(1).replace(".0", "")}k` : num;

// Custom hook for video control
const useVideoControl = (videoRefs, activeIndex) => {
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === activeIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeIndex]);
};

const Reels = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const videoRefs = useRef([]);
  const playPauseTimeoutRef = useRef(null);
  const isFetchingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  // Combined states
  const [activeIndex, setActiveIndex] = useState(0);
  const [playState, setPlayState] = useState({
    showIcon: false,
    isPlaying: true,
  });
  const [dropdown, setDropdown] = useState(null);
  const [expandedTags, setExpandedTags] = useState({});
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [reels, setReels] = useState([]);
  const [fetchedIds, setFetchedIds] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMoreReels, setHasMoreReels] = useState(true);
  const [showSharePopup, setShowSharePopup] = useState({});
  const [showComments, setShowComments] = useState(false);
  const [activeReelId, setActiveReelId] = useState(null);
  const [activeReelData, setActiveReelData] = useState(null);

  // Custom hook usage
  useVideoControl(videoRefs, activeIndex);

  // Ensure autoplay when reels load or activeIndex changes
  useEffect(() => {
    const video = videoRefs.current[activeIndex];
    if (video && typeof video.play === "function") {
      video.play().catch(() => {});
    }
  }, [reels, activeIndex]);

  // Optimized play/pause overlay
  const showPlayPauseOverlay = useCallback((playing) => {
    setPlayState({ showIcon: true, isPlaying: playing });

    if (playPauseTimeoutRef.current) {
      clearTimeout(playPauseTimeoutRef.current);
    }

    playPauseTimeoutRef.current = setTimeout(() => {
      setPlayState((prev) => ({ ...prev, showIcon: false }));
    }, PLAY_PAUSE_DELAY);
  }, []);

  // Optimized video toggle
  const toggleVideo = useCallback(
    (index) => {
      const video = videoRefs.current[index];
      const item = reels[index];
      if (!video || !item || item.type !== "video") return;

      const isPlaying = !video.paused;
      if (isPlaying) {
        video.pause();
        showPlayPauseOverlay(false);
      } else {
        video.play();
        showPlayPauseOverlay(true);
      }
    },
    [showPlayPauseOverlay, reels]
  );

  // Toggle tags expansion
  const toggleTagsExpansion = useCallback((index) => {
    setExpandedTags((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }, []);

  // Toggle description expansion
  const toggleDescriptionExpansion = useCallback((index) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }, []);

  // Render tags with limit
  const renderTags = useCallback(
    (tags, index, maxVisible = 3) => {
      if (!tags || tags.length === 0) return null;

      const visibleTags = tags.slice(0, maxVisible);
      const remainingCount = tags.length - maxVisible;

      return (
        <div className="mt-2">
          <div className="text-white text-sm">
            {expandedTags[index] ? (
              <div>
                <span>{tags.map((tag) => `#${tag}`).join(" ")}</span>
                <button
                  onClick={() => toggleTagsExpansion(index)}
                  className="text-blue-400 hover:text-blue-300 ml-2 font-medium"
                >
                  See Less
                </button>
              </div>
            ) : (
              <div>
                <span>{visibleTags.map((tag) => `#${tag}`).join(" ")}....</span>
                {remainingCount > 0 && (
                  <button
                    onClick={() => toggleTagsExpansion(index)}
                    className="text-blue-400 hover:text-blue-300 ml-1 font-medium"
                  >
                    See More
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      );
    },
    [expandedTags, toggleTagsExpansion]
  );

  // Render description with limit
  const renderDescription = useCallback(
    (description, index, maxLength = 80) => {
      if (!description) return null;

      const isExpanded = expandedDescriptions[index];
      const shouldTruncate = description.length > maxLength;

      if (!shouldTruncate) {
        return (
          <p className="text-white text-sm leading-relaxed pr-12">
            {description}
          </p>
        );
      }

      return (
        <div className="text-white text-sm leading-relaxed pr-12">
          {isExpanded ? (
            <div>
              <span>{description}</span>
              <button
                onClick={() => toggleDescriptionExpansion(index)}
                className="text-blue-400 hover:text-blue-300 ml-2 font-medium"
              >
                See Less
              </button>
            </div>
          ) : (
            <div>
              <span>{description.substring(0, maxLength)}...</span>
              <button
                onClick={() => toggleDescriptionExpansion(index)}
                className="text-blue-400 hover:text-blue-300 ml-0 font-medium"
              >
                See More
              </button>
            </div>
          )}
        </div>
      );
    },
    [expandedDescriptions, toggleDescriptionExpansion]
  );

  // Body scroll management (simplified)
  useEffect(() => {
    // Reset scroll position to top when entering reels
    window.scrollTo(0, 0);

    const scrollTop = window.scrollY;
    const bodyStyle = document.body.style;

    // Save original styles
    const originalStyles = {
      overflow: bodyStyle.overflow,
      position: bodyStyle.position,
      top: bodyStyle.top,
      width: bodyStyle.width,
    };

    // Apply reels styles
    Object.assign(bodyStyle, {
      overflow: "hidden",
      position: "fixed",
      top: `-${scrollTop}px`,
      width: "100%",
    });

    return () => {
      Object.assign(bodyStyle, originalStyles);
      // Don't restore scroll position when leaving reels

      if (playPauseTimeoutRef.current) {
        clearTimeout(playPauseTimeoutRef.current);
      }
    };
  }, []);

  // Reset container scroll to top when reels load
  useEffect(() => {
    // Only scroll to top when first reels are loaded, not when new ones are added
    if (containerRef.current && reels.length > 0 && !initialized) {
      containerRef.current.scrollTop = 0;
      setActiveIndex(0);
    }
  }, [reels.length, initialized]);

  // Intersection observer for active index with throttling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > SCROLL_THRESHOLD) {
            const newIndex = Number(entry.target.getAttribute("data-index"));
            if (newIndex !== activeIndex) {
              setActiveIndex(newIndex);
            }
          }
        });
      },
      {
        root: container,
        threshold: [0, 0.25, 0.5, SCROLL_THRESHOLD, 1],
        rootMargin: "0px 0px -10% 0px", // This helps with better detection
      }
    );

    const items = container.querySelectorAll("[data-index]");
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [reels.length, activeIndex]);

  // Optimized scroll handler with throttling
  const scrollToIndex = useCallback((index) => {
    if (scrollTimeoutRef.current) return;

    scrollTimeoutRef.current = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;

      const item = container.querySelector(`[data-index="${index}"]`);
      if (item) {
        item.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      scrollTimeoutRef.current = null;
    }, 50);
  }, []);

  // Optimized wheel event handler with throttling
  useEffect(() => {
    let wheelTimeout = null;

    const handler = (e) => {
      e.preventDefault();

      if (wheelTimeout) return;

      wheelTimeout = setTimeout(() => {
        const newIndex =
          e.deltaY > 0
            ? Math.min(activeIndex + 1, Math.max(reels.length - 1, 0))
            : Math.max(activeIndex - 1, 0);

        if (newIndex !== activeIndex) {
          scrollToIndex(newIndex);
        }
        wheelTimeout = null;
      }, 100);
    };

    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handler, { passive: false });
    return () => {
      container.removeEventListener("wheel", handler);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [activeIndex, scrollToIndex, reels.length]);

  // API fetcher
  const fetchMoreReels = useCallback(async () => {
    if (isFetchingRef.current || !hasMoreReels) return;
    isFetchingRef.current = true;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("user_id");
      const resp = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/getreels`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
            user_id: userId || "",
          },
          body: JSON.stringify({ already_fetched_ids: fetchedIds }),
        }
      );
      const json = await resp.json();

      if (json && json.status && Array.isArray(json.data)) {
        if (json.data.length === 0) {
          setHasMoreReels(false);
          return;
        }

        const mapped = json.data.map((r) => {
          let parsedTags = [];
          try {
            parsedTags = r.tags ? JSON.parse(r.tags) : [];
          } catch (e) {
            parsedTags = [];
          }

          return {
            id: r.id,
            type: "video",
            src: resolveMediaUrl(r.video_file),
            thumbnail: resolveMediaUrl(r.thumbnail),
            user: r?.user?.name || "",
            userProfilePhoto: resolveMediaUrl(r?.user?.profile?.profile_photo),
            likes: r.likes || 0,
            comments: r.comments_count || 0,
            shares: r.shares || 0,
            description: r.description || "",
            tags: parsedTags,
            isLiked: r.isLiked ? true : false,
            isSaved: r.isSaved ? true : false,
          };
        });

        setReels((prev) => [...prev, ...mapped]);
        setFetchedIds((prev) => [...prev, ...(json.fetched_ids || [])]);
      }
    } catch (e) {
      // Silent error handling
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [fetchedIds, hasMoreReels]);

  // Initial fetch
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      fetchMoreReels().then(() => {
        // Only scroll to top after initial fetch
        if (containerRef.current) {
          containerRef.current.scrollTop = 0;
          setActiveIndex(0);
        }
      });
    }
  }, [initialized, fetchMoreReels]);

  // Prefetch when reaching the second-to-last item
  useEffect(() => {
    if (reels.length === 0 || !hasMoreReels) return;
    const nearEnd = activeIndex >= reels.length - 2;
    if (
      nearEnd &&
      !loading &&
      !isFetchingRef.current &&
      reels.length < MAX_REELS_LIMIT &&
      hasMoreReels
    ) {
      fetchMoreReels();
    }
  }, [activeIndex, reels.length, loading, hasMoreReels, fetchMoreReels]);

  // Reset hasMoreReels when user goes back to earlier reels
  useEffect(() => {
    if (activeIndex < reels.length - 3) {
      setHasMoreReels(true);
    }
  }, [activeIndex, reels.length]);

  // Dropdown handlers
  const toggleDropdown = useCallback(
    (e, index) => {
      e.stopPropagation();

      if (dropdown) {
        setDropdown(null);
      } else {
        const rect = e.currentTarget.getBoundingClientRect();
        setDropdown({
          x: rect.right - DROPDOWN_WIDTH,
          y: rect.bottom,
          index,
        });
      }
    },
    [dropdown]
  );

  const handleReportReel = useCallback(() => {
    setDropdown(null);
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = () => setDropdown(null);

    if (dropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [dropdown]);

  const onBackToHome = () => navigate("/");

  const handleLike = async (reelId, index) => {
    try {
      const userId = localStorage.getItem("user_id");
      const token = localStorage.getItem("token");

      setReels((prev) =>
        prev.map((r, i) =>
          i === index
            ? {
                ...r,
                isLiked: !r.isLiked,
                likes: r.isLiked ? r.likes - 1 : r.likes + 1,
              }
            : r
        )
      );

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/likereel`,
        {
          reel_id: reelId,
          user_id: userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setReels((prev) =>
          prev.map((r, i) => {
            if (i !== index) return r;
            return {
              ...r,
              isLiked: response.data.liked,
              // likes: response.data.liked ? r.likes + 1 : r.likes - 1,
            };
          })
        );
      }

      console.log("Like response:", response.data);
    } catch (error) {
      console.error(
        "Error liking reel:",
        error.response?.data || error.message
      );
    }
  };

  const handleSave = async (reelId, index) => {
    try {
      const userId = localStorage.getItem("user_id");
      const token = localStorage.getItem("token");

      setReels((prev) =>
        prev.map((r, i) =>
          i === index
            ? {
                ...r,
                isSaved: !r.isSaved,
                // likes: r.isSaved ? r.likes - 1 : r.likes + 1,
              }
            : r
        )
      );

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/savereel`,
        {
          reel_id: reelId,
          user_id: userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setReels((prev) =>
          prev.map((r, i) => {
            if (i !== index) return r;
            return {
              ...r,
              isSaved: response.data.saved,
              // likes: response.data.liked ? r.likes + 1 : r.likes - 1,
            };
          })
        );
      }

      console.log("Like response:", response.data);
    } catch (error) {
      console.error(
        "Error liking reel:",
        error.response?.data || error.message
      );
    }
  };

  // Memoized reels rendering for better performance
  const renderedReels = useMemo(() => {
    return reels.map((item, index) => (
      <div
        key={item.id}
        data-index={index}
        className="snap-start h-full w-full flex items-end relative"
      >
        <div className="relative h-full w-full rounded-2xl overflow-hidden">
          {item.type === "video" ? (
            <video
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              src={item.src}
              className="w-full h-full object-cover cursor-pointer"
              loop
              playsInline
              // muted
              autoPlay={index === activeIndex}
              poster={item.thumbnail || undefined}
              onClick={() => toggleVideo(index)}
              preload="metadata"
            />
          ) : (
            <img
              src={item.src}
              alt="reel"
              className="w-full h-full object-cover"
            />
          )}

          {/* Play/Pause Overlay */}
          {item.type === "video" && index === activeIndex && (
            <div
              className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
                playState.showIcon ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="bg-black/35 rounded-full p-4 backdrop-blur-sm">
                {playState.isPlaying ? (
                  <Pause className="w-12 h-12 text-white fill-white" />
                ) : (
                  <Play className="w-12 h-12 text-white fill-white" />
                )}
              </div>
            </div>
          )}

          {/* Top Controls */}
          <div className="absolute top-2 left-4 right-4 z-20 flex items-center justify-between">
            <button className="p-2">
              <Volume2 className="w-7 h-7 text-white fill-white" />
            </button>
            <button
              className="p-2 relative"
              onClick={(e) => toggleDropdown(e, index)}
            >
              <MoreHorizontal className="w-7 h-7 text-white" />
            </button>
          </div>

          {/* Bottom User Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={
                  item.userProfilePhoto ||
                  "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                }
                alt={item.user}
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium text-sm">
                    {item.user}
                  </span>
                  <button className="bg-transparent border border-white text-white px-7 py-1 rounded-md text-sm ms-2 font-medium hover:bg-white hover:text-black transition-colors">
                    Follow
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Description */}
            {renderDescription(item.description, index)}

            {/* Dynamic Hashtags */}
            {renderTags(item.tags, index)}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 ml-4 mb-6">
          {/* Like */}
          <div
            onClick={() => handleLike(item.id, index)}
            className="flex flex-col items-center"
          >
            <button className="p-2 hover:bg-black/20 rounded-full transition-colors">
              <ThumbsUp
                className={`w-7 h-7 ${
                  item.isLiked
                    ? "fill-[#0017e7] text-transparent"
                    : "text-black"
                } `}
              />
            </button>

            <span className="text-black text-xs mt-1 font-medium">
              {formatCount(reels[activeIndex]?.likes || 0)}
            </span>
          </div>

          {/* Comment */}
          <div className="flex flex-col items-center">
            <button
              className="p-2 hover:bg-black/20 rounded-full transition-colors"
              onClick={() => {
                setActiveReelId(item.id); // reel id set
                setActiveReelData({
                  id: item.id,
                  ownerName: item.user,
                  ownerProfilePhoto:
                    item.userProfilePhoto ||
                    "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
                });
                setShowComments(true);
              }}
            >
              <MessageCircle className="w-7 h-7 text-black" />
            </button>
            <span className="text-black text-xs mt-1 font-medium">
              {formatCount(reels[activeIndex]?.comments || 0)}
            </span>
          </div>

          {/* Share */}
          <div
            onClick={() =>
              setShowSharePopup((prev) => ({
                ...prev,
                [post.uniqueId]: true,
              }))
            }
            className="flex flex-col items-center"
          >
            <button className="p-2 hover:bg-black/20 rounded-full transition-colors">
              <img src={ShareIcon} className="w-8 h-7" alt="share" />
            </button>
            <span className="text-black text-xs mt-1 font-medium">
              {formatCount(reels[activeIndex]?.shares || 0)}
            </span>
          </div>

          {/* Save */}
          <div
            onClick={() => handleSave(item.id, index)}
            className="flex flex-col items-center"
          >
            <button className="p-2 hover:bg-black/20 rounded-full transition-colors">
              <Bookmark
                className={`w-7 h-7 ${
                  item.isSaved
                    ? "fill-[#0017e7] text-transparent"
                    : "text-black"
                } `}
              />
            </button>
            <span className="text-black text-xs mt-1 font-medium">8137</span>
          </div>
        </div>
      </div>
    ));
  }, [
    reels,
    activeIndex,
    playState,
    toggleVideo,
    toggleDropdown,
    renderDescription,
    renderTags,
  ]);

  return (
    <>
      {Object.keys(showSharePopup).map((postId) => {
        if (!showSharePopup[postId]) return null;
        const sharePost = sortedPosts.find((p) => p.uniqueId === postId);
        return (
          <PostShare
            key={`share-${postId}`}
            post={sharePost}
            onClose={() =>
              setShowSharePopup((prev) => ({ ...prev, [postId]: false }))
            }
          />
        );
      })}
      <NavbarReplica />
      <div className="min-h-screen bg-gray-100 overflow-hidden">
        <div className="max-w-[86rem] mx-auto px-0 md:px-4 py-0 md:py-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="hidden md:block md:col-span-3 mt-1">
              <ProfileCard />
              <SidebarMenu />
            </div>

            <div className="col-span-1 md:col-span-9">
              <div className="p-4 ml-12">
                <div className="relative">
                  <div
                    ref={containerRef}
                    className="h-[85vh] w-full max-w-md mx-auto overflow-y-scroll snap-y snap-mandatory scrollbar-hide rounded-2xl"
                    style={{
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                      overscrollBehavior: "contain",
                      scrollBehavior: "smooth",
                    }}
                    tabIndex={0}
                  >
                    {renderedReels}
                  </div>

                  {/* Dropdown Menu */}
                  {dropdown && (
                    <div
                      className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[180px]"
                      style={{ left: dropdown.x, top: dropdown.y }}
                    >
                      <button
                        onClick={handleReportReel}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100"
                      >
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <span className="text-red-500 font-medium">
                          Report Reel
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Right Actions Panel */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showComments && activeReelId && (
        <ReelComments
          reelId={activeReelId}
          ownerName={activeReelData.ownerName}
          ownerProfilePhoto={activeReelData.ownerProfilePhoto}
          onClose={() => {
            setShowComments(false);
            setActiveReelData(null); // Clear active reel data when closing
          }}
        />
      )}

      {/* Hide Scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default Reels;
