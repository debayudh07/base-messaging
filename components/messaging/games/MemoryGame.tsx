/*eslint-disable*/
"use client";
import React, { useState, useEffect, useCallback } from 'react';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  onGameEnd: (winner: string | null, gameData: any) => void;
  gameState?: any;
  isPlayerTurn?: boolean;
  onMove?: (move: any) => void;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({
  onGameEnd,
  gameState: externalGameState,
  isPlayerTurn = true,
  onMove
}) => {
  const emojis = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎵', '🎸'];
  
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(1000);

  // Update local state when external game state changes
  useEffect(() => {
    if (externalGameState) {
      setCards(externalGameState.cards || []);
      setFlippedCards(externalGameState.flippedCards || []);
      
      if (externalGameState.scores) {
        const playerScores = Object.values(externalGameState.scores);
        setScore(playerScores[0] as number || 0);
      }
    }
  }, [externalGameState]);

  const initializeGame = useCallback(() => {
    const shuffledEmojis = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }));
    
    setCards(shuffledEmojis);
    setFlippedCards([]);
    setMoves(0);
    setGameComplete(false);
    setScore(1000);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const timer = setTimeout(() => {
        const [first, second] = flippedCards;
        const firstCard = cards.find(card => card.id === first);
        const secondCard = cards.find(card => card.id === second);

        if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
          // Match found
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isMatched: true }
              : card
          ));
          setScore(prev => prev + 100);
        } else {
          // No match
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isFlipped: false }
              : card
          ));
          setScore(prev => Math.max(0, prev - 10));
        }
        
        setFlippedCards([]);
        setMoves(prev => prev + 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    const allMatched = cards.length > 0 && cards.every(card => card.isMatched);
    if (allMatched && !gameComplete) {
      setGameComplete(true);
      const finalScore = Math.max(0, score - (moves * 5));
      onGameEnd('player', { moves, score: finalScore, time: Date.now() });
    }
  }, [cards, gameComplete, onGameEnd, score, moves]);
  const handleCardClick = (cardId: number) => {
    if (!isPlayerTurn || flippedCards.length === 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    // If using WebSocket, send move to server
    if (onMove) {
      onMove({
        type: 'card-flip',
        cardId: cardId
      });
    } else {
      // Local game logic (fallback)
      setCards(prev => prev.map(c => 
        c.id === cardId ? { ...c, isFlipped: true } : c
      ));
      
      setFlippedCards(prev => [...prev, cardId]);
    }
  };

  const getCardClassName = (card: Card) => {
    let className = `
      w-16 h-16 rounded-lg border-2 border-pink-400 
      flex items-center justify-center text-2xl font-bold
      transition-all duration-500 transform cursor-pointer
      hover:scale-105 relative preserve-3d
    `;

    if (card.isFlipped || card.isMatched) {
      className += ' rotateY-180';
    }

    if (card.isMatched) {
      className += ' bg-gradient-to-br from-green-400 to-emerald-500 animate-pulse';
    } else if (card.isFlipped) {
      className += ' bg-gradient-to-br from-pink-400 to-purple-500';
    } else {
      className += ' bg-gradient-to-br from-blue-500 to-purple-600 hover:from-purple-500 hover:to-pink-500';
    }

    return className;
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
      
      <div className="text-center mb-4 relative z-10">
        {/* Comic speech bubble style title */}
        <div className="relative mb-4">
          <div className="bg-white border-3 border-black rounded-2xl p-3 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {/* Speech bubble tail */}
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-black"></div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-5 border-l-transparent border-r-transparent border-t-white"></div>
            
            <h3 className="text-xl font-black text-black tracking-wider transform -skew-x-6">
              🧠 MEMORY GAME
            </h3>
          </div>
        </div>
        
        <div className="flex justify-between text-sm mb-4">
          <div className="bg-gray-900 text-white px-3 py-1 border-2 border-black font-bold">
            MOVES: {moves}
          </div>
          <div className="bg-yellow-400 text-black px-3 py-1 border-2 border-black font-bold">
            SCORE: {score}
          </div>
        </div>
        
        {gameComplete ? (
          <div className="text-center mb-4">
            <div className="bg-green-400 border-2 border-black px-4 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform -skew-x-3 mb-2">
              <p className="font-black text-black transform skew-x-3">
                🎉 COMPLETED!
              </p>
            </div>
            <div className="bg-yellow-400 text-black px-3 py-1 border-2 border-black font-bold">
              FINAL SCORE: {Math.max(0, score - (moves * 5))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 text-white px-6 py-3 border-2 border-black transform -skew-x-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-bold text-sm tracking-wider transform skew-x-3">
              FIND ALL MATCHING PAIRS!
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4 relative z-10">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`
              w-16 h-16 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
              flex items-center justify-center text-2xl font-black
              transition-all duration-300 transform cursor-pointer
              hover:scale-105 relative
              ${card.isMatched ? 'bg-green-400 animate-pulse' : ''}
              ${card.isFlipped && !card.isMatched ? 'bg-blue-400' : ''}
              ${!card.isFlipped && !card.isMatched ? 'bg-gray-200 hover:bg-gray-300' : ''}
            `}
          >
            {card.isFlipped || card.isMatched ? (
              <span className={card.isMatched ? 'text-black' : 'text-white'}>
                {card.emoji}
              </span>
            ) : (
              <span className="text-black">?</span>
            )}
          </div>
        ))}
      </div>

      {gameComplete && (
        <button
          onClick={initializeGame}
          className="w-full bg-white border-3 border-black px-6 py-3 font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform hover:scale-105 transition-all duration-300 relative z-10"
        >
          PLAY AGAIN 🚀
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
