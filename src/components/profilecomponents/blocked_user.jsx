import React, { useState } from 'react';
import { X } from 'lucide-react';

import avatarImg from '../../assets/images/avatorr.png';

const initialBlockedUsers = [
  { id: 1, name: 'Code With Larry', avatar: avatarImg },
  { id: 2, name: 'Code With Larry', avatar: avatarImg },
  { id: 3, name: 'Code With Larry', avatar: avatarImg },
  { id: 4, name: 'Code With Larry', avatar: avatarImg },
  { id: 5, name: 'Code With Larry', avatar: avatarImg },
];

const BlockedUser = ({ onClose }) => {
  const [users, setUsers] = useState(initialBlockedUsers);
  const [animatingIds, setAnimatingIds] = useState([]);

  const handleUnblock = (id) => {
    setAnimatingIds((prev) => [...prev, id]);
    setTimeout(() => {
      setUsers((prev) => prev.filter((user) => user.id !== id));
      setAnimatingIds((prev) => prev.filter((animId) => animId !== id));
    }, 400); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md min-w-[350px] animate-fadeIn relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 pt-6 pb-4">
          <h2 className="text-lg font-semibold text-black font-sf">Blocked Accounts</h2>
          <button
            className="text-2xl text-black hover:text-gray-800 ml-4"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* Blocked Users List */}
        <div className="px-6 py-4 max-h-[350px] overflow-y-auto hide-scrollbar">
          {users.map((user) => (
            <div
              key={user.id}
              className={`flex items-center justify-between py-3 border-b last:border-b-0 border-gray-100 transition-all duration-400 ease-in-out
                ${animatingIds.includes(user.id) ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}
              style={{
                transitionProperty: 'opacity, transform',
              }}
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <span className="font-sf text-base text-black font-medium">{user.name}</span>
              </div>
              <button
                className="bg-[#0017e7] hover:bg-[#0217d8] text-white font-sf font-medium rounded-lg px-5 py-2 transition-colors text-sm focus:outline-none"
                onClick={() => handleUnblock(user.id)}
                disabled={animatingIds.includes(user.id)}
              >
                Unblock
              </button>
            </div>
          ))}
          {users.length === 0 && (
            <div className="text-center text-gray-500 py-8 font-sf">No blocked accounts.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockedUser;