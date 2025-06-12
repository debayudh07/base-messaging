/*eslint-disable*/
"use client";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FiCopy } from "react-icons/fi";

// Components
import { ClientInitialization } from "./ClientInitialization";
import { ChatTab } from "./ChatTab";
import { ConversationList } from "./ConversationList";
import { VideoCall } from "./VideoCall";
import { NewConversationModal } from "./NewConversationModal";
import { GameHub } from "./games/GameHub";
import { AgentDashboard } from "./agents/AgentDashboard";

// Hooks and utilities
import { useXMTPClient } from "../../lib/hooks/useXMTPClient";
import { useAIAgents } from "../../lib/hooks/useAIAgents";
import { shortenAddress, copyAddressToClipboard } from "../../lib/utils";
import type { Conversation } from "../../lib/types";

export const MessagingApp: React.FC = () => {
  const { address, isConnected } = useAccount();
  
  // XMTP client state
  const {
    client,
    conversations,
    isInitializing,
    error: clientError,
    initializeClient,
    startNewConversation,
    setError: setClientError,  } = useXMTPClient();
  
  // AI agents hook - replacing group chat
  const {
    agents,
    selectedAgent,
    messages: agentMessages,
    isLoadingMessages,
    isCreateModalOpen: isCreateAgentModalOpen,
    error: agentError,
    createAgent,
    sendMessage: sendAgentMessage,
    disconnectAgent,
    selectAgent,
    setIsCreateModalOpen: setIsCreateAgentModalOpen,
  } = useAIAgents();
  
  // UI state
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isNewConversationModalOpen, setIsNewConversationModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'video' | 'games' | 'agents'>('chat');
  
  // Video call state
  const [isInCall, setIsInCall] = useState(false);
  const [callRecipient, setCallRecipient] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenShareEnabled, setIsScreenShareEnabled] = useState(false);
  const [isRecordingEnabled, setIsRecordingEnabled] = useState(false);
  const [callError, setCallError] = useState<string | null>(null);
  // Handle new conversation
  const handleStartNewConversation = async (recipientAddress: string): Promise<void> => {
    const conversation = await startNewConversation(recipientAddress);
    if (conversation) {
      setSelectedConversation(conversation);
    }
  };

  // Handle game messages
  const handleSendGameMessage = async (gameType: string, gameData: any): Promise<void> => {
    if (selectedConversation) {
      // In a real implementation, send game data via XMTP
      console.log('Sending game message:', { gameType, gameData });
    }
  };

  // Video call functions
  const startVideoCall = async (recipient: string): Promise<void> => {
    try {
      setCallError(null);
      const newRoomId = `room-${Math.random().toString(36).substring(2, 11)}`;
      setRoomId(newRoomId);
      setCallRecipient(recipient);
      setIsInCall(true);

      // In a real implementation, you would:
      // 1. Use Huddle01 SDK to create a room
      // 2. Send invite via XMTP
      // 3. Set up WebRTC connections
      
    } catch (err) {
      console.error("Error starting video call:", err);
      setCallError("Failed to start video call");
    }
  };

  const endVideoCall = async (): Promise<void> => {
    setIsInCall(false);
    setCallRecipient("");
    setRoomId("");
    setCallError(null);
  };

  const toggleVideo = async (): Promise<void> => {
    setIsVideoEnabled(!isVideoEnabled);
  };

  const toggleAudio = async (): Promise<void> => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  const toggleScreenShare = async (): Promise<void> => {
    setIsScreenShareEnabled(!isScreenShareEnabled);
  };
  const toggleRecording = async (): Promise<void> => {
    setIsRecordingEnabled(!isRecordingEnabled);
  };
  // AI agent handlers
  const handleCreateAgent = async (agentData: {
    name: string;
    description: string;
    role: string;
    capabilities: string[];
    chainId?: number;
    contractAddress?: string;
    apiEndpoint?: string;
  }): Promise<void> => {
    try {
      await createAgent(agentData);
      setIsCreateAgentModalOpen(false);
    } catch (error) {
      console.error('Failed to create agent:', error);
    }
  };

  const handleSendAgentMessage = async (agentId: string, message: string): Promise<void> => {
    try {
      await sendAgentMessage(agentId, message);
    } catch (error) {
      console.error('Failed to send agent message:', error);
    }
  };

  const handleDisconnectAgent = async (agentId: string): Promise<void> => {
    try {
      await disconnectAgent(agentId);
    } catch (error) {
      console.error('Failed to disconnect agent:', error);
    }
  };// Show wallet connection if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center relative overflow-hidden">
        {/* Manga background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-black transform rotate-12"></div>
          <div className="absolute top-32 right-20 w-24 h-24 border-2 border-black transform -rotate-12"></div>
          <div className="absolute bottom-20 left-32 w-28 h-28 border-2 border-black transform rotate-45"></div>
          <div className="absolute bottom-40 right-10 w-20 h-20 border-2 border-black transform -rotate-45"></div>
        </div>

        {/* Main comic card */}
        <div className="relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 max-w-md mx-4 transform hover:scale-105 transition-transform duration-300">
          {/* Comic panel border effect */}
          <div className="absolute -top-2 -left-2 w-full h-full bg-gray-800 -z-10"></div>
          
          {/* Speed lines background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/2 w-px h-full bg-black opacity-20 transform -rotate-12 animate-pulse"></div>
            <div className="absolute top-0 left-1/3 w-px h-full bg-black opacity-20 transform -rotate-6 animate-pulse"></div>
            <div className="absolute top-0 left-2/3 w-px h-full bg-black opacity-20 transform rotate-6 animate-pulse"></div>
            <div className="absolute top-0 right-1/3 w-px h-full bg-black opacity-20 transform rotate-12 animate-pulse"></div>
          </div>

          <div className="text-center relative z-10">
            <div className="text-6xl mb-4 animate-bounce">🎮</div>
            
            {/* Comic speech bubble style title */}
            <div className="relative mb-6">
              <div className="bg-white border-3 border-black rounded-2xl p-4 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {/* Speech bubble tail */}
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-black"></div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-5 border-l-transparent border-r-transparent border-t-white"></div>
                
                <h1 className="text-3xl font-black text-black mb-2 tracking-wider transform -skew-x-6">
                  🎮 ANIME GAMING HUB
                </h1>
              </div>
            </div>

            <div className="bg-gray-900 text-white px-6 py-3 border-2 border-black transform -skew-x-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-6">
              <p className="font-bold text-lg tracking-wider transform skew-x-3">
                CONNECT WALLET TO ENTER!
              </p>
            </div>

            <div className="mb-6">
              <ConnectButton />
            </div>            <div className="flex justify-center space-x-4">
              <div className="bg-white border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-sm font-bold">🎯 GAMES</span>
              </div>
              <div className="bg-white border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-sm font-bold">💬 CHAT</span>
              </div>
              <div className="bg-white border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-sm font-bold">🤖 AI AGENTS</span>
              </div>
            </div>
          </div>

          {/* Comic panel corners */}
          <div className="absolute top-0 left-0 w-4 h-4 border-l-4 border-t-4 border-black"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-r-4 border-t-4 border-black"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l-4 border-b-4 border-black"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r-4 border-b-4 border-black"></div>
        </div>

        {/* Floating comic elements */}
        <div className="absolute top-20 left-20 animate-bounce">
          <div className="bg-white border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-sm font-bold">POW!</span>
          </div>
        </div>
        
        <div className="absolute bottom-32 right-32 animate-bounce" style={{animationDelay: '0.3s'}}>
          <div className="bg-white border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-sm font-bold">ZOOM!</span>
          </div>
        </div>
      </div>
    );
  }

  // Show initialization screen if client not ready
  if (!client) {
    return (
      <ClientInitialization
        address={address}
        isInitializing={isInitializing}
        error={clientError}
        onInitialize={initializeClient}
      />
    );
  }  // Main app interface
  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
      {/* Manga background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-black transform rotate-12"></div>
        <div className="absolute top-32 right-20 w-24 h-24 border-2 border-black transform -rotate-12"></div>
        <div className="absolute bottom-20 left-32 w-28 h-28 border-2 border-black transform rotate-45"></div>
        <div className="absolute bottom-40 right-10 w-20 h-20 border-2 border-black transform -rotate-45"></div>
        <div className="absolute top-1/2 left-20 w-16 h-16 border-2 border-black transform rotate-12"></div>
        <div className="absolute top-20 right-1/3 w-20 h-20 border-2 border-black transform -rotate-45"></div>
      </div>

      {/* Speed lines */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-0 left-1/4 w-px h-full bg-black transform -rotate-12 animate-pulse"></div>
        <div className="absolute top-0 left-1/2 w-px h-full bg-black transform rotate-6 animate-pulse"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-black transform -rotate-6 animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 p-4">
        {/* Header - Comic style */}
        <div className="relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6 transform hover:scale-[1.02] transition-transform duration-300">
          <div className="absolute -top-2 -left-2 w-full h-full bg-gray-800 -z-10"></div>
          
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-3">
              <div className="text-4xl animate-bounce">🎮</div>
              <div className="relative">
                <div className="bg-white border-3 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <h1 className="text-2xl font-black text-black tracking-wider transform -skew-x-6">
                    ANIME GAMING HUB
                  </h1>
                </div>
              </div>
            </div>
            {address && (
              <div className="flex items-center gap-4">
                <div className="bg-gray-900 text-white px-4 py-2 border-2 border-black transform -skew-x-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-2 transform skew-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-bold">{shortenAddress(address)}</span>
                    <button
                      onClick={() => copyAddressToClipboard(address)}
                      className="text-green-400 hover:text-green-200 ml-1 transition-colors"
                    >
                      <FiCopy size={16} />
                    </button>
                  </div>
                </div>
                <ConnectButton />
              </div>
            )}
          </div>
          
          {/* Comic panel corners */}
          <div className="absolute top-0 left-0 w-4 h-4 border-l-4 border-t-4 border-black"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-r-4 border-t-4 border-black"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l-4 border-b-4 border-black"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r-4 border-b-4 border-black"></div>        </div>
        
        {/* Navigation Tabs - Comic style */}
        <div className="flex gap-4 mb-6">
          {[
            { id: 'chat', label: 'CHAT', icon: '💬' },
            { id: 'video', label: 'VIDEO CALL', icon: '📹' },
            { id: 'games', label: 'GAMES', icon: '🎮' },
            { id: 'agents', label: 'AI AGENTS', icon: '🤖' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                relative px-6 py-3 font-black text-lg tracking-wider
                border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                transform hover:scale-105 transition-all duration-300
                ${activeTab === tab.id 
                  ? 'bg-gray-900 text-white -skew-x-6' 
                  : 'bg-white text-black hover:bg-gray-100'
                }
              `}
            >
              <div className={`flex items-center gap-2 ${activeTab === tab.id ? 'skew-x-6' : ''}`}>
                <span>{tab.icon}</span>
                {tab.label}
              </div>
              {activeTab === tab.id && (
                <>
                  <div className="absolute top-0 left-0 w-4 h-4 border-l-4 border-t-4 border-black"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-r-4 border-t-4 border-black"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-l-4 border-b-4 border-black"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-r-4 border-b-4 border-black"></div>
                </>
              )}
            </button>
          ))}
        </div>{/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="col-span-12">
              <ChatTab
                conversations={conversations}
                selectedConversation={selectedConversation}
                onSelectConversation={setSelectedConversation}
                onStartCall={startVideoCall}
                onNewConversation={() => setIsNewConversationModalOpen(true)}
              />
            </div>
          )}

          {/* Video Call Tab */}
          {activeTab === 'video' && (
            <div className="col-span-12">
              <VideoCall
                isInCall={isInCall}
                callRecipient={callRecipient}
                roomId={roomId}
                isVideoEnabled={isVideoEnabled}
                isAudioEnabled={isAudioEnabled}
                isScreenShareEnabled={isScreenShareEnabled}
                isRecordingEnabled={isRecordingEnabled}
                callError={callError}
                onStartCall={startVideoCall}
                onEndCall={endVideoCall}
                onToggleVideo={toggleVideo}
                onToggleAudio={toggleAudio}
                onToggleScreenShare={toggleScreenShare}
                onToggleRecording={toggleRecording}
                selectedConversationPeer={selectedConversation?.peerAddress}
              />
            </div>
          )}

          {/* Games Tab */}
          {activeTab === 'games' && (
            <div className="col-span-12">
              <div className="grid grid-cols-12 gap-6">
                {/* Conversation List for Game Context */}
                <div className="col-span-12 md:col-span-4">
                  <ConversationList
                    conversations={conversations}
                    selectedConversation={selectedConversation}
                    onSelectConversation={setSelectedConversation}
                    onStartCall={startVideoCall}
                    onNewConversation={() => setIsNewConversationModalOpen(true)}
                  />
                </div>
                
                {/* Game Hub */}
                <div className="col-span-12 md:col-span-8">
                  <GameHub
                    selectedConversationPeer={selectedConversation?.peerAddress}
                    onSendGameMessage={handleSendGameMessage}
                  />
                </div>
              </div>            </div>
          )}
          
          {/* AI Agents Tab */}
          {activeTab === 'agents' && (
            <div className="col-span-12">
              <AgentDashboard
                agents={agents}
                selectedAgent={selectedAgent}
                onSelectAgent={selectAgent}
                onCreateAgent={handleCreateAgent}
                onSendMessage={handleSendAgentMessage}
                onDisconnectAgent={handleDisconnectAgent}
                isCreateModalOpen={isCreateAgentModalOpen}
                onOpenCreateModal={() => setIsCreateAgentModalOpen(true)}
                onCloseCreateModal={() => setIsCreateAgentModalOpen(false)}
                messages={agentMessages}
                isLoadingMessages={isLoadingMessages}
                error={agentError}
                currentUserAddress={address || ""}
              />
            </div>
          )}        </div>
      </div>
      
      {/* Modals */}
      <NewConversationModal
        isOpen={isNewConversationModalOpen}
        onClose={() => setIsNewConversationModalOpen(false)}
        onStartConversation={handleStartNewConversation}
        error={clientError}
      />
    </div>
  );
};
