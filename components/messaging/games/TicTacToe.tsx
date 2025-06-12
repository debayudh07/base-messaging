"use client";
import React, { useState, useEffect } from 'react';
import { FiX, FiCircle } from 'react-icons/fi';

interface TicTacToeProps {
  onGameEnd: (winner: string | null, gameData: any) => void;
  gameState?: any;
  isPlayerTurn?: boolean;
  playerSymbol?: 'X' | 'O';
}

export const TicTacToe: React.FC<TicTacToeProps> = ({
  onGameEnd,
  gameState,
  isPlayerTurn = true,
  playerSymbol = 'X'
}) => {
  const [board, setBoard] = useState<(string | null)[]>(
    gameState?.board || Array(9).fill(null)
  );
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>(
    gameState?.currentPlayer || 'X'
  );
  const [winner, setWinner] = useState<string | null>(null);
  const [winningLine, setWinningLine] = useState<number[]>([]);

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  const checkWinner = (board: (string | null)[]) => {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line: combination };
      }
    }
    if (board.every(cell => cell !== null)) {
      return { winner: 'tie', line: [] };
    }
    return { winner: null, line: [] };
  };

  useEffect(() => {
    const result = checkWinner(board);
    if (result.winner) {
      setWinner(result.winner);
      setWinningLine(result.line);
      onGameEnd(result.winner, { board, currentPlayer });
    }
  }, [board]);

  const handleCellClick = (index: number) => {
    if (board[index] || winner || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine([]);
  };
  const renderCell = (index: number) => {
    const value = board[index];
    const isWinningCell = winningLine.includes(index);
    
    return (
      <button
        key={index}
        onClick={() => handleCellClick(index)}
        className={`
          w-20 h-20 border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
          flex items-center justify-center text-2xl font-black
          transition-all duration-300 transform hover:scale-105
          ${isWinningCell ? 'bg-yellow-400 animate-pulse' : ''}
          ${value ? 'cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}
          ${!isPlayerTurn && !value ? 'opacity-50' : ''}
        `}
        disabled={!!value || !!winner || !isPlayerTurn}
      >
        {value === 'X' && (
          <FiX className={`${isWinningCell ? 'text-black' : 'text-red-600'} animate-bounce`} />
        )}
        {value === 'O' && (
          <FiCircle className={`${isWinningCell ? 'text-black' : 'text-blue-600'} animate-bounce`} />
        )}
      </button>
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
      
      <div className="text-center mb-4 relative z-10">
        {/* Comic speech bubble style title */}
        <div className="relative mb-4">
          <div className="bg-white border-3 border-black rounded-2xl p-3 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {/* Speech bubble tail */}
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-black"></div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-5 border-l-transparent border-r-transparent border-t-white"></div>
            
            <h3 className="text-xl font-black text-black tracking-wider transform -skew-x-6">
              🎯 TIC-TAC-TOE
            </h3>
          </div>
        </div>
        
        {winner ? (
          <div className="bg-yellow-400 border-2 border-black px-4 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform -skew-x-3 mb-4">
            <p className="font-black text-black transform skew-x-3">
              {winner === 'tie' ? "IT'S A TIE! 🤝" : `${winner.toUpperCase()} WINS! 🎉`}
            </p>
          </div>
        ) : (
          <div className="bg-gray-900 text-white px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
            <p className="font-bold text-sm">
              {isPlayerTurn ? `YOUR TURN (${playerSymbol})` : "OPPONENT'S TURN"}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4 relative z-10">
        {Array.from({ length: 9 }, (_, index) => renderCell(index))}
      </div>

      {winner && (
        <button
          onClick={resetGame}
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
