"use client";
import React, { useState } from 'react';
import { TicTacToe } from './TicTacToe';
import { RockPaperScissors } from './RockPaperScissors';
import { MemoryGame } from './MemoryGame';
import {  FiArrowLeft, FiPlay } from 'react-icons/fi';
type GameType = 'tictactoe' | 'rps' | 'memory' | null;

interface GameHubProps {
  selectedConversationPeer?: string;
  onSendGameMessage?: (gameType: string, gameData: any) => void;
}

export const GameHub: React.FC<GameHubProps> = ({
  selectedConversationPeer,
  onSendGameMessage
}) => {
  const [currentGame, setCurrentGame] = useState<GameType>(null);
  const [playerStats, setPlayerStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    totalScore: 0
  });

  const games = [
    {
      id: 'tictactoe',
      name: 'Tic-Tac-Toe',
      emoji: '⭕',
      description: 'Classic strategy game',
      color: 'from-pink-500 to-rose-500',
      difficulty: 'Easy'
    },
    {
      id: 'rps',
      name: 'Rock Paper Scissors',
      emoji: '✂️',
      description: 'Quick reflex game',
      color: 'from-blue-500 to-cyan-500',
      difficulty: 'Easy'
    },
    {
      id: 'memory',
      name: 'Memory Cards',
      emoji: '🧠',
      description: 'Test your memory',
      color: 'from-purple-500 to-indigo-500',
      difficulty: 'Medium'
    }
  ];

  const handleGameEnd = (winner: string | null, gameData: any) => {
    setPlayerStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      gamesWon: prev.gamesWon + (winner === 'player' ? 1 : 0),
      totalScore: prev.totalScore + (gameData.score || 0)
    }));

    if (onSendGameMessage && selectedConversationPeer) {
      onSendGameMessage(currentGame || 'unknown', {
        ...gameData,
        winner,
        timestamp: Date.now()
      });
    }
  };

  const startGame = (gameType: GameType) => {
    setCurrentGame(gameType);
  };

  const backToHub = () => {
    setCurrentGame(null);
  };

  const renderGame = () => {
    switch (currentGame) {
      case 'tictactoe':
        return (
          <TicTacToe
            onGameEnd={handleGameEnd}
            isPlayerTurn={true}
            playerSymbol="X"
          />
        );
      case 'rps':
        return (
          <RockPaperScissors
            onGameEnd={handleGameEnd}
            isPlayerTurn={true}
          />
        );
      case 'memory':
        return (
          <MemoryGame
            onGameEnd={handleGameEnd}
            isPlayerTurn={true}
          />
        );
      default:
        return null;
    }
  };
  if (currentGame) {
    return (
      <div className="relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 transform hover:scale-[1.02] transition-transform duration-300">
        {/* Comic panel border effect */}
        <div className="absolute -top-2 -left-2 w-full h-full bg-gray-800 -z-10"></div>
        
        <div className="space-y-4 relative z-10">
          <button
            onClick={backToHub}
            className="flex items-center gap-2 bg-white border-2 border-black px-4 py-2 font-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transform transition-all duration-300"
          >
            <FiArrowLeft /> BACK TO GAMES
          </button>
          {renderGame()}
        </div>
        
        {/* Comic panel corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-l-4 border-t-4 border-black"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-r-4 border-t-4 border-black"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-l-4 border-b-4 border-black"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-r-4 border-b-4 border-black"></div>
      </div>
    );
  }
  return (
    <div className="relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 transform hover:scale-[1.02] transition-transform duration-300">
      {/* Comic panel border effect */}
      <div className="absolute -top-2 -left-2 w-full h-full bg-gray-800 -z-10"></div>
      
      {/* Speed lines background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-0 left-1/4 w-px h-full bg-black transform -rotate-12 animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-black transform rotate-12 animate-pulse"></div>
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="relative mb-4">
            <div className="bg-white border-3 border-black rounded-2xl p-4 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {/* Speech bubble tail */}
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-black"></div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-5 border-l-transparent border-r-transparent border-t-white"></div>
              
              <h2 className="text-2xl font-black text-black tracking-wider transform -skew-x-6 flex items-center justify-center gap-2">
                <FiPlay className="text-red-600" />
                <span className="skew-x-6">ANIME GAME HUB</span>
              </h2>
            </div>
          </div>
          
          <div className="bg-gray-900 text-white px-6 py-3 border-2 border-black transform -skew-x-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-bold text-sm tracking-wider transform skew-x-3">
              CHOOSE A MINI-GAME TO PLAY!
            </p>
          </div>
        </div>

        {/* Player Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center bg-white border-2 border-black p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-2xl font-black text-red-600">{playerStats.gamesPlayed}</div>
            <div className="text-sm font-bold text-black">GAMES PLAYED</div>
          </div>
          <div className="text-center bg-white border-2 border-black p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-2xl font-black text-green-600">{playerStats.gamesWon}</div>
            <div className="text-sm font-bold text-black">GAMES WON</div>
          </div>
          <div className="text-center bg-white border-2 border-black p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-2xl font-black text-blue-600">{playerStats.totalScore}</div>
            <div className="text-sm font-bold text-black">TOTAL SCORE</div>
          </div>
        </div>

        {/* Game Selection */}
        <div className="grid gap-4">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => startGame(game.id as GameType)}
              disabled={!selectedConversationPeer}
              className={`
                relative bg-white border-3 border-black p-4 text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                ${!selectedConversationPeer ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 transform'}
                transition-all duration-300
              `}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-gray-900 border-2 border-black flex items-center justify-center text-2xl text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {game.emoji}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-black text-black mb-1">{game.name.toUpperCase()}</h3>
                  <p className="text-gray-600 text-sm mb-2 font-bold">{game.description.toUpperCase()}</p>
                  <div className="flex items-center gap-2">
                    <span className={`
                      px-2 py-1 border-2 border-black text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                      ${game.difficulty === 'Easy' ? 'bg-green-400 text-black' :
                        game.difficulty === 'Medium' ? 'bg-yellow-400 text-black' :
                        'bg-red-400 text-white'}
                    `}>
                      {game.difficulty.toUpperCase()}
                    </span>
                    {selectedConversationPeer && (
                      <span className="text-xs bg-gray-900 text-white px-2 py-1 border border-black font-bold">
                        CLICK TO PLAY!
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-red-600 text-xl font-black">
                  ▶️
                </div>
              </div>
            </button>
          ))}
        </div>

        {!selectedConversationPeer && (
          <div className="text-center mt-6 bg-yellow-400 border-2 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform -skew-x-3">
            <p className="text-black text-sm font-black transform skew-x-3">
              💡 SELECT A CONVERSATION TO START PLAYING GAMES WITH FRIENDS!
            </p>
          </div>
        )}
      </div>
      
      {/* Comic panel corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l-4 border-t-4 border-black"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-r-4 border-t-4 border-black"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l-4 border-b-4 border-black"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r-4 border-b-4 border-black"></div>
    </div>
  );
};
