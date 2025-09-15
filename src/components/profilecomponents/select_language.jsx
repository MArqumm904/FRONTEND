import React, { useState } from 'react';

const languages = [
  {
    code: 'en',
    name: 'English',
    flag: 'https://flagcdn.com/us.svg', 
  },
  {
    code: 'ur',
    name: 'Urdu',
    flag: 'https://flagcdn.com/pk.svg',
  },
  {
    code: 'ar',
    name: 'Arabic',
    flag: 'https://flagcdn.com/sa.svg',
  },
  {
    code: 'ye',
    name: 'Yemeni - Arabic',
    flag: 'https://flagcdn.com/ye.svg',
  },
  {
    code: 'es',
    name: 'Spanish',
    flag: 'https://flagcdn.com/es.svg',
  },
];

const SelectLanguage = ({ onClose }) => {
  const [selected, setSelected] = useState('en');

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold font-sf text-gray-900">Language</h2>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-800 transition-colors rounded-full "
            aria-label="Close"
          >
            <svg width="28" height="28" fill="none" stroke="currentColor"  strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        {/* Language List */}
        <div className="divide-y divide-gray-100">
          {languages.map((lang) => (
            <label
              key={lang.code}
              className="flex items-center px-7 py-4 cursor-pointer hover:bg-gray-50 transition"
            >
              <img
                src={lang.flag}
                alt={lang.name + ' flag'}
                className="w-12 h-12 rounded-full object-cover border border-gray-200 mr-4"
              />
              <span className="flex-1 text-lg font-sf text-gray-900">{lang.name}</span>
              <input
                type="radio"
                name="language"
                checked={selected === lang.code}
                onChange={() => setSelected(lang.code)}
                className="form-radio cursor-pointer w-8 h-8 text-[#0017e7] border-[#0017e7] focus:ring-[#0017e7]"
                style={{
                  accentColor: '#0017e7'
                }}
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectLanguage;