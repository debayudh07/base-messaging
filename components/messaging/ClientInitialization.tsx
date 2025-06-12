"use client";
import React from "react";
import { FiRefreshCw, FiCopy } from "react-icons/fi";
import { shortenAddress, copyAddressToClipboard } from "../../lib/utils";

interface ClientInitializationProps {
  address: string | undefined;
  isInitializing: boolean;
  error: string | null;
  onInitialize: () => void;
}

export const ClientInitialization: React.FC<ClientInitializationProps> = ({
  address,
  isInitializing,
  error,
  onInitialize,
}) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center relative overflow-hidden">
      {/* Manga background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-black transform rotate-12"></div>
        <div className="absolute top-32 right-20 w-24 h-24 border-2 border-black transform -rotate-12"></div>
        <div className="absolute bottom-20 left-32 w-28 h-28 border-2 border-black transform rotate-45"></div>
        <div className="absolute bottom-40 right-10 w-20 h-20 border-2 border-black transform -rotate-45"></div>
      </div>

      {/* Speed lines background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-0 left-1/4 w-px h-full bg-black transform -rotate-12 animate-pulse"></div>
        <div className="absolute top-0 left-1/2 w-px h-full bg-black transform rotate-6 animate-pulse"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-black transform -rotate-6 animate-pulse"></div>
      </div>

      {/* Main comic card */}
      <div className="relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 max-w-md mx-4 transform hover:scale-105 transition-transform duration-300">
        {/* Comic panel border effect */}
        <div className="absolute -top-2 -left-2 w-full h-full bg-gray-800 -z-10"></div>
        
        <div className="text-center relative z-10">
          {/* Status indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="bg-white border-2 border-black rounded-xl p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse border border-black"></div>
                <p className="font-black text-black text-lg">WALLET CONNECTED</p>
              </div>
            </div>
          </div>

          {/* Address display */}
          <div className="bg-gray-900 text-white p-4 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-6 flex items-center justify-between">
            <span className="font-black tracking-wider">
              {address ? shortenAddress(address) : ""}
            </span>
            <button
              onClick={() => address && copyAddressToClipboard(address)}
              className="text-green-400 hover:text-green-200 transition-colors hover:scale-110 transform"
            >
              <FiCopy size={18} />
            </button>
          </div>

          {/* Comic speech bubble style title */}
          <div className="relative mb-6">
            <div className="bg-white border-3 border-black rounded-2xl p-4 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {/* Speech bubble tail */}
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-black"></div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-5 border-l-transparent border-r-transparent border-t-white"></div>
              
              <h2 className="text-2xl font-black text-black tracking-wider transform -skew-x-6">
                INITIALIZE XMTP CLIENT
              </h2>
            </div>
          </div>

          <div className="bg-gray-900 text-white px-6 py-3 border-2 border-black transform -skew-x-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-6">
            <p className="font-bold text-sm tracking-wider transform skew-x-3">
              INITIALIZE THE XMTP CLIENT TO START SECURE, DECENTRALIZED MESSAGING.
            </p>
          </div>

          {error && (
            <div className="bg-red-500 text-white p-3 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4 transform -skew-x-3">
              <p className="font-bold text-sm transform skew-x-3">{error}</p>
            </div>
          )}

          <button
            onClick={onInitialize}
            className="w-full bg-white border-3 border-black px-6 py-4 font-black text-black text-lg tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isInitializing}
          >
            {isInitializing ? (
              <div className="flex items-center justify-center">
                <FiRefreshCw className="animate-spin mr-2" />
                <span>INITIALIZING...</span>
              </div>
            ) : (
              "INITIALIZE XMTP CLIENT"
            )}
          </button>
        </div>

        {/* Comic panel corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-l-4 border-t-4 border-black"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-r-4 border-t-4 border-black"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-l-4 border-b-4 border-black"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-r-4 border-b-4 border-black"></div>
      </div>

      {/* Floating comic elements */}
      <div className="absolute top-20 left-20 animate-bounce">
        <div className="bg-white border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-sm font-bold">CONNECT!</span>
        </div>
      </div>
      
      <div className="absolute bottom-32 right-32 animate-bounce" style={{animationDelay: '0.3s'}}>
        <div className="bg-white border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-sm font-bold">READY!</span>
        </div>
      </div>

      <div className="absolute top-1/3 right-20 animate-pulse">
        <div className="bg-white border-2 border-black px-2 py-1 transform rotate-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-xs font-bold">⚡</span>
        </div>
      </div>
    </div>
  );
};
