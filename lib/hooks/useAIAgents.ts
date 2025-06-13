/*eslint-disable*/
"use client";
import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { v4 as uuidv4 } from "uuid"; // We'll need to add this dependency
import type { AIAgent, AgentMessage } from "../types";
import { geminiAgentService, agentPersonalities } from "../gemini-agent-service";

// Predefined demo agents using Gemini personalities
const demoAgents: AIAgent[] = Object.keys(agentPersonalities).map(role => {
  const personality = agentPersonalities[role];
  return {
    id: `${role}-agent-1`,
    name: personality.name,
    description: personality.description,
    role: personality.role,
    capabilities: personality.capabilities,
    chainId: 1,
    createdAt: new Date(),
    isActive: true,
    owner: "0x0000000000000000000000000000000000000000",
    imageUrl: "https://via.placeholder.com/150"
  };
});

// Demo messages map by agent ID with welcome messages from Gemini personalities
const demoMessagesMap: Record<string, AgentMessage[]> = {};

// Initialize demo messages for each agent
Object.keys(agentPersonalities).forEach(role => {
  const personality = agentPersonalities[role];
  const agentId = `${role}-agent-1`;
  demoMessagesMap[agentId] = [
    {
      id: "msg-1",
      content: `Hello! I'm ${personality.name}, your AI ${personality.specialization} expert. I specialize in ${personality.capabilities.slice(0, 3).join(', ')} and more. How can I help you today?`,
      senderAddress: agentId,
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      type: "system",
      agentId
    }
  ];
});

export const useAIAgents = () => {
  const { address } = useAccount();
  
  // State
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load demo agents on initial render
  useEffect(() => {
    setAgents(demoAgents);
  }, []);

  // Load agent messages when an agent is selected
  useEffect(() => {
    if (selectedAgent) {
      setIsLoadingMessages(true);
      
      // Simulate API call to get messages
      setTimeout(() => {
        const agentMessages = demoMessagesMap[selectedAgent.id] || [];
        setMessages(agentMessages);
        setIsLoadingMessages(false);
      }, 1000);
    }
  }, [selectedAgent]);
  // Create a new agent
  const createAgent = async (agentData: {
    name: string;
    description: string;
    role: string;
    capabilities: string[];
    chainId?: number;
    contractAddress?: string;
    apiEndpoint?: string;
  }) => {
    try {
      setError(null);
      
      // Generate enhanced capabilities using Gemini if capabilities are basic
      let enhancedCapabilities = agentData.capabilities;
      if (enhancedCapabilities.length === 0) {
        try {
          enhancedCapabilities = await geminiAgentService.generateAgentCapabilities(
            agentData.role, 
            agentData.description
          );
        } catch (err) {
          console.warn("Failed to generate enhanced capabilities, using defaults");
          enhancedCapabilities = ["General Analysis", "Data Processing", "User Assistance"];
        }
      }

      // Create custom agent personality for Gemini
      const customPersonality = await geminiAgentService.createCustomAgent(
        agentData.name,
        agentData.description,
        agentData.role,
        enhancedCapabilities
      );
      
      // Create new agent object
      const newAgent: AIAgent = {
        id: `agent-${uuidv4()}`,
        name: agentData.name,
        description: agentData.description,
        role: agentData.role,
        capabilities: enhancedCapabilities,
        chainId: agentData.chainId,
        contractAddress: agentData.contractAddress,
        apiEndpoint: agentData.apiEndpoint,
        createdAt: new Date(),
        isActive: true,
        owner: address || "0x0000000000000000000000000000000000000000",
      };

      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate welcome message using Gemini
      let welcomeMessage: string;
      try {
        welcomeMessage = await geminiAgentService.generateAgentResponse(
          agentData.role,
          "Introduce yourself to a new user and explain how you can help them.",
          []
        );
      } catch (err) {
        console.warn("Failed to generate welcome message, using default");
        welcomeMessage = `Hello! I'm ${newAgent.name}, your AI ${newAgent.role} agent. I'm here to help you with ${newAgent.capabilities.join(', ')}. How can I assist you today?`;
      }

      // Add welcome message for the new agent
      demoMessagesMap[newAgent.id] = [{
        id: `msg-${uuidv4()}`,
        content: welcomeMessage,
        senderAddress: newAgent.id,
        timestamp: new Date(),
        type: "system",
        agentId: newAgent.id
      }];

      // Update state
      setAgents(prev => [...prev, newAgent]);
      setSelectedAgent(newAgent);
      return newAgent;
    } catch (err) {
      console.error("Error creating agent:", err);
      setError("Failed to create agent. Please try again.");
      throw err;
    }
  };
  // Send message to agent
  const sendMessage = async (agentId: string, content: string) => {
    try {
      setError(null);
      
      if (!address) {
        setError("You must connect your wallet to send messages.");
        return;
      }

      const userMessage: AgentMessage = {
        id: `msg-${uuidv4()}`,
        content,
        senderAddress: address,
        timestamp: new Date(),
        type: "message",
        agentId
      };

      // Add user message immediately
      setMessages(prev => [...prev, userMessage]);

      // Get conversation history for context
      const conversationHistory = demoMessagesMap[agentId]
        ?.filter(msg => msg.type === "message")
        ?.slice(-6) // Last 6 messages for context
        ?.map(msg => ({
          role: msg.senderAddress === address ? 'user' as const : 'assistant' as const,
          content: msg.content
        })) || [];

      // Find the agent to get its role
      const selectedAgentObj = agents.find(a => a.id === agentId);
      const agentRole = selectedAgentObj?.role || 'finance';

      // Generate response using Gemini
      let agentResponseContent: string;
      try {
        agentResponseContent = await geminiAgentService.generateAgentResponse(
          agentRole,
          content,
          conversationHistory
        );
      } catch (err) {
        console.error("Failed to generate Gemini response:", err);
        agentResponseContent = "I apologize, but I'm experiencing some technical difficulties right now. Please try again in a moment.";
      }

      // Determine message type based on content
      let messageType: 'message' | 'action' | 'result' | 'error' | 'system' = 'message';
      let metadata: any = undefined;

      if (content.toLowerCase().includes('transaction') || content.toLowerCase().includes('execute')) {
        messageType = 'action';
        metadata = {
          transactionHash: `0x${Math.random().toString(16).substring(2, 62)}`,
          functionName: "executeAction"
        };
      } else if (content.toLowerCase().includes('analyze') || content.toLowerCase().includes('calculate')) {
        messageType = 'result';
        metadata = {
          functionName: "performAnalysis",
          parameters: { query: content }
        };
      }

      const agentResponse: AgentMessage = {
        id: `msg-${uuidv4()}`,
        content: agentResponseContent,
        senderAddress: agentId,
        timestamp: new Date(),
        type: messageType,
        agentId,
        metadata
      };

      // Add agent response
      setMessages(prev => [...prev, agentResponse]);
      
      // Update demo messages map for persistence
      if (demoMessagesMap[agentId]) {
        demoMessagesMap[agentId] = [...demoMessagesMap[agentId], userMessage, agentResponse];
      } else {
        demoMessagesMap[agentId] = [userMessage, agentResponse];
      }

    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    }
  };

  // Disconnect agent
  const disconnectAgent = async (agentId: string) => {
    try {
      setError(null);
      
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove agent
      const updatedAgents = agents.filter(agent => agent.id !== agentId);
      setAgents(updatedAgents);
      
      if (selectedAgent?.id === agentId) {
        setSelectedAgent(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Error disconnecting agent:", err);
      setError("Failed to disconnect agent.");
      throw err;
    }
  };

  const selectAgent = (agent: AIAgent) => {
    setSelectedAgent(agent);
    setMessages([]); // Clear previous messages
  };

  return {
    agents,
    selectedAgent,
    messages,
    isLoadingMessages,
    isCreateModalOpen,
    error,
    createAgent,
    sendMessage,
    disconnectAgent,
    selectAgent,
    setIsCreateModalOpen,
    setError,
  };
};