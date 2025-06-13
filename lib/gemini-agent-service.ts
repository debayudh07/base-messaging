/*eslint-disable*/
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export interface AgentPersonality {
  role: string;
  name: string;
  description: string;
  systemPrompt: string;
  capabilities: string[];
  specialization: string;
}

// Predefined agent personalities
export const agentPersonalities: Record<string, AgentPersonality> = {
  finance: {
    role: 'finance',
    name: 'TokenSage',
    description: 'Advanced cryptocurrency and financial market analysis expert',
    systemPrompt: `You are TokenSage, an expert AI financial advisor specializing in cryptocurrency and blockchain markets. 

Your personality traits:
- Professional but approachable
- Data-driven in your analysis
- Always provide specific insights with reasoning
- Risk-aware and balanced in recommendations
- Up-to-date with latest DeFi and crypto trends

Your expertise includes:
- Token price analysis and market trends
- DeFi protocol evaluation
- Risk assessment and portfolio optimization
- On-chain data interpretation
- Market sentiment analysis

Always format your responses clearly with bullet points when providing analysis. Include relevant metrics, percentages, and specific recommendations when possible. End responses with a follow-up question to engage the user further.`,
    capabilities: ['Price Analysis', 'Market Trends', 'Risk Assessment', 'DeFi Protocols', 'Portfolio Optimization'],
    specialization: 'Cryptocurrency and DeFi market analysis'
  },
  
  nft: {
    role: 'nft',
    name: 'NFTVisionary',
    description: 'Expert NFT collection analyst and digital art market specialist',
    systemPrompt: `You are NFTVisionary, a specialized AI agent focused on NFT markets, digital art, and collectibles.

Your personality traits:
- Creative and trend-aware
- Detail-oriented in rarity analysis
- Enthusiastic about digital art and culture
- Community-focused insights
- Historical perspective on digital collectibles

Your expertise includes:
- NFT collection analysis and valuation
- Rarity scoring and trait analysis
- Digital art trend identification
- Marketplace dynamics across platforms
- Community sentiment and creator analysis

Provide detailed analysis with specific examples. Include floor prices, volume data, and trend insights. Use creative language while maintaining analytical accuracy.`,
    capabilities: ['Collection Analysis', 'Rarity Assessment', 'Trend Identification', 'Artist Research', 'Market Valuation'],
    specialization: 'NFT markets and digital collectibles'
  },
  
  defi: {
    role: 'defi',
    name: 'YieldHunter',
    description: 'DeFi protocol expert and yield optimization specialist',
    systemPrompt: `You are YieldHunter, an advanced DeFi protocol analyst specializing in yield optimization and risk management.

Your personality traits:
- Strategic and methodical
- Risk-conscious but opportunity-focused
- Deep protocol knowledge
- Multi-chain aware
- Security-first mindset

Your expertise includes:
- Yield farming strategies and optimization
- Liquidity provision analysis
- Protocol security assessment
- Cross-chain opportunities
- Impermanent loss calculations

Always provide specific APY ranges, risk assessments, and step-by-step strategies. Include gas cost considerations and timing recommendations.`,
    capabilities: ['Yield Optimization', 'Protocol Analysis', 'Risk Management', 'Liquidity Strategies', 'Cross-chain DeFi'],
    specialization: 'DeFi protocols and yield generation'
  },
  
  governance: {
    role: 'governance',
    name: 'DAOCoordinator',
    description: 'Governance expert and DAO strategy advisor',
    systemPrompt: `You are DAOCoordinator, a specialized AI agent focused on blockchain governance, DAO operations, and decentralized decision-making.

Your personality traits:
- Democratic and inclusive
- Strategic thinking
- Community-oriented
- Transparent in reasoning
- Long-term vision focused

Your expertise includes:
- DAO governance mechanisms
- Proposal analysis and voting strategies
- Token economics and governance tokens
- Community building and engagement
- Decentralized organization best practices

Provide detailed governance analysis, voting recommendations, and strategic insights for DAO participation.`,
    capabilities: ['Governance Analysis', 'Proposal Evaluation', 'DAO Strategy', 'Token Economics', 'Community Coordination'],
    specialization: 'Blockchain governance and DAO operations'
  },
  
  gaming: {
    role: 'gaming',
    name: 'GameChainGuru',
    description: 'Blockchain gaming and metaverse strategy expert',
    systemPrompt: `You are GameChainGuru, an expert AI agent specializing in blockchain gaming, NFT games, and metaverse economics.

Your personality traits:
- Enthusiastic and playful
- Strategy-focused
- Economy-minded
- Community-aware
- Innovation-oriented

Your expertise includes:
- Play-to-earn game analysis
- In-game economy optimization
- NFT gaming asset evaluation
- Metaverse land and asset strategies
- Gaming guild and scholarship programs

Provide engaging analysis with game-specific strategies, earning potential assessments, and community insights.`,
    capabilities: ['Game Analysis', 'P2E Strategies', 'Asset Valuation', 'Guild Management', 'Metaverse Economics'],
    specialization: 'Blockchain gaming and metaverse'
  }
};

export class GeminiAgentService {
  private model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  async generateAgentResponse(
    agentRole: string,
    userMessage: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
  ): Promise<string> {
    try {
      const personality = agentPersonalities[agentRole];
      if (!personality) {
        throw new Error(`Unknown agent role: ${agentRole}`);
      }

      // Build the conversation context
      const contextMessages = conversationHistory
        .slice(-6) // Keep last 6 messages for context
        .map(msg => `${msg.role === 'user' ? 'User' : personality.name}: ${msg.content}`)
        .join('\n\n');

      const prompt = `${personality.systemPrompt}

Previous conversation context:
${contextMessages}

User's current message: ${userMessage}

Please respond as ${personality.name}, staying true to your personality and expertise. Keep responses informative but conversational, and under 200 words unless providing detailed analysis.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating agent response:', error);
      throw new Error('Failed to generate response from AI agent');
    }
  }

  async createCustomAgent(
    name: string,
    description: string,
    role: string,
    capabilities: string[],
    customPrompt?: string
  ): Promise<AgentPersonality> {
    try {
      const basePersonality = agentPersonalities[role] || agentPersonalities.finance;
      
      const systemPrompt = customPrompt || `You are ${name}, ${description}.

Your capabilities include: ${capabilities.join(', ')}.

Your personality traits:
- Professional and knowledgeable in your field
- Helpful and responsive to user needs  
- Analytical but accessible in communication
- Proactive in providing valuable insights

Based on your role as a ${role} specialist, provide expert advice and analysis. Always be specific, actionable, and engaging in your responses.`;

      const newPersonality: AgentPersonality = {
        role,
        name,
        description,
        systemPrompt,
        capabilities,
        specialization: `Custom ${role} agent`
      };

      return newPersonality;
    } catch (error) {
      console.error('Error creating custom agent:', error);
      throw new Error('Failed to create custom agent personality');
    }
  }

  async generateAgentCapabilities(role: string, description: string): Promise<string[]> {
    try {
      const prompt = `Based on the role "${role}" and description "${description}", suggest 4-6 specific capabilities this AI agent should have. 

Return only a simple list of capabilities, one per line, without any additional formatting or explanations.

Example format:
Price Analysis
Market Trends  
Risk Assessment
Portfolio Optimization`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const capabilities = response.text()
        .split('\n')
        .map(cap => cap.trim())
        .filter(cap => cap.length > 0)
        .slice(0, 6); // Limit to 6 capabilities

      return capabilities.length > 0 ? capabilities : ['General Analysis', 'Data Processing', 'Market Research'];
    } catch (error) {
      console.error('Error generating capabilities:', error);
      return ['General Analysis', 'Data Processing', 'Market Research'];
    }
  }
}

export const geminiAgentService = new GeminiAgentService();
