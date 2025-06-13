"use client";
import React, { useState, useRef, useEffect } from 'react';
import { FiBox, FiSend, FiCode, FiClock, FiActivity, FiInfo, FiAlertCircle } from 'react-icons/fi';
import type { AIAgent, AgentMessage } from '../../../lib/types';

interface AgentChatAreaProps {
  selectedAgent: AIAgent | null;
  currentUserAddress: string;
  onSendMessage: (agentId: string, message: string) => Promise<void>;
  onDisconnectAgent: (agentId: string) => Promise<void>;
  messages: AgentMessage[];
  isLoadingMessages: boolean;
  error: string | null;
}

export const AgentChatArea: React.FC<AgentChatAreaProps> = ({
  selectedAgent,
  currentUserAddress,
  onSendMessage,
  onDisconnectAgent,
  messages,
  isLoadingMessages,
  error,
}) => {
  const [messageInput, setMessageInput] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !selectedAgent) return;

    try {
      await onSendMessage(selectedAgent.id, messageInput);
      setMessageInput("");
    } catch {
      // Error is handled in the parent component
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'action':
        return <FiActivity className="text-yellow-500" />;
      case 'result':
        return <FiCode className="text-green-500" />;
      case 'error':
        return <FiAlertCircle className="text-red-500" />;
      case 'system':
        return <FiInfo className="text-blue-500" />;
      default:
        return <FiBox className="text-gray-500" />;
    }
  };

  const getMessageTypeClass = (type: string) => {
    switch (type) {
      case 'action':
        return 'bg-yellow-100 border-yellow-400';
      case 'result':
        return 'bg-green-100 border-green-400';
      case 'error':
        return 'bg-red-100 border-red-400';
      case 'system':
        return 'bg-blue-100 border-blue-400';
      default:
        return 'bg-gray-100 border-gray-400';
    }
  };

  const formatTimestamp = (timestamp: Date | string | number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!selectedAgent) {
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
            <FiBox className="text-6xl text-blue-600 animate-bounce" />
          </div>
          
          <div className="bg-white border-3 border-black rounded-2xl p-4 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
            <h2 className="text-2xl font-black text-black tracking-wider transform -skew-x-6">
              SELECT AN AI AGENT
            </h2>
          </div>
          
          <div className="bg-gray-900 text-white px-6 py-3 border-2 border-black transform -skew-x-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-bold text-sm tracking-wider transform skew-x-3">
              🤖 INTERACT WITH ONCHAIN AI AGENTS
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
            {selectedAgent.role === 'finance' ? '💰' : 
             selectedAgent.role === 'nft' ? '🖼️' :
             selectedAgent.role === 'defi' ? '📊' :
             selectedAgent.role === 'governance' ? '⚖️' :
             selectedAgent.role === 'gaming' ? '🎮' : '🤖'}
          </div>
          <div>
            <h3 className="font-black text-lg">{selectedAgent.name}</h3>
            <p className="text-sm opacity-80">{selectedAgent.role}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="bg-white text-black border-2 border-black p-2 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transform transition-all duration-300"
            title="Agent details"
          >
            <FiInfo size={18} />
          </button>
          
          <button
            onClick={() => onDisconnectAgent(selectedAgent.id)}
            className="bg-red-500 text-white border-2 border-black p-2 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transform transition-all duration-300"
            title="Disconnect agent"
          >
            <FiBox size={18} />
          </button>
        </div>
      </div>

      {/* Agent Details Sidebar */}
      {showDetails && (
        <div className="absolute top-20 right-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 z-20 w-64 max-h-80 overflow-y-auto">
          <h4 className="font-black text-lg mb-3 border-b-2 border-black pb-2">AGENT DETAILS</h4>
          <div className="space-y-2">
            <div className="bg-gray-100 border border-black p-2">
              <p className="font-bold">Description</p>
              <p className="text-sm">{selectedAgent.description}</p>
            </div>
            
            <div className="bg-gray-100 border border-black p-2">
              <p className="font-bold">Capabilities</p>
              <ul className="text-sm list-disc pl-4">
                {selectedAgent.capabilities.map((capability, index) => (
                  <li key={index}>{capability}</li>
                ))}
              </ul>
            </div>
            
            {selectedAgent.contractAddress && (
              <div className="bg-gray-100 border border-black p-2">
                <p className="font-bold">Contract</p>
                <p className="text-sm break-all">{selectedAgent.contractAddress}</p>
              </div>
            )}
            
            <div className="bg-gray-100 border border-black p-2">
              <p className="font-bold">Created</p>
              <p className="text-sm">{selectedAgent.createdAt.toLocaleDateString()}</p>
            </div>
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
            <FiBox className="mx-auto mb-4 text-blue-600" size={48} />
            <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
              <p className="text-xl font-black">START CHATTING WITH {selectedAgent.name.toUpperCase()}</p>
            </div>
            
            <div className="bg-gray-900 text-white px-4 py-2 border-2 border-black transform -skew-x-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-sm font-bold tracking-wider transform skew-x-3">
                👉 THIS AGENT CAN {selectedAgent.capabilities.join(' AND ')}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`relative border-2 border-black p-3 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                  message.senderAddress === currentUserAddress 
                    ? 'ml-10 bg-blue-100' 
                    : 'mr-10 ' + getMessageTypeClass(message.type)
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full border-2 border-black mr-2 flex items-center justify-center bg-white">
                      {message.senderAddress === currentUserAddress ? '👤' : getMessageTypeIcon(message.type)}
                    </div>                    <span className="font-bold text-sm text-black">
                      {message.senderAddress === currentUserAddress ? 'You' : selectedAgent.name}
                    </span>
                  </div>                  <div className="text-xs flex items-center text-black">
                    <FiClock className="mr-1" size={12} />
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>                <div className="p-2 bg-white border border-black rounded">
                  <p className="whitespace-pre-wrap break-words text-black">{message.content}</p>
                </div>
                  {/* Metadata for actions/results/errors */}
                {message.metadata && (
                  <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded text-xs text-black">
                    {message.metadata.transactionHash && (
                      <div className="flex items-center gap-1 mb-1">
                        <span className="font-bold">Tx:</span>
                        <code className="bg-gray-100 px-1 rounded break-all">{message.metadata.transactionHash.slice(0, 10)}...{message.metadata.transactionHash.slice(-10)}</code>
                      </div>
                    )}
                    {message.metadata.functionName && (
                      <div className="flex items-center gap-1">
                        <span className="font-bold">Function:</span>
                        <code className="bg-gray-100 px-1 rounded">{message.metadata.functionName}</code>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Corner decoration */}
                <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-black"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-black"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-black"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-black"></div>
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
            placeholder="CHAT WITH YOUR AI AGENT... 🤖"
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
