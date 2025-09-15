import { useState, useRef, useEffect } from "react";
import {
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Forward,
  Pencil,
  Trash2,
  Eye,
  Play,
  Link2,
  Heart,
} from "lucide-react";
import Person1 from "../../assets/images/person-1.png";
import PostImage from "../../assets/images/postimage.png";
import SponserImage from "../../assets/images/sponsor-image.png";
import Upload from "../../assets/images/upload.png";
import SponserImage2 from "../../assets/images/sponsor-image-2.png";
import PostCreate from "../profilecomponents/post_edit";
import OurWork from "../../assets/images/our_work.png";
import report from "../../assets/images/error.png";
import share from "../../assets/images/share.png";
import ReportModal from "./reportModel";
import BlockModal from "./blockModel";
import useInfiniteScroll from "react-infinite-scroll-hook";
import axios from "axios";
import PostComment from "../post_comment";
import PostShare from "./post_share";

const PostTab = ({
  text_posts_data = [],
  image_posts_data = [],
  video_posts_data = [],
  posts_data = [],
  poll_posts_data = [],
  onAddToStory,
  fetchPosts,
  loading,
  hasMore,
  refreshPosts,
}) => {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [selectedReportOption, setSelectedReportOption] = useState(null);
  const [showMenu, setShowMenu] = useState({});
  const [showSponserMenu, setShowSponserMenu] = useState(true);
  const [sponserMenu, setSponserMenu] = useState(0);
  const [showFullText, setShowFullText] = useState({});
  const [isLiked, setIsLiked] = useState({});
  const [showAnimation, setShowAnimation] = useState({});
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState({});
  const [showPostCreatePopup, setShowPostCreatePopup] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showReactions, setShowReactions] = useState({});
  const [selectedReaction, setSelectedReaction] = useState({});
  const [hoverTimeout, setHoverTimeout] = useState({});
  const [pollVotes, setPollVotes] = useState({});
  const menuRef = useRef(null);

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
        `${import.meta.env.VITE_API_BASE_URL}/pages/postsreactions`,
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
        `${import.meta.env.VITE_API_BASE_URL}/pages/postsreactions`,
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

  const toggleFullText = (postId) => {
    setShowFullText((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleVideoPlay = (postId) => {
    setVideoPlaying((prev) => ({ ...prev, [postId]: true }));
  };

  const handleVideoPause = (postId) => {
    setVideoPlaying((prev) => ({ ...prev, [postId]: false }));
  };

  const handleReportSubmit = () => {
    setReportModalOpen(false);
    setBlockModalOpen(true);
  };

  const handleCancelReport = () => {
    setReportModalOpen(false);
    setSelectedReportOption(null);
  };

  const handleBlock = () => {
    setBlockModalOpen(false);
    // Handle block logic here
  };

  const handleCancelBlock = () => {
    setBlockModalOpen(false);
  };

  const handleEditPost = (postId) => {
    const post = sortedPosts.find((p) => p.uniqueId === postId);
    setSelectedPost(post);
    setShowMenu((prev) => ({ ...prev, [postId]: false }));
    setShowPostCreatePopup(true);
  };

  const handleAddToStoryFromMenu = (postId) => {
    setShowMenu((prev) => ({ ...prev, [postId]: false }));
  };

  const toggleMenu = (postId) => {
    setShowMenu((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleSponserMenu = (num) => {
    setShowSponserMenu(!showSponserMenu);
    setSponserMenu(num);
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

  if (!loading && posts_data.length === 0 && !hasMore) {
    return (
      <div className="w-full max-w-full py-6">
        <div className="grid grid-cols-12 gap-6 w-full">
          <div className="col-span-12 lg:col-span-7 w-full">
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
                  Be the first to share something! Create your first post to get
                  the conversation started.
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
        </div>
      </div>
    );
  }

  if (loading && posts_data.length === 0) {
    return (
      <div className="w-full max-w-full py-6">
        <div className="grid grid-cols-12 gap-6 w-full">
          {/* Left Side - Post Section (7 cols) */}
          <div className="col-span-12 lg:col-span-7 w-full">
            <div className="bg-white rounded-lg shadow-lg border border-[#6974b1] mb-4 w-full">
              <div className="flex flex-col items-center justify-center py-16 px-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6974b1] mb-4"></div>
                <p className="text-gray-600">Loading posts...</p>
              </div>
            </div>
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
            <p className="text-gray-800 text-2xl leading-relaxed font-semibold font-sf">
              {post.content}
            </p>
          </div>
        );

      case "image":
        return (
          <div className="pb-3 w-full">
            <div className="relative bg-gradient-to-b from-yellow-300 to-yellow-400 overflow-hidden w-full">
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
                // poster={post.thumbnail}
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

              {/* Custom Play Button Overlay - Only show when video is not playing */}
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
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours} Hours Ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} Days Ago`;
    }
  };

  return (
    <>
      {reportModalOpen && (
        <ReportModal
          onClose={handleCancelReport}
          onReportSubmit={handleReportSubmit}
          selectedOption={selectedReportOption}
          setSelectedOption={setSelectedReportOption}
        />
      )}

      {blockModalOpen && (
        <BlockModal
          onBlock={handleBlock}
          onCancel={handleCancelBlock}
          name={selectedReportOption || "this page"}
        />
      )}
      {showPostCreatePopup && (
        <PostCreate
          onClose={() => setShowPostCreatePopup(false)}
          editData={selectedPost}
        />
      )}

      {Object.keys(showCommentPopup).map(
        (postId) =>
          showCommentPopup[postId] && (
            <PostComment
              key={`comment-${postId}`}
              post_image={
                sortedPosts.find((p) => p.uniqueId === postId)?.type === "image"
                  ? sortedPosts.find((p) => p.uniqueId === postId)?.image
                  : null
              }
              text={
                sortedPosts.find((p) => p.uniqueId === postId)?.type === "text"
                  ? sortedPosts.find((p) => p.uniqueId === postId)?.content
                  : null
              }
              videoUrl={
                sortedPosts.find((p) => p.uniqueId === postId)?.type === "video"
                  ? sortedPosts.find((p) => p.uniqueId === postId)?.video
                  : null
              }
              pollData={
                sortedPosts.find((p) => p.uniqueId === postId)?.type === "poll"
                  ? sortedPosts.find((p) => p.uniqueId === postId)?.poll
                  : null
              }
              postData={sortedPosts.find((p) => p.uniqueId === postId)}
              userName={
                sortedPosts.find((p) => p.uniqueId === postId)?.user?.name ||
                "Design Foundation"
              }
              userAvatar={Person1}
              postTime={formatTimeAgo(
                sortedPosts.find((p) => p.uniqueId === postId)?.timestamp ||
                  sortedPosts.find((p) => p.uniqueId === postId)?.created_at
              )}
              totalReactions={
                sortedPosts.find((p) => p.uniqueId === postId)
                  ?.total_reactions || 0
              }
              reactionsCount={
                sortedPosts.find((p) => p.uniqueId === postId)
                  ?.reactions_count || {}
              }
              currentUserReaction={
                sortedPosts.find((p) => p.uniqueId === postId)
                  ?.current_user_reaction
              }
              commentsCount={
                sortedPosts.find((p) => p.uniqueId === postId)?.comments || 0
              }
              viewsCount={
                sortedPosts.find((p) => p.uniqueId === postId)?.views || 0
              }
              caption={sortedPosts.find((p) => p.uniqueId === postId)?.content}
              postType={sortedPosts.find((p) => p.uniqueId === postId)?.type}
              pollVotes={pollVotes}
              onPollVote={handlePollVote}
              postId={postId}
              onClose={() =>
                setShowCommentPopup((prev) => ({ ...prev, [postId]: false }))
              }
            />
          )
      )}

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


      <div className="w-full max-w-full py-6">
        <div className="grid grid-cols-12 gap-6 w-full">
          {/* Left Side - Post Section (7 cols) */}
          <div className="col-span-12 lg:col-span-7 w-full">
            {sortedPosts.map((post) => (
              <div
                key={post.uniqueId}
                className="bg-white rounded-lg shadow-lg border border-[#6974b1] mb-4 w-full"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-5 pb-3 relative">
                  {/* Left profile + name block */}
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-md flex items-center justify-center mr-3">
                      <img
                        src={post.profile_photo}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-md cursor-pointer"
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
                      <div className="absolute right-0 -mt-3 w-52 bg-white border border-gray-200 rounded-md shadow-md z-20 p-2 space-y-2 text-sm">
                        <button
                          className="w-full flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded-md text-left"
                          onClick={() => handleEditPost(post.uniqueId)}
                        >
                          <span>
                            <Pencil />
                          </span>
                          <span>Edit Post</span>
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded-md text-left">
                          <span>
                            <img src={OurWork} className="w-6 h-6" />
                          </span>
                          <span>Move to Our Work</span>
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded-md text-left text-red-600 font-medium">
                          <span>
                            <Trash2 />
                          </span>
                          <span>Delete Post</span>
                        </button>
                        <button
                          className="w-full flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded-md text-left"
                          onClick={() =>
                            handleAddToStoryFromMenu(post.uniqueId)
                          }
                        >
                          <span>
                            <img src={Upload} className="w-6 h-6" alt="" />
                          </span>
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

          {/* Right Side - Page Cards Section (5 cols) */}
          <div className="col-span-12 lg:col-span-5 w-full">
            <div className="space-y-4 w-full">
              {/* First Page Card - Leadership Academy */}
              <div className="bg-white border border-[#6873b0] rounded-lg shadow-lg mb-7">
                <div className="bg-gray-100 border-b border-blue-400 rounded-t-lg p-4">
                  <h2 className="text-gray-600 font-sf text-xl font-medium">
                    Sponsors
                  </h2>
                </div>
                {/* Header Section */}
                <div className="relative p-4">
                  {/* Warning Icon and Title */}
                  <div className="flex items-center mb-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center mr-3">
                      <span className="text-black font-bold text-lg">🖥️</span>
                    </div>
                    <h3 className="text-black font-semibold text-xl font-sf">
                      "Join UI/UX Design Bootcamp – 50% Off"
                    </h3>
                  </div>

                  {/* Website Link */}
                  <div className="relative">
                    <button
                      onClick={() => toggleSponserMenu(1)}
                      className="text-blue-700 underline text-sm mb-4 cursor-pointer"
                    >
                      https://www.reallygreatsite.com
                    </button>
                    {showSponserMenu && sponserMenu === 1 && (
                      <div className="absolute left-20 -top-44 -mt-3 w-52 bg-white border border-gray-200 rounded-md shadow-md z-10 p-2 space-y-2 text-sm">
                        <button
                          className="w-full flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded-md text-left"
                          // onClick={() => handleEditPost(post.uniqueId)}
                        >
                          <span>
                            <img src={share} className="w-6 h-5" />
                          </span>
                          <span>Share this Page</span>
                        </button>
                        <button
                          onClick={() => {
                            setReportModalOpen(true);
                            setSelectedReportOption(null); // Reset the selection when opening modal
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded-md text-[#FF0000] text-left"
                        >
                          <span>
                            <img src={report} className="w-5 h-5" />
                          </span>
                          <span>Report Page</span>
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded-md text-left">
                          <span>
                            <Link2 className="-rotate-45" />
                          </span>
                          <span>Copy Page Link</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Main Content Section */}
                <div className="relative flex items-center h-[450px]">
                  <img
                    src={SponserImage}
                    alt="Scholarship notification background"
                    className="w-full h-full object-cover rounded-b-lg"
                  />
                </div>
              </div>
              {/* first card ends here */}
              {/* Second Page Card - Leadership Academy */}
              <div className="bg-white border border-[#6873b0] rounded-lg shadow-lg mb-7">
                {/* Header Section */}
                <div className="relative p-6">
                  {/* Warning Icon and Title */}
                  <div className="flex items-center mb-3">
                    <div className="w-6 h-6  rounded-full flex items-center justify-center mr-3">
                      <span className="text-black font-bold text-lg">🖥️</span>
                    </div>
                    <h3 className="text-black font-semibold text-xl font-sf">
                      "Free IT Course - Sponsored by Codelab"
                    </h3>
                  </div>

                  <div className="relative">
                    {/* Website Link */}
                    <button
                      onClick={() => toggleSponserMenu(2)}
                      className="text-blue-700 underline text-sm cursor-pointer"
                    >
                      https://www.careervision.com
                    </button>
                    {showSponserMenu && sponserMenu === 2 && (
                      <div className="absolute left-20 -top-44 -mt-3 w-52 bg-white border border-gray-200 rounded-md shadow-md z-10 p-2 space-y-2 text-sm z-50">
                        <button
                          className="w-full flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded-md text-left"
                          // onClick={() => handleEditPost(post.uniqueId)}
                        >
                          <span>
                            <img src={share} className="w-6 h-5" />
                          </span>
                          <span>Share this Page</span>
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded-md text-[#FF0000] text-left">
                          <span>
                            <img src={report} className="w-5 h-5" />
                          </span>
                          <span>Report Page</span>
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded-md text-left">
                          <span>
                            <Link2 className="-rotate-45" />
                          </span>
                          <span>Copy Page Link</span>
                        </button>
                      </div>
                    )}
                  </div>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostTab;
