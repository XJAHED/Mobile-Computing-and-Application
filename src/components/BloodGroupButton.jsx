import React from 'react';

const BloodGroupButton = ({ group, onClick, selected }) => {
  return (
    <button
      onClick={() => onClick(group)}
      className={`
        relative w-full aspect-square rounded-2xl flex items-center justify-center text-2xl font-bold
        transition-all duration-300 ease-in-out shadow-sm
        ${selected 
          ? 'bg-red-600 text-white shadow-md transform scale-105 border-transparent' 
          : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-red-400 hover:shadow-md hover:text-red-500 hover:bg-red-50'
        }
      `}
    >
      {/* Drop icon watermark in background if selected for a nice effect */}
      {selected && (
        <span className="absolute inset-0 flex items-center justify-center opacity-10">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
            <path d="M12 21.5c-3.1 0-5.7-1.1-7.7-3.2-1.9-2-2.8-4.6-2.8-7.8 0-3.3 1.9-6.3 4.2-8.5C7.2 0.7 9.8 -1.2 12 -2.1c2.2 0.9 4.8 2.8 6.3 4.1 2.3 2.2 4.2 5.2 4.2 8.5 0 3.2-0.9 5.8-2.8 7.8-2 2.1-4.6 3.2-7.7 3.2z"/>
          </svg>
        </span>
      )}
      <span className="z-10 relative">{group}</span>
    </button>
  );
};

export default BloodGroupButton;
