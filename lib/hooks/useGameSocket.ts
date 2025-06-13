/*eslint-disable*/
import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseGameSocketProps {
  roomId: string;
  peer: string;
  gameType: 'tictactoe' | 'rps' | 'memory';
  onGameUpdate?: (data: any) => void;
  onGameEnd?: (data: any) => void;
  onPlayerJoined?: (data: any) => void;
  onPlayerDisconnected?: (data: any) => void;
}

interface GameSocketState {
  connected: boolean;
  players: { id: string; peer: string; ready: boolean }[];
  gameState: any;
  currentPlayer: string | null;
  allPlayersReady: boolean;
  gameStarted: boolean;
  isPlayerTurn: boolean;
}

export const useGameSocket = ({
  roomId,
  peer,
  gameType,
  onGameUpdate,
  onGameEnd,
  onPlayerJoined,
  onPlayerDisconnected
}: UseGameSocketProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [state, setState] = useState<GameSocketState>({
    connected: false,
    players: [],
    gameState: null,
    currentPlayer: null,
    allPlayersReady: false,
    gameStarted: false,
    isPlayerTurn: false
  });

  const socketRef = useRef<Socket | null>(null);
  // Initialize socket connection
  useEffect(() => {
    if (!roomId || !peer) return;

    console.log('Initializing socket connection...');
    
    // Connect directly to the game server
    const newSocket = io(process.env.NODE_ENV === 'production' 
      ? 'wss://your-domain.com:3001' 
      : 'http://localhost:3001', {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

      // Connection events
      newSocket.on('connect', () => {
        console.log('Connected to socket server');
        setState(prev => ({ ...prev, connected: true }));
        
        // Join the game room
        newSocket.emit('join-game', { roomId, peer, gameType });
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from socket server');
        setState(prev => ({ 
          ...prev, 
          connected: false,
          gameStarted: false 
        }));
      });

      // Game events
      newSocket.on('player-joined', (data) => {
        console.log('Player joined:', data);
        setState(prev => ({ 
          ...prev, 
          players: data.players,
          gameState: data.gameState 
        }));
        onPlayerJoined?.(data);
      });

      newSocket.on('player-ready-update', (data) => {
        console.log('Player ready update:', data);
        setState(prev => ({ 
          ...prev, 
          players: data.players,
          allPlayersReady: data.allReady 
        }));
      });

      newSocket.on('game-start', (data) => {
        console.log('Game started:', data);
        setState(prev => ({ 
          ...prev, 
          gameState: data.gameState,
          currentPlayer: data.currentPlayer,
          gameStarted: true,
          isPlayerTurn: data.currentPlayer === peer 
        }));
      });

      newSocket.on('game-update', (data) => {
        console.log('Game update:', data);
        setState(prev => ({ 
          ...prev, 
          gameState: data.gameState,
          currentPlayer: data.currentPlayer,
          isPlayerTurn: data.currentPlayer === peer 
        }));
        onGameUpdate?.(data);
      });

      newSocket.on('game-end', (data) => {
        console.log('Game ended:', data);
        setState(prev => ({ 
          ...prev, 
          gameStarted: false,
          currentPlayer: null,
          isPlayerTurn: false 
        }));
        onGameEnd?.(data);
      });

      newSocket.on('player-disconnected', (data) => {
        console.log('Player disconnected:', data);
        setState(prev => ({ 
          ...prev, 
          players: data.players,
          gameStarted: false 
        }));
        onPlayerDisconnected?.(data);      });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [roomId, peer, gameType, onGameUpdate, onGameEnd, onPlayerJoined, onPlayerDisconnected]);

  // Mark player as ready
  const markReady = useCallback(() => {
    if (socket && socket.connected) {
      socket.emit('player-ready', { roomId, peer });
    }
  }, [socket, roomId, peer]);

  // Send game move
  const sendMove = useCallback((move: any) => {
    if (socket && socket.connected && state.isPlayerTurn) {
      console.log('Sending move:', move);
      socket.emit('game-move', { roomId, move, peer });
    } else {
      console.warn('Cannot send move:', {
        connected: socket?.connected,
        isPlayerTurn: state.isPlayerTurn
      });
    }
  }, [socket, roomId, peer, state.isPlayerTurn]);

  // Disconnect from socket
  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
    }
  }, [socket]);

  return {
    ...state,
    socket,
    markReady,
    sendMove,
    disconnect
  };
};
