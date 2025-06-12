"use client";
import React, { useState, useRef, useEffect } from 'react';
import { 
  FiUsers, 
  FiUserPlus, 
  FiLogOut, 
  FiCopy, 
  FiSend 
} from 'react-icons/fi';
import type { GroupChat, GroupMessage } from '../../../lib/types';
import { shortenAddress } from '../../../lib/utils';

interface GroupChatAreaProps {
  selectedGroup: GroupChat | null;
  currentUserAddress: string;
  onSendMessage: (groupId: string, message: string) => Promise<void>;
  onLeaveGroup: (groupId: string) => Promise<void>;
  onAddMember: (groupId: string) => void;
  messages: GroupMessage[];
  isLoadingMessages: boolean;
  error: string | null;
}

export const GroupChatArea: React.FC<GroupChatAreaProps> = ({
  selectedGroup,
  currentUserAddress,
  onSendMessage,
  onLeaveGroup,
  onAddMember,
  messages,
  isLoadingMessages,
  error,
}) => {
  const [messageInput, setMessageInput] = useState("");
  const [showMembersList, setShowMembersList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !selectedGroup) return;

    try {
      await onSendMessage(selectedGroup.id, messageInput);
      setMessageInput("");    } catch {
      // Error is handled in the parent component
    }
  };
  const isCreator = selectedGroup && selectedGroup.creatorAddress.toLowerCase() === currentUserAddress?.toLowerCase();

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'join':
        return '👋';
      case 'leave':
        return '🚪';
      case 'admin':
        return '⚡';
      default:
        return '💬';
    }
  };

  if (!selectedGroup) {
    return (
      <div className="relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col h-[50vh] transform hover:scale-[1.02] transition-transform duration-300">
        {/* Comic panel border effect */}
        <div className="absolute -top-2 -left-2 w-full h-full bg-gray-800 -z-10"></div>
        
        <div className="flex flex-col items-center justify-center h-full p-8 text-center relative z-10">
          {/* Speed lines background */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute top-0 left-1/4 w-px h-full bg-black transform -rotate-12 animate-pulse"></div>
            <div className="absolute top-0 right-1/4 w-px h-full bg-black transform rotate-12 animate-pulse"></div>
          </div>
          
          <div className="relative mb-6">
            <FiUsers className="text-6xl text-blue-600 animate-bounce" />
          </div>
          
          <div className="bg-white border-3 border-black rounded-2xl p-4 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
            <h2 className="text-2xl font-black text-black tracking-wider transform -skew-x-6">
              SELECT A GROUP CHAT
            </h2>
          </div>
          
          <div className="bg-gray-900 text-white px-6 py-3 border-2 border-black transform -skew-x-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-bold text-sm tracking-wider transform skew-x-3">
              👥 JOIN THE CONVERSATION WITH MULTIPLE USERS
            </p>
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
    <div className="relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col h-[50vh] transform hover:scale-[1.02] transition-transform duration-300">
      {/* Comic panel border effect */}
      <div className="absolute -top-2 -left-2 w-full h-full bg-gray-800 -z-10"></div>
      
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 border-b-4 border-black flex justify-between items-center relative z-10">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white text-black border-2 border-black rounded-lg flex items-center justify-center font-black mr-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            👥
          </div>
          <div>
            <h3 className="font-black text-lg">{selectedGroup.name}</h3>
            <p className="text-sm opacity-80">{selectedGroup.members.length + 1} members</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMembersList(!showMembersList)}
            className="bg-white text-black border-2 border-black p-2 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transform transition-all duration-300"
            title="View members"
          >
            <FiUsers size={18} />
          </button>
          
          {isCreator && (
            <button
              onClick={() => onAddMember(selectedGroup.id)}
              className="bg-green-500 text-white border-2 border-black p-2 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transform transition-all duration-300"
              title="Add member"
            >
              <FiUserPlus size={18} />
            </button>
          )}
          
          <button
            onClick={() => onLeaveGroup(selectedGroup.id)}
            className="bg-red-500 text-white border-2 border-black p-2 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transform transition-all duration-300"
            title="Leave group"
          >
            <FiLogOut size={18} />
          </button>
        </div>
      </div>

      {/* Members List Sidebar */}
      {showMembersList && (
        <div className="absolute top-20 right-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 z-20 w-64 max-h-80 overflow-y-auto">
          <h4 className="font-black text-lg mb-3 border-b-2 border-black pb-2">GROUP MEMBERS</h4>
          <div className="space-y-2">
            {/* Creator */}
            <div className="flex items-center justify-between bg-yellow-100 border border-black p-2">
              <div className="flex items-center gap-2">
                <span className="bg-yellow-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">👑</span>
                <span className="font-bold text-sm">{shortenAddress(selectedGroup.creatorAddress)}</span>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(selectedGroup.creatorAddress)}
                className="text-blue-600 hover:text-blue-800"
                title="Copy address"
              >
                <FiCopy size={14} />
              </button>
            </div>
            
            {/* Members */}
            {selectedGroup.members.map((member, index) => (
              <div key={member} className="flex items-center justify-between bg-gray-100 border border-black p-2">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="font-bold text-sm">{shortenAddress(member)}</span>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(member)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Copy address"
                >
                  <FiCopy size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-white relative z-10">
        {isLoadingMessages ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-black mt-10">
            <FiUsers className="mx-auto mb-4 text-blue-600" size={48} />
            <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
              <p className="font-black text-lg">NO MESSAGES YET</p>
            </div>
            <div className="bg-gray-900 text-white px-4 py-2 border-2 border-black transform -skew-x-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-sm font-bold tracking-wider transform skew-x-3">🎯 BE THE FIRST TO SAY HELLO!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderAddress.toLowerCase() === currentUserAddress?.toLowerCase() ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                  message.senderAddress.toLowerCase() === currentUserAddress?.toLowerCase()
                    ? 'bg-blue-600 text-white'
                    : message.type === 'admin' || message.type === 'join' || message.type === 'leave'
                    ? 'bg-yellow-100 text-black'
                    : 'bg-gray-100 text-black'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs">{getMessageTypeIcon(message.type)}</span>
                    <span className="font-bold text-xs opacity-80">
                      {shortenAddress(message.senderAddress)}
                    </span>                    <span className="font-bold text-xs opacity-60">
                      {new Date(message.timestamp || message.sent || Date.now()).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="font-bold break-words">{message.content}</p>
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
            <p className="transform skew-x-3">{error}</p>
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="TYPE YOUR GROUP MESSAGE... 👥"
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
