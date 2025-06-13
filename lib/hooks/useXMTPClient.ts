/*eslint-disable*/
"use client";
import { useState, useEffect } from "react";
import { Client } from "@xmtp/xmtp-js";
import { useAccount, useSignMessage } from "wagmi";
import type { Conversation, GroupChat, GroupMessage } from "../types";
import { BasenameManager, BasenameConfig } from "../basename";

export const useXMTPClient = () => {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  
  const [client, setClient] = useState<Client | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [groupConversations, setGroupConversations] = useState<any[]>([]);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [basename, setBasename] = useState<string>("");

  const initializeClient = async (basenameConfig?: BasenameConfig): Promise<Client | null> => {
    try {
      setError(null);
      setIsInitializing(true);

      if (!address) {
        throw new Error("No wallet address found");
      }

      if (typeof window === 'undefined') {
        throw new Error("XMTP client must be initialized in browser environment");
      }

      // Generate or get basename
      const userBasename = BasenameManager.getBasename(address, basenameConfig);
      setBasename(userBasename);

      const signer = {
        getAddress: async () => address,
        signMessage: async (message: string) => {
          return signMessageAsync({ message });
        },
      };

      // Create XMTP client with group messaging enabled
      const xmtp = await Client.create(signer, {
        env: "production",
        skipContactPublishing: true,
      });

      setClient(xmtp);

      // Load existing conversations and groups
      const convos = await xmtp.conversations.list();
      setConversations(convos as unknown as Conversation[]);

      // Initialize empty group conversations array
      setGroupConversations([]);

      console.log(`XMTP Client initialized for ${userBasename} (${address})`);

      return xmtp;
    } catch (err) {
      console.error("Error initializing XMTP client:", err);
      setError("Failed to initialize XMTP client. Please try again.");
      return null;
    } finally {
      setIsInitializing(false);
    }
  };

  // Auto-initialize when wallet is connected
  useEffect(() => {
    if (isConnected && address && !client) {
      initializeClient({ useStoredName: true });
    }
  }, [isConnected, address]);

  const updateBasename = (newBasename: string) => {
    if (address) {
      BasenameManager.updateBasename(address, newBasename);
      setBasename(newBasename);
    }
  };

  const startNewConversation = async (recipientAddress: string): Promise<Conversation | null> => {
    if (!client) return null;

    try {
      setError(null);

      // First check if the address is valid
      if (!recipientAddress || recipientAddress.length !== 42 || !recipientAddress.startsWith('0x')) {
        setError("Please enter a valid Ethereum address");
        return null;
      }

      const canMessage = await client.canMessage(recipientAddress);
      if (!canMessage) {
        setError(`The address ${recipientAddress} hasn't enabled XMTP messaging yet. They need to connect their wallet to an XMTP-enabled app first.`);
        return null;
      }

      const conversation = (await client.conversations.newConversation(recipientAddress)) as unknown as Conversation;

      setConversations((prev) => {
        if (!prev.find((c) => c.peerAddress === conversation.peerAddress)) {
          return [...prev, conversation];
        }
        return prev;
      });

      return conversation;
    } catch (err) {
      console.error("Error starting conversation:", err);
      setError("Failed to start conversation");
      return null;
    }
  };

  const checkCanMessage = async (address: string): Promise<boolean> => {
    if (!client) return false;
    
    try {
      return await client.canMessage(address);
    } catch (err) {
      console.error("Error checking if address can message:", err);
      return false;
    }
  };
  const reinitializeClient = async (basenameConfig?: BasenameConfig): Promise<Client | null> => {
    // Clear existing client
    setClient(null);
    setConversations([]);
    setBasename("");
    
    // Reinitialize with new basename config
    return await initializeClient(basenameConfig);
  };const createGroup = async (groupData: {
    name: string;
    description: string;
    members: string[];
    maxMembers: number;
  }): Promise<any | null> => {
    if (!client) return null;

    try {
      setError(null);

      // Validate member addresses
      const validMembers = [];
      for (const member of groupData.members) {
        const canMessage = await client.canMessage(member);
        if (canMessage) {
          validMembers.push(member);
        } else {
          console.warn(`Address ${member} cannot receive XMTP messages`);
        }
      }

      if (validMembers.length === 0) {
        setError("No valid members found. All members must have XMTP enabled.");
        return null;
      }

      // Create conversations with each member to simulate group
      const groupConversations: { streamMessages: () => any; }[] = [];
      
      for (const member of validMembers) {
        try {
          const conversation = await client.conversations.newConversation(member);
            // Send initial group setup message to each member
          await conversation.send(`🎉 You've been added to the group "${groupData.name}"! 
📝 Description: ${groupData.description}
👥 Members: ${validMembers.length + 1} (including creator)
💬 All group messages will be prefixed with [${groupData.name}]
🚀 Start chatting with the group! Messages you send here will go to all members.`);
          groupConversations.push(conversation);
        } catch (err) {
          console.warn(`Failed to create conversation with ${member}:`, err);
        }
      }      // Create a pseudo-group object
      const pseudoGroup = {
        id: `group-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        topic: `group-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: groupData.name,
        description: groupData.description,
        members: validMembers,
        conversations: groupConversations,
        createdBy: address,
        createdAt: Date.now(),
        isGroup: true,
        send: async (message: string) => {
          // Send message to all current conversations
          console.log(`Sending to ${groupConversations.length} group members`);
          const promises = groupConversations.map(async (conv: any) => {
            try {
              await conv.send(`[${groupData.name}] ${message}`);
            } catch (err) {
              console.warn(`Failed to send to one member:`, err);
            }
          });
          await Promise.allSettled(promises);
        },
        messages: async () => {
          // Aggregate messages from all conversations
          const allMessages = [];
          for (const conv of groupConversations) {
            try {
              const messages = await (conv as any).messages();
              allMessages.push(...messages);
            } catch (err) {
              console.warn("Failed to get messages from one conversation:", err);
            }
          }
          // Sort by timestamp
          return allMessages.sort((a, b) => a.sent.getTime() - b.sent.getTime());
        },
        streamMessages: () => {
          // This is a simplified version - in a real implementation,
          // you'd want to merge streams from all conversations
          if (groupConversations.length > 0) {
            return groupConversations[0].streamMessages();
          }
          return {
            [Symbol.asyncIterator]: async function* () {
              // Empty stream
            }
          };
        }
      };

      // Update local state
      setGroupConversations(prev => [...prev, pseudoGroup]);

      return {
        id: pseudoGroup.id,
        name: groupData.name,
        description: groupData.description,
        members: validMembers,
        creatorAddress: address!,
        createdAt: new Date(),
        isActive: true,
        maxMembers: groupData.maxMembers,
        xmtpGroup: pseudoGroup,
      } as GroupChat;
    } catch (err) {
      console.error("Error creating group:", err);
      setError("Failed to create group. Please try again.");
      return null;
    }
  };  const sendGroupMessage = async (groupId: string, message: string): Promise<void> => {
    if (!client) throw new Error("Client not initialized");

    try {
      const group = groupConversations.find(g => g.topic === groupId || g.id === groupId);
      if (!group) {
        throw new Error("Group not found");
      }

      if ((group as any).isGroup && (group as any).conversations) {
        // Send to all conversations in the pseudo-group with current conversations list
        const conversations = (group as any).conversations;
        console.log(`Sending group message to ${conversations.length} members`);
        
        const promises = conversations.map(async (conv: any) => {
          try {
            await conv.send(`[${(group as any).name}] ${message}`);
          } catch (err) {
            console.warn(`Failed to send message to one member:`, err);
          }
        });
        
        await Promise.allSettled(promises); // Use allSettled to continue even if some fail
      } else {
        // Fallback to regular conversation
        await group.send(message);
      }
    } catch (err) {
      console.error("Error sending group message:", err);
      throw new Error("Failed to send message");
    }
  };
  const getGroupMessages = async (groupId: string): Promise<GroupMessage[]> => {
    if (!client) return [];

    try {
      const group = groupConversations.find(g => g.id === groupId || g.topic === groupId);
      if (!group) return [];

      const messages = await group.messages();
      
      return messages.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        senderAddress: msg.senderAddress,
        timestamp: msg.sent || msg.timestamp || new Date(),
        sent: msg.sent || msg.timestamp || new Date(),
        type: 'message',
        groupId,
      }));
    } catch (err) {
      console.error("Error fetching group messages:", err);
      return [];
    }
  };  const addMemberToGroup = async (groupId: string, memberAddress: string): Promise<void> => {
    if (!client) throw new Error("Client not initialized");

    try {
      const group = groupConversations.find(g => g.id === groupId || g.topic === groupId);
      if (!group) {
        throw new Error("Group not found");
      }

      const canMessage = await client.canMessage(memberAddress);
      if (!canMessage) {
        throw new Error("Address cannot receive XMTP messages");
      }

      // Check if member is already in the group
      if ((group as any).members && (group as any).members.includes(memberAddress)) {
        throw new Error("Member is already in the group");
      }

      if ((group as any).isGroup) {
        // Create conversation with new member from group creator's perspective
        const newConversation = await client.conversations.newConversation(memberAddress);
        
        // Send welcome message with group context to new member
        await newConversation.send(`🎉 You've been added to the group "${(group as any).name}"! 
📝 Description: ${(group as any).description}
👥 Members: ${(group as any).members.length + 2} (including you and creator)
💬 All messages will be prefixed with [${(group as any).name}] to identify group messages.
🚀 Start chatting with the group!`);
        
        // Add to conversations array
        if ((group as any).conversations) {
          (group as any).conversations.push(newConversation);
        }
        
        // Update members list
        if ((group as any).members) {
          (group as any).members.push(memberAddress);
        }
        
        // Update the group's send method to include the new conversation
        const allConversations = (group as any).conversations || [];
        (group as any).send = async (message: string) => {
          const promises = allConversations.map((conv: any) => 
            conv.send(`[${(group as any).name}] ${message}`)
          );
          await Promise.all(promises);
        };
        
        // Notify existing members about the new member
        const existingConversations = allConversations.filter((conv: any) => conv !== newConversation);
        const notificationPromises = existingConversations.map((conv: any) => 
          conv.send(`👋 ${memberAddress} has joined the group "${(group as any).name}"! Say hello! 👥`)
        );
        await Promise.all(notificationPromises);

        // Update the local group conversations state
        setGroupConversations(prev => prev.map(g => 
          g.id === groupId || g.topic === groupId ? group : g
        ));
        
      } else {
        console.warn("Adding member to non-group conversation not supported");
      }
    } catch (err) {
      console.error("Error adding member to group:", err);
      throw new Error("Failed to add member");
    }
  };
  const leaveGroup = async (groupId: string): Promise<void> => {
    if (!client) throw new Error("Client not initialized");

    try {
      const group = groupConversations.find(g => g.id === groupId || g.topic === groupId);
      if (!group) {
        throw new Error("Group not found");
      }

      // Check if this is a real group or simulated group
      if (typeof (group as any).removeMembers === 'function') {
        await (group as any).removeMembers([address!]);
      } else {
        // For simulated groups, just remove from local state
        console.warn("Leaving simulated group - XMTP v3 groups not available");
      }
      
      // Update local state
      setGroupConversations(prev => prev.filter(g => g.topic !== groupId && g.id !== groupId));
    } catch (err) {
      console.error("Error leaving group:", err);
      throw new Error("Failed to leave group");
    }
  };
  const streamGroupMessages = (groupId: string, onMessage: (message: GroupMessage) => void) => {
    if (!client) return;

    const group = groupConversations.find(g => g.id === groupId || g.topic === groupId);
    if (!group) return;

    const stream = group.streamMessages();
    
    (async () => {
      for await (const message of stream) {
        const groupMessage: GroupMessage = {
            id: message.id,
            content: message.content,
            senderAddress: message.senderAddress,
            sent: message.sent || message.timestamp || new Date(),
            type: 'message',
            groupId,
            timestamp: message.sent || message.timestamp || new Date()
        };
        onMessage(groupMessage);
      }
    })();

    return () => {
      // Cleanup stream
      stream.return?.();
    };
  };

  return {
    client,
    conversations,
    groupConversations,
    isInitializing,
    error,
    basename,
    initializeClient,
    reinitializeClient,
    startNewConversation,
    checkCanMessage,
    setError,
    updateBasename,
    // Group methods
    createGroup,
    sendGroupMessage,
    getGroupMessages,
    addMemberToGroup,
    leaveGroup,
    streamGroupMessages,
  };
};
