// PostModalPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PostComment from "../components/post_comment";
import axios from "axios";

function PostModalPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPostData();
  }, [postId]);

  const formatTimeAgo = (timestamp) => {
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

  const fetchPostData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/shareapost/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.success) {
        const post = response.data.data;
        const baseUrl = import.meta.env.VITE_API_BASE_URL.replace("/api", "");

        // Construct full image URL if it's a relative path
        if (post.image && !post.image.startsWith("http")) {
          post.image = `${baseUrl}/storage/${post.image}`;
        }

        // Same for video
        if (post.video && !post.video.startsWith("http")) {
          post.video = `${baseUrl}/storage/${post.video}`;
        }

        // Profile photo
        if (
          post.user?.profile_photo &&
          !post.user.profile_photo.startsWith("http")
        ) {
          post.user.profile_photo = `${baseUrl}/storage/${post.user.profile_photo}`;
        }

        setPostData(post);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate("/"); // Home page par wapas
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!postData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <h2 className="text-xl font-semibold mb-4">Post not found</h2>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <PostComment
      postId={postId}
      userAvatar={postData.user?.profile_photo}
      post_image={postData.type === "image" ? postData.image : null}
      text={postData.type === "text" ? postData.content : null}
      videoUrl={postData.type === "video" ? postData.video : null}
      pollData={postData.type === "poll" ? postData.poll : null}
      postData={postData}
      userName={postData.user?.name}
      postTime={formatTimeAgo(postData.created_at)}
      totalReactions={postData.total_reactions || 0}
      reactionsCount={postData.reactions_count || {}}
      currentUserReaction={postData.current_user_reaction}
      commentsCount={postData.comments || 0}
      viewsCount={postData.views || 0}
      caption={postData.content}
      postType={postData.type}
      userId={postData.user?.id}
      onClose={handleClose}
    />
  );
}

export default PostModalPage;
