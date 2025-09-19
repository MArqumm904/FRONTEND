import { useState, useEffect, useRef } from "react";
import PostImage from "../assets/images/postimage.png";
import PostStory from "./homecomponents/poststory";
import HomePostTab from "./homecomponents/homeposts";
import Person1 from "../assets/images/person-1.png";

const Post = ({onStoryUpload}) => {
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showStoryCreator, setShowStoryCreator] = useState(false);
  const [storyType, setStoryType] = useState("photo");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [postContent, setPostContent] = useState("");
  const [textBoxes, setTextBoxes] = useState([]);
  const [showFullText, setShowFullText] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [fetchedPostIds, setFetchedPostIds] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  const [apiPosts, setApiPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/allposts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            already_fetched_ids: fetchedPostIds,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        const newConvertedPosts = convertApiPostsToDisplayFormat(data);

        const newIds = [
          ...data.text_posts.map((p) => p.id),
          ...data.image_posts.map((p) => p.id),
          ...data.video_posts.map((p) => p.id),
          ...data.poll_posts.map((p) => p.id), // ADD THIS LINE
        ];

        const currentUserJustNowPosts = newConvertedPosts.filter((post) => {
          const timeDiff = new Date() - new Date(post.timestamp);
          const minutesDiff = Math.floor(timeDiff / (1000 * 60));
          return post.is_current_user && minutesDiff < 5; // Posts within 5 minutes
        });

        if (currentUserJustNowPosts.length > 0) {
          const filteredExistingPosts = apiPosts.filter(
            (existingPost) =>
              !currentUserJustNowPosts.some(
                (newPost) => newPost.uniqueId === existingPost.uniqueId
              )
          );

          const otherNewPosts = newConvertedPosts.filter(
            (post) => !currentUserJustNowPosts.includes(post)
          );
          setApiPosts([
            ...currentUserJustNowPosts,
            ...filteredExistingPosts,
            ...otherNewPosts,
          ]);
        } else {
          setApiPosts((prevPosts) => [...prevPosts, ...newConvertedPosts]);
        }

        setFetchedPostIds((prevIds) =>
          Array.from(new Set([...prevIds, ...newIds]))
        );

        newConvertedPosts.forEach((post) => {
          if (post.current_user_reaction) {
            setSelectedReaction((prev) => ({
              ...prev,
              [post.uniqueId]: post.current_user_reaction,
            }));
            setIsLiked((prev) => ({ ...prev, [post.uniqueId]: true }));
          }
        });

        if (newIds.length === 0) {
          setHasMore(false);
        }
      } else {
        console.error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshPosts = () => {
    setFetchedPostIds([]);
    setApiPosts([]);
    setHasMore(true);
    fetchPosts();
  };

  useEffect(() => {
    window.refreshPosts = refreshPosts;

    window.updatePostsData = (updatedPosts) => {
      setApiPosts(updatedPosts);
    };

    fetchPosts();

    // Cleanup
    return () => {
      delete window.refreshPosts;
      delete window.updatePostsData;
    };
  }, []);

const convertApiPostsToDisplayFormat = (apiData) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL.replace("/api", "");

  const convertedPosts = [];

  // Helper function to get profile photo URL
  const getProfilePhotoUrl = (profilePhoto) => {
    if (!profilePhoto) return Person1; // Fallback to default image
    return profilePhoto.startsWith("http")
      ? profilePhoto
      : `${baseUrl}/storage/${profilePhoto}`; 
  };

  apiData.text_posts.forEach((post) => {
    convertedPosts.push({
      id: post.id,
      type: "text",
      content: post.content,
      timestamp: post.created_at,
      likes: 0,
      comments: post.comments_count || 0,
      user: {
        ...post.user,
        profile_photo: getProfilePhotoUrl(post.user.profile_photo)
      },
      uniqueId: `text_${post.id}`,
      is_current_user: post.is_current_user,
      reactions_count: post.reactions_count || {},
      total_reactions: post.total_reactions || 0,
      current_user_reaction: post.current_user_reaction || null,
    });
  });

  apiData.image_posts.forEach((post) => {
    const imageUrl = post.media?.file
      ? post.media.file.startsWith("http")
        ? post.media.file
        : `${baseUrl}/storage/${post.media.file}`
      : PostImage;

    convertedPosts.push({
      id: post.id,
      type: "image",
      content: post.content,
      image: imageUrl,
      timestamp: post.created_at,
      likes: 0,
      comments: post.comments_count || 0,
      user: {
        ...post.user,
        profile_photo: getProfilePhotoUrl(post.user.profile_photo)
      },
      uniqueId: `image_${post.id}`,
      is_current_user: post.is_current_user,
      reactions_count: post.reactions_count || {},
      total_reactions: post.total_reactions || 0,
      current_user_reaction: post.current_user_reaction || null,
    });
  });

  apiData.video_posts.forEach((post) => {
    const videoUrl = post.media?.file
      ? post.media.file.startsWith("http")
        ? post.media.file
        : `${baseUrl}/storage/${post.media.file}`
      : "";

    convertedPosts.push({
      id: post.id,
      type: "video",
      content: post.content,
      video: videoUrl,
      thumbnail: PostImage,
      timestamp: post.created_at,
      likes: 0,
      comments: post.comments_count || 0,
      user: {
        ...post.user,
        profile_photo: getProfilePhotoUrl(post.user.profile_photo)
      },
      uniqueId: `video_${post.id}`,
      is_current_user: post.is_current_user,
      reactions_count: post.reactions_count || {},
      total_reactions: post.total_reactions || 0,
      current_user_reaction: post.current_user_reaction || null,
    });
  });

  apiData.poll_posts.forEach((post) => {
    const pollOptions = post.poll?.options || [];

    const formattedOptions = pollOptions.map((option, index) => ({
      id: index + 1,
      text: option,
      votes: 0,
      percentage: 0,
    }));

    convertedPosts.push({
      id: post.id,
      type: "poll",
      content: post.content,
      poll: {
        options: formattedOptions,
        totalVotes: 0,
        userVoted: null,
        question: post.poll?.question || post.content,
      },
      timestamp: post.created_at,
      likes: 0,
      comments: post.comments_count || 0,
      user: {
        ...post.user,
        profile_photo: getProfilePhotoUrl(post.user.profile_photo)
      },
      uniqueId: `poll_${post.id}`,
      is_current_user: post.is_current_user,
    });
  });

  return convertedPosts.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
};

  const getCombinedPosts = () => {
    return apiPosts;
  };

  const combinedPosts = getCombinedPosts();

  const [reactions, setReactions] = useState({
    like: 0,
    love: 0,
    laugh: 0,
    wow: 0,
    sad: 0,
    angry: 0,
  });

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();

  const handleAddToStory = () => {
    setShowStoryCreator(false);
    setSelectedImage(null);
    setSelectedVideo(null);
    setPostContent("");
    setTextBoxes([]);
    alert("story added successfully!");
    onStoryUpload();
  };

  const closeStoryCreator = () => {
    setShowStoryCreator(false);
    setSelectedImage(null);
    setSelectedVideo(null);
    setPostContent("");
    setTextBoxes([]);
  };

  const handleAddText = () => {
    const newTextBox = {
      id: Date.now(),
      text: "Add text here",
      x: 50,
      y: 50,
      editing: true,
      fontSize: "16px",
      color: "white",
    };
    setTextBoxes([...textBoxes, newTextBox]);
  };

  const handleTextClick = (id) => {
    setTextBoxes(
      textBoxes.map((box) =>
        box.id === id ? { ...box, editing: true } : { ...box, editing: false }
      )
    );
  };

  const handleTextChange = (id, newText) => {
    setTextBoxes(
      textBoxes.map((box) => (box.id === id ? { ...box, text: newText } : box))
    );
  };

  const handleRemoveText = (id) => {
    setTextBoxes(textBoxes.filter((box) => box.id !== id));
  };

  const handleMouseDown = (e, textBox) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setDraggedText(textBox.id);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const [draggedText, setDraggedText] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (draggedText) {
      const container = e.currentTarget.getBoundingClientRect();
      const newX = e.clientX - container.left - dragOffset.x;
      const newY = e.clientY - container.top - dragOffset.y;

      setTextBoxes(
        textBoxes.map((box) =>
          box.id === draggedText
            ? {
                ...box,
                x: Math.max(0, Math.min(newX, container.width - 100)),
                y: Math.max(0, Math.min(newY, container.height - 30)),
              }
            : box
        )
      );
    }
  };

  const handleMouseUp = () => {
    setDraggedText(null);
  };

  const handleAddToStoryFromMenu = (post) => {
    setShowMenu(false);
    setSelectedImage(null);
    setSelectedVideo(null);
    setPostContent("");
    setSelectedPost(post);

    if (post.type === "image") {
      setStoryType("postphotostory");
      setSelectedImage(post.image || PostImage);
    } else if (post.type === "video") {
      setStoryType("postvideostory");
      setSelectedVideo(post.video);
    } else if (post.type === "text") {
      setStoryType("posttextstory");
      setPostContent(post.content);
    }

    setShowStoryCreator(true);
  };

  useEffect(() => {
    if (showCommentPopup || showSharePopup || showStoryCreator) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showCommentPopup, showSharePopup, showStoryCreator]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="mx-auto space-y-4">
        <HomePostTab
          posts_data={combinedPosts}
          poll_posts_data={[]}
          onAddToStory={handleAddToStoryFromMenu}
          fetchPosts={fetchPosts}
          loading={loading}
          hasMore={hasMore}
          refreshPosts={refreshPosts}
        />
      </div>

      <PostStory
        showStoryCreator={showStoryCreator}
        closeStoryCreator={closeStoryCreator}
        storyType={storyType}
        selectedImage={selectedImage}
        selectedVideo={selectedVideo}
        postContent={postContent}
        textBoxes={textBoxes}
        handleMouseMove={handleMouseMove}
        handleMouseUp={handleMouseUp}
        handleMouseDown={handleMouseDown}
        handleTextClick={handleTextClick}
        handleTextChange={handleTextChange}
        handleAddText={handleAddText}
        handleAddToStory={handleAddToStory}
        setTextBoxes={setTextBoxes}
        handleRemoveText={handleRemoveText}
        post={selectedPost}
      />
    </>
  );
};

export default Post;
