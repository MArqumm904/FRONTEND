import { useState, useRef } from "react";
import { X, Type, Palette } from "lucide-react";
import axios from "axios";
import addtext from "../../../assets/images/text.png";
import addstory from "../../../assets/images/add_Story.png";

const ImageStory = ({
  selectedImage,
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
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(1);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSizes, setShowFontSizes] = useState(false);
  const containerRef = useRef(null);

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

  // Image dragging handlers
  const handleImageMouseDown = (e) => {
    if (!selectedImage) return;
    setIsDraggingImage(true);
    setDragStart({
      x: e.clientX - imagePosition.x,
      y: e.clientY - imagePosition.y,
    });
    e.preventDefault();
  };

  const handleImageMouseMove = (e) => {
    if (!isDraggingImage) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setImagePosition({ x: newX, y: newY });
  };

  const handleImageMouseUp = () => {
    setIsDraggingImage(false);
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

  const createImageStory = async () => {
    try {
      const formData = new FormData();

      let imageToUpload = selectedImage;
      if (
        typeof selectedImage === "string" &&
        selectedImage.startsWith("data:")
      ) {
        const blob = await fetch(selectedImage).then((res) => res.blob());
        const fileName = `story-image-${Date.now()}.${blob.type.split("/")[1]}`;
        imageToUpload = new File([blob], fileName, { type: blob.type });
      }

      if (
        !(imageToUpload instanceof File) &&
        !(imageToUpload instanceof Blob)
      ) {
        throw new Error(
          "Invalid image format. Please select a valid image file."
        );
      }

      formData.append("image", imageToUpload);

      const textElements = textBoxes.map((textBox) => {
        let fontSizeValue = 24;
        if (textBox.fontSize) {
          const sizeMatch = textBox.fontSize.toString().match(/\d+/);
          if (sizeMatch) {
            fontSizeValue = parseInt(sizeMatch[0]);
            fontSizeValue = Math.max(8, Math.min(72, fontSizeValue));
          }
        }

        return {
          text_content: textBox.text?.toString() || "Your Text Here",
          x_position: Number(textBox.x) || 50,
          y_position: Number(textBox.y) || 100,
          font_size: fontSizeValue,
          font_color: textBox.color?.toString() || "#ffffff",
        };
      });

      if (textElements.length > 0) {
        formData.append("text_elements", JSON.stringify(textElements));
      }

      formData.append("position_x", Number(imagePosition.x) || 0);
      formData.append("position_y", Number(imagePosition.y) || 0);
      formData.append(
        "scale",
        Math.max(0.1, Math.min(5, Number(imageScale) || 1))
      );

      formData.append("duration", 5);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/stories/image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
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

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="relative w-full h-full bg-[#9b9b9b] flex items-center justify-center overflow-hidden"
        onMouseMove={isDraggingImage ? handleImageMouseMove : handleMouseMove}
        onMouseUp={isDraggingImage ? handleImageMouseUp : handleMouseUp}
        onMouseLeave={isDraggingImage ? handleImageMouseUp : handleMouseUp}
      >
        {selectedImage && (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={
                typeof selectedImage === "string"
                  ? selectedImage
                  : URL.createObjectURL(selectedImage)
              }
              alt="Story content"
              className={`max-w-full max-h-full object-contain ${
                isDraggingImage ? "cursor-grabbing" : "cursor-grab"
              }`}
              style={{
                transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale})`,
                transition: isDraggingImage ? "none" : "transform 0.2s ease",
              }}
              onMouseDown={handleImageMouseDown}
              draggable={false}
            />
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

      {/* Image controls */}
      {selectedImage && (
        <div className="absolute top-4 left-4 flex gap-2">
          <button
            onClick={() => setImageScale((prev) => Math.max(0.5, prev - 0.1))}
            className="bg-gray-700 bg-opacity-80 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
          >
            -
          </button>
          <span className="bg-gray-700 bg-opacity-80 text-white px-3 py-1 rounded text-sm">
            {Math.round(imageScale * 100)}%
          </span>
          <button
            onClick={() => setImageScale((prev) => Math.min(2, prev + 0.1))}
            className="bg-gray-700 bg-opacity-80 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
          >
            +
          </button>
        </div>
      )}

      {/* Bottom buttons */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between">
        <button
          onClick={createImageStory}
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

export default ImageStory;
