import React from 'react';

const PostPhotoStoryView = ({ story, onAddToStory, onAddText }) => {
  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center p-8"
      style={{ backgroundColor: '#9B9B9B' }}
    >
      {/* Background blur effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center blur-sm opacity-30"
        style={{ backgroundColor: '#9B9B9B' }}
      />
      
      {/* Text elements container - centered with main content */}
      {story?.textElements && story.textElements.length > 0 && (
        <div className="relative z-10 w-full max-w-sm mb-4 flex flex-col items-center justify-center">
          {story.textElements.map((textElement, index) => (
            <div
              key={index}
              className="text-center"
              style={{
                fontSize: `${textElement.fontSize || 24}px`,
                color: textElement.color || '#ffffff',
                fontWeight: textElement.fontWeight || 'normal',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxWidth: '100%',
                marginBottom: '8px'
              }}
            >
              {textElement.text}
            </div>
          ))}
        </div>
      )}

      {/* Main content area */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center justify-center">
        {/* Post image container */}
        <div className="overflow-hidden w-full">
          <img
            src={story?.url || "https://images.unsplash.com/photo-1698778573682-346d219322b2?w=1080&auto=format"}
            alt="Post"
            className="w-full h-auto object-contain rounded-xl"
          />
          
          {/* Post caption/content area */}
          {story?.pagename && (
            <div className="p-4">
              <p className="text-white text-sm font-medium leading-relaxed">
                {story.pagename}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPhotoStoryView;