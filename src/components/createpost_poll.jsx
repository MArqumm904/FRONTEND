import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import axios from "axios";

const CreatePoll = ({ onClose }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    try {
      const filteredOptions = options.filter((o) => o.trim());

      const pollData = {
        content: question,
        type: "poll",
        visibility: "public",
        question: question,
        options: filteredOptions,
      };

      const authToken = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/pollposts`,
        pollData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        console.log("Poll created successfully:", response.data.data);
        if (window.refreshPosts) {
          window.refreshPosts();
        }

        setQuestion("");
        setOptions(["", "", ""]);

        onClose();
      } else {
        console.error(
          "Failed to create poll:",
          response.data.message || response.data.errors
        );
        alert(
          response.data.message || "Failed to create poll. Please try again."
        );
      }
    } catch (error) {
      console.error("Error creating poll:", error);

      if (error.response) {
        // API responded with error status
        const errorData = error.response.data;
        if (errorData.errors) {
          Object.keys(errorData.errors).forEach((key) => {
            console.error(`${key}: ${errorData.errors[key].join(", ")}`);
          });
        }
        alert(errorData.message || "Failed to create poll. Please try again.");
      } else if (error.request) {
        // Network error
        alert("Network error. Please check your connection and try again.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const canPost =
    question.trim() && options.filter((o) => o.trim()).length >= 2;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-md shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <h2 className="text-lg text-gray-900 ms-2 font-sf">Create Poll</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors p-1"
          >
            <X size={25} className="text-black hover:text-gray-600" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-4">
            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                <img src="./src/assets/images/person-1.png" alt="" />
              </div>
              <span className="text-gray-900 font-medium font-sf">
                {localStorage.getItem("user_name") || "The Ransom"}
              </span>
            </div>

            {/* Question Input */}
            <div>
              <label className="block text-sm font-sf font-medium text-gray-700 mb-2">
                Your Question
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full p-3 border border-gray-300 bg-[#fcfcfc] rounded-md resize-none"
                rows={3}
                placeholder="What would you like to ask?"
                disabled={isLoading}
              />
            </div>

            {/* Options */}
            <div className="space-y-5">
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
                      disabled={isLoading}
                    />
                    {options.length > 2 && (
                      <button
                        onClick={() => removeOption(index)}
                        className="border  rounded-full text-black hover:text-gray-800 transition-colors p-1 hover:bg-gray-100"
                        disabled={isLoading}
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
                disabled={isLoading}
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
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex-shrink-0 bg-gray-50">
          <button
            onClick={handlePost}
            disabled={!canPost || isLoading}
            className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
              canPost && !isLoading
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm font-sf"
                : "bg-gray-300 text-gray-500 cursor-not-allowed font-sf"
            }`}
          >
            {isLoading
              ? "Creating Poll..."
              : canPost
              ? "Create Poll"
              : "Fill required fields"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;
