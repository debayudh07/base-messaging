"use client";
import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { v4 as uuidv4 } from "uuid"; // We'll need to add this dependency
import type { AIAgent, AgentMessage } from "../types";

// Predefined demo agents
const demoAgents: AIAgent[] = [
  {
    id: "finance-agent-1",
    name: "TokenSage",
    description: "Advanced token price and market analysis agent. Provides real-time market insights and token recommendations.",
    role: "finance",
    capabilities: ["Price Analysis", "Market Trends", "Token Research", "Trading Signals"],
    chainId: 1,
    createdAt: new Date(),
    isActive: true,
    owner: "0x0000000000000000000000000000000000000000",
    imageUrl: "https://via.placeholder.com/150"
  },
  {
    id: "nft-agent-1",
    name: "NFTVisionary",
    description: "NFT collection tracker and value analyzer. Discovers trending collections and rare items.",
    role: "nft",
    capabilities: ["Collection Analysis", "Rarity Checks", "Price Evaluation", "Trend Discovery"],
    chainId: 1,
    createdAt: new Date(),
    isActive: true,
    owner: "0x0000000000000000000000000000000000000000",
    imageUrl: "https://via.placeholder.com/150"
  },
  {
    id: "defi-agent-1",
    name: "YieldHunter",
    description: "DeFi protocol analyzer that finds the best yield opportunities across multiple chains.",
    role: "defi",
    capabilities: ["Yield Optimization", "Risk Assessment", "Protocol Analysis", "LP Strategy"],
    chainId: 1,
    createdAt: new Date(),
    isActive: true,
    owner: "0x0000000000000000000000000000000000000000",
    imageUrl: "https://via.placeholder.com/150"
  }
];

// Demo messages map by agent ID
const demoMessagesMap: Record<string, AgentMessage[]> = {
  "finance-agent-1": [
    {
      id: "msg-1",
      content: "Hello! I'm TokenSage, your AI market analysis expert. How can I help you today?",
      senderAddress: "finance-agent-1",
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      type: "system",
      agentId: "finance-agent-1"
    }
  ],
  "nft-agent-1": [
    {
      id: "msg-1",
      content: "Welcome to NFTVisionary! I can help you discover trending NFT collections and analyze rarity. What would you like to know?",
      senderAddress: "nft-agent-1",
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      type: "system",
      agentId: "nft-agent-1"
    }
  ],
  "defi-agent-1": [
    {
      id: "msg-1",
      content: "Hi there! YieldHunter at your service. I can find the best yield opportunities across DeFi. What are your investment goals?",
      senderAddress: "defi-agent-1",
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      type: "system",
      agentId: "defi-agent-1"
    }
  ]
};

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
      
      // Create new agent object
      const newAgent: AIAgent = {
        id: `agent-${uuidv4()}`,
        name: agentData.name,
        description: agentData.description,
        role: agentData.role,
        capabilities: agentData.capabilities,
        chainId: agentData.chainId,
        contractAddress: agentData.contractAddress,
        apiEndpoint: agentData.apiEndpoint,
        createdAt: new Date(),
        isActive: true,
        owner: address || "0x0000000000000000000000000000000000000000",
      };

      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Add welcome message for the new agent
      demoMessagesMap[newAgent.id] = [{
        id: `msg-${uuidv4()}`,
        content: `Hello! I'm ${newAgent.name}, your AI ${newAgent.role} agent. I'm here to help you with ${newAgent.capabilities.join(', ')}. How can I assist you today?`,
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

      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate agent response based on the selected agent
      let agentResponse: AgentMessage;
      const selectedAgentObj = agents.find(a => a.id === agentId);
      
      if (selectedAgentObj?.role === "finance") {
        agentResponse = {
          id: `msg-${uuidv4()}`,
          content: generateFinanceResponse(content),
          senderAddress: agentId,
          timestamp: new Date(),
          type: content.toLowerCase().includes("transaction") ? "action" : "message",
          agentId,
          metadata: content.toLowerCase().includes("transaction") ? {
            transactionHash: `0x${Math.random().toString(16).substring(2, 62)}`,
            functionName: "analyzeMarket"
          } : undefined
        };
      } else if (selectedAgentObj?.role === "nft") {
        agentResponse = {
          id: `msg-${uuidv4()}`,
          content: generateNFTResponse(content),
          senderAddress: agentId,
          timestamp: new Date(),
          type: content.toLowerCase().includes("rarity") ? "result" : "message",
          agentId,
          metadata: content.toLowerCase().includes("nft") ? {
            contractAddress: `0x${Math.random().toString(16).substring(2, 42)}`,
            functionName: "getRarityScore"
          } : undefined
        };
      } else if (selectedAgentObj?.role === "defi") {
        agentResponse = {
          id: `msg-${uuidv4()}`,
          content: generateDeFiResponse(content),
          senderAddress: agentId,
          timestamp: new Date(),
          type: content.toLowerCase().includes("yield") ? "result" : "message",
          agentId,
          metadata: content.toLowerCase().includes("yield") ? {
            transactionHash: `0x${Math.random().toString(16).substring(2, 62)}`,
            functionName: "calculateAPY"
          } : undefined
        };
      } else {
        // Generic response
        agentResponse = {
          id: `msg-${uuidv4()}`,
          content: `I've processed your request: "${content}". I'm working on improving my responses for your specific needs. Is there anything else you'd like to know?`,
          senderAddress: agentId,
          timestamp: new Date(),
          type: "message",
          agentId
        };
      }

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

// Helper functions to generate responses based on the message content
function generateFinanceResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes("eth") || lowerMessage.includes("ethereum")) {
    return "Based on my latest analysis, Ethereum is showing strong momentum with increased developer activity. The recent upgrade has significantly improved transaction throughput. Technical indicators suggest a potential upward trend in the short term, but keep an eye on overall market conditions.";
  }
  
  if (lowerMessage.includes("btc") || lowerMessage.includes("bitcoin")) {
    return "Bitcoin's on-chain metrics are showing accumulation by long-term holders, which historically precedes bullish moves. Hash rate is at all-time highs, suggesting strong network security. My analysis indicates a possible consolidation phase before the next major move.";
  }
  
  if (lowerMessage.includes("market") || lowerMessage.includes("trend")) {
    return "Current market analysis shows increasing institutional interest in the crypto sector. DeFi TVL has grown 15% over the past month, while NFT trading volumes have decreased slightly. My sentiment analysis of social media indicates cautious optimism among retail investors. Key resistance levels to watch are at $35,500 for BTC and $2,300 for ETH.";
  }
  
  if (lowerMessage.includes("transaction") || lowerMessage.includes("execute")) {
    return "I've analyzed the requested transaction parameters. Based on current gas fees and market conditions, I recommend proceeding with execution. The estimated slippage is within acceptable ranges, and my price impact analysis shows minimal market disturbance. Shall I prepare the transaction for your approval?";
  }
  
  return "I've analyzed your request regarding financial markets. My data suggests there's been significant volatility in this sector recently. Would you like me to provide a more detailed analysis on specific assets or market segments?";
}

function generateNFTResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes("collection") || lowerMessage.includes("trend")) {
    return "My analysis shows that generative art collections are gaining significant traction this month, with a 28% increase in trading volume. PFP projects are seeing reduced activity, while utility-focused NFTs connected to gaming are emerging as a strong trend. I'm detecting growing interest in music NFTs, which might be the next category to watch.";
  }
  
  if (lowerMessage.includes("rarity") || lowerMessage.includes("rare")) {
    return "I've analyzed the collection's rarity distribution. Based on trait frequency and statistical models, the rarity score for this item is 89.7/100, placing it in the top 5% of the collection. The most valuable trait combination is the background (0.5% occurrence) and the accessory (1.2% occurrence). Similar items have recently sold for 2.4-3.1 ETH.";
  }
  
  if (lowerMessage.includes("floor") || lowerMessage.includes("price")) {
    return "The current floor price is 1.87 ETH, which represents a 12% increase over the past week. Trading volume is up 23% in the same period. My predictive model suggests moderate upward pressure on the floor over the next 7 days, with key support at 1.65 ETH. The collection's liquidity score is 7.8/10, indicating healthy market depth.";
  }
  
  if (lowerMessage.includes("mint") || lowerMessage.includes("upcoming")) {
    return "I've identified 3 promising upcoming NFT projects based on social metrics and team analysis: 1) CryptoVistas by the established artist collective PixelLabs, 2) MetaHomes with utility in the emerging Decentraland competitor, and 3) SonicBeings with music industry partnerships. Would you like detailed analysis on any of these?";
  }
  
  return "I've analyzed your request about NFTs. The current market shows interesting developments in digital collectibles and virtual assets. Would you like me to focus on a specific collection, creator, or marketplace trend?";
}

function generateDeFiResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes("yield") || lowerMessage.includes("apy")) {
    return "My yield analysis shows the following optimal opportunities:\n\n1. The USDC-ETH pool on Uniswap V3 (concentrated from 0.8x to 1.2x) is generating 24.8% APY with moderate impermanent loss risk\n2. Lido stETH with leveraged restaking via EigenLayer is yielding 12.3% with relatively low risk\n3. The BTC-USDT pool on Curve has a 9.1% APY currently boosted by CRV incentives\n\nWould you like me to prepare a detailed risk assessment for any of these options?";
  }
  
  if (lowerMessage.includes("risk") || lowerMessage.includes("security")) {
    return "I've conducted a risk assessment of your specified protocol. My security analysis identified: 1) No critical vulnerabilities in the audited contracts, 2) Medium centralization risk with 3/8 multisig control, 3) Moderate oracle dependency with dual price feeds, 4) Low liquidity risk based on TVL/volume ratio of 3.2. The protocol's risk score is 72/100, indicating a generally secure position but with some points of caution.";
  }
  
  if (lowerMessage.includes("borrow") || lowerMessage.includes("loan")) {
    return "Based on current market conditions, the most efficient borrowing options are:\n1. Aave on Arbitrum: 3.2% for USDC with no additional incentives\n2. Compound on Ethereum: 3.7% for DAI with COMP rewards effectively reducing rate to ~2.9%\n3. Spark Protocol: 3.5% for sUSD with potential for rate reduction through governance\n\nConsidering your position, option #2 would optimize your capital efficiency while minimizing risk.";
  }
  
  if (lowerMessage.includes("strategy") || lowerMessage.includes("portfolio")) {
    return "After analyzing your portfolio, I recommend the following adjustments to optimize for the current market conditions:\n\n1. Reduce stablecoin exposure by 15% and redirect to BTC/ETH (70/30 split)\n2. Consider adding 5% allocation to liquid staking derivatives for improved yield\n3. Implement a basic dollar-cost averaging strategy for your alt-coin positions\n4. Utilize a hedging strategy via options on Lyra to protect against downside risk\n\nThis balanced approach maintains your risk profile while potentially increasing returns by 4-7% annually based on historical backtesting.";
  }
  
  return "I've analyzed your DeFi query. The protocol landscape shows interesting yield opportunities balanced against various risk factors. Would you like me to dive deeper into specific protocols, strategies, or market segments?";
}
