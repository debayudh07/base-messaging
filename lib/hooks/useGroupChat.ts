"use client";
import { useState, useCallback, useEffect } from 'react';
import type { GroupChat, GroupMessage } from '../types';

interface UseGroupChatReturn {
  groups: GroupChat[];
  selectedGroup: GroupChat | null;
  groupMessages: GroupMessage[];
  isLoadingGroups: boolean;
  isLoadingMessages: boolean;
  error: string | null;
  createGroup: (groupData: {
    name: string;
    description: string;
    members: string[];
    maxMembers: number;
  }) => Promise<void>;
  joinGroup: (groupId: string) => Promise<void>;
  leaveGroup: (groupId: string) => Promise<void>;
  sendMessage: (groupId: string, message: string) => Promise<void>;
  selectGroup: (group: GroupChat | null) => void;
  addMember: (groupId: string, memberAddress: string) => Promise<void>;
  removeMember: (groupId: string, memberAddress: string) => Promise<void>;
  loadGroups: () => Promise<void>;
  loadMessages: (groupId: string) => Promise<void>;
}

const GROUP_STORAGE_KEY = 'anime_gaming_hub_groups';
const MESSAGES_STORAGE_KEY = 'anime_gaming_hub_group_messages';

export const useGroupChat = (userAddress?: string): UseGroupChatReturn => {
  const [groups, setGroups] = useState<GroupChat[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GroupChat | null>(null);
  const [groupMessages, setGroupMessages] = useState<GroupMessage[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load groups from localStorage on component mount
  useEffect(() => {
    loadGroups();
  }, []);

  // Load messages when a group is selected
  useEffect(() => {
    if (selectedGroup) {
      loadMessages(selectedGroup.id);
    }
  }, [selectedGroup]);

  const loadGroups = useCallback(async (): Promise<void> => {
    try {
      setIsLoadingGroups(true);
      setError(null);
      
      // Load groups from localStorage
      const storedGroups = localStorage.getItem(GROUP_STORAGE_KEY);
      if (storedGroups) {
        const parsedGroups = JSON.parse(storedGroups).map((group: any) => ({
          ...group,
          createdAt: new Date(group.createdAt)
        }));
        
        // Filter groups where user is a member
        const userGroups = userAddress 
          ? parsedGroups.filter((group: GroupChat) => 
              group.members.includes(userAddress) && group.isActive
            )
          : [];
        
        setGroups(userGroups);
      } else {
        setGroups([]);
      }
    } catch (err) {
      console.error('Error loading groups:', err);
      setError('Failed to load groups');
    } finally {
      setIsLoadingGroups(false);
    }
  }, [userAddress]);

  const loadMessages = useCallback(async (groupId: string): Promise<void> => {
    try {
      setIsLoadingMessages(true);
      setError(null);
      
      // Load messages from localStorage
      const storedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages).map((msg: any) => ({
          ...msg,
          sent: new Date(msg.sent)
        }));
        
        // Filter messages for the selected group
        const groupMsgs = parsedMessages
          .filter((msg: GroupMessage) => msg.groupId === groupId)
          .sort((a: GroupMessage, b: GroupMessage) => a.sent.getTime() - b.sent.getTime());
        
        setGroupMessages(groupMsgs);
      } else {
        setGroupMessages([]);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  const saveGroups = useCallback((updatedGroups: GroupChat[]) => {
    try {
      localStorage.setItem(GROUP_STORAGE_KEY, JSON.stringify(updatedGroups));
    } catch (err) {
      console.error('Error saving groups:', err);
    }
  }, []);

  const saveMessages = useCallback((updatedMessages: GroupMessage[]) => {
    try {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updatedMessages));
    } catch (err) {
      console.error('Error saving messages:', err);
    }
  }, []);

  const createGroup = useCallback(async (groupData: {
    name: string;
    description: string;
    members: string[];
    maxMembers: number;
  }): Promise<void> => {
    try {
      setError(null);
      
      if (!userAddress) {
        throw new Error('User address is required to create a group');
      }

      // Validate Ethereum addresses
      const validMembers = groupData.members.filter(address => 
        /^0x[a-fA-F0-9]{40}$/.test(address) && address.toLowerCase() !== userAddress.toLowerCase()
      );

      const newGroup: GroupChat = {
        id: `group-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: groupData.name.trim(),
        description: groupData.description.trim(),
        creatorAddress: userAddress,
        members: [userAddress, ...validMembers],
        maxMembers: groupData.maxMembers,
        createdAt: new Date(),
        isActive: true
      };

      // Load existing groups
      const storedGroups = localStorage.getItem(GROUP_STORAGE_KEY);
      const existingGroups = storedGroups ? JSON.parse(storedGroups) : [];
      
      // Add new group
      const updatedGroups = [...existingGroups, newGroup];
      saveGroups(updatedGroups);
      
      // Update local state
      await loadGroups();
      
      // Auto-select the newly created group
      setSelectedGroup(newGroup);
      
      // Add welcome message
      const welcomeMessage: GroupMessage = {
          id: `msg-${Date.now()}`,
          content: `Welcome to ${newGroup.name}! 🎉`,
          senderAddress: userAddress,
          groupId: newGroup.id,
          sent: new Date(),
          type: 'message',
          timestamp: new Date()
      };
      
      const storedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
      const existingMessages = storedMessages ? JSON.parse(storedMessages) : [];
      const updatedMessages = [...existingMessages, welcomeMessage];
      saveMessages(updatedMessages);
      
    } catch (err) {
      console.error('Error creating group:', err);
      setError(err instanceof Error ? err.message : 'Failed to create group');
      throw err;
    }
  }, [userAddress, loadGroups, saveGroups, saveMessages]);

  const joinGroup = useCallback(async (groupId: string): Promise<void> => {
    try {
      setError(null);
      
      if (!userAddress) {
        throw new Error('User address is required to join a group');
      }

      // Load existing groups
      const storedGroups = localStorage.getItem(GROUP_STORAGE_KEY);
      if (!storedGroups) return;
      
      const existingGroups = JSON.parse(storedGroups);
      const groupIndex = existingGroups.findIndex((g: GroupChat) => g.id === groupId);
      
      if (groupIndex === -1) {
        throw new Error('Group not found');
      }
      
      const group = existingGroups[groupIndex];
      
      // Check if user is already a member
      if (group.members.includes(userAddress)) {
        return;
      }
      
      // Check if group is full
      if (group.members.length >= group.maxMembers) {
        throw new Error('Group is full');
      }
      
      // Add user to group
      group.members.push(userAddress);
      saveGroups(existingGroups);
      
      // Reload groups
      await loadGroups();
      
      // Add join message
      const joinMessage: GroupMessage = {
          id: `msg-${Date.now()}`,
          content: `${userAddress} joined the group`,
          senderAddress: userAddress,
          groupId: groupId,
          sent: new Date(),
          type: 'join',
          timestamp: new Date()
      };
      
      const storedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
      const existingMessages = storedMessages ? JSON.parse(storedMessages) : [];
      const updatedMessages = [...existingMessages, joinMessage];
      saveMessages(updatedMessages);
      
    } catch (err) {
      console.error('Error joining group:', err);
      setError(err instanceof Error ? err.message : 'Failed to join group');
      throw err;
    }
  }, [userAddress, loadGroups, saveGroups, saveMessages]);

  const leaveGroup = useCallback(async (groupId: string): Promise<void> => {
    try {
      setError(null);
      
      if (!userAddress) {
        throw new Error('User address is required to leave a group');
      }

      // Load existing groups
      const storedGroups = localStorage.getItem(GROUP_STORAGE_KEY);
      if (!storedGroups) return;
      
      const existingGroups = JSON.parse(storedGroups);
      const groupIndex = existingGroups.findIndex((g: GroupChat) => g.id === groupId);
      
      if (groupIndex === -1) {
        throw new Error('Group not found');
      }
      
      const group = existingGroups[groupIndex];
      
      // Remove user from group
      group.members = group.members.filter((member: string) => member !== userAddress);
      
      // If creator leaves and there are other members, transfer ownership
      if (group.creatorAddress === userAddress && group.members.length > 0) {
        group.creatorAddress = group.members[0];
      }
      
      // If no members left, deactivate group
      if (group.members.length === 0) {
        group.isActive = false;
      }
      
      saveGroups(existingGroups);
      
      // Clear selected group if user left it
      if (selectedGroup?.id === groupId) {
        setSelectedGroup(null);
      }
      
      // Reload groups
      await loadGroups();
      
      // Add leave message
      const leaveMessage: GroupMessage = {
          id: `msg-${Date.now()}`,
          content: `${userAddress} left the group`,
          senderAddress: userAddress,
          groupId: groupId,
          sent: new Date(),
          type: 'leave',
          timestamp: new Date()
      };
      
      const storedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
      const existingMessages = storedMessages ? JSON.parse(storedMessages) : [];
      const updatedMessages = [...existingMessages, leaveMessage];
      saveMessages(updatedMessages);
      
    } catch (err) {
      console.error('Error leaving group:', err);
      setError(err instanceof Error ? err.message : 'Failed to leave group');
      throw err;
    }
  }, [userAddress, selectedGroup, loadGroups, saveGroups, saveMessages]);

  const sendMessage = useCallback(async (groupId: string, message: string): Promise<void> => {
    try {
      setError(null);
      
      if (!userAddress) {
        throw new Error('User address is required to send a message');
      }

      if (!message.trim()) {
        throw new Error('Message cannot be empty');
      }

      const newMessage: GroupMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        content: message.trim(),
        senderAddress: userAddress,
        groupId: groupId,
        sent: new Date(),
        timestamp: new Date(),
        type: 'message'
      };

      // Load existing messages
      const storedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
      const existingMessages = storedMessages ? JSON.parse(storedMessages) : [];
      
      // Add new message
      const updatedMessages = [...existingMessages, newMessage];
      saveMessages(updatedMessages);
      
      // If the message is for the currently selected group, update the UI
      if (selectedGroup?.id === groupId) {
        await loadMessages(groupId);
      }
      
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
      throw err;
    }
  }, [userAddress, selectedGroup, loadMessages, saveMessages]);

  const selectGroup = useCallback((group: GroupChat | null) => {
    setSelectedGroup(group);
    if (group) {
      loadMessages(group.id);
    } else {
      setGroupMessages([]);
    }
  }, [loadMessages]);

  const addMember = useCallback(async (groupId: string, memberAddress: string): Promise<void> => {
    try {
      setError(null);
      
      if (!userAddress) {
        throw new Error('User address is required');
      }

      // Validate Ethereum address
      if (!/^0x[a-fA-F0-9]{40}$/.test(memberAddress)) {
        throw new Error('Invalid Ethereum address');
      }

      // Load existing groups
      const storedGroups = localStorage.getItem(GROUP_STORAGE_KEY);
      if (!storedGroups) return;
      
      const existingGroups = JSON.parse(storedGroups);
      const groupIndex = existingGroups.findIndex((g: GroupChat) => g.id === groupId);
      
      if (groupIndex === -1) {
        throw new Error('Group not found');
      }
      
      const group = existingGroups[groupIndex];
      
      // Check if user is group creator
      if (group.creatorAddress !== userAddress) {
        throw new Error('Only group creator can add members');
      }
      
      // Check if member is already in group
      if (group.members.includes(memberAddress)) {
        throw new Error('User is already a member');
      }
      
      // Check if group is full
      if (group.members.length >= group.maxMembers) {
        throw new Error('Group is full');
      }
      
      // Add member
      group.members.push(memberAddress);
      saveGroups(existingGroups);
      
      // Reload groups
      await loadGroups();
      
    } catch (err) {
      console.error('Error adding member:', err);
      setError(err instanceof Error ? err.message : 'Failed to add member');
      throw err;
    }
  }, [userAddress, loadGroups, saveGroups]);

  const removeMember = useCallback(async (groupId: string, memberAddress: string): Promise<void> => {
    try {
      setError(null);
      
      if (!userAddress) {
        throw new Error('User address is required');
      }

      // Load existing groups
      const storedGroups = localStorage.getItem(GROUP_STORAGE_KEY);
      if (!storedGroups) return;
      
      const existingGroups = JSON.parse(storedGroups);
      const groupIndex = existingGroups.findIndex((g: GroupChat) => g.id === groupId);
      
      if (groupIndex === -1) {
        throw new Error('Group not found');
      }
      
      const group = existingGroups[groupIndex];
      
      // Check if user is group creator
      if (group.creatorAddress !== userAddress) {
        throw new Error('Only group creator can remove members');
      }
      
      // Can't remove creator
      if (memberAddress === group.creatorAddress) {
        throw new Error('Cannot remove group creator');
      }
      
      // Remove member
      group.members = group.members.filter((member: string) => member !== memberAddress);
      saveGroups(existingGroups);
      
      // Reload groups
      await loadGroups();
      
    } catch (err) {
      console.error('Error removing member:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove member');
      throw err;
    }
  }, [userAddress, loadGroups, saveGroups]);

  return {
    groups,
    selectedGroup,
    groupMessages,
    isLoadingGroups,
    isLoadingMessages,
    error,
    createGroup,
    joinGroup,
    leaveGroup,
    sendMessage,
    selectGroup,
    addMember,
    removeMember,
    loadGroups,
    loadMessages
  };
};
