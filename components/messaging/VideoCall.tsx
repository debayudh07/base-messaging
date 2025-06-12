/*eslint-disable*/
"use client";
import React, { useState, useRef } from "react";
import {
  FiVideo,
  FiVideoOff,
  FiMic,
  FiMicOff,
  FiPhone,
  FiShare,
  FiClock,
  FiUsers,
} from "react-icons/fi";
import { shortenAddress } from "../../lib/utils";

interface VideoCallProps {
  isInCall: boolean;
  callRecipient: string;
  roomId: string;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenShareEnabled: boolean;
  isRecordingEnabled: boolean;
  callError: string | null;
  onStartCall: (recipient: string) => void;
  onEndCall: () => void;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onToggleScreenShare: () => void;
  onToggleRecording: () => void;
  selectedConversationPeer?: string;
}

export const VideoCall: React.FC<VideoCallProps> = ({
  isInCall,
  callRecipient,
  roomId,
  isVideoEnabled,
  isAudioEnabled,
  isScreenShareEnabled,
  isRecordingEnabled,
  callError,
  onStartCall,
  onEndCall,
  onToggleVideo,
  onToggleAudio,
  onToggleScreenShare,
  onToggleRecording,
  selectedConversationPeer,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  if (isInCall) {
    return (
      <div className="col-span-12 md:col-span-8 relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
        {/* Comic panel border effect */}
        <div className="absolute -top-2 -left-2 w-full h-full bg-gray-800 -z-10"></div>
        
        <div className="bg-gray-900 text-white p-4 border-b-4 border-black relative z-10">
          <div className="relative">
            <div className="bg-white border-2 border-black rounded-xl p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="font-black text-lg text-black tracking-wider transform -skew-x-6 flex items-center">
                <FiVideo className="mr-2 text-red-600" />
                <span className="skew-x-6">VIDEO CONSULTATION</span>
                {callError && (
                  <span className="text-xs text-red-500 ml-2 bg-red-100 px-2 py-1 rounded font-bold skew-x-6">
                    {callError}
                  </span>
                )}
              </h2>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-900 h-[50vh] relative z-10">
          <div className="bg-white border-2 border-black h-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-black text-lg font-black relative">
            {/* Speed lines background */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
              <div className="absolute top-0 left-1/4 w-px h-full bg-black transform -rotate-12 animate-pulse"></div>
              <div className="absolute top-0 right-1/4 w-px h-full bg-black transform rotate-12 animate-pulse"></div>
            </div>
            
            {/* Video container */}
            <div className="grid grid-cols-1 w-full h-full p-2 relative z-10">
              {isVideoEnabled ? (
                <div className="relative bg-gray-900 border-2 border-black overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-white border-2 border-black px-2 py-1 text-xs font-black">
                    YOU {!isAudioEnabled && <FiMicOff className="inline ml-1" />}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center bg-white">
                  <div className="w-24 h-24 rounded-lg bg-gray-900 border-2 border-black flex items-center justify-center text-4xl text-white mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    {callRecipient.slice(2, 4).toUpperCase()}
                  </div>
                  
                  <div className="bg-white border-2 border-black rounded-xl p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-2">
                    <p className="font-black">IN CALL WITH {shortenAddress(callRecipient).toUpperCase()}...</p>
                  </div>
                  
                  <div className="bg-gray-900 text-white px-3 py-1 border-2 border-black font-black text-sm">
                    ROOM ID: {roomId}
                  </div>
                </div>
              )}
            </div>

            {/* Call controls */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
              <button
                onClick={onToggleVideo}
                className={`p-3 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all transform hover:scale-110 ${
                  isVideoEnabled ? "bg-white text-black" : "bg-red-500 text-white"
                }`}
                title={isVideoEnabled ? "Turn off video" : "Turn on video"}
              >
                {isVideoEnabled ? <FiVideo size={20} /> : <FiVideoOff size={20} />}
              </button>
              <button
                onClick={onToggleAudio}
                className={`p-3 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all transform hover:scale-110 ${
                  isAudioEnabled ? "bg-white text-black" : "bg-red-500 text-white"
                }`}
                title={isAudioEnabled ? "Mute audio" : "Unmute audio"}
              >
                {isAudioEnabled ? <FiMic size={20} /> : <FiMicOff size={20} />}
              </button>
              <button
                onClick={onToggleScreenShare}
                className={`p-3 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all transform hover:scale-110 ${
                  isScreenShareEnabled ? "bg-green-500 text-white" : "bg-white text-black"
                }`}
                title={isScreenShareEnabled ? "Stop screen share" : "Start screen share"}
              >
                <FiShare size={20} />
              </button>
              <button
                onClick={onToggleRecording}
                className={`p-3 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all transform hover:scale-110 ${
                  isRecordingEnabled ? "bg-green-500 text-white" : "bg-white text-black"
                }`}
                title={isRecordingEnabled ? "Stop recording" : "Start recording"}
              >
                <FiClock size={20} />
              </button>
              <button
                onClick={onEndCall}
                className="p-3 bg-red-500 text-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all transform hover:scale-110"
                title="End call"
              >
                <FiPhone size={20} />
              </button>
            </div>

            {/* Call information */}
            <div className="absolute top-4 left-4 bg-white border-2 border-black px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm font-black">
              <div className="flex items-center">
                <FiUsers className="inline mr-1" />
                {isInCall ? 1 : 0} PARTICIPANT(S)
              </div>
              {roomId && (
                <div className="text-xs mt-1">ROOM: {roomId.substring(0, 8)}...</div>
              )}
            </div>
          </div>
        </div>
        
        {/* Comic panel corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-l-4 border-t-4 border-black"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-r-4 border-t-4 border-black"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-l-4 border-b-4 border-black"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-r-4 border-b-4 border-black"></div>
      </div>
    );
  }
  return (
    <div className="col-span-12 md:col-span-8 relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
      {/* Comic panel border effect */}
      <div className="absolute -top-2 -left-2 w-full h-full bg-gray-800 -z-10"></div>
      
      <div className="bg-gray-900 text-white p-4 border-b-4 border-black relative z-10">
        <div className="relative">
          <div className="bg-white border-2 border-black rounded-xl p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-black text-lg text-black tracking-wider transform -skew-x-6 flex items-center">
              <FiVideo className="mr-2 text-red-600" />
              <span className="skew-x-6">VIDEO CONSULTATION</span>
              {callError && (
                <span className="text-xs text-red-500 ml-2 bg-red-100 px-2 py-1 rounded font-bold skew-x-6">
                  {callError}
                </span>
              )}
            </h2>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center h-[50vh] p-8 text-center relative z-10">
        {/* Speed lines background */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 left-1/4 w-px h-full bg-black transform -rotate-12 animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-px h-full bg-black transform rotate-12 animate-pulse"></div>
        </div>
        
        <FiVideo className="mb-6 text-red-600 animate-bounce" size={60} />
        
        {/* Comic speech bubble style title */}
        <div className="relative mb-6">
          <div className="bg-white border-3 border-black rounded-2xl p-4 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {/* Speech bubble tail */}
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-black"></div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-5 border-l-transparent border-r-transparent border-t-white"></div>
            
            <h3 className="text-xl font-black text-black tracking-wider transform -skew-x-6">
              START A VIDEO CONSULTATION
            </h3>
          </div>
        </div>
        
        <div className="bg-gray-900 text-white px-6 py-3 border-2 border-black transform -skew-x-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-6">
          <p className="font-bold text-sm tracking-wider transform skew-x-3">
            CONNECT WITH YOUR HEALTHCARE PROVIDER SECURELY
          </p>
        </div>
        
        {selectedConversationPeer ? (
          <button
            onClick={() => onStartCall(selectedConversationPeer)}
            className="bg-white border-3 border-black px-6 py-3 font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <FiVideo className="text-red-600" />
            CALL {shortenAddress(selectedConversationPeer).toUpperCase()}
          </button>
        ) : (
          <div className="bg-yellow-400 border-2 border-black px-4 py-2 font-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            SELECT A CONVERSATION TO START A CALL
          </div>
        )}
      </div>
      
      {/* Comic panel corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l-4 border-t-4 border-black"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-r-4 border-t-4 border-black"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l-4 border-b-4 border-black"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r-4 border-b-4 border-black"></div>
    </div>
  );
};
