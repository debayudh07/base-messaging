"use client";
import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { isValidEthereumAddress } from "../../lib/utils";

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartConversation: (address: string) => Promise<void>;
  error: string | null;
}

export const NewConversationModal: React.FC<NewConversationModalProps> = ({
  isOpen,
  onClose,
  onStartConversation,
  error,
}) => {
  const [recipientInput, setRecipientInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!recipientInput.trim()) return;

    if (!isValidEthereumAddress(recipientInput)) {
      return;
    }

    try {
      setIsLoading(true);
      await onStartConversation(recipientInput);
      setRecipientInput("");
      onClose();
    } catch (err) {
      // Error is handled by parent component
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setRecipientInput("");
    onClose();
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Manga background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white transform rotate-12"></div>
        <div className="absolute top-32 right-20 w-24 h-24 border-2 border-white transform -rotate-12"></div>
        <div className="absolute bottom-20 left-32 w-28 h-28 border-2 border-white transform rotate-45"></div>
        <div className="absolute bottom-40 right-10 w-20 h-20 border-2 border-white transform -rotate-45"></div>
      </div>

      {/* Main comic card */}
      <div className="relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 max-w-md w-full mx-4 transform hover:scale-105 transition-transform duration-300">
        {/* Comic panel border effect */}
        <div className="absolute -top-2 -left-2 w-full h-full bg-gray-800 -z-10"></div>
        
        {/* Speed lines background */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 left-1/4 w-px h-full bg-black transform -rotate-12 animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-px h-full bg-black transform rotate-12 animate-pulse"></div>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              <div className="bg-white border-2 border-black rounded-xl p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-xl font-black text-black tracking-wider transform -skew-x-6">
                  NEW CONVERSATION
                </h3>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="bg-red-500 text-white border-2 border-black p-2 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transform transition-all duration-300"
            >
              <FiX size={24} />
            </button>
          </div>

          {error && (
            <div className="bg-red-500 text-white p-3 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4 transform -skew-x-3">
              <p className="font-bold text-sm transform skew-x-3">{error}</p>
            </div>
          )}

          {/* Input section */}
          <div className="mb-6">
            <div className="bg-gray-900 text-white px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
              <label htmlFor="recipient" className="font-black text-sm tracking-wider">
                RECIPIENT'S ETHEREUM ADDRESS
              </label>
            </div>
            
            <input
              type="text"
              id="recipient"
              value={recipientInput}
              onChange={(e) => setRecipientInput(e.target.value)}
              placeholder="0x..."
              className="w-full border-2 border-black py-3 px-4 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:scale-105 transform transition-all duration-300"
              disabled={isLoading}
            />
            
            <div className="bg-gray-900 text-white px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mt-2 transform -skew-x-3">
              <p className="text-xs font-bold transform skew-x-3">
                ENTER THE FULL ETHEREUM ADDRESS OF THE RECIPIENT.
              </p>
            </div>
            
            {recipientInput && !isValidEthereumAddress(recipientInput) && (
              <div className="bg-red-500 text-white p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mt-2">
                <p className="text-sm font-bold">INVALID ETHEREUM ADDRESS FORMAT</p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              className="bg-gray-300 text-black border-2 border-black px-4 py-2 font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transform transition-all duration-300 disabled:opacity-50"
              disabled={isLoading}
            >
              CANCEL
            </button>
            <button
              onClick={handleSubmit}
              className="bg-gray-900 text-white border-2 border-black px-4 py-2 font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!recipientInput.trim() || !isValidEthereumAddress(recipientInput) || isLoading}
            >
              {isLoading ? "STARTING..." : "START CONVERSATION"}
            </button>
          </div>
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
          <span className="text-sm font-bold">NEW!</span>
        </div>
      </div>
      
      <div className="absolute bottom-32 right-32 animate-bounce" style={{animationDelay: '0.3s'}}>
        <div className="bg-white border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-sm font-bold">CHAT!</span>
        </div>
      </div>
    </div>
  );
};
