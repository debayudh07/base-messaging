"use client";
import React from 'react';
import { FiCalendar, FiActivity, FiTool, FiBox } from 'react-icons/fi';
import type { AIAgent } from '../../../lib/types';

interface AgentListProps {
  agents: AIAgent[];
  selectedAgent: AIAgent | null;
  onSelectAgent: (agent: AIAgent) => void;
  onCreateAgent: () => void;
  currentUserAddress: string;
}

export const AgentList: React.FC<AgentListProps> = ({
  agents,
  selectedAgent,
  onSelectAgent,
  onCreateAgent,
  currentUserAddress,
}) => {
  const getAgentStatusText = (agent: AIAgent) => {
    return agent.isActive ? 'ACTIVE' : 'INACTIVE';
  };

  const getAgentStatusColor = (agent: AIAgent) => {
    return agent.isActive ? 'bg-green-500' : 'bg-gray-500';
  };

  const getAgentRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'finance':
        return 'text-green-600';
      case 'nft':
        return 'text-purple-600';
      case 'defi':
        return 'text-blue-600';
      case 'governance':
        return 'text-orange-600';
      case 'gaming':
        return 'text-pink-600';
      default:
        return 'text-gray-600';
    }
  };

  const getAgentEmoji = (role: string) => {
    switch (role.toLowerCase()) {
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

  return (
    <div className="relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
      {/* Comic panel border effect */}
      <div className="absolute -top-2 -left-2 w-full h-full bg-gray-800 -z-10"></div>
      
      <div className="bg-gray-900 text-white p-4 border-b-4 border-black relative z-10">
        <div className="flex justify-between items-center">
          <div className="relative">
            <div className="bg-white border-2 border-black rounded-xl p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="font-black text-lg text-black tracking-wider transform -skew-x-6 flex items-center gap-2">
                <FiBox className="text-blue-600" />
                <span className="skew-x-6">AI AGENTS</span>
              </h2>
            </div>
          </div>
          <button
            onClick={onCreateAgent}
            className="bg-white text-black border-2 border-black p-2 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transform transition-all duration-300"
            title="Create new agent"
          >
            <FiBox size={18} />
          </button>
        </div>
      </div>

      <div className="divide-y-4 divide-black max-h-[50vh] overflow-y-auto bg-white">
        {agents.length === 0 ? (
          <div className="p-8 text-center relative">
            {/* Speed lines background */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
              <div className="absolute top-0 left-1/4 w-px h-full bg-black transform -rotate-12 animate-pulse"></div>
              <div className="absolute top-0 right-1/4 w-px h-full bg-black transform rotate-12 animate-pulse"></div>
            </div>
            
            <FiBox className="mx-auto mb-4 text-blue-600 animate-bounce" size={40} />
            
            <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
              <p className="font-black text-black text-lg">NO AGENTS YET</p>
            </div>
            
            <div className="bg-gray-900 text-white px-4 py-2 border-2 border-black transform -skew-x-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
              <p className="text-sm font-bold tracking-wider transform skew-x-3">🎯 CREATE YOUR FIRST ONCHAIN AI AGENT</p>
            </div>
            
            <button
              onClick={onCreateAgent}
              className="bg-white border-3 border-black px-6 py-3 font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform hover:scale-105 transition-all duration-300"
            >
              ✨ CREATE AGENT
            </button>
          </div>
        ) : (
          agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => onSelectAgent(agent)}
              className={`w-full text-left p-4 transition-all duration-300 transform hover:scale-[1.02] border-b-2 border-black relative ${
                selectedAgent?.id === agent.id
                  ? "bg-gray-900 text-white border-l-8 border-l-blue-600"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              {/* Action lines for selected agent */}
              {selectedAgent?.id === agent.id && (
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-px bg-white transform rotate-12 animate-pulse"></div>
                  <div className="absolute bottom-0 right-0 w-full h-px bg-white transform -rotate-12 animate-pulse"></div>
                </div>
              )}
              
              <div className="flex items-start justify-between relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-lg border-2 border-black flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {getAgentEmoji(agent.role)}
                    </div>
                    <div>
                      <h3 className="font-black text-lg">
                        {agent.name}
                      </h3>
                      <p className="text-sm font-bold opacity-80 truncate max-w-[200px]">
                        {agent.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <FiActivity size={12} />
                      <span className={getAgentRoleColor(agent.role)}>{agent.role}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiCalendar size={12} />
                      <span>{agent.createdAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiTool size={12} />
                      <span>{agent.capabilities.slice(0, 2).join(', ')}</span>
                    </div>
                    <div className={`${getAgentStatusColor(agent)} text-white px-2 py-1 border-2 border-black font-bold text-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]`}>
                      {getAgentStatusText(agent)}
                    </div>
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
