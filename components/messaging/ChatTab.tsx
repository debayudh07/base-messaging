"use client";
import React from 'react';
import { ConversationList } from './ConversationList';
import { MessageArea } from './MessageArea';
import type { Conversation } from '../../lib/types';

interface ChatTabProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onStartCall: (peerAddress: string) => void;
  onNewConversation: () => void;
}

export const ChatTab: React.FC<ChatTabProps> = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  onStartCall,
  onNewConversation,
}) => {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Conversation List */}
      <div className="col-span-12 md:col-span-4">
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={onSelectConversation}
          onStartCall={onStartCall}
          onNewConversation={onNewConversation}
        />
      </div>

      {/* Message Area */}
      <div className="col-span-12 md:col-span-8">
        <MessageArea
          selectedConversation={selectedConversation}
          onStartCall={onStartCall}
          onNewConversation={onNewConversation}
        />
      </div>
    </div>
  );
};
