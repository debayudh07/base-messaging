"use client";
import React, { useState, useEffect } from 'react';

interface RockPaperScissorsProps {
  onGameEnd: (winner: string | null, gameData: any) => void;
  gameState?: any;
  isPlayerTurn?: boolean;
}

type Choice = 'rock' | 'paper' | 'scissors' | null;

export const RockPaperScissors: React.FC<RockPaperScissorsProps> = ({
  onGameEnd,
  gameState,
  isPlayerTurn = true
}) => {
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [opponentChoice, setOpponentChoice] = useState<Choice>(null);
  const [result, setResult] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  const choices = [
    { name: 'rock', emoji: '🪨', color: 'from-gray-400 to-gray-600' },
    { name: 'paper', emoji: '📄', color: 'from-blue-400 to-blue-600' },
    { name: 'scissors', emoji: '✂️', color: 'from-red-400 to-red-600' }
  ];

  const getWinner = (player: Choice, opponent: Choice): string => {
    if (!player || !opponent) return '';
    if (player === opponent) return 'tie';
    
    const winConditions = {
      rock: 'scissors',
      paper: 'rock',
      scissors: 'paper'
    };
    
    return winConditions[player] === opponent ? 'player' : 'opponent';
  };

  const handleChoice = (choice: Choice) => {
    if (!isPlayerTurn || playerChoice) return;
    
    setPlayerChoice(choice);
    
    // Simulate opponent choice (in real game, this would come from XMTP)
    const opponentChoices: Choice[] = ['rock', 'paper', 'scissors'];
    const randomChoice = opponentChoices[Math.floor(Math.random() * 3)];
    setOpponentChoice(randomChoice);
    
    setTimeout(() => {
      const winner = getWinner(choice, randomChoice);
      setResult(winner);
      setShowResult(true);
      
      if (winner === 'player') {
        setPlayerScore(prev => prev + 1);
      } else if (winner === 'opponent') {
        setOpponentScore(prev => prev + 1);
      }
      
      onGameEnd(winner, { playerChoice: choice, opponentChoice: randomChoice, winner });
    }, 2000);
  };

  const resetRound = () => {
    setPlayerChoice(null);
    setOpponentChoice(null);
    setResult(null);
    setShowResult(false);
  };

  const resetGame = () => {
    resetRound();
    setPlayerScore(0);
    setOpponentScore(0);
  };

  const getChoiceComponent = (choice: Choice, isPlayer: boolean) => {
    if (!choice) return null;
    
    const choiceData = choices.find(c => c.name === choice);
    if (!choiceData) return null;
    
    return (
      <div className={`
        text-6xl animate-bounce
        ${showResult ? 'animate-pulse' : ''}
      `}>
        {choiceData.emoji}
      </div>
    );
  };
  return (
    <div className="relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 max-w-md mx-auto transform hover:scale-[1.02] transition-transform duration-300">
      {/* Comic panel border effect */}
      <div className="absolute -top-2 -left-2 w-full h-full bg-gray-800 -z-10"></div>
      
      {/* Speed lines background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-0 left-1/4 w-px h-full bg-black transform -rotate-12 animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-black transform rotate-12 animate-pulse"></div>
      </div>
      
      <div className="text-center mb-6 relative z-10">
        {/* Comic speech bubble style title */}
        <div className="relative mb-4">
          <div className="bg-white border-3 border-black rounded-2xl p-3 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {/* Speech bubble tail */}
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-black"></div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-5 border-l-transparent border-r-transparent border-t-white"></div>
            
            <h3 className="text-xl font-black text-black tracking-wider transform -skew-x-6">
              ✊ ROCK PAPER SCISSORS
            </h3>
          </div>
        </div>
        
        <div className="flex justify-between text-sm mb-4">
          <div className="bg-gray-900 text-white px-3 py-1 border-2 border-black font-bold">
            YOU: {playerScore}
          </div>
          <div className="bg-red-500 text-white px-3 py-1 border-2 border-black font-bold">
            OPPONENT: {opponentScore}
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="mb-6 relative z-10">
        {playerChoice && opponentChoice ? (
          <div className="text-center">
            <div className="flex justify-between items-center mb-4">
              <div className="text-center">
                <div className="bg-gray-900 text-white px-2 py-1 border border-black font-bold text-xs mb-2">
                  YOU
                </div>
                <div className="bg-white border-2 border-black p-4 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  {getChoiceComponent(playerChoice, true)}
                </div>
              </div>
              
              <div className="text-4xl font-black animate-pulse">⚔️</div>
              
              <div className="text-center">
                <div className="bg-red-500 text-white px-2 py-1 border border-black font-bold text-xs mb-2">
                  BOT
                </div>
                <div className="bg-white border-2 border-black p-4 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  {getChoiceComponent(opponentChoice, false)}
                </div>
              </div>
            </div>
            
            {showResult && (
              <div className="text-center">
                <div className="bg-yellow-400 border-2 border-black px-4 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform -skew-x-3 mb-4">
                  <p className="font-black text-black transform skew-x-3">
                    {result === 'player' ? '🎉 YOU WIN!' : 
                     result === 'opponent' ? '😢 YOU LOSE!' : '🤝 TIE!'}
                  </p>
                </div>
                
                <button
                  onClick={resetRound}
                  className="bg-white border-3 border-black px-6 py-3 font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform hover:scale-105 transition-all duration-300"
                >
                  NEXT ROUND 🚀
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-gray-900 text-white px-6 py-3 border-2 border-black transform -skew-x-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-6">
              <p className="font-bold text-sm tracking-wider transform skew-x-3">
                {isPlayerTurn ? 'CHOOSE YOUR WEAPON!' : 'WAITING FOR OPPONENT...'}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {choices.map((choice) => (
                <button
                  key={choice.name}
                  onClick={() => handleChoice(choice.name as Choice)}
                  disabled={!isPlayerTurn || !!playerChoice}
                  className="bg-white border-3 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-4xl mb-2">{choice.emoji}</div>
                  <div className="font-black text-xs text-black">
                    {choice.name.toUpperCase()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {(playerScore > 0 || opponentScore > 0) && (
        <button
          onClick={resetGame}
          className="w-full bg-gray-300 border-2 border-black px-4 py-2 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transform transition-all duration-300 relative z-10"
        >
          RESET GAME
        </button>
      )}
      
      {/* Comic panel corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l-4 border-t-4 border-black"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-r-4 border-t-4 border-black"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l-4 border-b-4 border-black"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r-4 border-b-4 border-black"></div>
    </div>
  );
};
