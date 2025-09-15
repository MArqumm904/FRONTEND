import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

const DeactivateAccount = ({ onClose }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDeactivate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md min-w-[350px] flex flex-col items-center py-12 px-8">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-[#0017e7] border-r-[#0017e7] rounded-full animate-spin mb-6"></div>
          <div className="text-lg font-sf font-semibold text-gray-900 mb-2">Deactivating your account...</div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md min-w-[350px] flex flex-col items-center py-12 px-8">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-100 mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
          <div className="text-lg font-sf font-semibold text-gray-900 mb-2">Account Deactivated</div>
          <div className="text-gray-600 text-center font-sf mb-2">Your account has been successfully deactivated.</div>
          <button
            className="mt-4 px-6 py-2 bg-[#0017e7] hover:bg-[#0217d8] text-white rounded-lg font-sf font-medium text-sm focus:outline-none"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md min-w-[350px] animate-fadeIn relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 pt-6 pb-4">
          <h2 className="text-lg font-semibold text-black font-sf">Deactivate Account</h2>
          <button
            className="text-2xl text-black hover:text-gray-800 ml-4"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* Content */}
        <div className="px-6 pt-6 pb-2">
          <label className="block text-sm font-sf text-gray-700 mb-2 font-medium">Password</label>
          <div className="relative mb-3">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md font-sf focus:outline-none focus:ring-2 focus:ring-[#0017e7] focus:border-transparent pr-12"
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
              onClick={() => setShowPassword(v => !v)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <div className=" mb-6">
            <span className="text-gray-700 text-sm font-sf">I understand that I can reactivate my account by logging in again.</span>
          </div>
          <div className="flex justify-end gap-3 pb-2">
            <button
              className="px-6 py-2 border border-gray-300 rounded-lg font-sf font-medium text-gray-800 bg-white hover:bg-gray-50 focus:outline-none"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-6 py-2 bg-[#0017e7] hover:bg-[#0217d8] text-white rounded-lg font-sf font-medium text-sm focus:outline-none"
              onClick={handleDeactivate}
              disabled={!password}
            >
              Deactivate Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeactivateAccount;