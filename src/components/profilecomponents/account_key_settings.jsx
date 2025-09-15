import React, { useState, useRef, useEffect } from "react";
import { EyeOff, Eye } from "lucide-react";

const AccountKeySettings = ({ onClose }) => {
  const [view, setView] = useState("main"); // 'main', 'email', 'contact', 'password', 'forgot', 'otp', 'reset'
  const [email, setEmail] = useState("ransom.ux@gmail.com");
  const [contact, setContact] = useState("+9281601746");
  const [tempValue, setTempValue] = useState("");

  // Password modal state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Forgot password flow
  const [forgotEmail, setForgotEmail] = useState(email);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const [resetNew, setResetNew] = useState("");
  const [resetConfirm, setResetConfirm] = useState("");
  const [showResetNew, setShowResetNew] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);

  // Timer effect for OTP
  useEffect(() => {
    if (view !== "otp") return;
    if (otpTimer === 0) return;
    const interval = setInterval(() => {
      setOtpTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [view, otpTimer]);

  // Open edit view and set temp value
  const handleEdit = (type) => {
    setView(type);
    setTempValue(type === "email" ? email : contact);
  };

  // Confirm edit
  const handleConfirm = () => {
    if (view === "email") setEmail(tempValue);
    if (view === "contact") setContact(tempValue);
    setView("main");
  };

  // Save password (dummy)
  const handleSavePassword = (e) => {
    e.preventDefault();
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setView("main");
  };

  // Eye icon
  const EyeIcon = ({ open }) =>
    open ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />;

  // OTP input handler
  const handleOtpChange = (idx, val) => {
    if (!/^[0-9]?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 5) {
      otpRefs[idx + 1].current.focus();
    }
    if (!val && idx > 0) {
      otpRefs[idx - 1].current.focus();
    }
  };

  // Resend code handler
  const handleResendCode = () => {
    if (otpTimer === 0) {
      setOtp(["", "", "", "", "", ""]);
      setOtpTimer(60);
      // Here you can also trigger resend code API
    }
  };

  // Modal content based on view
  let content = null;
  if (view === "main") {
    content = (
      <div className="pt-4 pb-8 px-8">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-6">
          <h2 className="text-2xl font-bold text-black font-sf">
            Account Key Settings
          </h2>
          <button
            className="text-4xl text-black hover:text-gray-800  ml-4"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="space-y-6">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setView("password")}
          >
            <span className="font-medium text-lg font-sf text-black">
              Password
            </span>
            <span className="text-gray-400 text-lg font-sf">********</span>
          </div>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => handleEdit("email")}
          >
            <span className="font-medium text-lg font-sf text-black">
              Email
            </span>
            <span className="text-gray-500 text-lg font-sf">{email}</span>
          </div>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => handleEdit("contact")}
          >
            <span className="font-medium text-lg font-sf text-black">
              Contact
            </span>
            <span className="text-gray-500 text-lg font-sf">{contact}</span>
          </div>
        </div>
      </div>
    );
  } else if (view === "password") {
    content = (
      <form className="pt-4 pb-8 px-8" onSubmit={handleSavePassword}>
        <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-6">
          <h2 className="text-2xl font-bold text-black font-sf">
            Change Password
          </h2>
          <button
            className="text-4xl text-black hover:text-gray-800 ml-4"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            &times;
          </button>
        </div>
        <div className="mb-5">
          <label className="block text-md mb-2 font-sf">Current Password</label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              className="w-full border font-sf border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0017e7]"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowCurrent((v) => !v)}
              tabIndex={-1}
            >
              <EyeIcon open={showCurrent} />
            </button>
          </div>
        </div>
        <div className="mb-5">
          <label className="block text-md mb-2 font-sf">New Password</label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              className="w-full border font-sf border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0017e7]"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowNew((v) => !v)}
              tabIndex={-1}
            >
              <EyeIcon open={showNew} />
            </button>
          </div>
        </div>
        <div className="mb-3">
          <label className="block text-md mb-2 font-sf">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              className="w-full border font-sf border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0017e7]"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowConfirm((v) => !v)}
              tabIndex={-1}
            >
              <EyeIcon open={showConfirm} />
            </button>
          </div>
        </div>
        <div className="mb-6">
          <button
            type="button"
            className="text-[#0017e7] text-sm underline font-sf"
            onClick={() => setView("forgot")}
          >
            Forgot Password?
          </button>
        </div>
        <button
          type="submit"
          className="bg-[#0017e7] text-white font-sf px-6 py-2 rounded hover:bg-[#0015d3] transition font-semibold"
        >
          Save
        </button>
      </form>
    );
  } else if (view === "forgot") {
    content = (
      <form
        className="pt-4 pb-8 px-8"
        onSubmit={(e) => {
          e.preventDefault();
          setView("otp");
        }}
      >
        <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-6">
          <h2 className="text-2xl font-bold text-black font-sf">
            Forgot Password
          </h2>
          <button
            className="text-4xl text-black hover:text-gray-800 ml-4"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            &times;
          </button>
        </div>
        <label className="block text-md mb-2 font-sf">Email</label>
        <input
          type="email"
          className="w-full border font-sf border-gray-300 rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-[#0017e7]"
          value={forgotEmail}
          onChange={(e) => setForgotEmail(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-[#0017e7] font-sf text-white py-2 rounded hover:bg-[#0015d3] transition"
        >
          Send
        </button>
      </form>
    );
  } else if (view === "otp") {
    content = (
      <form
        className="pt-4 pb-8 px-5"
        onSubmit={(e) => {
          e.preventDefault();
          setView("reset");
        }}
      >
        <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-6">
          <h2 className="text-2xl font-bold text-black font-sf">
            Verification
          </h2>
          <button
            className="text-4xl text-black hover:text-gray-800 ml-4"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            &times;
          </button>
        </div>
        <label className="block text-md mb-2 font-sf">OTP</label>
        <div className="flex space-x-2 mb-4">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={otpRefs[idx]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="w-16 h-16 text-center border border-gray-300 rounded text-4xl font-sf focus:outline-none focus:ring-2 focus:ring-[#0017e7]"
              value={digit}
              onChange={(e) => handleOtpChange(idx, e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>
        <div className="mb-2 text-gray-500 text-sm font-sf">
          Check your email. We just sent you a code. Please enter it.
        </div>
        <div className="mb-6 flex items-center gap-2">
          <button
            type="button"
            className={`font-sf text-sm ${
              otpTimer === 0
                ? "text-blue-700 cursor-pointer"
                : "text-blue-700/60 cursor-not-allowed"
            }`}
            onClick={handleResendCode}
            disabled={otpTimer !== 0}
          >
            Resend code
          </button>
          <span className="text-gray-500 text-sm font-sf">
            {otpTimer > 0 ? `${otpTimer}s` : ""}
          </span>
        </div>
        <button
          type="submit"
          className="w-full bg-[#0017e7] font-sf text-white py-2 rounded hover:bg-[#0015d3] transition"
        >
          Confirm
        </button>
      </form>
    );
  } else if (view === "reset") {
    content = (
      <form
        className="pt-4 pb-8 px-8"
        onSubmit={(e) => {
          e.preventDefault();
          setView("main");
        }}
      >
        <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-6">
          <h2 className="text-2xl font-bold text-black font-sf">
            Reset Password
          </h2>
          <button
            className="text-4xl text-black hover:text-gray-800 ml-4"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            &times;
          </button>
        </div>
        <div className="mb-5">
          <label className="block text-md mb-2 font-sf">New Password</label>
          <div className="relative">
            <input
              type={showResetNew ? "text" : "password"}
              className="w-full border font-sf border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0017e7]"
              value={resetNew}
              onChange={(e) => setResetNew(e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowResetNew((v) => !v)}
              tabIndex={-1}
            >
              <EyeIcon open={showResetNew} />
            </button>
          </div>
        </div>
        <div className="mb-5">
          <label className="block text-md mb-2 font-sf">Confirm Password</label>
          <div className="relative">
            <input
              type={showResetConfirm ? "text" : "password"}
              className="w-full border font-sf border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0017e7]"
              value={resetConfirm}
              onChange={(e) => setResetConfirm(e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowResetConfirm((v) => !v)}
              tabIndex={-1}
            >
              <EyeIcon open={showResetConfirm} />
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-[#0017e7] font-sf text-white py-2 rounded hover:bg-[#0015d3] transition"
        >
          Save
        </button>
      </form>
    );
  } else if (view === "email") {
    content = (
      <div className="pt-3 pb-8 px-8">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-2xl font-bold text-black">Email</h2>
          <button
            className="text-4xl text-black hover:text-gray-800  ml-4"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <label className="block text-md mb-2 font-sf">Email</label>
        <input
          type="email"
          className="w-full border font-sf border-gray-300 rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-[#0017e7]"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
        />
        <button
          className="w-full bg-[#0017e7] font-sf text-white py-2 rounded hover:bg-[#0015d3] transition"
          onClick={handleConfirm}
        >
          Confirm
        </button>
      </div>
    );
  } else if (view === "contact") {
    content = (
      <div className="pt-4 pb-8 px-8">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-2xl font-bold text-black font-sf">Contact</h2>
          <button
            className="text-4xl text-black hover:text-gray-800  ml-4"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <label className="block text-md mb-2 font-sf">Contact</label>
        <input
          type="text"
          className="w-full border font-sf border-gray-300 rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-[#0017e7]"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
        />
        <button
          className="w-full bg-[#0017e7] text-white py-2 rounded font-semibold hover:bg-[#0217d8] transition"
          onClick={handleConfirm}
        >
          Confirm
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-fadeIn">
        {content}
      </div>
    </div>
  );
};

export default AccountKeySettings;
