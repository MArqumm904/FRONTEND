import React, { useState, useEffect } from "react";
import {
  User,
  Users,
  TrendingUp,
  MessageCircle,
  Briefcase,
  Camera,
  Eye,
  EyeOff,
  Mail,
  Lock,
} from "lucide-react";

import logo from "../assets/images/logo.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginAccount = () => {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    setLoginLoading(true);
    setLoginError("");
    setLoginSuccess("");
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const isEmail = formData.emailOrPhone.includes("@");
    const payload = {
      password: formData.password,
      ...(isEmail
        ? { email: formData.emailOrPhone }
        : { phone: formData.emailOrPhone }),
    };
    try {
      const res = await axios.post(`${API_BASE_URL}/login`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      const data = res.data;
      console.log(res.status, data);

      if (res.status >= 200 && res.status < 300) {
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        if (data.user) {
          if (data.user.name) {
            localStorage.setItem("user_name", data.user.name);
          }
          if (data.user.email) {
            localStorage.setItem("user_email", data.user.email);
          }
          if (data.user.id) {
            localStorage.setItem("user_id", data.user.id);
          }
        }
        setLoginSuccess(data.message);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setLoginError(data.error || "Login failed!");
      }
    } catch (e) {
      if (e.response && e.response.data && e.response.data.error) {
        setLoginError(e.response.data.error);
      } else {
        setLoginError("Login failed! Server error.");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleSendResetEmail = () => {
    console.log("Reset email sent to:", forgotPasswordEmail);
    setShowOtpScreen(true);
    startCountdown();
  };

  const startCountdown = () => {
    setCountdown(60);
    setIsResendDisabled(true);
  };

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0 && isResendDisabled) {
      setIsResendDisabled(false);
      if (showOtpScreen) {
        window.location.href = "/login";
      }
    }
    return () => clearTimeout(timer);
  }, [countdown, isResendDisabled, showOtpScreen]);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleConfirmOtp = () => {
    const otpCode = otpValues.join("");
    console.log("OTP entered:", otpCode);
    setShowResetPassword(true);
  };

  const handleResendCode = () => {
    if (!isResendDisabled) {
      startCountdown();
      console.log("Resending code...");
    }
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setShowOtpScreen(false);
    setShowResetPassword(false);
    setForgotPasswordEmail("");
    setOtpValues(["", "", "", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
    setCountdown(0);
    setIsResendDisabled(false);
  };

  const handleSavePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log("New password saved:", newPassword);
    handleBackToLogin();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Login Success/Error Modal */}
      {(loginSuccess || loginError) && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          <div
            className={`relative bg-white rounded-xl shadow-xl px-8 py-8 flex flex-col items-center max-w-sm w-full border-l-4 ${
              loginSuccess ? "border-blue-600" : "border-red-500"
            }`}
          >
            {loginSuccess ? (
              <>
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-3xl font-semibold text-gray-800 mb-2">
                  {loginSuccess}
                </h3>
                <p className="text-blue-600 text-center mb-4">
                  Welcome Back to <span className="text-green-600">Ahmeed</span>
                </p>
                <div className="flex items-center text-gray-500 text-sm">
                  <svg
                    className="w-4 h-4 mr-2 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Redirecting to home...
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h3 className="text-3xl font-semibold text-black mb-2">
                  {loginError}
                </h3>
                <p className="text-red-600 text-center mb-4">
                  Try to Enter Correct Email or Phone Number and Password
                </p>
                <button
                  onClick={() => setLoginError("")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main Login Card */}
      <div className="bg-white rounded-lg shadow-sm border border-[#6974b1] w-full max-w-lg p-8">
        {/* Header */}
        <h1 className="text-3xl font-semibold text-gray-900 text-center mb-8">
          Login Account
        </h1>

        {showResetPassword ? (
          <>
            {/* Reset Password Screen */}
            <div className="space-y-6">
              {/* New Password Field */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="334455"
                    className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="334455"
                    className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <button
                type="button"
                onClick={handleSavePassword}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Save
              </button>
            </div>
          </>
        ) : !showForgotPassword ? (
          <>
            {/* Email or Phone Field */}
            <div className="mb-4">
              <label
                htmlFor="emailOrPhone"
                className="block text-sm text-[#707070] mb-2"
              >
                Email or Phone
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  id="emailOrPhone"
                  name="emailOrPhone"
                  placeholder="Enter you Email or Phone Number"
                  value={formData.emailOrPhone}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("emailOrPhone")}
                  onBlur={() => setFocusedField("")}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0017e7] focus:border-transparent text-sm bg-white"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-3">
              <label
                htmlFor="password"
                className="block text-sm text-[#707070] mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0017e7] focus:border-transparent text-sm bg-white"
                  placeholder="******"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-left mb-6">
              <button
                onClick={handleForgotPassword}
                className="text-sm text-[#0017e7] hover:text-[#0315b2] hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="button"
              onClick={handleLogin}
              className="w-full bg-[#0017e7] text-white py-3 px-4 rounded-full font-[400] text-sm hover:bg-[#0315b2] focus:outline-none focus:ring-2 focus:ring-[#0315b2] focus:ring-offset-2 transition-colors duration-200 mb-4"
              disabled={loginLoading}
            >
              {loginLoading ? "Processing..." : "Login"}
            </button>

            {/* OR Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-[#7f7f7f]" />
              <span className="text-[#3a3a3a] text-sm">OR</span>
              <div className="flex-1 h-px bg-[#7f7f7f]" />
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white border border-[#939393] text-black py-3 px-4 rounded-full font-medium text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue With Google
            </button>
            {/* Login Link */}
            <div className="text-center mt-5 text-sm">
              <span className="text-black font-medium">
                Don't have an Account?{" "}
              </span>
              <button
                onClick={() => navigate("/register")}
                className="text-[#0017e7] font-medium hover:underline transition-colors duration-200"
              >
                Register Yourself
              </button>
            </div>
          </>
        ) : !showOtpScreen ? (
          <>
            {/* Forgot Password Screen */}
            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="forgotEmail"
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="forgotEmail"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  placeholder="ransom.ux@gmail.com"
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                />
              </div>

              {/* Send Button */}
              <button
                type="button"
                onClick={handleSendResetEmail}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Send
              </button>

              {/* Back to Login */}
              <div className="text-center">
                <button
                  onClick={handleBackToLogin}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* OTP Screen */}
            <div className="space-y-6">
              {/* OTP Header */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">OTP</h2>

                {/* OTP Input Boxes */}
                <div className="flex gap-3 justify-center mb-4">
                  {otpValues.map((value, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      value={value}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-14 h-14 text-center text-4xl border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength="1"
                    />
                  ))}
                </div>

                {/* Check Email Message */}
                <p className="text-sm text-gray-600 mb-4">
                  Check your email! We've just sent you a code.
                </p>

                {/* Resend Code */}
                <div className="mb-4">
                  <button
                    onClick={handleResendCode}
                    disabled={isResendDisabled}
                    className={`text-sm ${
                      isResendDisabled
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 hover:text-blue-800 hover:underline"
                    }`}
                  >
                    Resend code {isResendDisabled && `${countdown}s`}
                  </button>
                </div>

                {/* Confirm Button */}
                <button
                  type="button"
                  onClick={handleConfirmOtp}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Confirm
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginAccount;
