import React, { useState, useRef, useEffect } from "react";
import { Camera, Type, Plus, X } from "lucide-react";
import PostStory from "./homecomponents/poststory";
import StoryViewer from "./homecomponents/storyviewer";
import { fetchStories, fetchUserStories } from "../data/storiesData";

const Stories = ({refreshStories}) => {
  const [showStoryTypeModal, setShowStoryTypeModal] = useState(false);
  const [showStoryCreator, setShowStoryCreator] = useState(false);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [storyType, setStoryType] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [textBoxes, setTextBoxes] = useState([]);
  const [draggedText, setDraggedText] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [stories, setStories] = useState([]);
  const fileInputRef = useRef(null);
  const [userStories, setUserStories] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const loadStories = async () => {
    const data = await fetchStories();
    setStories(data);
  };
  useEffect(() => {
    loadStories();
  }, [refreshStories]);

  const hasUserStory = stories.some((story) => story.isYour);

  const handleYourStoryClick = (e) => {
    e.stopPropagation();
    setShowStoryTypeModal(true);
  };

  const handleStoryClick = async (index) => {
    const story = stories[index];
    let userId;
    let userName;

    if (story.isYour) {
      userId = localStorage.getItem("user_id");
      userName = "You";
    } else {
      userId = story.id;
      userName = story.name;
    }

    try {
      const userStoriesData = await fetchUserStories(userId);
      console.log('Fetched stories for user:', userId, userStoriesData);
      
      if (userStoriesData && userStoriesData.length > 0) {
        setUserStories(userStoriesData);
        setCurrentUser({
          id: userId,
          name: userName,
          avatar: story.avatar
        });
        setCurrentStoryIndex(0);
        setShowStoryViewer(true);
      } else {
        console.log('No stories found for user:', userId);
        alert('No stories available for this user');
      }
    } catch (error) {
      console.error('Error fetching user stories:', error);
      alert('Failed to load stories');
    }
  };

  const handleStoryTypeSelect = (type) => {
    setStoryType(type);
    setShowStoryTypeModal(false);
    if (type === "photo") {
      fileInputRef.current?.click();
    } else {
      setShowStoryCreator(true);
    }
  };

  const handleRemoveText = (id) => {
    setTextBoxes((prevTextBoxes) =>
      prevTextBoxes.filter((box) => box.id !== id)
    );
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setShowStoryCreator(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddText = () => {
    const newTextBox = {
      id: Date.now(),
      text: "",
      x: 50,
      y: 50,
      editing: true,
    };
    setTextBoxes([...textBoxes, newTextBox]);
  };

  const handleTextChange = (id, newText) => {
    setTextBoxes(
      textBoxes.map((box) => (box.id === id ? { ...box, text: newText } : box))
    );
  };

  const handleTextClick = (id) => {
    setTextBoxes(
      textBoxes.map((box) =>
        box.id === id ? { ...box, editing: true } : { ...box, editing: false }
      )
    );
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

  useEffect(() => {
    if (showStoryCreator || showStoryTypeModal || showStoryViewer) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showStoryCreator, showStoryTypeModal, showStoryViewer]);

  const handleMouseUp = () => {
    setDraggedText(null);
  };

  const handleAddToStory = () => {
    alert("Story posted successfully!");
    loadStories();
    setShowStoryCreator(false);
    setSelectedImage(null);
    setTextBoxes([]);
    setStoryType("");
  };

  const closeStoryCreator = () => {
    setShowStoryCreator(false);
    setSelectedImage(null);
    setTextBoxes([]);
    setStoryType("");
  };

  const closeStoryViewer = () => {
    setShowStoryViewer(false);
    setCurrentStoryIndex(0);
    setUserStories([]);
    setCurrentUser(null);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow border border-[#6974b1] p-5 mb-4">
        <div className="flex space-x-7 overflow-x-auto ms-2">
          {/* Add Story Button (shown when user has no stories) */}
          {!hasUserStory && (
            <div className="flex-shrink-0 text-center">
              <div className="relative cursor-pointer">
                <div
                  className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-400 p-0.5 flex items-center justify-center bg-gray-100"
                  onClick={handleYourStoryClick}
                >
                  <Plus className="w-6 h-6 text-gray-600" />
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-1 max-w-[60px] truncate font-sf">
                Your Story
              </p>
            </div>
          )}

          {/* Existing stories */}
          {stories.map((story, index) => (
            <div key={story.id} className="flex-shrink-0 text-center">
              <div className="relative cursor-pointer">
                <div
                  className={`w-14 h-14 rounded-full overflow-hidden border-2 p-0.5 ${
                    story.isYour ? "border-gray-400" : "border-blue-500"
                  }`}
                  onClick={() => handleStoryClick(index)}
                >
                  <img
                    src={"http://127.0.0.1:8000/storage/" + story.avatar}
                    alt={story.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                {story.isYour && (
                  <div
                    className="absolute -bottom-0 -right-0 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer"
                    onClick={handleYourStoryClick}
                  >
                    <span className="text-white text-xs mb-1">+</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-1 max-w-[60px] truncate cursor-pointer font-sf">
                {story.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Story Type Selection Modal */}
      {showStoryTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-100 p-8 rounded-lg max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Create Story</h2>
              <button
                onClick={() => setShowStoryTypeModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex gap-4">
              <div
                className="flex-1 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg p-6 text-center cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => handleStoryTypeSelect("photo")}
              >
                <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-6 h-6 text-gray-800" />
                </div>
                <p className="text-white font-medium">Create a Photo Story</p>
              </div>
              <div
                className="flex-1 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-6 text-center cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => handleStoryTypeSelect("text")}
              >
                <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <Type className="w-6 h-6 text-gray-800" />
                </div>
                <p className="text-white font-medium">Create a Text Story</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Story Viewer */}
      <StoryViewer
        isOpen={showStoryViewer}
        onClose={closeStoryViewer}
        stories={userStories}
        currentStoryIndex={currentStoryIndex}
        currentUser={currentUser}
        onDelete={loadStories}
      />

      {/* Story Creator */}
      <PostStory
        showStoryCreator={showStoryCreator}
        closeStoryCreator={closeStoryCreator}
        storyType={storyType}
        selectedImage={selectedImage}
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
      />

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageSelect}
        accept="image/*"
        className="hidden"
      />
    </>
  );
};

export default Stories;