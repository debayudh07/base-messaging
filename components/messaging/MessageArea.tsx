/*eslint-disable*/
"use client";
import React, { useState, type FormEvent } from "react";
import { FiMessageCircle, FiSend, FiVideo } from "react-icons/fi";
import { useAccount } from "wagmi";
import { useConversation } from "../../lib/hooks/useConversation";
import type { Conversation } from "../../lib/types";
import { shortenAddress, formatTime } from "../../lib/utils";

interface MessageAreaProps {
  selectedConversation: Conversation | null;
  onStartCall: (peerAddress: string) => void;
  onNewConversation: () => void;
}

export const MessageArea: React.FC<MessageAreaProps> = ({
  selectedConversation,
  onStartCall,
  onNewConversation,
}) => {
  const { address } = useAccount();
  const [messageInput, setMessageInput] = useState("");
  
  const {
    messages,
    isLoadingMessages,
    error,
    messagesEndRef,
    sendMessage,
    setError,
  } = useConversation(selectedConversation);

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!messageInput.trim()) return;

    try {
      await sendMessage(messageInput);
      setMessageInput("");
    } catch (err) {
      // Error is handled in the hook
    }
  };  if (!selectedConversation) {
    return (
      <div className="relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col h-[40vh] transform hover:scale-[1.02] transition-transform duration-300">
        {/* Comic panel border effect */}
        <div className="absolute -top-2 -left-2 w-full h-full bg-gray-800 -z-10"></div>
        
        <div className="flex flex-col items-center justify-center h-full p-8 text-center relative z-10">
          {/* Speed lines background */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute top-0 left-1/4 w-px h-full bg-black transform -rotate-12 animate-pulse"></div>
            <div className="absolute top-0 right-1/4 w-px h-full bg-black transform rotate-12 animate-pulse"></div>
          </div>
          
          <div className="relative mb-6">
            <FiMessageCircle className="text-6xl text-red-600 animate-bounce" />
          </div>
          
          {/* Comic speech bubble style title */}
          <div className="relative mb-6">
            <div className="bg-white border-3 border-black rounded-2xl p-4 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {/* Speech bubble tail */}
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-black"></div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-5 border-l-transparent border-r-transparent border-t-white"></div>
              
              <h3 className="text-xl font-black text-black tracking-wider transform -skew-x-6">
                🌟 SELECT A CONVERSATION
              </h3>
            </div>
          </div>
          
          <div className="bg-gray-900 text-white px-6 py-3 border-2 border-black transform -skew-x-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-6">
            <p className="font-bold text-sm tracking-wider transform skew-x-3">
              CHOOSE A FRIEND TO START CHATTING AND GAMING!
            </p>
          </div>
          
          <button
            onClick={onNewConversation}
            className="bg-white border-3 border-black px-6 py-3 font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform hover:scale-105 transition-all duration-300"
          >
            ✨ START NEW CONVERSATION
          </button>
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
    <div className="relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col h-[40vh] transform hover:scale-[1.02] transition-transform duration-300">
      {/* Comic panel border effect */}
      <div className="absolute -top-2 -left-2 w-full h-full bg-gray-800 -z-10"></div>
      
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 border-b-4 border-black flex justify-between items-center relative z-10">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white text-black border-2 border-black rounded-lg flex items-center justify-center font-black mr-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span>{selectedConversation.peerAddress.slice(2, 4).toUpperCase()}</span>
          </div>
          <div>
            <h2 className="font-black text-white text-lg">
              {shortenAddress(selectedConversation.peerAddress)}
            </h2>
            <p className="text-xs text-green-400 font-bold">🎮 READY TO PLAY!</p>
          </div>
        </div>
        <button
          onClick={() => onStartCall(selectedConversation.peerAddress)}
          className="bg-white text-black border-2 border-black p-2 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transform transition-all duration-300"
          title="Start video call"
        >
          <FiVideo size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-white relative z-10">
        {isLoadingMessages ? (
          <div className="flex justify-center items-center h-full">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
              <div className="absolute inset-0 w-12 h-12 border-2 border-black rounded-full animate-ping"></div>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-black mt-10">
            <div className="text-4xl mb-4 animate-bounce">💬</div>
            
            <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
              <p className="font-black text-lg">NO MESSAGES YET!</p>
            </div>
            
            <div className="bg-gray-900 text-white px-4 py-2 border-2 border-black transform -skew-x-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-sm font-bold tracking-wider transform skew-x-3">START THE CONVERSATION AND UNLOCK GAMES! 🎮</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderAddress === address ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] border-2 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] relative transform transition-all duration-300 hover:scale-105 ${
                    message.senderAddress === address
                      ? "bg-gray-900 text-white -skew-x-3"
                      : "bg-white text-black"
                  }`}
                >
                  <p className={`mb-2 relative z-10 font-bold ${message.senderAddress === address ? 'skew-x-3' : ''}`}>
                    {message.content}
                  </p>
                  <p
                    className={`text-xs font-bold ${
                      message.senderAddress === address ? "text-green-400 skew-x-3" : "text-gray-600"
                    }`}
                  >
                    {formatTime(message.sent)}
                  </p>
                  
                  {/* Comic sound effect for sent messages */}
                  {message.senderAddress === address && (
                    <div className="absolute -top-4 -right-2 bg-white border-2 border-black px-2 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] skew-x-3">
                      <span className="text-xs font-bold">SENT!</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t-4 border-black bg-gray-900 relative z-10">
        {error && (
          <div className="text-white text-sm mb-2 p-2 bg-red-500 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform -skew-x-3">
            <p className="font-bold transform skew-x-3">{error}</p>
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="TYPE YOUR MESSAGE... 💬"
            className="flex-1 bg-white border-2 border-black py-3 px-4 text-black font-bold placeholder-gray-500 focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
          />
          <button
            type="submit"
            className="bg-white text-black border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-black"
            disabled={!messageInput.trim()}
          >
            <FiSend size={20} />
          </button>
        </div>
      </form>
      
      {/* Comic panel corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l-4 border-t-4 border-black"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-r-4 border-t-4 border-black"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l-4 border-b-4 border-black"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r-4 border-b-4 border-black"></div>
    </div>
  );
};
