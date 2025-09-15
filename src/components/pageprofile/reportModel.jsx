import React, { useState } from "react";
import { X } from "lucide-react";

const options = [
  "Spam or misleading",
  "Hate speech or abusive content",
  "Nudity or sexual content",
  "Violence or harmful behavior",
  "False information",
];

export default function ReportModal({
  onClose,
  onReportSubmit,
  selectedOption,
  setSelectedOption,
}) {

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl w-full max-w-xl h-auto shadow-lg relative">
        {/* Header */}
        <div className="py-4 px-8 border border-gray-400 rounded-b-lg flex justify-between items-center">
          <h2 className="font-semibold text-black text-lg">Report</h2>
          <button onClick={onClose}>
            <X className="w-7 h-7 text-gray-600 hover:text-black" />
          </button>
        </div>

        {/* Options */}
        <div className="py-2 space-y-3">
          {options.map((option, index) => (
            <div
              key={index}
              className={`px-8 py-4 flex items-center justify-between space-x-3 cursor-pointer ${
                index !== options.length - 1 ? "border-b  border-gray-300" : " "
              }`}
              onClick={() => setSelectedOption(option)}
            >
              <span className="text-base font-medium text-black">{option}</span>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedOption === option ? "border-blue-600" : "border-gray-300"
                }`}
              >
                {selectedOption === option && (
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="px-8 py-4 border-t  border-gray-300 mt-5">
          <button
            className={`w-full py-3 rounded-md text-base font-medium ${
              selectedOption !== null
                ? "bg-[#0017E7] text-white hover:bg-blue-700"
                : "bg-[#0017E7]/25 text-white cursor-not-allowed"
            }`}
            disabled={selectedOption === null}
            onClick={() => {
              onReportSubmit();
              onClose();
            }}
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
}
