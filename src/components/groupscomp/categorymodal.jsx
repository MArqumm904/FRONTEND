import { useState, useEffect } from "react";

const CategoryModal = ({ isOpen, onClose, onSave, initialText = "" }) => {
  const [text, setText] = useState(initialText);

  useEffect(() => {
    if (isOpen) {
      setText(initialText);
    }
  }, [isOpen, initialText]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-md w-[500px] shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-black hover:text-gray-700 text-lg"
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-4 border-b border-gray-200 font-sf">
          {initialText?.trim() ? "Edit Category" : "Add Category"}
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-[#707070] mb-2 font-sf">
            Group Category
          </label>
          <textarea
            className="w-full border border-gray-300 font-sf rounded-md p-3 text-sm resize-none"
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="I'm a UI/UX designer who loves creating clean, easy-to-use designs for websites and apps. I enjoy solving problems through design and making sure every project is both useful and good-looking."
          />
        </div>

        <button
          onClick={() => {
            onSave(text);
            setText("");
          }}
          className="bg-[#0017e7] font-sf text-white px-7 py-1 rounded-md hover:bg-[#0014c9] transition"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default CategoryModal;
