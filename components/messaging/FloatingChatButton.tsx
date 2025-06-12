/*eslint-disable*/
"use client";
import React, { useState } from 'react';
import { FiMessageCircle, FiX } from 'react-icons/fi';

interface FloatingChatButtonProps {
  onClick: () => void;
  hasUnreadMessages?: boolean;
}

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({
  onClick,
  hasUnreadMessages = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        fixed bottom-6 right-6 z-50
        w-16 h-16 
        bg-white border-4 border-black
        shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
        text-black font-black text-xl
        transition-all duration-300 transform
        ${isHovered ? 'scale-110 rotate-12' : 'scale-100'}
        ${hasUnreadMessages ? 'animate-bounce' : 'hover:scale-105'}
        relative overflow-hidden
      `}
    >
      {/* Comic panel background effect */}
      <div className="absolute -top-1 -left-1 w-full h-full bg-gray-800 -z-10"></div>
      
      {/* Speed lines for animation */}
      {isHovered && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-px h-full bg-black opacity-30 transform -rotate-12 animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-px h-full bg-black opacity-30 transform rotate-12 animate-pulse"></div>
        </div>
      )}

      <div className="relative z-10">
        <FiMessageCircle 
          className={`transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} 
          size={24} 
        />
        {hasUnreadMessages && (
          <div className="absolute -top-2 -right-2 w-6 h-6">
            <div className="w-full h-full bg-red-500 border-2 border-black rounded-full animate-pulse flex items-center justify-center">
              <span className="text-white text-xs font-black">!</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Comic sound effect when hovered */}
      {isHovered && (
        <div className="absolute -top-8 -right-2 bg-white border-2 border-black px-2 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-xs font-bold">CLICK!</span>
        </div>
      )}

      {/* Comic panel corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-black"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-black"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-black"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-black"></div>
    </button>
  );
};
