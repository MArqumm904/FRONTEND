import { useState, useRef, useEffect } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import {
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Forward,
  Play,
  Heart,
  Bookmark,
} from "lucide-react";
import Person1 from "../../assets/images/person-1.png";
import PostImage from "../../assets/images/postimage.png";
import bookmark from "../../assets/images/bookmark 1.png";
import avatorr from "../../assets/images/avatorr.png";
import error from "../../assets/images/error.png";
import addtostory from "../../assets/images/addtostory.png";
import PostCreate from "../profilecomponents/post_edit";
import PostComment from "../post_comment";
import PostShare from "../post_share";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomePostTab = ({
  posts_data = [],
  poll_posts_data = [],
  onAddToStory,
  fetchPosts,
  loading,
  hasMore,
  refreshPosts,
}) => {
  const [showMenu, setShowMenu] = useState({});
  const [showFullText, setShowFullText] = useState({});
  const [isLiked, setIsLiked] = useState({});
  const [showAnimation, setShowAnimation] = useState({});
  const [showCommentPopup, setShowCommentPopup] = useState({});
  const [showSharePopup, setShowSharePopup] = useState({});
  const [videoPlaying, setVideoPlaying] = useState({});
  const [showPostCreatePopup, setShowPostCreatePopup] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showReactions, setShowReactions] = useState({});
  const [selectedReaction, setSelectedReaction] = useState({});
  const [hoverTimeout, setHoverTimeout] = useState({});
  const [pollVotes, setPollVotes] = useState({});
  const menuRef = useRef(null);
  const [isSavingPost, setIsSavingPost] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(null);
  const navigate = useNavigate();
  // console.log("posts_data", posts_data);

  useEffect(() => {
    // Properly check if any popup is actually open
    const hasCommentPopup = Object.values(showCommentPopup).some(Boolean);
    const hasSharePopup = Object.values(showSharePopup).some(Boolean);

    if (hasCommentPopup || hasSharePopup || showPostCreatePopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showCommentPopup, showSharePopup, showPostCreatePopup]);

  // Infinite scroll hook
  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage: hasMore,
    onLoadMore: fetchPosts,
    rootMargin: "0px 0px 400px 0px",
  });

  const reactions = [
    { name: "like", icon: "👍", color: "text-[#0017e7]", component: ThumbsUp },
    { name: "love", icon: "❤️", color: "text-red-500", component: Heart },
    { name: "care", icon: "🤗", color: "text-yellow-500" },
    { name: "haha", icon: "😂", color: "text-yellow-500" },
    { name: "wow", icon: "😮", color: "text-yellow-500" },
    { name: "sad", icon: "😢", color: "text-yellow-500" },
    { name: "angry", icon: "😠", color: "text-orange-500" },
  ];

  const recommendations = [
    {
      id: 1,
      name: "Sarah Malik",
      avatar: PostImage,
      description:
        "Freelance Web designer helping startups build bold, modern brand identities",
    },
    {
      id: 2,
      name: "Arshpixels",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
      description:
        "Freelance designer helping startups build bold, modern brand identities",
    },
    {
      id: 3,
      name: "Codebyrixa",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      description:
        "Freelance iOS Developer helping startups build bold, modern brand identities",
    },
  ];

  const handlePollVote = (postId, optionId) => {
    setPollVotes((prev) => ({
      ...prev,
      [postId]: optionId,
    }));
  };

  const handleLike = async (postId) => {
    const currentPost = sortedPosts.find((p) => p.uniqueId === postId);
    const reactionType = currentPost?.current_user_reaction || "like";

    // Extract only the ID part (remove prefix like "text_", "poll_", etc.)
    const actualPostId = postId.includes("_") ? postId.split("_")[1] : postId;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/postsreactions`,
        {
          post_id: actualPostId,
          reaction_type: reactionType,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update the post data directly in posts_data
      const updatedPosts = posts_data.map((post) => {
        if (post.uniqueId === postId) {
          return {
            ...post,
            current_user_reaction: currentPost?.current_user_reaction
              ? null
              : "like",
            total_reactions: currentPost?.current_user_reaction
              ? (post.total_reactions || 1) - 1
              : (post.total_reactions || 0) + 1,
            reactions_count: {
              ...post.reactions_count,
              like: currentPost?.current_user_reaction
                ? Math.max(0, (post.reactions_count?.like || 1) - 1)
                : (post.reactions_count?.like || 0) + 1,
            },
          };
        }
        return post;
      });

      // Call the parent component to update the posts
      if (window.updatePostsData) {
        window.updatePostsData(updatedPosts);
      }

      setShowAnimation((prev) => ({ ...prev, [postId]: true }));
      setTimeout(
        () => setShowAnimation((prev) => ({ ...prev, [postId]: false })),
        600
      );
    } catch (error) {
      console.error("Error sending reaction:", error);
    }
  };

  const handleReactionSelect = async (postId, reactionName) => {
    const currentPost = sortedPosts.find((p) => p.uniqueId === postId);
    const actualPostId = postId.includes("_") ? postId.split("_")[1] : postId;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/postsreactions`,
        {
          post_id: actualPostId,
          reaction_type: reactionName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update the post data directly
      const updatedPosts = posts_data.map((post) => {
        if (post.uniqueId === postId) {
          const oldReaction = post.current_user_reaction;
          return {
            ...post,
            current_user_reaction: reactionName,
            total_reactions: oldReaction
              ? post.total_reactions
              : (post.total_reactions || 0) + 1,
            reactions_count: {
              ...post.reactions_count,
              // Remove old reaction count
              ...(oldReaction && {
                [oldReaction]: Math.max(
                  0,
                  (post.reactions_count?.[oldReaction] || 1) - 1
                ),
              }),
              // Add new reaction count
              [reactionName]: (post.reactions_count?.[reactionName] || 0) + 1,
            },
          };
        }
        return post;
      });

      // Update parent component
      if (window.updatePostsData) {
        window.updatePostsData(updatedPosts);
      }

      setShowReactions((prev) => ({ ...prev, [postId]: false }));
      setShowAnimation((prev) => ({ ...prev, [postId]: true }));
      setTimeout(
        () => setShowAnimation((prev) => ({ ...prev, [postId]: false })),
        600
      );
    } catch (error) {
      console.error("Error sending reaction:", error);
    }
  };

  const handleLikeHover = (postId) => {
    const timeout = setTimeout(() => {
      setShowReactions((prev) => ({ ...prev, [postId]: true }));
    }, 500);

    setHoverTimeout((prev) => ({ ...prev, [postId]: timeout }));
  };

  const handleLikeLeave = (postId) => {
    if (hoverTimeout[postId]) {
      clearTimeout(hoverTimeout[postId]);
    }

    setTimeout(() => {
      setShowReactions((prev) => ({ ...prev, [postId]: false }));
    }, 3500);
  };

  const handleReactionsHover = (postId) => {
    setShowReactions((prev) => ({ ...prev, [postId]: true }));
  };

  const handleReactionsLeave = (postId) => {
    setTimeout(() => {
      setShowReactions((prev) => ({ ...prev, [postId]: false }));
    }, 3500);
  };

  const getReactionIcon = (postId) => {
    const reaction = selectedReaction[postId] || "like";
    const reactionData = reactions.find((r) => r.name === reaction);

    if (reaction === "like") {
      return (
        <ThumbsUp
          className={`w-5 h-5 transition-all duration-300 ${
            showAnimation[postId] ? "animate-bounce" : ""
          }`}
          fill={isLiked[postId] ? "currentColor" : "none"}
        />
      );
    } else if (reaction === "love") {
      return (
        <Heart
          className={`w-5 h-5 transition-all duration-300 ${
            showAnimation[postId] ? "animate-bounce" : ""
          }`}
          fill={isLiked[postId] ? "currentColor" : "none"}
        />
      );
    } else {
      return (
        <span
          className={`text-xl transition-all duration-300 ${
            showAnimation[postId] ? "animate-bounce" : ""
          }`}
        >
          {reactionData?.icon}
        </span>
      );
    }
  };

  const getReactionText = (postId) => {
    const reaction = selectedReaction[postId] || "like";
    return reaction.charAt(0).toUpperCase() + reaction.slice(1);
  };

  const getReactionColor = (postId) => {
    const reaction = selectedReaction[postId] || "like";
    const reactionData = reactions.find((r) => r.name === reaction);
    return isLiked[postId]
      ? reactionData?.color || "text-[#0017e7]"
      : "text-gray-600 hover:text-[#0017e7]";
  };

  const handleEditPost = (postId) => {
    const post = allPosts.find((p) => p.uniqueId === postId);
    setSelectedPost(post);
    setShowMenu((prev) => ({ ...prev, [postId]: false }));
    setShowPostCreatePopup(true);
  };

  const toggleMenu = (postId) => {
    setShowMenu((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {}),
      [postId]: !prev[postId],
    }));
  };

  const toggleFullText = (postId) => {
    setShowFullText((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleVideoPlay = (postId) => {
    setVideoPlaying((prev) => ({ ...prev, [postId]: true }));
  };

  const handleVideoPause = (postId) => {
    setVideoPlaying((prev) => ({ ...prev, [postId]: false }));
  };

  const allPosts = [
    ...posts_data,
    ...poll_posts_data.map((post, index) => ({
      ...post,
      type: "poll",
      id: `poll${index}`,
      uniqueId: `poll_${post.id || index}`,
    })),
  ];

  const sortedPosts = allPosts;

  const handleSavePost = async (postId) => {
    if (isSavingPost) return;

    const token = localStorage.getItem("token");
    const numericPostId = parseInt(postId.replace(/\D/g, ""), 10);

    setIsSavingPost(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/savedapost`,
        { post_id: numericPostId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.success) {
        setIsBookmarked(response.data.data.user_saved);
      } else {
        console.error("Failed to save post:", response.data?.message);
      }
    } catch (error) {
      console.error("Error saving post:", error);
    } finally {
      setIsSavingPost(false);
    }
  };

  if (!loading && posts_data.length === 0 && !hasMore) {
    return (
      <div className="w-full max-w-full">
        <div className="bg-white rounded-lg shadow-lg border border-[#6974b1] mb-4 w-full">
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Posts Yet
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              Be the first to share something! Create your first post to get the
              conversation started.
            </p>
            <button
              onClick={() => refreshPosts()}
              className="mt-6 px-6 py-2 bg-[#0017e7] text-white rounded-lg hover:bg-[#0013c4] transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading && posts_data.length === 0) {
    return (
      <div className="w-full max-w-full">
        <div className="bg-white rounded-lg shadow-lg border border-[#6974b1] mb-4 w-full">
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6974b1] mb-4"></div>
            <p className="text-gray-600">Loading posts...</p>
          </div>
        </div>
      </div>
    );
  }

  const renderPostContent = (post) => {
    switch (post.type) {
      case "text":
        return (
          <div className="px-5 py-4 hover:bg-gray-50 rounded-lg mb-3">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <p
                  className={`text-gray-800 text-base leading-relaxed font-medium font-sf transition-all duration-300 ${
                    !showFullText[post.uniqueId] ? "line-clamp-3" : ""
                  }`}
                >
                  {post.content}
                </p>
                {post.content.length > 80 && (
                  <button
                    className="text-[#0017e7] font-semibold mt-2 cursor-pointer hover:underline text-sm"
                    onClick={() => toggleFullText(post.uniqueId)}
                  >
                    {showFullText[post.uniqueId] ? "See Less" : "See More"}
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case "image":
        return (
          <div className="pb-3 w-full">
            <div className="relative bg-[#0017e7] overflow-hidden w-full">
              <img
                src={post.image || PostImage}
                alt="Post"
                className="w-full h-[28rem] object-cover"
              />
            </div>
          </div>
        );

      case "video":
        return (
          <div className="pb-3 w-full">
            <div className="relative bg-black overflow-hidden w-full">
              <video
                controls
                className="w-full h-[35rem] object-cover"
                onPlay={() => handleVideoPlay(post.uniqueId)}
                onPause={() => handleVideoPause(post.uniqueId)}
                style={{
                  outline: "none",
                  border: "none",
                }}
              >
                <source src={post.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {!videoPlaying[post.uniqueId] && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    const video = e.currentTarget.previousElementSibling;
                    if (video && video.tagName === "VIDEO") {
                      video.play();
                    }
                  }}
                >
                  <div className="w-16 h-16 bg-black bg-opacity-70 rounded-full flex items-center justify-center hover:bg-opacity-90 transition-all">
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case "poll":
        const userVoted = pollVotes[post.uniqueId];
        const hasVoted = userVoted !== undefined;

        return (
          <div className="pb-3 w-full px-5">
            <div className="space-y-2">
              {post.poll?.options?.map((option) => {
                const isSelected = userVoted === option.id;
                const percentage = hasVoted ? option.percentage : 0;

                return (
                  <div
                    key={option.id}
                    className="relative border border-gray-300 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:border-gray-400"
                    onClick={() =>
                      !hasVoted &&
                      handlePollVote(post.uniqueId, option.id, option.text)
                    }
                  >
                    {/* Background fill bar */}
                    {hasVoted && (
                      <div
                        className="absolute top-0 left-0 h-full bg-gray-300 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    )}

                    {/* Content */}
                    <div className="relative z-10 flex items-center justify-between p-4">
                      <span className="font-medium text-gray-800">
                        {option.text}
                      </span>

                      <div className="flex items-center space-x-3">
                        {hasVoted && (
                          <span className="text-sm font-medium text-gray-700">
                            {percentage}%
                          </span>
                        )}

                        {/* Radio button */}
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            hasVoted && isSelected
                              ? "border-gray-600 bg-white"
                              : "border-gray-400 bg-white"
                          }`}
                        >
                          {hasVoted && isSelected && (
                            <div className="w-2.5 h-2.5 bg-gray-600 rounded-full" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {hasVoted && (
              <div className="mt-4 text-sm text-gray-600 text-center">
                Total votes: {post.poll?.totalVotes || 0}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return "Just Now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} Minutes Ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} Hours Ago`;
    } else {
      return `${diffInDays} Days Ago`;
    }
  };

  return (
    <>
      {showPostCreatePopup && (
        <PostCreate
          onClose={() => setShowPostCreatePopup(false)}
          editData={selectedPost}
        />
      )}

      {/* Comment Popup */}
      {Object.keys(showCommentPopup).map((postId) => {
        if (!showCommentPopup[postId]) return null;

        const post = sortedPosts.find((p) => p.uniqueId === postId);
        if (!post) return null;

        return (
          <PostComment
            key={`comment-${postId}`}
            userAvatar={post.user?.profile_photo || Person1}
            post_image={post.type === "image" ? post.image : null}
            text={post.type === "text" ? post.content : null}
            videoUrl={post.type === "video" ? post.video : null}
            pollData={post.type === "poll" ? post.poll : null}
            postData={post}
            userName={post.user?.name || "Design Foundation"}
            postTime={formatTimeAgo(post.timestamp || post.created_at)}
            totalReactions={post.total_reactions || 0}
            reactionsCount={post.reactions_count || {}}
            currentUserReaction={post.current_user_reaction}
            commentsCount={post.comments || 0}
            viewsCount={post.views || 0}
            caption={post.content}
            postType={post.type}
            pollVotes={pollVotes}
            onPollVote={handlePollVote}
            postId={postId}
            userId={post.user?.id || ""}
            onClose={() =>
              setShowCommentPopup((prev) => ({ ...prev, [postId]: false }))
            }
          />
        );
      })}

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

      <div className="w-full max-w-full ">
        <div className="grid gap-6 w-full">
          <div className="col-span-12 lg:col-span-7 w-full">
            {sortedPosts.map((post) => (
              <div
                key={post.uniqueId}
                className="bg-white rounded-lg shadow-lg border border-[#6974b1] mb-4 w-full"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-5 pb-3 relative">
                  {/* Left profile + name block */}
                  <div
                    onClick={() => navigate(`/profile/${post.user.id}`)}
                    className="flex items-center"
                  >
                    <div className="w-12 h-12 rounded-md flex items-center justify-center mr-3">
                      <img
                        src={post.user?.profile_photo || Person1}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full cursor-pointer"
                        onError={(e) => {
                          e.target.src = Person1; // Fallback if image fails to load
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-900 text-sm cursor-pointer">
                          {post.user?.name || "Design Foundation"}
                        </span>
                      </div>
                      <span
                        className={`text-xs ${
                          formatTimeAgo(post.timestamp || post.created_at) ===
                          "Just Now"
                            ? "text-[#0017e7]"
                            : "text-gray-500"
                        }`}
                      >
                        {formatTimeAgo(post.timestamp || post.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* More icon + dropdown */}
                  <div className="relative" ref={menuRef}>
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => toggleMenu(post.uniqueId)}
                    >
                      <MoreHorizontal className="w-5 h-5 mb-5 mx-1" />
                    </button>

                    {showMenu[post.uniqueId] && (
                      <div className="absolute right-0 mt-1 w-52 bg-white border border-gray-200 rounded-md shadow-md z-20 p-2 space-y-2 text-sm">
                        <button
                          onClick={() => handleSavePost(post.uniqueId)}
                          className={`w-full flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded-md text-left ${
                            isSavingPost ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {isSavingPost ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500"></div>
                            </div>
                          ) : (
                            // <img
                            //   src={bookmark}
                            //   alt="Save"
                            //   className="w-4 h-4"
                            // />
                            <Bookmark
                              className={`w-5 h-5 ${
                                isBookmarked
                                  ? "text-yellow-500 hover:text-yellow-600"
                                  : "text-gray-600 hover:text-black"
                              }`}
                              fill={isBookmarked ? "currentColor" : "none"}
                            />
                          )}

                          <span>Save Post</span>
                        </button>
                        <button
                          onClick={() => navigate(`/profile/${post.user.id}`)}
                          className="w-full flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded-md text-left"
                        >
                          <img
                            src={avatorr}
                            alt="Profile"
                            className="w-4 h-4"
                          />
                          <span>View The Profile</span>
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded-md text-left text-red-600 font-medium">
                          <img src={error} alt="Report" className="w-4 h-4" />
                          <span>Report Post</span>
                        </button>
                        <button
                          className="w-full flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded-md text-left"
                          onClick={() => {
                            onAddToStory(post);
                            setShowMenu((prev) => ({
                              ...prev,
                              [post.uniqueId]: false,
                            }));
                          }}
                        >
                          <img src={addtostory} alt="Add" className="w-4 h-4" />
                          <span>Add to story</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Post Description */}
                {post.content && post.type !== "text" && (
                  <p className="px-5 text-gray-600 text-sm mb-3 font-sf mt-3 font-medium">
                    <span className="block md:hidden">
                      {showFullText[post.uniqueId]
                        ? post.content
                        : post.content.length > 100
                        ? `${post.content.substring(0, 100)}...`
                        : post.content}
                      {post.content.length > 100 && (
                        <span
                          className="text-[#0017e7] font-semibold ml-1 cursor-pointer"
                          onClick={() => toggleFullText(post.uniqueId)}
                        >
                          {showFullText[post.uniqueId]
                            ? "See Less"
                            : "See More"}
                        </span>
                      )}
                    </span>

                    <span className="hidden md:block">{post.content}</span>
                  </p>
                )}

                {/* Content based on post type */}
                {renderPostContent(post)}

                {/* Reactions */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 ms-1">
                      {(post.total_reactions > 0 || post.reactions_count) && (
                        <>
                          <div className="flex items-center -space-x-2">
                            {/* Show reaction icons based on what reactions exist */}
                            {post.reactions_count?.like > 0 && (
                              <div className="w-8 h-8 bg-[#0017e7] rounded-full flex items-center justify-center border-2 border-white z-20">
                                <ThumbsUp className="w-4 h-4 text-white fill-white" />
                              </div>
                            )}
                            {post.reactions_count?.love > 0 && (
                              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center border-2 border-white z-10">
                                <span className="text-white text-sm">❤️</span>
                              </div>
                            )}
                            {post.reactions_count?.haha > 0 && (
                              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-white">
                                <span className="text-white text-sm">😂</span>
                              </div>
                            )}
                            {post.reactions_count?.wow > 0 && (
                              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white">
                                <span className="text-white text-sm">😮</span>
                              </div>
                            )}
                            {post.reactions_count?.sad > 0 && (
                              <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center border-2 border-white">
                                <span className="text-white text-sm">😢</span>
                              </div>
                            )}
                            {post.reactions_count?.angry > 0 && (
                              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center border-2 border-white">
                                <span className="text-white text-sm">😠</span>
                              </div>
                            )}
                          </div>

                          {/* Show reaction text */}
                          <span className="text-sm font-medium text-gray-700">
                            {post.current_user_reaction &&
                            post.total_reactions > 1
                              ? `You and ${post.total_reactions - 1} others`
                              : post.current_user_reaction
                              ? "You"
                              : `${post.total_reactions} ${
                                  post.total_reactions === 1
                                    ? "reaction"
                                    : "reactions"
                                }`}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{post.comments || 0} Comments</span>
                      <span className="text-gray-300">|</span>
                      <span>{post.views || 0} Views</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-gray-200 px-9 py-5">
                  <div className="flex justify-between">
                    <div className="relative">
                      {/* like button */}
                      <button
                        onClick={() => handleLike(post.uniqueId)}
                        onMouseEnter={() => handleLikeHover(post.uniqueId)}
                        onMouseLeave={() => handleLikeLeave(post.uniqueId)}
                        className={`flex items-center space-x-2 transition-colors ${
                          post.current_user_reaction
                            ? reactions.find(
                                (r) => r.name === post.current_user_reaction
                              )?.color || "text-[#0017e7]"
                            : "text-gray-600 hover:text-[#0017e7]"
                        }`}
                      >
                        <div className="relative">
                          {/* Show current user's reaction or default like */}
                          {post.current_user_reaction ? (
                            post.current_user_reaction === "like" ? (
                              <ThumbsUp
                                className={`w-5 h-5 transition-all duration-300 ${
                                  showAnimation[post.uniqueId]
                                    ? "animate-bounce"
                                    : ""
                                }`}
                                fill="currentColor"
                              />
                            ) : post.current_user_reaction === "love" ? (
                              <Heart
                                className={`w-5 h-5 transition-all duration-300 ${
                                  showAnimation[post.uniqueId]
                                    ? "animate-bounce"
                                    : ""
                                }`}
                                fill="currentColor"
                              />
                            ) : (
                              <span
                                className={`text-xl transition-all duration-300 ${
                                  showAnimation[post.uniqueId]
                                    ? "animate-bounce"
                                    : ""
                                }`}
                              >
                                {
                                  reactions.find(
                                    (r) => r.name === post.current_user_reaction
                                  )?.icon
                                }
                              </span>
                            )
                          ) : (
                            <ThumbsUp
                              className={`w-5 h-5 transition-all duration-300 ${
                                showAnimation[post.uniqueId]
                                  ? "animate-bounce"
                                  : ""
                              }`}
                              fill="none"
                            />
                          )}

                          {showAnimation[post.uniqueId] && (
                            <div className="absolute inset-0 pointer-events-none">
                              <div className="absolute -top-1 left-0 animate-ping opacity-75">
                                {post.current_user_reaction ? (
                                  reactions.find(
                                    (r) => r.name === post.current_user_reaction
                                  )?.icon
                                ) : (
                                  <ThumbsUp className="w-5 h-5" />
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <span className="text-sm font-medium">
                          {post.current_user_reaction
                            ? post.current_user_reaction
                                .charAt(0)
                                .toUpperCase() +
                              post.current_user_reaction.slice(1)
                            : "Like"}
                        </span>
                      </button>
                      {/* like button */}

                      {/* Reactions Panel */}
                      {showReactions[post.uniqueId] && (
                        <div
                          className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-full shadow-lg p-2 flex space-x-2 z-50 animate-fadeInUp"
                          onMouseEnter={() =>
                            handleReactionsHover(post.uniqueId)
                          }
                          onMouseLeave={() =>
                            handleReactionsLeave(post.uniqueId)
                          }
                          style={{
                            animation:
                              "slideUpBounce 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                          }}
                        >
                          {reactions.map((reaction, index) => (
                            <button
                              key={reaction.name}
                              onClick={() =>
                                handleReactionSelect(
                                  post.uniqueId,
                                  reaction.name
                                )
                              }
                              className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-125 transform transition-all duration-200 hover:bg-gray-100 animated-reaction"
                              title={
                                reaction.name.charAt(0).toUpperCase() +
                                reaction.name.slice(1)
                              }
                              style={{
                                animationDelay: `${index * 0.05}s`,
                                animation: `bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${
                                  index * 0.05
                                }s both`,
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.animation =
                                  "wiggle 0.5s ease-in-out infinite";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.animation = "";
                              }}
                            >
                              {reaction.name === "like" ? (
                                <ThumbsUp
                                  className="w-6 h-6 text-[#0017e7] animate-pulse-subtle"
                                  fill="currentColor"
                                />
                              ) : reaction.name === "love" ? (
                                <div className="relative">
                                  <Heart
                                    className="w-6 h-6 text-red-500 animate-heartbeat"
                                    fill="currentColor"
                                  />
                                  <div className="absolute inset-0 animate-ping opacity-25">
                                    <Heart
                                      className="w-6 h-6 text-red-500"
                                      fill="currentColor"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <span
                                  className="text-2xl animate-bounce-subtle"
                                  style={{
                                    filter:
                                      "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                                  }}
                                >
                                  {reaction.icon}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Add CSS Animations */}
                      <style jsx>{`
                      .line-clamp-3 {
                           display: -webkit-box;
                           -webkit-line-clamp: 3;
                           -webkit-box-orient: vertical;
                           overflow: hidden;
                           text-overflow: ellipsis;
                         }
                         
                         @keyframes slideUpBounce {
                           0% {
                             opacity: 0;
                             transform: translateY(20px) scale(0.8);
                           }
                           50% {
                             transform: translateY(-5px) scale(1.05);
                           }
                           100% {
                             opacity: 1;
                             transform: translateY(0) scale(1);
                           }
                         }
                        @keyframes slideUpBounce {
                          0% {
                            opacity: 0;
                            transform: translateY(20px) scale(0.8);
                          }
                          50% {
                            transform: translateY(-5px) scale(1.05);
                          }
                          100% {
                            opacity: 1;
                            transform: translateY(0) scale(1);
                          }
                        }

                        @keyframes bounceIn {
                          0% {
                            opacity: 0;
                            transform: scale(0.3) translateY(20px);
                          }
                          50% {
                            opacity: 1;
                            transform: scale(1.1) translateY(-10px);
                          }
                          70% {
                            transform: scale(0.9) translateY(0);
                          }
                          100% {
                            opacity: 1;
                            transform: scale(1) translateY(0);
                          }
                        }

                        @keyframes wiggle {
                          0%,
                          100% {
                            transform: rotate(0deg) scale(1);
                          }
                          25% {
                            transform: rotate(-10deg) scale(1.1);
                          }
                          75% {
                            transform: rotate(10deg) scale(1.1);
                          }
                        }

                        @keyframes heartbeat {
                          0%,
                          100% {
                            transform: scale(1);
                          }
                          50% {
                            transform: scale(1.2);
                          }
                        }

                        @keyframes bounce-subtle {
                          0%,
                          100% {
                            transform: translateY(0);
                          }
                          50% {
                            transform: translateY(-2px);
                          }
                        }

                        @keyframes pulse-subtle {
                          0%,
                          100% {
                            opacity: 1;
                          }
                          50% {
                            opacity: 0.8;
                          }
                        }

                        .animate-heartbeat {
                          animation: heartbeat 1.5s ease-in-out infinite;
                        }

                        .animate-bounce-subtle {
                          animation: bounce-subtle 2s ease-in-out infinite;
                        }

                        .animate-pulse-subtle {
                          animation: pulse-subtle 2s ease-in-out infinite;
                        }

                        .animated-reaction:hover {
                          transform: scale(1.3) !important;
                          transition: all 0.2s
                            cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
                        }
                      `}</style>
                    </div>

                    <button
                      onClick={() =>
                        setShowCommentPopup((prev) => ({
                          ...prev,
                          [post.uniqueId]: true,
                        }))
                      }
                      className="flex items-center space-x-2 text-gray-600 hover:text-[#0017e7] transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Comment</span>
                    </button>

                    <button
                      onClick={() =>
                        setShowSharePopup((prev) => ({
                          ...prev,
                          [post.uniqueId]: true,
                        }))
                      }
                      className="flex items-center space-x-2 text-gray-600 hover:text-[#0017e7] transition-colors"
                    >
                      <Forward className="w-5 h-5" />
                      <span className="text-sm font-medium">Share</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Infinite scroll trigger */}
            {hasMore && (
              <div ref={sentryRef} className="flex justify-center py-8">
                {loading && (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6974b1]"></div>
                    <span className="text-gray-600">Loading more posts...</span>
                  </div>
                )}
              </div>
            )}

            {/* End of posts message */}
            {!hasMore && sortedPosts.length > 0 && (
              <div className="text-center py-8 text-gray-600">
                <div className="space-y-2">
                  <p>🎉 That's all for now!</p>
                  <p className="text-sm">Check back later for more updates</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-2 border-[#6974b1] shadow-sm mx-auto">
        {/* Header */}
        <div className="px-4 py-3 border-b">
          <h2 className="text-gray-600 font-medium text-sm">
            Recommended For You
          </h2>
        </div>

        {/* Recommendations List */}
        <div className="p-4 space-y-4">
          {recommendations.map((person) => (
            <div
              key={person.id}
              className="flex items-start space-x-4  border-b pb-3"
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={person.avatar}
                  alt={person.name}
                  className="w-14 h-14 rounded object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-medium text-gray-900 text-lg">
                    {person.name}
                  </h3>
                  <span className="text-xs text-[#0017e7]">•</span>
                  <button className="text-[#0017e7] text-xs font-medium hover:underline">
                    Connect
                  </button>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {person.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePostTab;
