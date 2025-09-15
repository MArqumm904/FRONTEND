import React from 'react';

const TextStoryView = ({ story, onAddToStory, onAddText }) => {
  return (
    <div 
      className="w-full h-full flex items-center justify-center text-white text-center p-8 relative bg-[#9B9B9B]"
    >
      <div className="space-y-4 max-w-sm">
        {story?.textElements ? (
          story.textElements.map((element, index) => (
            <div
              key={index}
              className="text-2xl font-bold break-words"
              style={{
                color: element.color || story?.textColor || 'white',
                fontSize: element.fontSize || '28px',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              {element.text}
            </div>
          ))
        ) : (
          <div
            className="text-2xl font-bold break-words leading-relaxed"
            style={{
              color: story?.textColor || 'white',
              fontSize: '28px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            {story?.text || 'Text Story'}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextStoryView;