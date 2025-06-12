"use client";
import React, { useState } from 'react';
import { 
  FiX, 
  FiUserPlus, 
  FiTrash2,
  FiUsers, 
  FiCopy
} from 'react-icons/fi';

// Helper function to shorten Ethereum addresses for display
const shortenAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Utility function to validate Ethereum addresses
const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (groupData: {
    name: string;
    description: string;
    members: string[];
    maxMembers: number;
  }) => Promise<void>;
  error: string | null;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onCreateGroup,
  error,
}) => {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [maxMembers, setMaxMembers] = useState(10);
  const [memberAddress, setMemberAddress] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddMember = () => {
    if (!memberAddress.trim()) return;

    if (!isValidEthereumAddress(memberAddress)) {
      return;
    }

    if (members.includes(memberAddress.toLowerCase())) {
      return;
    }

    if (members.length >= maxMembers - 1) { // -1 for the creator
      return;
    }

    setMembers([...members, memberAddress.toLowerCase()]);
    setMemberAddress("");
  };

  const handleRemoveMember = (address: string) => {
    setMembers(members.filter(member => member !== address));
  };

  const handleSubmit = async () => {
    if (!groupName.trim() || !groupDescription.trim()) return;

    try {
      setIsLoading(true);
      await onCreateGroup({
        name: groupName,
        description: groupDescription,
        members,
        maxMembers,
      });
      
      // Reset form
      setGroupName("");
      setGroupDescription("");
      setMembers([]);
      setMemberAddress("");
      setMaxMembers(10);
      onClose();    } catch {
      // Error is handled by parent component
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setGroupName("");
    setGroupDescription("");
    setMembers([]);
    setMemberAddress("");
    setMaxMembers(10);
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
      <div className="relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto transform hover:scale-105 transition-transform duration-300">
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
                <h2 className="font-black text-xl text-black tracking-wider transform -skew-x-6 flex items-center gap-2">
                  <FiUsers className="text-blue-600" />
                  <span className="skew-x-6">CREATE GROUP CHAT</span>
                </h2>
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

          {/* Group Info Section */}
          <div className="mb-6">
            <div className="bg-gray-900 text-white px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
              <h3 className="font-black text-lg tracking-wider">📝 GROUP DETAILS</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="groupName" className="block font-bold text-black mb-2">Group Name</label>
                <input
                  type="text"
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name..."
                  className="w-full border-2 border-black py-3 px-4 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:scale-105 transform transition-all duration-300"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="groupDescription" className="block font-bold text-black mb-2">Description</label>
                <textarea
                  id="groupDescription"
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  placeholder="Enter group description..."
                  rows={3}
                  className="w-full border-2 border-black py-3 px-4 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:scale-105 transform transition-all duration-300 resize-none"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="maxMembers" className="block font-bold text-black mb-2">Max Members</label>
                <input
                  type="number"
                  id="maxMembers"
                  value={maxMembers}
                  onChange={(e) => setMaxMembers(Math.max(2, Math.min(50, parseInt(e.target.value) || 2)))}
                  min="2"
                  max="50"
                  className="w-full border-2 border-black py-3 px-4 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:scale-105 transform transition-all duration-300"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Add Members Section */}
          <div className="mb-6">
            <div className="bg-gray-900 text-white px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
              <h3 className="font-black text-lg tracking-wider">👥 ADD MEMBERS ({members.length}/{maxMembers - 1})</h3>
            </div>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={memberAddress}
                onChange={(e) => setMemberAddress(e.target.value)}
                placeholder="0x... Ethereum address"
                className="flex-1 border-2 border-black py-3 px-4 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:scale-105 transform transition-all duration-300"
                disabled={isLoading || members.length >= maxMembers - 1}
              />
              <button
                onClick={handleAddMember}
                className="bg-blue-600 text-white border-2 border-black px-4 py-3 font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!memberAddress.trim() || !isValidEthereumAddress(memberAddress) || members.includes(memberAddress.toLowerCase()) || members.length >= maxMembers - 1 || isLoading}
              >
                <FiUserPlus size={20} />
              </button>
            </div>

            {memberAddress && !isValidEthereumAddress(memberAddress) && (
              <div className="bg-red-100 border-2 border-red-500 p-2 mb-4">
                <p className="text-red-700 font-bold text-sm">❌ Invalid Ethereum address</p>
              </div>
            )}

            {/* Members List */}
            {members.length > 0 && (
              <div className="bg-gray-100 border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] max-h-40 overflow-y-auto">
                <h4 className="font-black text-black mb-3">Added Members:</h4>
                <div className="space-y-2">
                  {members.map((member, index) => (
                    <div key={member} className="flex items-center justify-between bg-white border border-black p-2 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <span className="font-bold text-sm">{shortenAddress(member)}</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(member)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Copy address"
                        >
                          <FiCopy size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(member)}
                        className="bg-red-500 text-white p-1 rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transform transition-all duration-300"
                        disabled={isLoading}
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
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
              className="bg-blue-600 text-white border-2 border-black px-6 py-3 font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!groupName.trim() || !groupDescription.trim() || isLoading}
            >
              {isLoading ? 'CREATING...' : 'CREATE GROUP'}
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
                <span className="font-bold text-xs">POW!</span>
              </div>            </div>
          </div>
        );
      };
