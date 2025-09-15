import { useState, useRef, useEffect } from "react";
import { X, Type, Palette, Play, Pause } from "lucide-react";
import addtext from "../../../assets/images/text.png";
import addstory from "../../../assets/images/add_Story.png";
import axios from "axios";

const PostVideoStory = ({
  selectedVideo,
  textBoxes,
  handleMouseMove,
  handleMouseUp,
  handleMouseDown,
  handleTextClick,
  handleTextChange,
  handleAddText,
  handleAddToStory,
  handleRemoveText,
  setTextBoxes,
  postData,
}) => {
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const [videoPosition, setVideoPosition] = useState({ x: 0, y: 0 });
  const [videoScale, setVideoScale] = useState(1);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSizes, setShowFontSizes] = useState(false);
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  const username = postData?.user?.name || "Unknown User";
  const postId = postData?.id || null;

  

  // Font size options
  const fontSizes = [
    { label: "Small", value: "16px" },
    { label: "Medium", value: "24px" },
    { label: "Large", value: "32px" },
    { label: "X-Large", value: "40px" },
    { label: "XX-Large", value: "48px" },
  ];

  // Color options
  const colorOptions = [
    "#ffffff",
    "#000000",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
    "#ffa500",
    "#800080",
    "#ffc0cb",
    "#90ee90",
    "#ffd700",
    "#808080",
  ];

  // Video time update
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [selectedVideo]);

  const createPostVideoStory = async () => {
    try {
      // Prepare text elements
      const textElements = textBoxes.map((textBox) => ({
        text_content: textBox.text || "Your Text Here",
        x_position: Number(textBox.x) || 50,
        y_position: Number(textBox.y) || 100,
        font_size: parseInt(textBox.fontSize) || 24,
        font_color: textBox.color || "#ffffff",
        font_weight: textBox.fontWeight || "normal",
      }));

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/stories/postvideo`,
        {
          post_id: postId,
          text_elements: textElements.length > 0 ? textElements : undefined,
          position_x: Number(videoPosition.x) || 0,
          position_y: Number(videoPosition.y) || 0,
          scale: Math.max(0.1, Math.min(5, Number(videoScale) || 1)),
          duration: 5,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        handleAddToStory();
      } else {
        throw new Error(response.data.message || "Failed to create story");
      }
    } catch (error) {
      console.error("Error creating story:", error);
      let errorMessage = "Error creating story. Please try again.";

      if (error.response) {
        if (error.response.data?.errors) {
          errorMessage = Object.entries(error.response.data.errors)
            .map(
              ([field, messages]) =>
                `${field}: ${
                  Array.isArray(messages) ? messages.join(", ") : messages
                }`
            )
            .join("\n");
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    }
  };

  // Format time display
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Video controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Video dragging handlers
  const handleVideoMouseDown = (e) => {
    if (!selectedVideo) return;
    setIsDraggingVideo(true);
    setDragStart({
      x: e.clientX - videoPosition.x,
      y: e.clientY - videoPosition.y,
    });
    e.preventDefault();
  };

  const handleVideoMouseMove = (e) => {
    if (!isDraggingVideo) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setVideoPosition({ x: newX, y: newY });
  };

  const handleVideoMouseUp = () => {
    setIsDraggingVideo(false);
  };

  // Text styling handlers
  const handleFontSizeChange = (fontSize) => {
    if (!selectedTextId) return;
    setTextBoxes((prevTextBoxes) =>
      prevTextBoxes.map((box) =>
        box.id === selectedTextId ? { ...box, fontSize } : box
      )
    );
    setShowFontSizes(false);
  };

  const handleColorChange = (color) => {
    if (!selectedTextId) return;
    setTextBoxes((prevTextBoxes) =>
      prevTextBoxes.map((box) =>
        box.id === selectedTextId ? { ...box, color } : box
      )
    );
    setShowColorPicker(false);
  };

  const handleFontWeightToggle = (textId) => {
    setTextBoxes((prevTextBoxes) =>
      prevTextBoxes.map((box) =>
        box.id === textId
          ? {
              ...box,
              fontWeight: box.fontWeight === "bold" ? "normal" : "bold",
            }
          : box
      )
    );
  };

  const handleTouchStart = (e) => {
    if (!selectedVideo) return;
    const touch = e.touches[0];
    setIsDraggingVideo(true);
    setDragStart({
      x: touch.clientX - videoPosition.x,
      y: touch.clientY - videoPosition.y,
    });
  };

  const handleTouchMove = (e) => {
    if (!isDraggingVideo) return;
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;
    setVideoPosition({ x: newX, y: newY });
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    setIsDraggingVideo(false);
  };

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="relative w-full h-full bg-[#9b9b9b] flex items-center justify-center overflow-hidden"
        onMouseMove={isDraggingVideo ? handleVideoMouseMove : handleMouseMove}
        onMouseUp={isDraggingVideo ? handleVideoMouseUp : handleMouseUp}
        onMouseLeave={isDraggingVideo ? handleVideoMouseUp : handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {selectedVideo && (
          <div
            className="relative flex items-center justify-center"
            style={{ width: "260px", height: "450px" }}
          >
            <div
              className={`w-full h-full flex flex-col items-start justify-center relative ${
                isDraggingVideo ? "cursor-grabbing" : "cursor-grab"
              }`}
              style={{
                transform: `translate(${videoPosition.x}px, ${videoPosition.y}px) scale(${videoScale})`,
                transition: isDraggingVideo ? "none" : "transform 0.2s ease",
              }}
              onMouseDown={handleVideoMouseDown}
            >
              {/* Video Player */}
              <div className="relative w-full h-full rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  src={selectedVideo}
                  className="w-full h-full object-cover pointer-events-none"
                  muted
                  loop
                />

                {/* Video Overlay Controls */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={togglePlay}
                    className="bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-70 transition-all"
                    style={{ pointerEvents: "auto" }}
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                </div>

                {/* Video Timer */}
              

                 <div className="absolute top-3 left-3 text-white text-sm font-light">
                  {username}
                </div>
                <div className="absolute top-3 right-3 text-white text-sm font-light">
                  {formatTime(currentTime)} / {formatTime(duration || 0)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Text boxes */}
        {textBoxes.map((textBox) => (
          <div
            key={textBox.id}
            className="absolute cursor-move group"
            style={{
              left: `${textBox.x}px`,
              top: `${textBox.y}px`,
              fontSize: textBox.fontSize || "24px",
              fontWeight: textBox.fontWeight || "normal",
              color: textBox.color || "#ffffff",
            }}
            onMouseDown={(e) => {
              handleMouseDown(e, textBox);
              setSelectedTextId(textBox.id);
            }}
          >
            {/* Control buttons - shows on hover */}
            <div className="absolute -top-10 left-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 p-1 rounded">
              {/* Remove Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveText(textBox.id);
                }}
                className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                title="Remove Text"
              >
                <X size={12} />
              </button>

              {/* Font Size Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTextId(textBox.id);
                  setShowFontSizes(!showFontSizes);
                  setShowColorPicker(false);
                }}
                className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-600"
                title="Font Size"
              >
                <Type size={12} />
              </button>

              {/* Color Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTextId(textBox.id);
                  setShowColorPicker(!showColorPicker);
                  setShowFontSizes(false);
                }}
                className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-green-600"
                title="Text Color"
              >
                <Palette size={12} />
              </button>

              {/* Bold Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFontWeightToggle(textBox.id);
                }}
                className={`${
                  textBox.fontWeight === "bold"
                    ? "bg-yellow-500"
                    : "bg-gray-500"
                } text-white rounded-full w-6 h-6 flex items-center justify-center hover:opacity-80 font-bold text-xs`}
                title="Toggle Bold"
              >
                B
              </button>
            </div>

            {textBox.editing ? (
              <input
                type="text"
                value={textBox.text}
                onChange={(e) => handleTextChange(textBox.id, e.target.value)}
                onBlur={() => handleTextClick(textBox.id)}
                className="bg-transparent border-none outline-none"
                style={{
                  fontSize: textBox.fontSize || "24px",
                  fontWeight: textBox.fontWeight || "normal",
                  color: textBox.color || "#ffffff",
                  minWidth: "120px",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                }}
                autoFocus
              />
            ) : (
              <div
                className="cursor-pointer select-none"
                onClick={() => {
                  setSelectedTextId(textBox.id);
                  handleTextClick(textBox.id);
                }}
                style={{
                  fontSize: textBox.fontSize || "24px",
                  fontWeight: textBox.fontWeight || "normal",
                  color: textBox.color || "#ffffff",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                }}
              >
                {textBox.text || "Click to edit"}
              </div>
            )}
          </div>
        ))}

        {/* Font Size Selector */}
        {showFontSizes && (
          <div className="absolute top-16 left-4 bg-white rounded-lg shadow-lg p-3 z-10">
            <h3 className="font-semibold mb-2 text-sm">Font Size</h3>
            <div className="space-y-1">
              {fontSizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => handleFontSizeChange(size.value)}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                >
                  {size.label} ({size.value})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color Picker */}
        {showColorPicker && (
          <div className="absolute top-16 right-4 bg-white rounded-lg shadow-lg p-3 z-10">
            <h3 className="font-semibold mb-2 text-sm">Text Color</h3>
            <div className="grid grid-cols-5 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-500"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Video controls */}
      {selectedVideo && (
        <div className="absolute top-4 left-4 flex gap-2">
          <button
            onClick={() => setVideoScale((prev) => Math.max(0.5, prev - 0.1))}
            className="bg-gray-700 bg-opacity-80 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
          >
            -
          </button>
          <span className="bg-gray-700 bg-opacity-80 text-white px-3 py-1 rounded text-sm">
            {Math.round(videoScale * 100)}%
          </span>
          <button
            onClick={() => setVideoScale((prev) => Math.min(2, prev + 0.1))}
            className="bg-gray-700 bg-opacity-80 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
          >
            +
          </button>
        </div>
      )}

      {/* Bottom buttons */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
        <button
          onClick={createPostVideoStory}
          className="bg-gray-700 bg-opacity-80 text-white px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-600 transition-colors font-medium"
        >
          <img src={addstory} alt="Add" className="w-[18px] h-[18px]" />
          Add to Story
        </button>
        <button
          onClick={handleAddText}
          className="bg-gray-700 bg-opacity-80 text-white px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-600 transition-colors font-medium"
        >
          <img src={addtext} alt="Text" className="w-[18px] h-[18px]" />
          Add Text
        </button>
      </div>
    </div>
  );
};

export default PostVideoStory;