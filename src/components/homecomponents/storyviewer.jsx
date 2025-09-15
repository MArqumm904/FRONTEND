import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import TextStoryView from "./storycomponents/TextStoryView";
import PhotoStoryView from "./storycomponents/PhotoStoryView";
import PostPhotoStoryView from "./storycomponents/PostPhotoStoryView";
import PostTextStoryView from "./storycomponents/PostTextStoryView";
import PostVideoStoryView from "./storycomponents/PostVideoStoryView";
import ViewersModal from "./viewersmodal";
import { viewersData } from "./viewersData";
import cross from "../../assets/images/cross_icon.png";
import dots from "../../assets/images/dots.png";
import pause from "../../assets/images/pause.png";
import volume from "../../assets/images/volume.png";
import viewss from "../../assets/images/viewss.png";
import { Play, Volume2, VolumeX } from "lucide-react";

const StoryViewer = ({
  isOpen,
  onClose,
  stories,
  currentStoryIndex,
  currentUser,
  onDelete,
}) => {
  const [currentStory, setCurrentStory] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [showViewersModal, setShowViewersModal] = useState(false);
  const [progress, setProgress] = useState(0);

  // Use stories prop directly
  const storiesToShow = stories || [];
  const currentStoryData = storiesToShow[currentStory];

  console.log("StoryViewer props:", { isOpen, stories, currentUser });
  console.log("Current story data:", currentStoryData);

  useEffect(() => {
    if (!isOpen || !isPlaying || !currentStoryData) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Move to next story
          if (currentStory < storiesToShow.length - 1) {
            setCurrentStory((prev) => prev + 1);
            return 0;
          } else {
            // Close viewer when all stories are done
            onClose();
            return 0;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [
    isOpen,
    isPlaying,
    currentStory,
    storiesToShow.length,
    currentStoryData,
    onClose,
  ]);

  useEffect(() => {
    if (isOpen) {
      setCurrentStory(0);
      setProgress(0);
      setIsPlaying(true);
    }
  }, [isOpen, stories]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleDeleteStory = async () => {
    try {
      const deleteBody = {
        id: currentStoryData.id,
        type: currentStoryData.type,
      };
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/stories/delete-story`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(deleteBody),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete story");
      }

      const result = await response.json();
      alert("Story deleted successfully!");
      setShowDeleteMenu(false);
      onDelete();
      onClose();
    } catch (error) {
      console.error("Error deleting story:", error);
      alert("Failed to delete story. Please try again.");
    }
  };

  const handleViewersClick = () => {
    setShowViewersModal(true);
    setIsPlaying(false);
  };

  const handleViewersClose = () => {
    setShowViewersModal(false);
    setIsPlaying(true);
  };

  const nextStory = () => {
    if (currentStory < storiesToShow.length - 1) {
      setCurrentStory((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const prevStory = () => {
    if (currentStory > 0) {
      setCurrentStory((prev) => prev - 1);
      setProgress(0);
    }
  };

  const renderStoryContent = () => {
    if (!currentStoryData) {
      console.log("No current story data available");
      return (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
          <p>No story available</p>
        </div>
      );
    }

    const storyType = currentStoryData.type;

    const transformedStory = {
      id: currentStoryData.id,
      createdAt: currentStoryData.created_at,
      type: storyType,
      video: currentStoryData?.post?.media?.file,
      url: currentStoryData.media_path
        ? `http://127.0.0.1:8000/storage/${currentStoryData.media_path}`
        : null,
      background_color: currentStoryData.background_color || "#9B9B9B",
      x_position: currentStoryData.x_position || 50,
      y_position: currentStoryData.y_position || 50,
      scale: currentStoryData.scale || 1,

      textElements:
        currentStoryData.texts?.map((text) => ({
          text: text.text_content,
          color: text.font_color || "#ffffff",
          fontSize: text.font_size || 24,
          fontWeight: text.font_weight || "bold",
          x: text.x_position || 50,
          y: text.y_position || 50,
          order: text.order_index || 0,
        })) || [],

      pagename:
        currentStoryData.post?.user?.name || currentUser?.name || "Story",
      avatar:
        currentStoryData.post?.user?.avatar || currentUser?.avatar || null,
      postdesc: currentStoryData.post?.content || "",
      duration: currentStoryData.duration || 5,
    };

    if (transformedStory.textElements.length > 0) {
      transformedStory.textElements.sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      );
    }

    switch (storyType) {
      case "text":
        return (
          <TextStoryView
            story={transformedStory}
            onAddToStory={() => {}}
            onAddText={() => {}}
          />
        );
      case "image":
        return (
          <PhotoStoryView
            story={transformedStory}
            onAddToStory={() => {}}
            onAddText={() => {}}
          />
        );
      case "postimage":
        return (
          <PostPhotoStoryView
            story={{
              ...transformedStory,
              url: currentStoryData.post?.media?.[0]?.file
                ? `http://127.0.0.1:8000/storage/${currentStoryData.post.media[0].file}`
                : transformedStory.url,
            }}
            onAddToStory={() => {}}
            onAddText={() => {}}
          />
        );
      case "posttext":
        return (
          <PostTextStoryView
            story={transformedStory}
            onAddToStory={() => {}}
            onAddText={() => {}}
          />
        );
      case "postvideo":
      case "video":
        let videoUrl = null;
        if (currentStoryData.media_path) {
          videoUrl = `http://127.0.0.1:8000/storage/${currentStoryData.media_path}`;
        } else if (currentStoryData.post?.media?.[0]?.file) {
          videoUrl = `http://127.0.0.1:8000/storage/${currentStoryData.post.media[0].file}`;
        }
        return (
          <PostVideoStoryView
            storyData={{
              ...transformedStory,
              url: videoUrl,
              duration: currentStoryData.duration || 5,
            }}
            isPlaying={isPlaying}
            isMuted={isMuted}
            onPlayPause={togglePlayPause}
            onToggleMute={toggleMute}
          />
        );
      default:
        console.log("Unknown story type, defaulting to PhotoStoryView");
        return (
          <PhotoStoryView
            story={transformedStory}
            onAddToStory={() => {}}
            onAddText={() => {}}
          />
        );
    }
  };

  const getTotalProgressBars = () => {
    return storiesToShow.length || 1;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-[#333333] z-50 flex items-center justify-center">
        <div className="relative w-full max-w-md h-[800px] bg-black overflow-hidden flex flex-col justify-center items-center mx-auto my-auto rounded-xl">
          {/* Progress bars */}
          <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
            {Array.from({ length: getTotalProgressBars() }, (_, index) => (
              <div
                key={index}
                className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{
                    width:
                      index < currentStory
                        ? "100%"
                        : index === currentStory
                        ? `${progress}%`
                        : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Story Content */}
          <div className="relative w-full h-full">
            {renderStoryContent()}

            {/* Navigation areas */}
            <div className="absolute inset-0 flex z-10">
              <div className="flex-1" onClick={prevStory} />
              <div className="flex-1" onClick={nextStory} />
            </div>
          </div>

          {/* Header */}
          <div className="absolute top-12 left-4 right-4 flex items-center justify-between z-20">
            <div className="flex items-center gap-3">
              <img
                src={
                  currentUser?.avatar
                    ? `http://127.0.0.1:8000/storage/${currentUser.avatar}`
                    : currentStoryData?.user?.avatar
                    ? `http://127.0.0.1:8000/storage/${currentStoryData.user.avatar}`
                    : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&crop=face"
                }
                alt=""
                className="w-8 h-8 rounded-full object-cover border border-white"
              />
              <div>
                <p className="text-white font-medium text-sm">
                  {currentUser?.name || currentStoryData?.user?.name || "User"}
                </p>
                <p className="text-gray-300 text-xs">30m ago</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Sound/Mute Button */}
              <button
                onClick={toggleMute}
                className="text-white p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>

              {/* Play/Pause Button */}
              <button
                onClick={togglePlayPause}
                className="text-white p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                {isPlaying ? (
                  <img src={pause} alt="Pause" className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 fill-white" />
                )}
              </button>

              {/* Menu Button */}
              <div className="relative">
                <button
                  onClick={() => setShowDeleteMenu(!showDeleteMenu)}
                  className="text-white p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  <img src={dots} alt="Menu" className="w-6 h-2" />
                </button>
                {showDeleteMenu && (
                  <div className="absolute top-8 right-0 bg-white rounded-lg shadow-lg py-2 px-4 min-w-[170px]">
                    <button
                      onClick={handleDeleteStory}
                      className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-2 py-1 rounded w-full text-left"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Delete Story
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer - Views */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 z-20">
            <button
              onClick={handleViewersClick}
              className="flex items-center gap-1 text-white hover:text-gray-300 transition-colors"
            >
              <img src={viewss} alt="Views" className="w-6 h-4" />
              <span className="text-sm">{viewersData.length} Views</span>
            </button>
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white z-30 p-2 bg-opacity-50 rounded-full hover:bg-opacity-20 transition-colors"
        >
          <img src={cross} alt="Close" className="w-6 h-6" />
        </button>
      </div>

      {/* Viewers Modal */}
      <ViewersModal
        isOpen={showViewersModal}
        onClose={handleViewersClose}
        viewers={viewersData}
      />
    </>
  );
};

export default StoryViewer;
