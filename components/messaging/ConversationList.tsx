"use client";
import React from "react";
import { FiMessageCircle, FiVideo } from "react-icons/fi";
import type { Conversation } from "../../lib/types";
import { shortenAddress } from "../../lib/utils";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onStartCall: (peerAddress: string) => void;
  onNewConversation: () => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  onStartCall,
  onNewConversation,
}) => {
  return (
    <div className="relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
      {/* Comic panel border effect */}
      <div className="absolute -top-2 -left-2 w-full h-full bg-gray-800 -z-10"></div>
      
      <div className="bg-gray-900 text-white p-4 border-b-4 border-black relative">
        <div className="flex justify-between items-center">
          <div className="relative">
            <div className="bg-white border-2 border-black rounded-xl p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="font-black text-lg text-black tracking-wider transform -skew-x-6 flex items-center gap-2">
                <FiMessageCircle className="text-red-600" />
                <span className="skew-x-6">CONVERSATIONS</span>
              </h2>
            </div>
          </div>
          <button
            onClick={onNewConversation}
            className="bg-white text-black border-2 border-black p-2 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transform transition-all duration-300"
            title="Start new conversation"
          >
            <FiMessageCircle size={18} />
          </button>
        </div>
      </div>

      <div className="divide-y-4 divide-black max-h-[30vh] overflow-y-auto bg-white">
        {conversations.length === 0 ? (
          <div className="p-8 text-center relative">
            {/* Speed lines background */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
              <div className="absolute top-0 left-1/4 w-px h-full bg-black transform -rotate-12 animate-pulse"></div>
              <div className="absolute top-0 right-1/4 w-px h-full bg-black transform rotate-12 animate-pulse"></div>
            </div>
            
            <FiMessageCircle className="mx-auto mb-4 text-red-600 animate-bounce" size={40} />
            
            <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
              <p className="font-black text-black text-lg">NO CONVERSATIONS YET</p>
            </div>
            
            <div className="bg-gray-900 text-white px-4 py-2 border-2 border-black transform -skew-x-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
              <p className="text-sm font-bold tracking-wider transform skew-x-3">🎮 START CHATTING TO UNLOCK GAMES!</p>
            </div>
            
            <button
              onClick={onNewConversation}
              className="bg-white border-3 border-black px-6 py-3 font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform hover:scale-105 transition-all duration-300"
            >
              ✨ START NEW CHAT
            </button>
          </div>
        ) : (
          conversations.map((conversation) => (
            <button
              key={conversation.peerAddress}
              onClick={() => onSelectConversation(conversation)}
              className={`w-full text-left p-4 transition-all duration-300 transform hover:scale-[1.02] border-b-2 border-black relative ${
                selectedConversation?.peerAddress === conversation.peerAddress
                  ? "bg-gray-900 text-white border-l-8 border-l-red-600"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              {/* Action lines for selected conversation */}
              {selectedConversation?.peerAddress === conversation.peerAddress && (
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-px bg-white transform rotate-12 animate-pulse"></div>
                  <div className="absolute bottom-0 right-0 w-full h-px bg-white transform -rotate-12 animate-pulse"></div>
                </div>
              )}
              
              <div className="flex items-center relative z-10">
                <div className="w-12 h-12 bg-gray-900 text-white rounded-lg border-2 border-black flex items-center justify-center font-black text-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span>{conversation.peerAddress.slice(2, 4).toUpperCase()}</span>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="font-black text-lg truncate mb-1">
                    {shortenAddress(conversation.peerAddress)}
                  </h3>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="text-xs bg-white text-black border-2 border-black px-3 py-1 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transform transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartCall(conversation.peerAddress);
                      }}
                    >
                      <FiVideo className="inline mr-1" size={12} />
                      CALL
                    </button>
                    <span className="text-xs bg-gray-900 text-white px-3 py-1 border-2 border-black font-bold">
                      💬 CHAT
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-black">
                  ▶️
                </div>
              </div>
            </button>
          ))
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
