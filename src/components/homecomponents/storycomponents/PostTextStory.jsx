import { useState, useRef } from "react";
import { X, Type, Palette } from "lucide-react";
import addtext from "../../../assets/images/text.png";
import addstory from "../../../assets/images/add_Story.png";
import axios from "axios";

const PostTextStory = ({
  postContent,
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
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSizes, setShowFontSizes] = useState(false);
  const containerRef = useRef(null);

  const username = postData?.user?.name || "Unknown User";
  const postId = postData?.id || null;
  
  // Get first letter of username
  const userInitial = username.charAt(0).toUpperCase();

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

  const createPostTextStory = async () => {
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
        `${import.meta.env.VITE_API_BASE_URL}/stories/posttext`,
        {
          post_id: postId,
          text_elements: textElements.length > 0 ? textElements : undefined,
          content: postContent || "Amazing new features. Created playlists and exclusive content for you.",
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

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="relative w-full h-full bg-[#9b9b9b] flex items-center justify-center overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Post Content Display */}
        <div className="w-full h-full flex flex-col items-center justify-center px-6">
          {/* Profile Section */}
          <div className="bg-white rounded-xl p-4 w-full max-w-[280px] shadow-lg">
            {/* Profile Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">{userInitial}</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  {username}
                </h3>
              </div>
            </div>

            {/* Post Text Content */}
            <div className="bg-black text-white p-12 rounded-lg text-center">
              <p className="text-md font-medium leading-relaxed">
                {postContent ||
                  "Amazing new features. Created playlists and exclusive content for you."}
              </p>
            </div>
          </div>
        </div>

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

      {/* Bottom buttons */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
        <button
          onClick={createPostTextStory}
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

export default PostTextStory;