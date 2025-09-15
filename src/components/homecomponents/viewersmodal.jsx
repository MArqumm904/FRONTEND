import React from 'react';
import { X } from 'lucide-react';

const ViewersModal = ({ isOpen, onClose, viewers }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      <div className="bg-white rounded-2xl w-[90%] max-w-[400px] min-w-[350px] max-h-[500px] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Viewers</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Viewers List */}
        <div 
          className="flex-1 overflow-y-auto px-6 py-4" 
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            maxHeight: '400px'
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="space-y-4">
            {viewers.map((viewer, index) => (
              <div key={index} className="flex items-center gap-3">
                <img
                  src={viewer.avatar}
                  alt={viewer.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-base truncate">{viewer.name}</p>
                  <p className="text-sm text-gray-500 truncate">{viewer.username}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewersModal;