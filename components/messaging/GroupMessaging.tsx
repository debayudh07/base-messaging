"use client";
import React from 'react';
import { useAccount } from 'wagmi';
import { useGroupChats } from '../../lib/hooks/useGroupChats';
import { GroupChatDashboard } from './groups/GroupChatDashboard';

export const GroupMessaging: React.FC = () => {
  const { address } = useAccount();
  const {
    groups,
    selectedGroup,
    messages,
    isLoadingMessages,
    isCreateModalOpen,
    error,
    createGroup,
    sendMessage,
    addMember,
    leaveGroup,
    selectGroup,
    setIsCreateModalOpen,
  } = useGroupChats();

  const handleAddMember = (groupId: string) => {
    const memberAddress = prompt("Enter Ethereum address to add:");
    if (memberAddress) {
      addMember(groupId, memberAddress).catch(err => {
        console.error("Failed to add member:", err);
      });
    }
  };

  return (
    <GroupChatDashboard
      groups={groups}
      selectedGroup={selectedGroup}
      onSelectGroup={selectGroup}
      onCreateGroup={createGroup}
      onSendMessage={sendMessage}
      onLeaveGroup={leaveGroup}
      onAddMember={handleAddMember}
      isCreateModalOpen={isCreateModalOpen}
      onOpenCreateModal={() => setIsCreateModalOpen(true)}
      onCloseCreateModal={() => setIsCreateModalOpen(false)}
      messages={messages}
      isLoadingMessages={isLoadingMessages}
      error={error}
      currentUserAddress={address || ""}
    />
  );
};