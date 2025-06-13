# Anime Gaming Hub - Decentralized Messaging & Gaming Platform

A revolutionary Web3 social platform that combines **decentralized messaging**, **multiplayer gaming**, **video calls**, and **AI agents** into one unified experience. Built with XMTP for secure messaging, Web3 wallet integration, and a unique anime-inspired comic book UI.

## 🌟 Features

### 🎮 Core Features

- **🔐 Decentralized Messaging**: Secure, wallet-to-wallet messaging powered by XMTP protocol
- **🎯 Multiplayer Gaming**: Real-time games including Tic-Tac-Toe, Rock-Paper-Scissors, and Memory Cards
- **📹 Video Calling**: Integrated video consultation and calling features
- **🤖 AI Agents**: Interact with on-chain AI agents for various blockchain operations
- **💼 Wallet Integration**: Connect with MetaMask, Rainbow, Coinbase, and WalletConnect

### 🎨 Unique Design

- **Anime/Manga Theme**: Comic book-inspired UI with manga panels, speech bubbles, and anime aesthetics
- **Interactive Elements**: Dynamic animations, speed lines, and comic-style visual effects
- **Responsive Design**: Optimized for both desktop and mobile experiences

### 🔗 Web3 Integration

- **XMTP Messaging**: End-to-end encrypted messaging between wallet addresses
- **Base Blockchain**: Built on Base network for fast, low-cost transactions
- **Basename Support**: Custom basename integration for user-friendly addresses
- **Multi-Chain Support**: Extensible architecture for multiple blockchain networks

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- A Web3 wallet (MetaMask, Rainbow, etc.)
- XMTP-enabled wallet address

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Base-messaging/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your environment variables:
   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   NEXT_PUBLIC_GOOGLE_API_KEY=your_google_gemini_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **For gaming with multiplayer support**
   ```bash
   npm run dev-with-games
   # This starts both the Next.js app and the game server
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
client/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── api/socket/              # WebSocket API routes
├── components/
│   └── messaging/               # Main messaging components
│       ├── MessagingApp.tsx     # Main app component
│       ├── ConversationList.tsx # Chat conversations
│       ├── MessageArea.tsx      # Message display
│       ├── VideoCall.tsx        # Video call interface
│       ├── agents/              # AI agent components
│       │   ├── AgentDashboard.tsx
│       │   ├── AgentChatArea.tsx
│       │   └── CreateAgentModal.tsx
│       └── games/               # Gaming components
│           ├── GameHub.tsx      # Game selection hub
│           ├── TicTacToe.tsx    # Tic-tac-toe game
│           ├── RockPaperScissors.tsx
│           └── MemoryGame.tsx
├── lib/
│   ├── hooks/                   # Custom React hooks
│   │   ├── useXMTPClient.ts     # XMTP messaging
│   │   ├── useAIAgents.ts       # AI agent management
│   │   ├── useGameSocket.ts     # Real-time gaming
│   │   └── useConversation.ts   # Conversation management
│   ├── types.ts                 # TypeScript definitions
│   ├── utils.ts                 # Utility functions
│   ├── wagmi.ts                 # Web3 configuration
│   └── basename.ts              # Basename management
├── providers/
│   └── wagmi-provider.tsx       # Web3 providers
├── server/
│   └── game-server.js           # Real-time game server
└── public/                      # Static assets
```

## 🎯 How It Works

### 1. **Wallet Connection**
- Users connect their Web3 wallet (MetaMask, Rainbow, Coinbase)
- The app initializes XMTP client for decentralized messaging
- Basename generation for user-friendly identification

### 2. **Messaging System**
- **Direct Messages**: Wallet-to-wallet encrypted messaging via XMTP
- **Group Conversations**: Simulated group chats using multiple XMTP conversations
- **Message History**: Persistent message storage and retrieval

### 3. **Gaming Platform**
- **Real-time Multiplayer**: WebSocket-based game server for live gaming
- **Game Types**: Tic-Tac-Toe, Rock-Paper-Scissors, Memory Cards
- **Social Integration**: Games launched directly from chat conversations

### 4. **AI Agents**
- **On-chain Agents**: Smart contract-based AI agents
- **Multiple Roles**: Finance, NFT, DeFi, Gaming, Governance agents
- **Transaction Support**: Execute blockchain transactions through agents

### 5. **Video Calling**
- **P2P Video Calls**: Direct video communication between users
- **Call Controls**: Camera, microphone, screen share, recording controls
- **Integration**: Launch calls directly from conversations

## 🎮 Available Games

### Tic-Tac-Toe
- Classic 3x3 grid game
- Real-time multiplayer
- Win detection and animations

### Rock-Paper-Scissors
- Best-of-3 rounds
- Simultaneous move submission
- Score tracking

### Memory Cards
- Memory matching game
- Turn-based gameplay
- Difficulty levels

## 🤖 AI Agents

### Supported Agent Types
- **Finance Agents**: Portfolio management, trading assistance
- **NFT Agents**: Collection tracking, marketplace integration
- **DeFi Agents**: Yield farming, liquidity management
- **Gaming Agents**: In-game asset management
- **Governance Agents**: DAO participation, voting assistance

### Agent Capabilities
- **Smart Contract Interaction**: Execute transactions on-chain
- **Data Analysis**: Real-time blockchain data analysis
- **Automated Actions**: Trigger actions based on conditions
- **Multi-chain Support**: Work across different blockchain networks

## 🛠️ Technical Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Wagmi**: Web3 React hooks
- **RainbowKit**: Wallet connection UI

### Web3 & Blockchain
- **XMTP**: Decentralized messaging protocol
- **Base Network**: Primary blockchain network
- **Viem**: Ethereum library for interactions
- **MetaMask/Rainbow/Coinbase**: Wallet integrations

### Real-time Features
- **Socket.IO**: Real-time bidirectional communication
- **WebRTC**: Peer-to-peer video calling
- **WebSocket**: Live gaming infrastructure

### AI & External APIs
- **Google Gemini**: AI agent capabilities
- **IPFS**: Decentralized file storage
- **Various APIs**: Blockchain data and services

## 📱 Usage Guide

### Getting Started
1. **Connect Wallet**: Click "Connect Wallet" and choose your preferred wallet
2. **Initialize XMTP**: Click "Initialize XMTP Client" to enable messaging
3. **Start Chatting**: Enter a wallet address to start a new conversation
4. **Explore Features**: Try video calls, games, and AI agents

### Starting a Conversation
1. Click "Start New Chat" 
2. Enter the recipient's wallet address (0x...)
3. Wait for XMTP verification
4. Begin messaging!

### Playing Games
1. Select a conversation with a friend
2. Navigate to the "Games" tab
3. Choose a game (Tic-Tac-Toe, Rock-Paper-Scissors, Memory)
4. Wait for your friend to join
5. Play in real-time!

### Using AI Agents
1. Go to the "AI Agents" tab
2. Create a new agent or select an existing one
3. Choose agent capabilities and role
4. Start chatting with your AI agent
5. Execute on-chain actions through the agent

### Video Calling
1. Open a conversation
2. Click the video call button
3. Share the room ID with your contact
4. Enjoy your video call with full controls

## 🔧 Configuration

### Environment Variables
```env
# Required
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Optional
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key
NEXT_PUBLIC_BASENAME_API_URL=your_basename_api
```

### Customization
- **Themes**: Modify the anime/manga styling in Tailwind classes
- **Games**: Add new games in the `components/messaging/games/` directory
- **Agents**: Extend AI agent capabilities in `lib/hooks/useAIAgents.ts`
- **Networks**: Add new blockchain networks in `lib/wagmi.ts`

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### With Game Server
```bash
npm run start-with-games
```

### Vercel Deployment
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain the anime/manga UI theme
- Add tests for new features
- Update documentation for new components

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **XMTP Team**: For the decentralized messaging protocol
- **Base Team**: For the blockchain infrastructure  
- **Anime Community**: For design inspiration
- **Web3 Developers**: For the amazing tooling and libraries

## 📞 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs via GitHub Issues
- **Community**: Join our Discord for discussions
- **Email**: Contact us at support@example.com

---

**Built with ❤️ for the Web3 and Anime communities**

*Experience the future of decentralized social gaming!* 🎮✨
