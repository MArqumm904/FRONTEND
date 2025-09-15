import React, { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";

const PostVideoStoryView = ({ 
  storyData, 
  isPlaying, 
  isMuted, 
  onPlayPause, 
  onToggleMute 
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef(null);

  // Handle video playback state changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideoReady) return;

    if (isPlaying) {
      video.play().catch(error => {
        console.error("Video play error:", error);
        setHasError(true);
      });
    } else {
      video.pause();
    }
  }, [isPlaying, isVideoReady]);

  // Handle mute state changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = isMuted;
  }, [isMuted]);

  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    
    const updateDuration = () => {
      if (video.duration && video.duration !== Infinity) {
        setDuration(video.duration);
      } else {
        setDuration(storyData?.duration || 5);
      }
    };
    
    const handleCanPlay = () => {
      setIsVideoReady(true);
      setHasError(false);
      if (isPlaying) {
        video.play().catch(error => {
          console.error("Video play error:", error);
          setHasError(true);
        });
      }
    };

    const handleError = (e) => {
      console.error("Video loading error:", e);
      setHasError(true);
      setIsVideoReady(false);
    };

    const handleLoadStart = () => {
      setIsVideoReady(false);
      setHasError(false);
    };

    const handleEnded = () => {
      video.currentTime = 0;
      if (video.loop) {
        video.play().catch(error => {
          console.error("Video loop error:", error);
        });
      }
    };

    // Add event listeners
    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("ended", handleEnded);

    // Set initial muted state
    video.muted = isMuted;

    // Auto-play if video is ready and should be playing
    if (video.readyState >= 3 && isPlaying) {
      video.play().catch(error => {
        console.error("Video play error:", error);
        setHasError(true);
      });
    }

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("ended", handleEnded);
    };
  }, [storyData?.url, storyData?.duration, isPlaying, isMuted]);

  // Format time helper
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Get the correct video URL
  const getVideoUrl = () => {
    if (storyData?.url) return storyData.url;
    if (storyData?.video) return storyData.video;
    if (storyData?.post?.media?.file) {
      return `http://127.0.0.1:8000/storage/${storyData.post.media.file}`;
    }
    return null;
  };

  const videoUrl = getVideoUrl();

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#9b9b9b] p-4">
      {/* Text elements */}
      {storyData?.textElements && storyData.textElements.length > 0 && (
        <div className="relative z-10 w-full max-w-sm mb-4 flex flex-col items-center justify-center">
          {storyData.textElements.map((textElement, index) => (
            <div
              key={index}
              className="text-center mb-2"
              style={{
                fontSize: `${textElement.fontSize || 24}px`,
                color: textElement.color || '#ffffff',
                fontWeight: textElement.fontWeight || 'normal',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxWidth: '100%'
              }}
            >
              {textElement.text}
            </div>
          ))}
        </div>
      )}

      {/* Video container */}
      <div className="relative flex items-center justify-center" style={{ width: "260px", height: "450px" }}>
        {/* If video is available */}
        {videoUrl && !hasError ? (
          <div className="w-full h-full relative rounded-lg overflow-hidden bg-black">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-cover"
              loop
              playsInline
              preload="metadata"
              muted={isMuted}
            />
            
            {/* Loading indicator */}
            {!isVideoReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* Play/Pause overlay - only shows when paused or on tap */}
            <button 
              onClick={onPlayPause}
              className={`absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-200 ${
                !isPlaying ? 'opacity-100' : 'opacity-0 hover:opacity-100 focus:opacity-100'
              }`}
            >
              <div className="bg-black bg-opacity-50 rounded-full p-3 transform transition-transform hover:scale-110">
                {!isPlaying ? (
                  <Play size={40} className="text-white ml-1" fill="white" />
                ) : (
                  <Pause size={40} className="text-white" />
                )}
              </div>
            </button>
            
            {/* Pagename & Timer */}
            <div className="absolute top-3 left-3 text-white text-sm font-light bg-black bg-opacity-50 px-2 py-1 rounded backdrop-blur-sm">
              {storyData?.pagename || "Story"}
            </div>
            <div className="absolute top-3 right-3 text-white text-sm font-light bg-black bg-opacity-50 px-2 py-1 rounded backdrop-blur-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700">
              <div 
                className="h-full bg-white transition-all duration-300" 
                style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
              />
            </div>

            {/* Mute indicator */}
            {isMuted && (
              <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 rounded-full p-1">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.54-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.34-1.71-.71z"/>
                </svg>
              </div>
            )}
          </div>
        ) : (
          // If no video URL or error
          <div className="w-full h-full bg-gray-800 rounded-lg flex flex-col items-center justify-center text-center px-4 text-white">
            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-4">
              <Play size={32} className="text-gray-400 ml-1" />
            </div>
            <p className="text-gray-400 text-sm mb-2">
              {hasError ? "Error loading video" : "No video available"}
            </p>
            <p className="text-gray-500 text-xs">
              {storyData?.pagename || "Story"}
            </p>
            {storyData?.duration && (
              <p className="text-gray-500 text-xs mt-2">
                Duration: {storyData.duration}s
              </p>
            )}
            {hasError && (
              <button 
                onClick={() => {
                  setHasError(false);
                  setIsVideoReady(false);
                  if (videoRef.current) {
                    videoRef.current.load();
                  }
                }}
                className="mt-3 px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-500 transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostVideoStoryView;