import React from "react";

const PhotoStoryView = ({ story, onAddToStory, onAddText }) => {
  return (
    <div className="w-full h-full relative bg-[#9B9B9B] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-cover bg-center blur-sm opacity-30"
        style={{
          backgroundImage: `url(${story?.url || "https://images.unsplash.com/photo-1698778573682-346d219322b2?w=1080&auto=format"})`
        }}
      />
      <img
        src={
          story?.url ||
          "https://images.unsplash.com/photo-1682686580391-615b5f41556b?w=1080&auto=format"
        }
        alt="Story"
        className="h-full w-full object-contain rounded-lg"
      />

      {/* Overlay text elements with positioning */}
      {story?.textElements && story.textElements.length > 0 && (
        <>
          {story.textElements.map((element, index) => (
            <div
              key={index}
              className="absolute font-bold drop-shadow-lg"
              style={{
                left: `${element.x}px`,
                top: `${element.y}px`,
                color: element.color || "white",
                fontSize: element.fontSize || "24px",
                textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                zIndex: 15,
              }}
            >
              {element.text}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default PhotoStoryView;