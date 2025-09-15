import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Users,
  TrendingUp,
  MessageCircle,
  Briefcase,
} from "lucide-react";
import logo from "../assets/images/logo.jpg";
import RegisterSecondStep from "./register_second_step";
import axios from "axios";

const benefits = [
  { icon: Users, text: "Connect with professionals" },
  { icon: TrendingUp, text: "Grow your network" },
  { icon: MessageCircle, text: "Share your story" },
  { icon: Briefcase, text: "Discover new opportunities" },
];

const stats = [
  { number: "10K+", label: "Active Users" },
  { number: "50+", label: "Companies" },
  { number: "1000+", label: "Success Stories" },
];

const MainLogin = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    contactOrEmail: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.contactOrEmail.trim())
      newErrors.contactOrEmail = "Email or Phone is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setStep(2);
    }
  };

  const handleSecondStepComplete = async (secondStepData) => {
    setLoading(true);
    setApiError("");
    setSuccess("");
    const payload = {
      name: formData.fullName,
      password: formData.password,
      email: formData.contactOrEmail.includes("@")
        ? formData.contactOrEmail
        : undefined,
      phone: !formData.contactOrEmail.includes("@")
        ? formData.contactOrEmail
        : undefined,
      skills: secondStepData.skills,
      dob: secondStepData.dob,
      location: secondStepData.location,
    };
    try {
      const res = await axios.post(`${API_BASE_URL}/signup`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      const data = res.data;
      setSuccess(data.message);
      setFormData({
        fullName: "",
        contactOrEmail: "",
        password: "",
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      const data = error.response?.data;
      setApiError((data && data.error) || "Registration failed!");
      setStep(1);
      setTimeout(() => setApiError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <RegisterSecondStep
        onComplete={handleSecondStepComplete}
        successMessage={success}
        errorMessage={apiError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-md border border-[#6974b1] overflow-hidden">
        {/* Form Content */}
        <div className="p-6">
          {/* Form Fields */}
          <div className="space-y-4 mt-3">
            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-medium text-[#707070] mb-2">
                Full Name
              </label>
              <div className="relative">
                <div
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                    focusedField === "fullName"
                      ? "text-[#0017e7]"
                      : "text-gray-400"
                  }`}
                >
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("fullName")}
                  onBlur={() => setFocusedField("")}
                  className={`w-full pl-10 pr-3 py-3 border ${
                    errors.fullName ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-[#0017e7] focus:border-[#0017e7] bg-white`}
                  placeholder="Enter your full name"
                  autoComplete="off"
                />
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email/Phone Field */}
            <div>
              <label className="block text-sm font-medium text-[#707070] mb-2">
                Mobile Number or Email Address
              </label>
              <div className="relative">
                <div
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                    focusedField === "contactOrEmail"
                      ? "text-[#0017e7]"
                      : "text-gray-400"
                  }`}
                >
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="contactOrEmail"
                  value={formData.contactOrEmail}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("contactOrEmail")}
                  onBlur={() => setFocusedField("")}
                  className={`w-full pl-10 pr-3 py-3 border ${
                    errors.contactOrEmail ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-[#0017e7] focus:border-[#0017e7] bg-white`}
                  placeholder="Enter email or phone number"
                  autoComplete="off"
                />
              </div>
              {errors.contactOrEmail && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.contactOrEmail}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-[#707070] mb-2">
                Password
              </label>
              <div className="relative">
                <div
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                    focusedField === "password"
                      ? "text-[#0017e7]"
                      : "text-gray-400"
                  }`}
                >
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  className={`w-full pl-10 pr-10 py-3 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-[#0017e7] focus:border-[#0017e7]blue-500 bg-white`}
                  placeholder="Create a strong password"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#0017e7] transition-colors duration-200"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="text-sm text-[#707070] text-center mt-4 mb-4">
            <CheckCircle className="w-4 h-4 text-[#0017e7] mx-auto mb-1" />
            By clicking Agree & Join or Continue, you agree to the Ahmeed{" "}
            <a
              href="#"
              className="text-[#0017e7] hover:underline font-medium transition-colors duration-200"
            >
              User Agreement
            </a>
            ,{" "}
            <a
              href="#"
              className="text-[#0017e7] hover:underline font-medium transition-colors duration-200"
            >
              Privacy Policy
            </a>
            , and{" "}
            <a
              href="#"
              className="text-[#0017e7] hover:underline font-medium transition-colors duration-200"
            >
              Cookie Policy
            </a>
            .
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#0017e7] text-white py-3 px-4 rounded-full font-medium text-sm hover:bg-[#0013c1] focus:outline-none focus:ring-2 focus:ring-[#0017e7] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Next"}
          </button>

          {/* Error/Success Messages */}
          {apiError && (
            <div className="text-red-500 text-center text-sm mt-3">
              {apiError}
            </div>
          )}
          {success && (
            <div className="text-green-600 text-center text-sm mt-3">
              {success} Redirecting to login...
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center px-6">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div>

        {/* Google Sign-in Button */}
        <div className="px-6 pb-4">
          <button className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-full bg-white text-[#161616] font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
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
        </div>

        {/* Login Link */}
        <div className="text-center pb-6 text-sm">
          <span className="text-black font-medium">Already on Ahmeed? </span>
          <button
            onClick={() => navigate("/Login")}
            className="text-[#0017e7] font-medium hover:underline transition-colors duration-200"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainLogin;
