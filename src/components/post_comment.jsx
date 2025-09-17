import { useState, useEffect } from "react";
import {
  X,
  Send,
  MoreHorizontal,
  ThumbsUp,
  Forward,
  Bookmark,
  SendHorizontal,
  Smile,
} from "lucide-react";
import axios from "axios";

import VideoComponent from "../components/post_video";
import { useNavigate } from "react-router-dom";
const PostComment = ({
  onClose,
  post_image,
  text,
  videoUrl,
  pollData,
  postType,
  pollVotes = {},
  onPollVote,
  postId,
  caption,
  userName,
  postTime,
  totalReactions,
  userId,
  userAvatar
}) => {
  const [newComment, setNewComment] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(null); // null initially
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  // Add states to prevent duplicate submissions
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  // Add state to track liking status
  const [likingComments, setLikingComments] = useState(new Set());
  const [isSavingPost, setIsSavingPost] = useState(false);
  const navigate = useNavigate();
  const handleSavePost = async () => {
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

  const handlePollVote = (optionId) => {
    if (onPollVote) {
      onPollVote(postId, optionId);
    }
  };

  const fetchComments = async () => {
    console.log("Post ID before request:", postId);

    const token = localStorage.getItem("token");
    const numericPostId = parseInt(postId.replace(/\D/g, ""), 10);

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/getcommentsreplies`,
        { post_id: numericPostId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.success) {
        const transformedComments = response.data.data.map((comment) => ({
          id: comment.id,
          user: comment.user.name,
          avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&round=50`,
          text: comment.content,
          time: formatTime(comment.created_at),
          likes: comment.likes_count,
          userLiked: comment.user_liked,
          replies: comment.replies.map((reply) => ({
            id: reply.id,
            user: reply.user.name,
            avatar: `https://images.unsplash.com/photo-1494790108755-2616b332c3cd?w=40&h=40&fit=crop&crop=face&round=50`,
            text: reply.content,
            time: formatTime(reply.created_at),
            likes: reply.likes_count,
            userLiked: reply.user_liked,
          })),
        }));
        setComments(transformedComments);

        setIsBookmarked(response.data.saved_post === "saved");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return diffMins < 1 ? "Just now" : `${diffMins} Minutes Ago`;
    } else if (diffHours < 24) {
      return `${diffHours} Hours Ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} Days Ago`;
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [hiddenReplies, setHiddenReplies] = useState({});

  const toggleReplies = (commentId) => {
    setHiddenReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || isSubmittingComment) {
      return;
    }

    const token = localStorage.getItem("token");
    const numericPostId = parseInt(postId.replace(/\D/g, ""), 10);
    const currentUserId = parseInt(localStorage.getItem("user_id"));

    setIsSubmittingComment(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/storecommentsreplies`,
        {
          post_id: numericPostId,
          content: newComment.trim(),
          parent_comment_id: null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.success) {
        setNewComment("");
        await fetchComments();
      } else {
        console.error("Failed to post comment:", response.data?.message);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleLikeComment = async (
    commentId,
    isReply = false,
    parentCommentId = null
  ) => {
    if (likingComments.has(commentId)) return;

    setLikingComments((prev) => new Set(prev).add(commentId));

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/likeacomment`,
        { comment_id: commentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.success) {
        const { new_likes_count, user_liked } = response.data.data;

        setComments((prevComments) =>
          prevComments.map((comment) => {
            if (isReply && comment.id === parentCommentId) {
              return {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === commentId
                    ? {
                        ...reply,
                        likes: new_likes_count,
                        userLiked: user_liked,
                      }
                    : reply
                ),
              };
            } else if (!isReply && comment.id === commentId) {
              return {
                ...comment,
                likes: new_likes_count,
                userLiked: user_liked,
              };
            }
            return comment;
          })
        );
      } else {
        console.error("Failed to like comment:", response.data?.message);
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    } finally {
      setLikingComments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  const handleAddReply = async (commentId) => {
    if (!replyText.trim() || isSubmittingReply) {
      return;
    }

    const token = localStorage.getItem("token");
    const numericPostId = parseInt(postId.replace(/\D/g, ""), 10);

    setIsSubmittingReply(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/storereply`,
        {
          post_id: numericPostId,
          user_id: parseInt(localStorage.getItem("user_id")),
          parent_id: commentId,
          content: replyText.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.success) {
        setReplyText("");
        setReplyingTo(null);
        await fetchComments();
      } else {
        console.error("Failed to post reply:", response.data?.message);
        alert("Failed to post reply. Please try again.");
      }
    } catch (error) {
      console.error("Error posting reply:", error);
      alert("Error posting reply. Please try again.");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Render poll content
  const renderPollContent = () => {
    if (!pollData || !pollData.options) return null;

    const userVoted = pollVotes[postId];
    const hasVoted = userVoted !== undefined;

    return (
      <div className="p-4 space-y-3">
        {pollData.options.map((option) => {
          const isSelected = userVoted === option.id;
          const percentage = hasVoted ? option.percentage : 0;

          return (
            <div
              key={option.id}
              className={`relative border-2 rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                hasVoted
                  ? isSelected
                    ? "border-[#0017e7] bg-blue-50"
                    : "border-gray-200 bg-gray-50"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }`}
              onClick={() => !hasVoted && handlePollVote(option.id)}
            >
              {hasVoted && (
                <div
                  className={`absolute top-0 left-0 h-full rounded-l-lg transition-all duration-500 ${
                    isSelected ? "bg-blue-200" : "bg-gray-200"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              )}

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      hasVoted && isSelected
                        ? "border-[#0017e7] bg-[#0017e7]"
                        : "border-gray-400"
                    }`}
                  >
                    {hasVoted && isSelected && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      hasVoted && isSelected ? "text-blue-700" : "text-gray-700"
                    }`}
                  >
                    {option.text}
                  </span>
                </div>

                {hasVoted && (
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-medium ${
                        isSelected ? "text-[#0017e7]" : "text-gray-600"
                      }`}
                    >
                      {percentage}%
                    </span>
                    <span className="text-xs text-gray-500">
                      ({option.votes})
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {hasVoted && (
          <div className="mt-3 text-xs text-gray-600 text-center">
            Total votes: {pollData.totalVotes || 0}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header - Fixed */}
        <div className="p-3 flex items-center justify-between border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div onClick={() => navigate(`/profile/${userId}`)} className="cursor-pointer w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <img
                src={userAvatar}
                className="w-full h-full rounded-full object-cover"
                alt="Profile"
              />
            </div>
            <div className="flex items-center justify-between ">
              <div onClick={() => navigate(`/profile/${userId}`)} className="cursor-pointer">
                <h3 className="font-semibold text-sm ms-2 text-gray-900">
                  {userName}
                </h3>
                <p className="text-xs text-gray-500 ms-2">{postTime}</p>
              </div>
              <button className="text-[#0017e7] ml-1 -mt-4 text-xs cursor-pointer font-semibold ms-3">
                • Follow
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-black hover:text-gray-600" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Post Content */}
          <div className="border-b border-gray-200">
            {/* Caption for image/video posts */}
            {caption && (postType === "image" || postType === "video") && (
              <div className="p-3 pb-2">
                <p className="text-gray-600 text-sm font-medium font-sf">
                  {caption}
                </p>
              </div>
            )}

            {/* Content Area - Natural Height */}
            <div className="w-full">
              {postType === "image" && post_image ? (
                <img
                  src={post_image}
                  alt="Post"
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: "none" }}
                />
              ) : postType === "text" && text ? (
                <div className="w-full flex items-center  p-8 min-h-[150px]">
                  <p className="text-2xl text-black font-sf font-semibold ">
                    {text}
                  </p>
                </div>
              ) : postType === "video" && videoUrl ? (
                <VideoComponent videoUrl={videoUrl} />
              ) : postType === "poll" && pollData ? (
                <div className="w-full">{renderPollContent()}</div>
              ) : null}
            </div>
          </div>

          {/* Comments List */}
          <div className="divide-y divide-gray-100">
            {loading ? (
              // Loading State
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0017e7] mx-auto"></div>
                <p className="text-gray-500 mt-2 text-sm">
                  Loading comments...
                </p>
              </div>
            ) : comments.length === 0 ? (
              // No Comments State
              <div className="p-8 text-center">
                <p className="text-gray-500 text-sm">
                  No comments yet. Be the first to comment!
                </p>
              </div>
            ) : (
              // Comments Mapping
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex space-x-2 font-sf">
                    <img
                      src={comment.avatar}
                      alt={comment.user}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="rounded-2xl px-1 py-1">
                        <div className="flex items-center gap-1">
                          <p className="font-semibold text-sm mr-1 text-gray-900">
                            {comment.user}
                          </p>
                          <span className="text-[10px] text-gray-500">•</span>
                          <span className="text-[10px] text-gray-500 font-sf">
                            {comment.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800 mt-1 font-sf">
                          {comment.text}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3 mt-1 text-xs ">
                        <button
                          onClick={() => handleLikeComment(comment.id, false)}
                          disabled={likingComments.has(comment.id)}
                          className={`transition-colors font-medium flex items-center space-x-1 ${
                            comment.userLiked
                              ? "text-[#0017e7] hover:text-[#0017e7]"
                              : "text-[#151515] hover:text-[#0017e7]"
                          } ${
                            likingComments.has(comment.id) ? "opacity-50" : ""
                          }`}
                        >
                          <ThumbsUp
                            className="w-4 h-4 mb-1"
                            fill={comment.userLiked ? "#0017e7" : "none"}
                          />
                          <span>{comment.likes} Likes </span>
                        </button>
                        <span className="text-gray-500">•</span>
                        <button
                          onClick={() => setReplyingTo(comment.id)}
                          className="hover:text-[#0017e7] text-[#0017e7] transition-colors font-medium"
                        >
                          Reply
                        </button>
                      </div>

                      {/* Show/Hide Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <button
                          onClick={() => toggleReplies(comment.id)}
                          className="text-xs text-[#0017e7] hover:text-[#0017e7] font-medium mt-2 flex items-center space-x-1"
                        >
                          {replyingTo !== comment.id &&
                            (hiddenReplies[comment.id] ? (
                              <button className="flex items-center space-x-2 border border-gray-300 px-3 py-1 rounded-full text-[0.65rem] text-black hover:bg-gray-100 transition">
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                                <span>Show Replies</span>
                              </button>
                            ) : (
                              <button className="flex items-center space-x-2 border border-gray-300 px-3 py-1 rounded-full text-[0.65rem] text-black hover:bg-gray-100 transition">
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 15l7-7 7 7"
                                  />
                                </svg>
                                <span>Hide Replies</span>
                              </button>
                            ))}
                        </button>
                      )}
                    </div>
                    <button className="p-1 mb-16 hover:bg-gray-100 rounded-full transition-colors">
                      <MoreHorizontal className="w-5 h-5  text-gray-400" />
                    </button>
                  </div>

                  {/* Reply Input */}
                  {replyingTo === comment.id && (
                    <div className="ml-10 mt-2 flex space-x-2">
                      <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face&round=50"
                        alt="Your avatar"
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Reply to ${comment.user}...`}
                          className="w-full bg-gray-100 rounded-full px-3 py-1 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-[#0017e7]"
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && !isSubmittingReply) {
                              handleAddReply(comment.id);
                            }
                          }}
                          disabled={isSubmittingReply}
                        />
                        <button
                          onClick={() => handleAddReply(comment.id)}
                          disabled={isSubmittingReply || !replyText.trim()}
                          className={`absolute right-2 top-1/2 transform -translate-y-1/2 transition-colors ${
                            isSubmittingReply || !replyText.trim()
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-[#0017e7] hover:text-[#0017e7] cursor-pointer"
                          }`}
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="text-xs text-gray-400 hover:text-gray-600 px-2"
                        disabled={isSubmittingReply}
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies &&
                    comment.replies.length > 0 &&
                    !hiddenReplies[comment.id] && (
                      <div className="ml-10 border-l border-gray-200 pl-3 font-sf mt-2">
                        {comment.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="py-2 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex space-x-2">
                              <img
                                src={reply.avatar}
                                alt={reply.user}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <div className="rounded-2xl px-1 py-2">
                                  <div className="flex items-center space-x-2 -mt-2">
                                    <p className="font-semibold text-sm text-gray-900">
                                      {reply.user}
                                    </p>
                                    <span className="text-xs text-gray-500">
                                      {reply.time}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-800 mt-1">
                                    {reply.text}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-3 mt-1 text-xs text-[#151515]">
                                  <button
                                    onClick={() =>
                                      handleLikeComment(
                                        reply.id,
                                        true,
                                        comment.id
                                      )
                                    }
                                    disabled={likingComments.has(reply.id)}
                                    className={`transition-colors font-medium flex items-center space-x-1 ${
                                      reply.userLiked
                                        ? "text-[#0017e7] hover:text-[#0017e7]"
                                        : "text-[#151515] hover:text-[#0017e7]"
                                    } ${
                                      likingComments.has(reply.id)
                                        ? "opacity-50"
                                        : ""
                                    }`}
                                  >
                                    <ThumbsUp
                                      className="w-4 h-4 mb-1"
                                      fill={
                                        reply.userLiked ? "#0017e7" : "none"
                                      }
                                    />
                                    <span>{reply.likes} Likes </span>
                                  </button>
                                </div>
                              </div>
                              <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                <MoreHorizontal className="w-5 h-5 mb-10 text-gray-400" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Action Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b flex-shrink-0">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <button className="flex items-center space-x-1 text-[#0017e7] font-medium">
              <ThumbsUp className="w-5 h-5" />
              <span className="text-black">{totalReactions}</span>
            </button>
            <span className="text-gray-300">|</span>
            <button className="flex items-center space-x-1 hover:text-[#0017e7]">
              <Forward className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>
          <button
            className={`${
              isBookmarked
                ? "text-yellow-500 hover:text-yellow-600"
                : "text-gray-600 hover:text-black"
            } transition-colors duration-200 ${
              isSavingPost || loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleSavePost}
            disabled={isSavingPost || loading}
          >
            {isSavingPost || loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500"></div>
              </div>
            ) : (
              <Bookmark
                className="w-5 h-5"
                fill={isBookmarked ? "currentColor" : "none"}
              />
            )}
          </button>
        </div>
        {/* Comment Input Bar - Fixed at Bottom */}
        <div className="flex items-center px-4 py-3 border-t bg-white flex-shrink-0">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isSubmittingComment) {
                e.preventDefault();
                handleAddComment();
              }
            }}
            placeholder="Write a comment..."
            className="flex-1 bg-transparent text-sm text-gray-700 focus:outline-none"
            disabled={isSubmittingComment}
          />
          <button className="text-gray-500 text-xl hover:text-gray-700 mr-2">
            <Smile className="w-5 h-5" />
          </button>
          <button
            onClick={handleAddComment}
            disabled={isSubmittingComment || !newComment.trim()}
            className={`transition-colors ${
              isSubmittingComment || !newComment.trim()
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:text-[#0017e7] cursor-pointer"
            }`}
          >
            {isSubmittingComment ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0017e7]"></div>
            ) : (
              <SendHorizontal className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostComment;