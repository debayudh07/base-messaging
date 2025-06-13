"use client";
import React from 'react';
import { AgentList } from './AgentList';
import { AgentChatArea } from './AgentChatArea';
import { CreateAgentModal } from './CreateAgentModal';
import type { AIAgent, AgentMessage } from '../../../lib/types';

interface AgentDashboardProps {
  agents: AIAgent[];
  selectedAgent: AIAgent | null;
  onSelectAgent: (agent: AIAgent) => void;
  onCreateAgent: (agentData: {
    name: string;
    description: string;
    role: string;
    capabilities: string[];
    chainId?: number;
    contractAddress?: string;
    apiEndpoint?: string;
  }) => Promise<void>;
  onSendMessage: (agentId: string, message: string) => Promise<void>;
  onDisconnectAgent: (agentId: string) => Promise<void>;
  isCreateModalOpen: boolean;
  onOpenCreateModal: () => void;
  onCloseCreateModal: () => void;
  messages: AgentMessage[];
  isLoadingMessages: boolean;
  error: string | null;
  currentUserAddress: string;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({
  agents,
  selectedAgent,
  onSelectAgent,
  onCreateAgent,
  onSendMessage,
  onDisconnectAgent,
  isCreateModalOpen,
  onOpenCreateModal,
  onCloseCreateModal,
  messages,
  isLoadingMessages,
  error,
  currentUserAddress,
}) => {
  return (    <div className="grid grid-cols-12 gap-6">
      {/* Agent List */}
      <div className="col-span-12 md:col-span-3">
        <AgentList
          agents={agents}
          selectedAgent={selectedAgent}
          onSelectAgent={onSelectAgent}
          onCreateAgent={onOpenCreateModal}
          currentUserAddress={currentUserAddress}
        />
      </div>

      {/* Agent Chat Area */}
      <div className="col-span-12 md:col-span-9">
        <AgentChatArea
          selectedAgent={selectedAgent}
          currentUserAddress={currentUserAddress}
          onSendMessage={onSendMessage}
          onDisconnectAgent={onDisconnectAgent}
          messages={messages}
          isLoadingMessages={isLoadingMessages}
          error={error}
        />
      </div>

      {/* Create Agent Modal */}
      <CreateAgentModal
        isOpen={isCreateModalOpen}
        onClose={onCloseCreateModal}
        onCreateAgent={onCreateAgent}
        error={error}
      />
    </div>
  );
};
