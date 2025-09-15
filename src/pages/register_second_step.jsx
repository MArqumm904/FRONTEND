import React, { useState } from "react";
import { Camera, User } from "lucide-react";

const RegisterSecondStep = ({ onComplete, successMessage, errorMessage }) => {
  const [formData, setFormData] = useState({
    skill: "",
    day: "18",
    month: "July",
    year: "2010",
    location: "",
  });

  const [focusedField, setFocusedField] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const monthIndex = months.indexOf(formData.month) + 1;
    const dob = `${formData.year}-${monthIndex
      .toString()
      .padStart(2, "0")}-${formData.day.toString().padStart(2, "0")}`;
    const dataToSend = {
      skills: formData.skill ? [formData.skill] : [],
      dob,
      location: formData.location,
    };
    if (onComplete) onComplete(dataToSend);
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-0 px-4 sm:px-6 lg:px-8">
      {/* Success Popup Modal */}
      {/* Modal */}
      {(successMessage || errorMessage) && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

          <div
            className={`relative bg-white rounded-xl shadow-xl px-8 py-8 flex flex-col items-center max-w-sm w-full border-l-4 ${
              successMessage ? "border-[#0017e7]" : "border-red-500"
            }`}
          >
            {successMessage ? (
              <>
                <div className="w-16 h-16 bg-[#0017e7] rounded-full flex items-center justify-center mb-4">
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
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Success!
                </h3>
                <p className="text-[#0017e7] text-center mb-4">
                  {successMessage}
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
                  Redirecting to login...
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
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Error
                </h3>
                <p className="text-red-600 text-center mb-4">{errorMessage}</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Try Again
                </button>
              </>
            )}
          </div>
        </div>
      )}
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h2>
          <p className="text-gray-600 text-md">
            Just a few more details to get started
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="space-y-6">
            {/* Skill Field */}
            <div className="space-y-2">
              <label
                htmlFor="skill"
                className="block text-sm font-semibold text-gray-700"
              >
                Skill{" "}
                <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="skill"
                  name="skill"
                  value={formData.skill}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("skill")}
                  onBlur={() => setFocusedField("")}
                  className={`w-full pl-10 pr-3 py-2 border ${
                    focusedField === "skill"
                      ? "border-[#0017e7]"
                      : "border-[#d6dbe1]"
                  } rounded-[6px] focus:outline-none focus:ring-2 focus:ring-[#0017e7] focus:border-transparent text-[14px] bg-white hover:border-[#0017e7]/30 transition-all duration-200 placeholder-gray-400`}
                  placeholder="e.g., Web Developer, Designer..."
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#bbb]">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Date of Birth
              </label>
              <div className="grid grid-cols-3 gap-3">
                {/* Day */}
                <div className="relative">
                  <select
                    name="day"
                    value={formData.day}
                    onChange={handleInputChange}
                    className="w-full pl-3 pr-8 py-2 border border-[#d6dbe1] rounded-[6px] focus:outline-none focus:ring-2 focus:ring-[#0017e7] focus:border-transparent text-[14px] bg-white hover:border-[#0017e7]/30 transition-all duration-200 appearance-none"
                  >
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Month */}
                <div className="relative">
                  <select
                    name="month"
                    value={formData.month}
                    onChange={handleInputChange}
                    className="w-full pl-3 pr-8 py-2 border border-[#d6dbe1] rounded-[6px] focus:outline-none focus:ring-2 focus:ring-[#0017e7] focus:border-transparent text-[14px] bg-white hover:border-[#0017e7]/30 transition-all duration-200 appearance-none"
                  >
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Year */}
                <div className="relative">
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full pl-3 pr-8 py-2 border border-[#d6dbe1] rounded-[6px] focus:outline-none focus:ring-2 focus:ring-[#0017e7] focus:border-transparent text-[14px] bg-white hover:border-[#0017e7]/30 transition-all duration-200 appearance-none"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Field */}
            <div className="space-y-2">
              <label
                htmlFor="location"
                className="block text-sm font-semibold text-gray-700"
              >
                Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("location")}
                  onBlur={() => setFocusedField("")}
                  className={`w-full pl-10 pr-3 py-2 border ${
                    focusedField === "location"
                      ? "border-[#0017e7]"
                      : "border-[#d6dbe1]"
                  } rounded-[6px] focus:outline-none focus:ring-2 focus:ring-[#0017e7] focus:border-transparent text-[14px] bg-white hover:border-[#0017e7]/30 transition-all duration-200 placeholder-gray-400`}
                  placeholder="e.g., Karachi, Pakistan"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#bbb]">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Create Account Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-[#0017e7] text-white py-2 px-4 rounded-full font-medium text-[15px] hover:bg-[#0013bf] focus:outline-none focus:ring-2 focus:ring-[#0017e7] focus:ring-offset-2 transition-all duration-200 shadow hover:shadow-lg transform  active:scale-[0.98]"
            >
              Create Account
            </button>

            {/* Already on Ahmeed Link */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-semibold text-[#0017e7] hover:text-[#0014c2] transition-all duration-200"
                >
                  Sign in here
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-2 h-2 bg-[#0017e7] rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterSecondStep;
