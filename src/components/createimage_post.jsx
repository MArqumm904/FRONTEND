import { useState, useRef } from "react";
import { X, Plus } from "lucide-react";
import CreateImagePost from "../assets/images/create_post_image.png";
import Person1 from "../assets/images/person-1.png";
import axios from "axios";

export default function CreatePostImage({ onClose, selectedImage }) {
  const [description, setDescription] = useState("");
  const [currentSelectedImage, setCurrentSelectedImage] =
    useState(selectedImage);
  const [isPosting, setIsPosting] = useState(false);

  const fileInputRef = useRef(null);

  const handleAddPhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCurrentSelectedImage({
        file: file,
        url: imageUrl,
        name: file.name,
      });
    }
  };

  const handleRemoveImage = () => {
    if (currentSelectedImage && currentSelectedImage.url) {
      URL.revokeObjectURL(currentSelectedImage.url);
    }
    setCurrentSelectedImage(null);
  };

  const handlePost = async () => {
    if (!currentSelectedImage || !currentSelectedImage.file) {
      alert("Please select an image first!");
      return;
    }

    setIsPosting(true);

    try {
      const token = localStorage.getItem("token");

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("content", description.trim() || "");
      formData.append("type", "image");
      formData.append("visibility", "public");
      formData.append("image", currentSelectedImage.file);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/imageposts`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        console.log("Image post created successfully:", response.data);
        if (window.refreshPosts) {
          window.refreshPosts();
        }

        if (currentSelectedImage && currentSelectedImage.url) {
          URL.revokeObjectURL(currentSelectedImage.url);
        }
        setDescription("");
        setCurrentSelectedImage(null);

        if (onClose) onClose();

      }
    } catch (error) {
      if (error.response) {
        console.error("Error creating post:", error.response.data);
        alert(error.response.data.message || "Failed to create post");
      } else if (error.request) {
        console.error("Network error:", error.request);
        alert("Network error. Please try again.");
      } else {
        console.error("Error:", error.message);
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setIsPosting(false);
    }
  };

  const handleClose = () => {
    if (currentSelectedImage && currentSelectedImage.url) {
      URL.revokeObjectURL(currentSelectedImage.url);
    }
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Modal */}
      <div className="bg-white rounded-md shadow-xl w-full max-w-md max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-sf">Create Post</h2>
          <button
            onClick={handleClose}
            className="text-black hover:text-gray-700 hover:bg-gray-100 rounded-full p-1"
            disabled={isPosting}
          >
            <X size={25} />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 mt-4 -mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <img
                src={Person1}
                className="w-full h-auto object-cover max-h-96"
                alt="User"
              />
            </div>
            <span className="font-medium text-gray-900 font-sf">
              {localStorage.getItem("user_name") || "The Ransom"}
            </span>
          </div>
        </div>

        {/* Description Input */}
        <div className="p-4">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full h-14 p-3 border border-gray-300 rounded-sm"
            disabled={isPosting}
          />
        </div>

        {/* Post Preview */}
        <div className="px-4 pb-4">
          <div className="bg-black rounded-lg overflow-hidden relative">
            {/* Top buttons */}
            <div className="absolute top-3 left-3 justify-between items-start right-3 flex gap-2 z-10">
              <button
                onClick={handleAddPhotoClick}
                className="flex font-sf bg-[#fcfcfc] bg-opacity-90 text-[#000000] px-3 py-1 rounded-sm text-sm hover:bg-opacity-100 transition-all"
                disabled={isPosting}
              >
                <Plus size={20} className="mr-1" /> Add Photo/Video
              </button>
              {currentSelectedImage && (
                <button
                  onClick={handleRemoveImage}
                  className="bg-[#fcfcfc] bg-opacity-90 text-[#000000] w-8 h-8 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all"
                  disabled={isPosting}
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Image Display */}
            <div className="relative">
              <div className="text-center">
                <img
                  src={
                    currentSelectedImage
                      ? currentSelectedImage.url
                      : CreateImagePost
                  }
                  alt={
                    currentSelectedImage
                      ? currentSelectedImage.name
                      : "Default post image"
                  }
                  className="w-full h-auto object-cover max-h-96"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Post Button */}
        <div className="p-4 sticky bottom-0 bg-white border-t">
          <button
            onClick={handlePost}
            disabled={!currentSelectedImage || isPosting}
            className={`w-full py-3 rounded-md font-medium transition-colors ${
              currentSelectedImage && !isPosting
                ? "bg-[#0017e7] text-white hover:bg-[#0014cc]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isPosting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
