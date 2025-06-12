"use client";
import React, { useState } from 'react';
import { FiX, FiBox, FiPlus, FiCode, FiTrash2 } from 'react-icons/fi';

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAgent: (agentData: {
    name: string;
    description: string;
    role: string;
    capabilities: string[];
    chainId?: number;
    contractAddress?: string;
    apiEndpoint?: string;
  }) => Promise<void>;
  error: string | null;
}

export const CreateAgentModal: React.FC<CreateAgentModalProps> = ({
  isOpen,
  onClose,
  onCreateAgent,
  error,
}) => {
  const [agentName, setAgentName] = useState("");
  const [agentDescription, setAgentDescription] = useState("");
  const [role, setRole] = useState("finance");
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [currentCapability, setCurrentCapability] = useState("");
  const [chainId, setChainId] = useState<number | undefined>(1); // Ethereum Mainnet as default
  const [contractAddress, setContractAddress] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddCapability = () => {
    if (!currentCapability.trim()) return;
    
    setCapabilities([...capabilities, currentCapability]);
    setCurrentCapability("");
  };

  const handleRemoveCapability = (index: number) => {
    setCapabilities(capabilities.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!agentName.trim() || !agentDescription.trim() || capabilities.length === 0) return;

    try {
      setIsLoading(true);
      await onCreateAgent({
        name: agentName,
        description: agentDescription,
        role,
        capabilities,
        chainId,
        contractAddress: contractAddress.trim() || undefined,
        apiEndpoint: apiEndpoint.trim() || undefined,
      });
      
      // Reset form
      setAgentName("");
      setAgentDescription("");
      setRole("finance");
      setCapabilities([]);
      setCurrentCapability("");
      setChainId(1);
      setContractAddress("");
      setApiEndpoint("");
      onClose();
    } catch {
      // Error is handled by parent component
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setAgentName("");
    setAgentDescription("");
    setRole("finance");
    setCapabilities([]);
    setCurrentCapability("");
    setChainId(1);
    setContractAddress("");
    setApiEndpoint("");
    onClose();
  };

  const getRoleEmoji = (role: string) => {
    switch (role) {
      case 'finance':
        return '💰';
      case 'nft':
        return '🖼️';
      case 'defi':
        return '📊';
      case 'governance':
        return '⚖️';
      case 'gaming':
        return '🎮';
      default:
        return '🤖';
    }
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
                <h2 className="font-black text-lg text-black tracking-wider transform -skew-x-6 flex items-center gap-2">
                  <FiBox className="text-blue-600" />
                  <span className="skew-x-6">CREATE AI AGENT</span>
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

          {/* Agent Info Section */}
          <div className="mb-6">
            <div className="bg-gray-900 text-white px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
              <h3 className="font-black text-lg tracking-wider">📝 AGENT DETAILS</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="agentName" className="block font-bold text-black mb-2">
                  Agent Name
                </label>
                <input
                  type="text"
                  id="agentName"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="Enter agent name..."
                  className="w-full border-2 border-black py-3 px-4 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:scale-105 transform transition-all duration-300"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="agentDescription" className="block font-bold text-black mb-2">
                  Description
                </label>
                <textarea
                  id="agentDescription"
                  value={agentDescription}
                  onChange={(e) => setAgentDescription(e.target.value)}
                  placeholder="Enter agent description..."
                  rows={3}
                  className="w-full border-2 border-black py-3 px-4 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:scale-105 transform transition-all duration-300 resize-none"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="role" className="block font-bold text-black mb-2">
                  Agent Role
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['finance', 'nft', 'defi', 'governance', 'gaming', 'other'].map((roleOption) => (
                    <button
                      key={roleOption}
                      type="button"
                      onClick={() => setRole(roleOption)}
                      className={`
                        border-2 border-black p-3 font-bold
                        flex items-center justify-center gap-2
                        shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                        transition-all hover:scale-105
                        ${role === roleOption ? 'bg-blue-600 text-white' : 'bg-white text-black'}
                      `}
                      disabled={isLoading}
                    >
                      {getRoleEmoji(roleOption)} {roleOption.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Capabilities Section */}
          <div className="mb-6">
            <div className="bg-gray-900 text-white px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
              <h3 className="font-black text-lg tracking-wider">🔧 AGENT CAPABILITIES</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentCapability}
                  onChange={(e) => setCurrentCapability(e.target.value)}
                  placeholder="Enter capability (e.g. Price Tracking)"
                  className="flex-1 border-2 border-black py-3 px-4 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:scale-105 transform transition-all duration-300"
                  disabled={isLoading}
                />
                <button
                  onClick={handleAddCapability}
                  type="button"
                  className="bg-blue-600 text-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transform transition-all duration-300 disabled:opacity-50"
                  disabled={!currentCapability.trim() || isLoading}
                >
                  <FiPlus size={24} />
                </button>
              </div>

              {capabilities.length > 0 ? (
                <div className="border-2 border-black p-3">
                  <h4 className="font-bold mb-2">Added Capabilities:</h4>
                  <div className="space-y-2">
                    {capabilities.map((capability, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-100 p-2 border border-black">
                        <div className="flex items-center gap-2">
                          <FiCode />
                          <span>{capability}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveCapability(index)}
                          className="text-red-500 hover:text-red-700"
                          disabled={isLoading}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center p-4 border-2 border-dashed border-gray-400">
                  <p className="text-gray-500">No capabilities added yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Technical Details Section */}
          <div className="mb-6">
            <div className="bg-gray-900 text-white px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
              <h3 className="font-black text-lg tracking-wider">⚙️ TECHNICAL DETAILS (OPTIONAL)</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="chainId" className="block font-bold text-black mb-2">
                  Blockchain
                </label>
                <select
                  id="chainId"
                  value={chainId || ""}
                  onChange={(e) => setChainId(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full border-2 border-black py-3 px-4 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:scale-105 transform transition-all duration-300"
                  disabled={isLoading}
                >
                  <option value="1">Ethereum Mainnet</option>
                  <option value="42161">Arbitrum</option>
                  <option value="10">Optimism</option>
                  <option value="137">Polygon</option>
                  <option value="8453">Base</option>
                  <option value="56">BNB Chain</option>
                  <option value="">Off-chain</option>
                </select>
              </div>

              <div>
                <label htmlFor="contractAddress" className="block font-bold text-black mb-2">
                  Contract Address (if applicable)
                </label>
                <input
                  type="text"
                  id="contractAddress"
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full border-2 border-black py-3 px-4 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:scale-105 transform transition-all duration-300"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="apiEndpoint" className="block font-bold text-black mb-2">
                  API Endpoint (if applicable)
                </label>
                <input
                  type="text"
                  id="apiEndpoint"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  placeholder="https://..."
                  className="w-full border-2 border-black py-3 px-4 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:scale-105 transform transition-all duration-300"
                  disabled={isLoading}
                />
              </div>
            </div>
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
              disabled={!agentName.trim() || !agentDescription.trim() || capabilities.length === 0 || isLoading}
            >
              {isLoading ? 'CREATING...' : 'CREATE AGENT'}
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
          <span className="font-bold text-xs">AI!</span>
        </div>
      </div>
    </div>
  );
};
