# XMTP Game System

This document explains how the games have been modified to work with XMTP messaging instead of WebSocket connections.

## Overview

The game system now uses XMTP (Extensible Message Transport Protocol) for peer-to-peer game communication, eliminating the need for a centralized WebSocket server. This provides better decentralization and privacy for gaming sessions.

## Architecture

### Core Components

1. **useXMTPGame Hook** (`lib/hooks/useXMTPGame.ts`)
   - Manages XMTP-based game communication
   - Handles game state synchronization
   - Processes game moves and events
   - Replaces the previous `useGameSocket` hook

2. **Game Components**
   - `TicTacToe.tsx` - Three-in-a-row strategy game
   - `RockPaperScissors.tsx` - Quick reflex game
   - `MemoryGame.tsx` - Memory card matching game
   - `GameHub.tsx` - Game selection and management interface

### Message Flow

1. **Game Invitation**
   ```
   Player A → XMTP → Player B: game-invite
   Player B → XMTP → Player A: game-ready
   ```

2. **Game Moves**
   ```
   Player A → XMTP → Player B: game-move
   Player B → XMTP → Player A: game-move
   ```

3. **Game End**
   ```
   Winner → XMTP → Opponent: game-end
   ```

## Message Types

### GameMessage Interface
```typescript
interface GameMessage {
  type: 'game-invite' | 'game-move' | 'game-state' | 'game-end' | 'game-ready';
  gameType: 'tictactoe' | 'rps' | 'memory';
  gameId: string;
  data: any;
  timestamp: number;
  sender: string;
}
```

### Message Types Details

1. **game-invite**: Sent to invite another player to a game
2. **game-ready**: Confirms player is ready to start
3. **game-move**: Contains player move data
4. **game-state**: Synchronizes game state between players
5. **game-end**: Indicates game completion with results

## Game-Specific Implementation

### Tic-Tac-Toe
- **Move Data**: `{ type: 'cell-click', cellIndex: number, symbol: 'X'|'O' }`
- **State**: Board array with player symbols
- **Turn Logic**: Alternates between players based on moves

### Rock Paper Scissors
- **Move Data**: `{ type: 'choice', choice: 'rock'|'paper'|'scissors' }`
- **State**: Player choices and scores
- **Result Logic**: Determines winner when both players choose

### Memory Game
- **Move Data**: `{ type: 'card-flip', cardId: number }`
- **State**: Card positions, matches, and scores
- **Turn Logic**: Players alternate turns flipping cards

## Key Features

### Decentralized Gaming
- No central server required
- Direct peer-to-peer communication
- Enhanced privacy and security

### State Synchronization
- Real-time game state updates
- Conflict resolution for simultaneous moves
- Automatic game recovery

### Error Handling
- Connection failure detection
- Message parsing error recovery
- Graceful disconnection handling

## Usage

### Starting a Game

1. Select a conversation with another user
2. Choose a game from the GameHub
3. The system automatically sends a game invitation
4. Wait for opponent to accept and be ready
5. Game begins automatically when both players are ready

### During Gameplay

- Take turns making moves
- Game state is automatically synchronized
- Receive real-time notifications of opponent moves
- Game ends automatically when win condition is met

### Game Management

- View game statistics (games played, won, total score)
- End games early if needed
- Return to game hub to select different games

## Technical Benefits

1. **Reduced Infrastructure**: No need for game servers
2. **Better Privacy**: Direct peer-to-peer communication
3. **Lower Latency**: Direct messaging between peers
4. **Offline Capability**: Games work as long as XMTP connection exists
5. **Scalability**: No server bottlenecks

## Migration from WebSocket

The key changes made during migration:

1. Replaced `useGameSocket` with `useXMTPGame`
2. Updated message format to include game-specific prefixes
3. Modified game components to handle XMTP messaging
4. Implemented direct peer-to-peer game state management
5. Added game message types to the type system

## Future Enhancements

Potential improvements for the XMTP game system:

1. **Tournament Mode**: Multi-player tournament brackets
2. **Spectator Mode**: Allow others to watch games
3. **Replay System**: Save and replay games
4. **Advanced Analytics**: Detailed game statistics
5. **Custom Games**: User-created game modes
