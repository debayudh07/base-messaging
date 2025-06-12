"use client";
import React, { useState } from 'react';
import { FiX, FiUserPlus, FiUsers } from 'react-icons/fi';

// Utility function to validate Ethereum addresses
const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (memberAddress: string) => Promise<void>;
  groupName: string;
  error: string | null;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onAddMember,
  groupName,
  error,
}) => {
  const [memberAddress, setMemberAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!memberAddress.trim() || !isValidEthereumAddress(memberAddress)) return;

    try {
      setIsLoading(true);
      await onAddMember(memberAddress.toLowerCase());
      setMemberAddress("");
      onClose();
    } catch (err) {
      // Error is handled by parent component
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setMemberAddress("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Main comic card */}
      <div className="relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 max-w-md w-full mx-4 transform hover:scale-105 transition-transform duration-300">
        {/* Comic panel border effect */}
        <div className="absolute -top-2 -left-2 w-full h-full bg-gray-800 -z-10"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="bg-white border-2 border-black rounded-xl p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="font-black text-lg text-black tracking-wider transform -skew-x-6 flex items-center gap-2">
                <FiUserPlus className="text-green-600" />
                <span className="skew-x-6">ADD MEMBER</span>
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="bg-red-500 text-white border-2 border-black p-2 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transform transition-all duration-300"
            >
              <FiX size={20} />
            </button>
          </div>

          {error && (
            <div className="bg-red-500 text-white p-3 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4 transform -skew-x-3">
              <p className="font-bold text-sm transform skew-x-3">{error}</p>
            </div>
          )}

          {/* Group Info */}
          <div className="bg-gray-100 border-2 border-black p-3 mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2">
              <FiUsers className="text-blue-600" size={20} />
              <span className="font-black text-black">Adding to: {groupName}</span>
            </div>
          </div>

          {/* Member Address Input */}
          <div className="mb-6">
            <label htmlFor="memberAddress" className="block font-bold text-black mb-2">
              Member Ethereum Address
            </label>
            <input
              type="text"
              id="memberAddress"
              value={memberAddress}
              onChange={(e) => setMemberAddress(e.target.value)}
              placeholder="0x... Ethereum address"
              className="w-full border-2 border-black py-3 px-4 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:scale-105 transform transition-all duration-300"
              disabled={isLoading}
            />
            
            {memberAddress && !isValidEthereumAddress(memberAddress) && (
              <div className="bg-red-100 border-2 border-red-500 p-2 mt-2">
                <p className="text-red-700 font-bold text-sm">❌ Invalid Ethereum address</p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              className="bg-gray-300 text-black border-2 border-black px-6 py-3 font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transform transition-all duration-300 disabled:opacity-50"
              disabled={isLoading}
            >
              CANCEL
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white border-2 border-black px-6 py-3 font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!memberAddress.trim() || !isValidEthereumAddress(memberAddress) || isLoading}
            >
              {isLoading ? 'ADDING...' : 'ADD MEMBER'}
            </button>
          </div>
        </div>

        {/* Comic panel corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-l-4 border-t-4 border-black"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-r-4 border-t-4 border-black"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-l-4 border-b-4 border-black"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-r-4 border-b-4 border-black"></div>
      </div>
    </div>
  );
};
