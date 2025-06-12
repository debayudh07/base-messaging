"use client";
import { useState, useEffect, useCallback } from "react";
import { useXMTPClient } from "./useXMTPClient";
import type { GroupChat, GroupMessage } from "../types";

export const useGroupChats = () => {
  const {
    groupConversations,
    createGroup: createXMTPGroup,
    sendGroupMessage: sendXMTPMessage,
    getGroupMessages: getXMTPMessages,
    addMemberToGroup: addXMTPMember,
    leaveGroup: leaveXMTPGroup,
    streamGroupMessages,
    error: xmtpError,
    setError,
  } = useXMTPClient();
  const [groups, setGroups] = useState<GroupChat[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GroupChat | null>(null);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  const loadGroupMessages = useCallback(async (groupId: string) => {
    setIsLoadingMessages(true);
    try {
      const groupMessages = await getXMTPMessages(groupId);
      setMessages(groupMessages);
    } catch (err) {
      console.error("Error loading messages:", err);
      setError("Failed to load messages");
    } finally {
      setIsLoadingMessages(false);
    }
  }, [getXMTPMessages, setError]);

  // Convert XMTP groups to our GroupChat format
  useEffect(() => {
    if (groupConversations.length > 0) {
      const formattedGroups: GroupChat[] = groupConversations.map(group => ({
        id: group.id || group.topic,
        name: (group as any).groupName || (group as any).name || `Group ${(group.id || group.topic).slice(0, 8)}`,
        description: (group as any).groupDescription || (group as any).description || "XMTP Group Chat",
        members: (group as any).groupMembers || (group as any).members || [],
        creatorAddress: (group as any).createdBy || "",
        createdAt: new Date((group as any).createdAt || Date.now()),
        isActive: true,
        maxMembers: 50, // XMTP default
        xmtpGroup: group,
      }));
      setGroups(formattedGroups);
    }
  }, [groupConversations]);

  // Load messages when group is selected
  useEffect(() => {
    if (selectedGroup) {
      loadGroupMessages(selectedGroup.id);
      
      // Set up message streaming
      const cleanup = streamGroupMessages(selectedGroup.id, (newMessage) => {
        setMessages(prev => [...prev, newMessage]);
      });

      return cleanup;
    }
  }, [selectedGroup, loadGroupMessages, streamGroupMessages]);

  const createGroup = async (groupData: {
    name: string;
    description: string;
    members: string[];
    maxMembers: number;
  }) => {
    try {
      const newGroup = await createXMTPGroup(groupData);
      if (newGroup) {
        setGroups(prev => [...prev, newGroup]);
        setSelectedGroup(newGroup);
      }
    } catch (err) {
      console.error("Error creating group:", err);
      throw err;
    }
  };

  const sendMessage = async (groupId: string, message: string) => {
    try {
      await sendXMTPMessage(groupId, message);
      // Message will be added via streaming
    } catch (err) {
      console.error("Error sending message:", err);
      throw err;
    }
  };

  const addMember = async (groupId: string, memberAddress: string) => {
    try {
      await addXMTPMember(groupId, memberAddress);
      
      // Update local group state
      setGroups(prev => prev.map(group => 
        group.id === groupId 
          ? { ...group, members: [...group.members, memberAddress] }
          : group
      ));
    } catch (err) {
      console.error("Error adding member:", err);
      throw err;
    }
  };

  const leaveGroup = async (groupId: string) => {
    try {
      await leaveXMTPGroup(groupId);
      
      // Update local state
      setGroups(prev => prev.filter(group => group.id !== groupId));
      if (selectedGroup?.id === groupId) {
        setSelectedGroup(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Error leaving group:", err);
      throw err;
    }
  };

  const selectGroup = (group: GroupChat) => {
    setSelectedGroup(group);
    setMessages([]); // Clear previous messages
  };
  return {
    groups,
    selectedGroup,
    messages,
    isLoadingMessages,
    isCreateModalOpen,
    isAddMemberModalOpen,
    error: xmtpError,
    createGroup,
    sendMessage,
    addMember,
    leaveGroup,
    selectGroup,
    setIsCreateModalOpen,
    setIsAddMemberModalOpen,
    setError,
  };
};