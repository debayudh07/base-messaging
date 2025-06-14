# XMTP Game Synchronization Debug Guide

## Issue
Games are not getting updated on one side and the opponent is still waiting for their turn.

## Key Changes Made

### 1. Fixed useXMTPGame Hook (`lib/hooks/useXMTPGame.ts`)

**Problem Fixed:** 
- Message streaming was blocking in useEffect
- Turn logic was inconsistent between players
- State updates weren't properly synchronized

**Solutions Implemented:**
- Non-blocking message streaming with proper cleanup
- Clear turn alternation logic
- Immediate local state updates for responsive UI
- Better error handling and logging

### 2. Enhanced Game State Synchronization

**Turn Management:**
```typescript
// When receiving opponent move
case 'game-move':
  setState(prev => {
    const newGameState = processMove(message.data, prev.gameState);
    return {
      ...prev,
      gameState: newGameState,
      isPlayerTurn: true // Now it's this player's turn
    };
  });

// When sending own move
const sendMove = useCallback(async (moveData: any) => {
  setState(prev => {
    const newGameState = processMove({ ...moveData, sender: currentUserAddress }, prev.gameState);
    return {
      ...prev,
      gameState: newGameState,
      isPlayerTurn: false // Player made move, opponent's turn
    };
  });
  
  await sendGameMessage('game-move', {
    ...moveData,
    sender: currentUserAddress
  });
}, [sendGameMessage, currentUserAddress, processMove]);
```

### 3. Debug Features Added

**Console Logging:**
- All XMTP message sending/receiving
- Game state changes
- Turn switches
- Move attempts and blocks

**Visual Debug Panel:**
- Connection status
- Game state indicators
- Turn information
- Player ready status

**TicTacToe Debug Info:**
- Move blocking reasons
- Board state tracking
- Current player display

## Debugging Steps

### 1. Check Console Logs
Look for these log messages:
- `"Sent game message:"` - Outgoing XMTP messages
- `"Received game message:"` - Incoming XMTP messages  
- `"TicTacToe: Making move"` - Move attempts
- `"TicTacToe: Move blocked"` - Blocked moves with reasons

### 2. Monitor Debug Panel
In development mode, check the yellow debug panel for:
- Connection status
- Game started state
- Player ready states
- Turn indicators

### 3. Verify XMTP Connection
Ensure both players have:
- Active XMTP client connection
- Valid peer addresses
- Successful conversation initialization

### 4. Test Game Flow
1. Player A starts game → sends `game-invite`
2. Player B receives invite → auto-ready
3. Player A auto-ready → game starts
4. Players alternate turns via `game-move` messages

## Common Issues & Solutions

### Issue: Game not starting
**Check:**
- Both players connected to XMTP
- Game invitation sent/received
- Both players marked as ready

**Debug:**
```javascript
// Check in browser console
console.log('XMTP Client:', client);
console.log('Game State:', gameState);
console.log('Players Ready:', { playerReady, opponentReady });
```

### Issue: Turns not switching
**Check:**
- `isPlayerTurn` value in debug panel
- Move messages being sent/received
- Game state synchronization

**Verify:**
- Player A makes move → `isPlayerTurn: false`
- Player B receives move → `isPlayerTurn: true`

### Issue: State not updating
**Check:**
- XMTP message streaming active
- Game message parsing successful
- State update functions called

## Message Flow Diagram

```
Player A                    XMTP                    Player B
   |                         |                         |
   |-- game-invite --------->|                         |
   |                         |------game-invite------>|
   |                         |                         |
   |                         |<-----game-ready--------|
   |<-- game-ready ----------|                         |
   |                         |                         |
   |-- game-move ----------->|                         |
   |                         |------game-move-------->|
   |                         |                         |
   |                         |<-----game-move---------|
   |<-- game-move ----------|                         |
```

## Testing Checklist

- [ ] Both players can connect to XMTP
- [ ] Game invitation sent and received
- [ ] Both players marked as ready
- [ ] Game starts automatically
- [ ] Moves are sent via XMTP
- [ ] Opponent receives moves
- [ ] Turn switches correctly
- [ ] Game state stays synchronized
- [ ] Game ends properly

## Next Steps

If synchronization issues persist:

1. **Check XMTP Message Delivery:**
   - Verify messages appear in XMTP conversation
   - Test with simple text messages first

2. **Simplify Game Logic:**
   - Start with basic turn-based moves
   - Add complexity gradually

3. **Add Message Acknowledgments:**
   - Confirm message receipt
   - Implement retry mechanisms

4. **Consider Fallback Mechanisms:**
   - State reconciliation on reconnection
   - Periodic state sync messages
