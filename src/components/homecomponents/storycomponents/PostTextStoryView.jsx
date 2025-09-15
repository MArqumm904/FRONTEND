import React from 'react';

const PostTextStoryView = ({ story, onAddToStory, onAddText }) => {
    const formatTimeAgo = (timestamp) => {
        if (!timestamp) return "Just now";
        
        const created = new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now - created) / 1000);
        
        if (diffInSeconds < 60) return "Just now";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    return (
        <div className="w-full h-full relative flex items-center justify-center p-4" 
             style={{ backgroundColor: '#9B9B9B' }}>
            
            {/* Text Elements positioned absolutely above the card */}
            {story?.textElements && story.textElements.length > 0 && (
                <div className="absolute top-28 z-10 pointer-events-none">
                    {story.textElements.map((textElement, index) => (
                        <div
                            key={index}
                            className=""
                            style={{
                                fontSize: `${textElement.fontSize || 24}px`,
                                color: textElement.color || '#ffffff',
                                fontWeight: textElement.fontWeight || 'normal',
                                textAlign: 'center',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                maxWidth: '100%',
                                zIndex: textElement.order || 0
                            }}
                        >
                            {textElement.text}
                        </div>
                    ))}
                </div>
            )}

            {/* Main Card - positioned below text elements */}
            <div className="w-full max-w-xs bg-white rounded-2xl overflow-hidden shadow-2xl relative z-0">
                {/* Top section: Page Info */}
                <div className="flex items-center p-4 space-x-3">
                    <img
                        src={
                            story?.avatar 
                                ? `http://127.0.0.1:8000/storage/${story.avatar}`
                                : "https://via.placeholder.com/40"
                        }
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <p className="text-sm font-semibold text-black">
                            {story?.pagename || "Page Name"}
                        </p>
                        <p className="text-xs text-gray-500">
                            {formatTimeAgo(story?.createdAt)}
                        </p>
                    </div>
                </div>

                {/* Middle section: Main Text - using post content */}
                <div className="bg-black w-full h-[250px] flex items-center justify-center px-4">
                    <p className="text-white text-xl font-bold text-center leading-tight">
                        {story?.postdesc || "Post headline text goes here"}
                    </p>
                </div>

                {/* Bottom section: Interaction area or additional info */}
                <div className="p-4">
                    <div className="flex items-center justify-between text-gray-500 text-xs">
                       
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostTextStoryView;