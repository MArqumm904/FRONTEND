import { useState, useRef } from "react";
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

const Mentions = ({
  text_posts_data = [],
  image_posts_data = [],
  video_posts_data = [],
}) => {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [selectedReportOption, setSelectedReportOption] = useState(null);
  const [showMenu, setShowMenu] = useState({});
  const [showSponserMenu, setShowSponserMenu] = useState(false);
  const [showFullText, setShowFullText] = useState({});
  const [isLiked, setIsLiked] = useState({});
  const [showAnimation, setShowAnimation] = useState({});
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState({});
  const [showPostCreatePopup, setShowPostCreatePopup] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const menuRef = useRef(null);

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

  const handleLike = (postId) => {
    setIsLiked((prev) => ({ ...prev, [postId]: !prev[postId] }));
    setShowAnimation((prev) => ({ ...prev, [postId]: true }));
    setTimeout(
      () => setShowAnimation((prev) => ({ ...prev, [postId]: false })),
      600
    );
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

  const toggleSponserMenu = () => {
    setShowSponserMenu(!showSponserMenu);
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
    ...text_posts_data.map((post, index) => ({
      ...post,
      type: "text",
      id: `text_${index}`,
      uniqueId: `text_${index}`,
    })),
    ...image_posts_data.map((post, index) => ({
      ...post,
      type: "image",
      id: `image_${index}`,
      uniqueId: `image_${index}`,
    })),
    ...video_posts_data.map((post, index) => ({
      ...post,
      type: "video",
      id: `video_${index}`,
      uniqueId: `video_${index}`,
    })),
  ];

  const sortedPosts = allPosts.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

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
      <div className="w-full max-w-full py-6">
        <div className="w-full ">
          {/* Left Side - Post Section (7 cols) */}
          <div className="grid grid-cols-1 max-w-xl mx-auto">
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
                        src={Person1}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-md cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-900 text-sm cursor-pointer">
                          Design Foundation
                        </span>
                      </div>
                      <span className="text-gray-500 text-xs">
                        {formatTimeAgo(post.timestamp)}
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
                      <div className="absolute right-0 -mt-3 w-52 bg-white border border-gray-200 rounded-md shadow-md z-10 p-2 space-y-2 text-sm">
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
                    {/* Mobile: Toggle text */}
                    <span className="block md:hidden">
                      {showFullText[post.uniqueId]
                        ? post.content
                        : post.content.length > 100
                        ? `${post.content.substring(0, 100)}...`
                        : post.content}
                      {post.content.length > 100 && (
                        <span
                          className="text-blue-500 font-semibold ml-1 cursor-pointer"
                          onClick={() => toggleFullText(post.uniqueId)}
                        >
                          {showFullText[post.uniqueId]
                            ? "See Less"
                            : "See More"}
                        </span>
                      )}
                    </span>

                    {/* Desktop: Always show full text, no toggle */}
                    <span className="hidden md:block">{post.content}</span>
                  </p>
                )}

                {/* Content based on post type */}
                {renderPostContent(post)}

                {/* Reactions */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    {/* Left side - Reaction icons and count */}
                    <div className="flex items-center space-x-2 ms-1">
                      <div className="flex items-center -space-x-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white z-10">
                          <ThumbsUp className="w-4 h-4 text-white fill-white" />
                        </div>
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                          <span className="text-white text-lg">❤️</span>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {post.likes || 0} Likes
                      </span>
                    </div>

                    {/* Right side - Comments and views */}
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
                    <button
                      onClick={() => handleLike(post.uniqueId)}
                      className={`flex items-center space-x-2 transition-colors ${
                        isLiked[post.uniqueId]
                          ? "text-blue-500"
                          : "text-gray-600 hover:text-blue-500"
                      }`}
                    >
                      <div className="relative">
                        <ThumbsUp
                          className={`w-5 h-5 transition-all duration-300 ${
                            showAnimation[post.uniqueId] ? "animate-bounce" : ""
                          }`}
                          fill={
                            isLiked[post.uniqueId] ? "currentColor" : "none"
                          }
                        />

                        {/* Animation effect */}
                        {showAnimation[post.uniqueId] && (
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute -top-1 left-0 animate-ping opacity-75">
                              <ThumbsUp
                                className="w-5 h-5 text-blue-500"
                                fill="currentColor"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <span className="text-sm font-medium">Like</span>
                    </button>
                    <button
                      onClick={() => setShowCommentPopup(true)}
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Comment</span>
                    </button>

                    <button
                      onClick={() => setShowSharePopup(true)}
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
                    >
                      <Forward className="w-5 h-5" />
                      <span className="text-sm font-medium">Share</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          
        </div>
      </div>
    </>
  );
};

export default Mentions