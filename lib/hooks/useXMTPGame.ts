/*eslint-disable*/
import { useState, useCallback, useEffect } from 'react';

interface UseXMTPGameProps {
  gameType: 'tictactoe' | 'rps' | 'memory';
  peerAddress: string;
  currentUserAddress: string;
  onGameUpdate?: (data: any) => void;
  onGameEnd?: (data: any) => void;
  onGameInvite?: (data: any) => void;
  onOpponentMove?: (data: any) => void;
  onPlayerJoined?: (data: any) => void;
  onPlayerDisconnected?: (data: any) => void;
}

interface GameState {
  connected: boolean;
  players: string[];
  gameState: any;
  currentPlayer: string | null;
  allPlayersReady: boolean;
  gameStarted: boolean;
  isPlayerTurn: boolean;
  playerSymbol: string | null;
  opponentReady: boolean;
  playerReady: boolean;
}

export const useXMTPGame = ({
  gameType,
  peerAddress,
  currentUserAddress,
  onGameUpdate,
  onGameEnd,
  onGameInvite,
  onOpponentMove,
  onPlayerJoined,
  onPlayerDisconnected
}: UseXMTPGameProps) => {
  const [state, setState] = useState<GameState>({
    connected: false,
    players: [],
    gameState: null,
    currentPlayer: null,
    allPlayersReady: false,
    gameStarted: false,
    isPlayerTurn: false,
    playerSymbol: null,
    opponentReady: false,
    playerReady: false
  });

  // Initialize game connection
  useEffect(() => {
    if (!peerAddress || !currentUserAddress) return;

    // Simulate connection for now
    setState(prev => ({
      ...prev,
      connected: true,
      players: [currentUserAddress, peerAddress]
    }));

    console.log('XMTP Game initialized:', { gameType, peerAddress, currentUserAddress });
  }, [gameType, peerAddress, currentUserAddress]);

  // Start/initialize a game
  const startGame = useCallback(() => {
    if (!state.connected) return;

    console.log('Starting XMTP game:', gameType);
    
    let initialGameState: any = null;
    let playerSymbol: string | null = null;

    switch (gameType) {
      case 'tictactoe':
        initialGameState = {
          board: Array(9).fill(null),
          currentPlayer: 'X'
        };
        playerSymbol = 'X'; // First player gets X
        break;
      case 'rps':
        initialGameState = {
          round: 1,
          choices: {},
          scores: {
            [currentUserAddress]: 0,
            [peerAddress]: 0
          }
        };
        break;
      case 'memory':
        const emojis = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎵', '🎸'];
        const shuffledCards = [...emojis, ...emojis]
          .sort(() => Math.random() - 0.5)
          .map((emoji, index) => ({
            id: index,
            emoji,
            isFlipped: false,
            isMatched: false
          }));
        
        initialGameState = {
          cards: shuffledCards,
          currentPlayer: currentUserAddress,
          scores: {
            [currentUserAddress]: 0,
            [peerAddress]: 0
          }
        };
        break;
    }

    setState(prev => ({
      ...prev,
      gameState: initialGameState,
      gameStarted: true,
      currentPlayer: currentUserAddress,
      isPlayerTurn: true,
      playerSymbol,
      allPlayersReady: true
    }));

    // TODO: Send game invitation via XMTP
    console.log('Game started with initial state:', initialGameState);
  }, [gameType, currentUserAddress, peerAddress, state.connected]);

  // Mark player as ready
  const markReady = useCallback(() => {
    setState(prev => ({
      ...prev,
      playerReady: true
    }));
    
    // TODO: Send ready message via XMTP
    console.log('Player marked as ready');
  }, []);

  // Send a game move
  const sendMove = useCallback((move: any) => {
    if (!state.isPlayerTurn || !state.gameStarted) {
      console.warn('Cannot send move: not player turn or game not started');
      return;
    }

    console.log('Sending move via XMTP:', move);
    
    // Update local game state based on move
    let newGameState = { ...state.gameState };
    let gameEnded = false;
    let winner = null;

    switch (gameType) {
      case 'tictactoe':
        if (move.type === 'cell-click' && move.cellIndex !== undefined) {
          newGameState.board[move.cellIndex] = state.playerSymbol;
          
          // Check for winner (basic implementation)
          const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
          ];
          
          for (const combo of winningCombos) {
            const [a, b, c] = combo;
            if (newGameState.board[a] && 
                newGameState.board[a] === newGameState.board[b] && 
                newGameState.board[a] === newGameState.board[c]) {
              winner = currentUserAddress;
              gameEnded = true;
              break;
            }
          }
          
          // Switch turns
          newGameState.currentPlayer = state.playerSymbol === 'X' ? 'O' : 'X';
        }
        break;
        
      case 'rps':
        if (move.type === 'choice') {
          newGameState.choices[currentUserAddress] = move.choice;
        }
        break;
        
      case 'memory':
        if (move.type === 'card-flip') {
          const card = newGameState.cards.find((c: any) => c.id === move.cardId);
          if (card) {
            card.isFlipped = true;
          }
        }
        break;
    }

    setState(prev => ({
      ...prev,
      gameState: newGameState,
      currentPlayer: newGameState.currentPlayer,
      isPlayerTurn: !prev.isPlayerTurn
    }));

    onGameUpdate?.(newGameState);

    if (gameEnded) {
      setState(prev => ({
        ...prev,
        gameStarted: false
      }));
      onGameEnd?.({ winner, gameState: newGameState });
    }

    // TODO: Send move via XMTP
  }, [gameType, state.gameState, state.isPlayerTurn, state.gameStarted, state.playerSymbol, currentUserAddress, onGameUpdate, onGameEnd]);

  // End the game
  const endGame = useCallback(() => {
    setState(prev => ({
      ...prev,
      gameStarted: false,
      gameState: null,
      currentPlayer: null,
      isPlayerTurn: false
    }));
    
    // TODO: Send end game message via XMTP
    console.log('Game ended');
  }, []);

  return {
    ...state,
    startGame,
    markReady,
    sendMove,
    endGame
  };
};
