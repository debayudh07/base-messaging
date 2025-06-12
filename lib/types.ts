export interface Message {
  id: string;
  content: string;
  senderAddress: string;
  sent: Date;
}

export interface Conversation {
  peerAddress: string;
  messages: () => Promise<Message[]>;
  send: (message: string) => Promise<void>;
  streamMessages: () => AsyncIterable<Message>;
}

export interface GroupChat {
  id: string;
  name: string;
  description: string;
  members: string[];
  creatorAddress: string;
  createdAt: Date;
  isActive: boolean;
  maxMembers: number;
  xmtpGroup?: any; // Reference to actual XMTP group
}

export interface GroupMessage {
  id: string;
  content: string;
  senderAddress: string;
  timestamp: Date | string | number;
  sent?: Date | string | number;
  type: 'message' | 'join' | 'leave' | 'admin';
  groupId: string;
}

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  role: string; // finance, nft, defi, governance, gaming, etc.
  capabilities: string[]; // data analysis, trade execution, asset monitoring, etc.
  chainId?: number;
  createdAt: Date;
  isActive: boolean;
  contractAddress?: string; // If the agent is deployed as a smart contract
  apiEndpoint?: string; // If the agent is accessible via API
  owner: string; // Address of the creator/owner
  imageUrl?: string; // Avatar/image URL
}

export interface AgentMessage {
  id: string;
  content: string;
  senderAddress: string; // User address or agent ID
  timestamp: Date | string | number;
  sent?: Date | string | number;
  type: 'message' | 'action' | 'result' | 'error' | 'system';
  agentId: string;
  metadata?: {
    transactionHash?: string;
    blockNumber?: number;
    gasUsed?: number;
    contractAddress?: string;
    functionName?: string;
    parameters?: Record<string, any>;
    result?: any;
  };
}

export interface Prescription {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  issueDate: Date;
  expiryDate: Date;
  physicianAddress: string;
  patientAddress: string;
  instructions: string;
  status: "active" | "pending" | "completed" | "expired";
}
