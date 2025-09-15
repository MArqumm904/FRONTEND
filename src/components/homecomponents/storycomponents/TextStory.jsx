import React, { useState } from "react";
import { X, Type, Palette } from "lucide-react";
import axios from "axios";
import addtext from "../../../assets/images/text.png";
import addstory from "../../../assets/images/add_Story.png";

const TextStory = ({
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
}) => {
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSizes, setShowFontSizes] = useState(false);

  // Font size options
  const fontSizes = [
    { label: "Small", value: "20px" },
    { label: "Medium", value: "28px" },
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

  // Default text boxes if empty
  const displayTextBoxes = textBoxes.length > 0 ? textBoxes : [
    {
      id: 1,
      text: "Your Text Here",
      x: 50,
      y: 100,
      editing: false,
      fontSize: "32px",
      fontWeight: "bold",
      color: "#ffffff",
    },
  ];

  const handleFontSizeChange = (fontSize) => {
    if (!selectedTextId) return;
    
    setTextBoxes(prevTextBoxes =>
      prevTextBoxes.map(box =>
        box.id === selectedTextId ? { ...box, fontSize } : box
      )
    );
    setShowFontSizes(false);
  };

  const handleColorChange = (color) => {
    if (!selectedTextId) return;
    
    setTextBoxes(prevTextBoxes =>
      prevTextBoxes.map(box =>
        box.id === selectedTextId ? { ...box, color } : box
      )
    );
    setShowColorPicker(false);
  };

  const handleFontWeightToggle = (textId) => {
    setTextBoxes(prevTextBoxes =>
      prevTextBoxes.map(box =>
        box.id === textId
          ? {
              ...box,
              fontWeight: box.fontWeight === "bold" ? "normal" : "bold",
            }
          : box
      )
    );
  };

  const createTextStory = async () => {
    try {
      const textElements = displayTextBoxes.map((textBox) => {
        // Extract numeric value from fontSize string (e.g., "32px" -> 32)
        const fontSizeValue = parseInt(textBox.fontSize?.replace('px', '')) || 32;
        
        return {
          text_content: textBox.text || "Your Text Here",
          x_position: textBox.x || 50,
          y_position: textBox.y || 100,
          font_size: fontSizeValue, // Now guaranteed to be a number
          font_color: textBox.color || "#ffffff",
          font_weight: textBox.fontWeight || "normal",
        };
      });

      console.log("Sending text elements:", textElements); // Debug log

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/stories/text`,
        {
          text_elements: textElements,
          duration: 5,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        handleAddToStory();
      } else {
        alert("Failed to create story: " + response.data.message);
      }
    } catch (error) {
      console.error("Error creating story:", error);
      console.error("Error response:", error.response?.data); // More detailed error log
      
      if (error.response?.data?.errors) {
        const errorMessages = Object.entries(error.response.data.errors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('\n');
        alert(`Validation errors:\n${errorMessages}`);
      } else {
        alert("Error creating story. Please try again.");
      }
    }
  };

  return (
    <div className="relative w-full h-full">
      <div
        className="relative w-full h-full bg-[#9b9b9b] p-4"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Text boxes */}
        {displayTextBoxes.map((textBox) => (
          <div
            key={textBox.id}
            className="absolute cursor-move group"
            style={{
              left: `${textBox.x}px`,
              top: `${textBox.y}px`,
              fontSize: textBox.fontSize,
              fontWeight: textBox.fontWeight,
              color: textBox.color,
            }}
            onMouseDown={(e) => {
              handleMouseDown(e, textBox);
              setSelectedTextId(textBox.id);
            }}
          >
            {/* Control buttons */}
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
                  fontSize: textBox.fontSize,
                  fontWeight: textBox.fontWeight,
                  color: textBox.color,
                  minWidth: "120px",
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
                  fontSize: textBox.fontSize,
                  fontWeight: textBox.fontWeight,
                  color: textBox.color,
                  textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                }}
              >
                {textBox.text}
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
      <div className="absolute bottom-6 left-6 right-6 flex justify-between">
        <button
          onClick={createTextStory}
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

export default TextStory;