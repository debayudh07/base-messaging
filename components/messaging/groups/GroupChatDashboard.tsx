"use client";
import React from 'react';
import { GroupList } from './GroupList';
import { GroupChatArea } from './GroupChatArea';
import { CreateGroupModal } from './CreateGroupModal';
import type { GroupChat, GroupMessage } from '../../../lib/types';

interface GroupChatDashboardProps {
  groups: GroupChat[];
  selectedGroup: GroupChat | null;
  onSelectGroup: (group: GroupChat) => void;
  onCreateGroup: (groupData: {
    name: string;
    description: string;
    members: string[];
    maxMembers: number;
  }) => Promise<void>;
  onSendMessage: (groupId: string, message: string) => Promise<void>;
  onLeaveGroup: (groupId: string) => Promise<void>;
  onAddMember: (groupId: string) => void;
  isCreateModalOpen: boolean;
  onOpenCreateModal: () => void;
  onCloseCreateModal: () => void;
  messages: GroupMessage[];
  isLoadingMessages: boolean;
  error: string | null;
  currentUserAddress: string;
}

export const GroupChatDashboard: React.FC<GroupChatDashboardProps> = ({
  groups,
  selectedGroup,
  onSelectGroup,
  onCreateGroup,
  onSendMessage,
  onLeaveGroup,
  onAddMember,
  isCreateModalOpen,
  onOpenCreateModal,
  onCloseCreateModal,
  messages,
  isLoadingMessages,
  error,
  currentUserAddress,
}) => {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Group List */}
      <div className="col-span-12 md:col-span-4">
        <GroupList
          groups={groups}
          selectedGroup={selectedGroup}
          onSelectGroup={onSelectGroup}
          onCreateGroup={onOpenCreateModal}
          currentUserAddress={currentUserAddress}
        />
      </div>

      {/* Group Chat Area */}
      <div className="col-span-12 md:col-span-8">
        <GroupChatArea
          selectedGroup={selectedGroup}
          currentUserAddress={currentUserAddress}
          onSendMessage={onSendMessage}
          onLeaveGroup={onLeaveGroup}
          onAddMember={onAddMember}
          messages={messages}
          isLoadingMessages={isLoadingMessages}
          error={error}
        />
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={onCloseCreateModal}
        onCreateGroup={onCreateGroup}
        error={error}
      />
    </div>
  );
};
