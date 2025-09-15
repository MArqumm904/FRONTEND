import React, { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import Person from "../../assets/images/person-1.png";
import axios from "axios";

export default function EditPostModal({ onClose, editData }) {
  const [isOpen, setIsOpen] = useState(true);
  const [error, setError] = useState("");
  const [postText, setPostText] = useState(editData?.content || "");
  const [isPosting, setIsPosting] = useState(false);
  const [question, setQuestion] = useState(editData?.poll?.question || "");
  const [options, setOptions] = useState([]);

  // console.log("editData", editData);

  useEffect(() => {
    // Initialize poll data if editing a poll post
    if (editData?.type === "poll" && editData?.poll) {
      setQuestion(editData.poll.question || "");

      // Extract just the text from options array of objects
      const optionTexts = editData.poll.options.map(
        (option) => option.text || ""
      );
      setOptions(optionTexts.length > 0 ? optionTexts : ["", "", ""]);
    }
  }, [editData]);

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const handlePost = async () => {
    if (!postText.trim()) return;

    if (!editData.page.id || isNaN(editData.page.id) || editData.page.id <= 0) {
      setError("Cannot post: Invalid page ID");
      return;
    }

    setIsPosting(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      let requestData = {
        content: postText.trim(),
        type: editData.type,
        visibility: "public",
        post_id: editData.id,
        page_id: editData.page.id,
      };

      if (editData.type === "poll") {
        const filteredOptions = options.filter((o) => o.trim());
        if (filteredOptions.length < 2) {
          setError("Poll must have at least 2 options");
          setIsPosting(false);
          return;
        }

        requestData = {
          ...requestData,
          poll_question: question.trim(),
          poll_options: filteredOptions,
        };
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/pages/UpdatePost`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      // console.log(response.data.success);
      if (response.data.success) {
        console.log("Post created successfully:", response.data);
        if (window.refreshPosts) {
          window.refreshPosts();
        }
        setPostText("");
        setIsOpen(false);
        onClose();
      }
    } catch (error) {
      if (error.response) {
        console.error("Error creating post:", error.response.data);
      } else if (error.request) {
        console.error("Network error:", error.request);
      } else {
        console.error("Error:", error.message);
      }
    } finally {
      setIsPosting(false);
    }
  };

  const canPost =
    editData.type === "poll"
      ? question.trim() &&
        options.filter((o) => o.trim()).length >= 2 &&
        postText.trim()
      : postText.trim();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl font-sf font-medium text-gray-900">
            Edit Post
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={25} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* User Profile */}
          <div className="flex items-center mb-5 mt-3">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
              <img
                src={editData.profile_photo}
                className="w-full h-full object-cover"
                alt="User avatar"
              />
            </div>
            <span className="ml-3 font-medium font-sf text-gray-900">
              {editData.user.name || ""}
            </span>
          </div>

          {/* Text Input - sirf text posts ke liye */}
          {(!editData?.type || editData?.type === "text") && (
            <div className="mb-6">
              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="What's on your mind ?"
                className="w-full h-24 p-3 border border-gray-300 rounded-md resize-none text-md placeholder-[#9b9b9b]"
              />
            </div>
          )}

          {/* Image Display - image posts ke liye */}
          {editData?.type === "image" && (
            <div className="mb-6">
              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="What's on your mind ?"
                className="w-full h-24 p-3 border border-gray-300 rounded-md resize-none text-md placeholder-[#9b9b9b] mb-4"
              />
              <div className="w-full h-64 bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={editData.image}
                  alt="Post image"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Video Display - video posts ke liye */}
          {editData?.type === "video" && (
            <div className="mb-6">
              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="What's on your mind ?"
                className="w-full h-24 p-3 border border-gray-300 rounded-md resize-none text-md placeholder-[#9b9b9b] mb-4"
              />
              <div className="w-full h-64 bg-black rounded-md overflow-hidden">
                <video
                  src={editData.video}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {editData?.type === "poll" && (
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-sm font-sf font-medium text-gray-700 mb-2">
                  Poll Question
                </label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full p-3 border border-gray-300 bg-[#fcfcfc] rounded-md"
                  placeholder="Enter your poll question"
                  disabled={isPosting}
                />
              </div>

              <div className="space-y-3 overflow-y-auto">
                <h3 className="font-sf text-sm font-medium text-gray-700">
                  Poll Options
                </h3>
                {options.map((option, index) => (
                  <div key={index} className="rounded-lg">
                    <label className="font-sf block text-sm font-medium text-gray-600 mb-2">
                      Option {index + 1}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-sm bg-[#fcfcfc]"
                        placeholder={`Enter option ${index + 1}`}
                        disabled={isPosting}
                      />
                      {options.length > 2 && (
                        <button
                          onClick={() => removeOption(index)}
                          className="border rounded-full text-black hover:text-gray-800 transition-colors p-1 hover:bg-gray-100"
                          disabled={isPosting}
                          type="button"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Option Button */}
              {options.length < 6 && (
                <button
                  onClick={addOption}
                  className="w-full p-2 border-2 border-gray-300 rounded-sm text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center justify-center space-x-2"
                  disabled={isPosting}
                  type="button"
                >
                  <Plus size={18} className="text-black" />
                  <span className="font-medium text-black font-sf">
                    Add option
                  </span>
                </button>
              )}

              {/* Option Count Info */}
              <div className="text-xs text-gray-500 text-center">
                {options.length}/6 options • At least 2 options required
              </div>
            </div>
          )}

          {/* Post Button */}
          <button
            onClick={handlePost}
            disabled={!canPost || isPosting}
            className={`w-full py-2.5 bg-[#0017e7] text-white rounded-md font-medium text-sm hover:bg-[#0013c6] transition-colors ${
              canPost && !isPosting
                ? "bg-[#0017e7] text-white hover:bg-[#0013c6]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
