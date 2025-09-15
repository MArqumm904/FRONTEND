import React from 'react';

const Preloader = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-xl z-50 flex flex-col items-center justify-center">
      <div className="relative">
        {/* Outer glow ring */}
        <div
          className="absolute inset-0 w-16 h-16 rounded-full opacity-20 animate-ping"
          style={{ backgroundColor: '#0017e7' }}
        ></div>

        {/* Main loader */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
          <div
            className="absolute inset-0 border-4 border-transparent rounded-full animate-spin shadow-lg"
            style={{
              borderTopColor: '#0017e7',
              borderRightColor: '#0017e7',
              filter: 'drop-shadow(0 0 8px rgba(0, 23, 231, 0.3))',
            }}
          ></div>
        </div>

        {/* Inner dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: '#0017e7' }}
          ></div>
        </div>
      </div>

      {/* Loading text */}
      <p className="mt-3 text-xl text-[#0017e7] font-medium animate-pulse">
        Loading...
      </p>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes ping {
          75%,
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default Preloader;