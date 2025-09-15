import { Pencil } from "lucide-react";
import React from "react";

const Overview = ({owner_id}) => {
  const userId = localStorage.getItem('user_id');
  return (
    <div className="py-4 sm:py-6 px-10 mt-4 w-full max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold tracking-wider">Welcome to Leadership Academy</h1>
        {owner_id === userId && (
        <button
          className="text-gray-800 border rounded-full border-gray-800 p-2 mr-20"
          tabIndex={-1}
        >
          <Pencil className="w-5 h-5" />
        </button>
        )}
      </div>
      <p className="text-xl tracking-wide leading-9 text-gray-600">
        We’re a Leadership Academy that loves shaping confident, capable
        individuals for real-world<br/>success. We focus on building strong
        mindsets, practical skills, and making sure every<br/>lesson is both
        inspiring and impactful.
      </p>
    </div>
  );
};

export default Overview;
