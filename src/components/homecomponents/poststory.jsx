import { X } from "lucide-react";
import cross from "../../assets/images/cross_icon.png";
import ImageStory from "./storycomponents/ImageStory";
import TextStory from "./storycomponents/TextStory";
import PostImageStory from "./storycomponents/PostImageStory";
import PostTextStory from "./storycomponents/PostTextStory";
import PostVideoStory from "./storycomponents/PostVideoStory";

const PostStory = ({
  showStoryCreator,
  closeStoryCreator,
  storyType,
  selectedImage,
  selectedVideo,
  postContent,
  textBoxes,
  handleMouseMove,
  handleMouseUp,
  handleMouseDown,
  handleTextClick,
  handleTextChange,
  handleAddText,
  handleAddToStory,
  setTextBoxes,
  handleRemoveText,
  post,
}) => {
  if (!showStoryCreator) return null;

  const renderStoryComponent = () => {
    switch (storyType) {
      case "photo":
        return (
          <ImageStory
            selectedImage={selectedImage}
            textBoxes={textBoxes}
            handleMouseMove={handleMouseMove}
            handleMouseUp={handleMouseUp}
            handleMouseDown={handleMouseDown}
            handleTextClick={handleTextClick}
            handleTextChange={handleTextChange}
            handleAddText={handleAddText}
            handleAddToStory={handleAddToStory}
            handleRemoveText={handleRemoveText}
            setTextBoxes={setTextBoxes}
          />
        );

      case "postphotostory":
        return (
          <PostImageStory
            selectedImage={selectedImage}
            textBoxes={textBoxes}
            handleMouseMove={handleMouseMove}
            handleMouseUp={handleMouseUp}
            handleMouseDown={handleMouseDown}
            handleTextClick={handleTextClick}
            handleTextChange={handleTextChange}
            handleAddText={handleAddText}
            handleAddToStory={handleAddToStory}
            handleRemoveText={handleRemoveText}
            postData={post}
            setTextBoxes={setTextBoxes}
          />
        );

      case "posttextstory":
        return (
          <PostTextStory
            postContent={postContent}
            textBoxes={textBoxes}
            handleMouseMove={handleMouseMove}
            handleMouseUp={handleMouseUp}
            handleMouseDown={handleMouseDown}
            handleTextClick={handleTextClick}
            handleTextChange={handleTextChange}
            handleAddText={handleAddText}
            handleAddToStory={handleAddToStory}
            handleRemoveText={handleRemoveText}
            setTextBoxes={setTextBoxes}
            postData={post}
          />
        );

      case "postvideostory":
        return (
          <PostVideoStory
            selectedVideo={selectedVideo}
            textBoxes={textBoxes}
            handleMouseMove={handleMouseMove}
            handleMouseUp={handleMouseUp}
            handleMouseDown={handleMouseDown}
            handleTextClick={handleTextClick}
            handleTextChange={handleTextChange}
            handleAddText={handleAddText}
            handleAddToStory={handleAddToStory}
            handleRemoveText={handleRemoveText}
            setTextBoxes={setTextBoxes}
            postData={post}
          />
        );

      default:
        return (
          <TextStory
            textBoxes={textBoxes}
            handleMouseMove={handleMouseMove}
            handleMouseUp={handleMouseUp}
            handleMouseDown={handleMouseDown}
            handleTextClick={handleTextClick}
            handleTextChange={handleTextChange}
            handleAddText={handleAddText}
            handleAddToStory={handleAddToStory}
            handleRemoveText={handleRemoveText}
            setTextBoxes={setTextBoxes}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-[#333333] flex items-center justify-center z-50 overflow-hidden">
      {/* Close button positioned at top right of screen */}
      <button
        onClick={closeStoryCreator}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-opacity-50 rounded-full p-2 flex items-center justify-center transition-colors"
      >
        <img src={cross} alt="Close" className="w-6 h-6" />
      </button>

      <div className="relative">
        <div
          className="rounded-2xl overflow-hidden shadow-2xl"
          style={{ width: "400px", height: "700px" }}
        >
          {renderStoryComponent()}
        </div>
      </div>
    </div>
  );
};

export default PostStory;
