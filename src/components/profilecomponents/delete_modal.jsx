import React from 'react'

const DeleteModal = ({
  isOpen,
  onClose,
  onDelete,
  type = "item",
  customTitle,
  customMessage,
}) => {
  if (!isOpen) return null;

  // Dynamic title and message based on type
  const getTitle = () => {
    if (customTitle) return customTitle;
    switch (type) {
      case "overview":
        return "Delete Overview?";
      case "education":
        return "Delete Education?";
      case "certificate":
        return "Delete Certificate?";
      case "skill":
        return "Delete Skill?";
      default:
        return "Are you sure you want to delete this?";
    }
  };

  const getMessage = () => {
    if (customMessage) return customMessage;
    switch (type) {
      case "overview":
        return "This action cannot be undone. Your overview will be permanently deleted.";
      case "education":
        return "This education entry will be permanently removed from your profile.";
      case "certificate":
        return "This certificate will be permanently deleted from your profile.";
      case "skill":
        return "This skill will be removed from your profile.";
      default:
        return "This action cannot be undone.";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div
        className="bg-white rounded-[12px] w-full max-w-[420px] mx-4 shadow-[0_2px_16px_0_rgba(0,0,0,0.18)]"
        style={{
          padding: "0",
          fontFamily: "inherit",
        }}
      >
        {/* Title */}
        <div className="pt-7 px-7 pb-2">
          <h2
            className="text-[22px] font-semibold text-center text-[#222] mb-2"
            style={{
              fontFamily: "inherit",
              letterSpacing: 0,
              lineHeight: "28px",
            }}
          >
            {getTitle()}
          </h2>
          {/* Message */}
          <p
            className="text-[16px] text-[#606770] text-center mb-0 leading-[22px]"
            style={{
              fontFamily: "inherit",
              marginBottom: 0,
            }}
          >
            {getMessage()}
          </p>
        </div>
        {/* Divider */}
        <div className="border-t border-[#dadde1] my-0"></div>
        {/* Action Buttons */}
        <div>
          <button
            onClick={onDelete}
            className="w-full py-[18px] text-[18px] text-[#e41e3f] font-normal text-center hover:bg-[#f2f2f2] transition-colors"
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
          <div className="border-t border-[#dadde1] my-0"></div>
          <button
            onClick={onClose}
            className="w-full py-[18px] text-[18px] text-[#050505] font-normal text-center hover:bg-[#f2f2f2] transition-colors"
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal