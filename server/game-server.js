const { Server } = require('socket.io');
const http = require('http');

// Game state management
const gameRooms = new Map();

// Create HTTP server
const server = http.createServer();

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join game room
  socket.on('join-game', ({ roomId, peer, gameType }) => {
    console.log(`${socket.id} joining room ${roomId} as ${peer}`);
    
    let room = gameRooms.get(roomId);
    
    if (!room) {
      // Create new room
      room = {
        id: roomId,
        players: [],
        gameType,
        gameState: null,
        createdAt: Date.now()
      };
      gameRooms.set(roomId, room);
    }

    // Add player to room if not already present
    const existingPlayer = room.players.find(p => p.peer === peer);
    if (!existingPlayer) {
      room.players.push({
        id: socket.id,
        peer,
        ready: false
      });
    } else {
      // Update socket ID for reconnected player
      existingPlayer.id = socket.id;
    }

    socket.join(roomId);
    
    // Notify room about player join
    io.to(roomId).emit('player-joined', {
      players: room.players,
      gameState: room.gameState
    });

    console.log(`Room ${roomId} now has ${room.players.length} players`);
  });

  // Player ready
  socket.on('player-ready', ({ roomId, peer }) => {
    const room = gameRooms.get(roomId);
    if (!room) return;

    const player = room.players.find(p => p.peer === peer);
    if (player) {
      player.ready = true;
      
      // Check if both players are ready
      const allReady = room.players.length === 2 && room.players.every(p => p.ready);
      
      io.to(roomId).emit('player-ready-update', {
        players: room.players,
        allReady,
        canStart: allReady
      });

      if (allReady) {
        // Initialize game state based on game type
        let initialGameState;
        
        switch (room.gameType) {
          case 'tictactoe':
            initialGameState = {
              board: Array(9).fill(null),
              currentPlayer: 'X',
              playerSymbols: {
                [room.players[0].peer]: 'X',
                [room.players[1].peer]: 'O'
              }
            };
            break;
          case 'rps':
            initialGameState = {
              round: 1,
              choices: {},
              scores: {
                [room.players[0].peer]: 0,
                [room.players[1].peer]: 0
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
              currentPlayer: room.players[0].peer,
              scores: {
                [room.players[0].peer]: 0,
                [room.players[1].peer]: 0
              },
              flippedCards: []
            };
            break;
        }
        
        room.gameState = initialGameState;
        room.currentPlayer = room.players[0].peer;
        
        io.to(roomId).emit('game-start', {
          gameState: initialGameState,
          currentPlayer: room.currentPlayer
        });
      }
    }
  });

  // Game move
  socket.on('game-move', ({ roomId, move, peer }) => {
    const room = gameRooms.get(roomId);
    if (!room || !room.gameState) return;

    console.log(`Game move from ${peer} in room ${roomId}:`, move);

    // Validate if it's the player's turn
    if (room.currentPlayer !== peer) {
      console.log(`Invalid turn: expected ${room.currentPlayer}, got ${peer}`);
      return;
    }

    // Process move based on game type
    let gameEnd = false;
    let winner = null;

    switch (room.gameType) {
      case 'tictactoe':
        if (move.type === 'cell-click' && move.cellIndex !== undefined) {
          const { cellIndex } = move;
          if (room.gameState.board[cellIndex] === null) {
            const currentSymbol = room.gameState.playerSymbols[peer];
            room.gameState.board[cellIndex] = currentSymbol;
            
            // Check for winner
            const winningCombos = [
              [0, 1, 2], [3, 4, 5], [6, 7, 8],
              [0, 3, 6], [1, 4, 7], [2, 5, 8],
              [0, 4, 8], [2, 4, 6]
            ];
            
            for (const combo of winningCombos) {
              const [a, b, c] = combo;
              if (room.gameState.board[a] && 
                  room.gameState.board[a] === room.gameState.board[b] && 
                  room.gameState.board[a] === room.gameState.board[c]) {
                winner = peer;
                gameEnd = true;
                break;
              }
            }
            
            // Check for tie
            if (!gameEnd && room.gameState.board.every(cell => cell !== null)) {
              winner = 'tie';
              gameEnd = true;
            }
            
            // Switch player
            if (!gameEnd) {
              room.currentPlayer = room.players.find(p => p.peer !== peer)?.peer || peer;
            }
          }
        }
        break;

      case 'rps':
        if (move.type === 'choice' && move.choice) {
          room.gameState.choices[peer] = move.choice;
          
          // Check if both players have chosen
          const bothChosen = room.players.every(p => room.gameState.choices[p.peer]);
          
          if (bothChosen) {
            const [player1, player2] = room.players;
            const choice1 = room.gameState.choices[player1.peer];
            const choice2 = room.gameState.choices[player2.peer];
            
            // Determine winner
            const getWinner = (c1, c2, p1, p2) => {
              if (c1 === c2) return 'tie';
              const winConditions = {
                rock: 'scissors',
                paper: 'rock',
                scissors: 'paper'
              };
              return winConditions[c1] === c2 ? p1 : p2;
            };
            
            const roundWinner = getWinner(choice1, choice2, player1.peer, player2.peer);
            
            if (roundWinner !== 'tie') {
              room.gameState.scores[roundWinner]++;
            }
            
            // Clear choices for next round
            room.gameState.choices = {};
            room.gameState.round++;
            
            // Check for game end (first to 3 wins)
            if (room.gameState.scores[player1.peer] >= 3 || room.gameState.scores[player2.peer] >= 3) {
              winner = room.gameState.scores[player1.peer] >= 3 ? player1.peer : player2.peer;
              gameEnd = true;
            }
          }
        }
        break;

      case 'memory':
        if (move.type === 'card-flip' && move.cardId !== undefined) {
          const card = room.gameState.cards.find(c => c.id === move.cardId);
          if (card && !card.isFlipped && !card.isMatched) {
            card.isFlipped = true;
            room.gameState.flippedCards.push(move.cardId);
            
            // Check for match when 2 cards are flipped
            if (room.gameState.flippedCards.length === 2) {
              const [card1Id, card2Id] = room.gameState.flippedCards;
              const card1 = room.gameState.cards.find(c => c.id === card1Id);
              const card2 = room.gameState.cards.find(c => c.id === card2Id);
              
              if (card1.emoji === card2.emoji) {
                // Match found
                card1.isMatched = true;
                card2.isMatched = true;
                room.gameState.scores[peer]++;
              } else {
                // No match - flip back after delay
                setTimeout(() => {
                  card1.isFlipped = false;
                  card2.isFlipped = false;
                  room.gameState.flippedCards = [];
                  
                  // Switch player turn
                  room.currentPlayer = room.players.find(p => p.peer !== peer)?.peer || peer;
                  
                  io.to(roomId).emit('game-update', {
                    gameState: room.gameState,
                    currentPlayer: room.currentPlayer
                  });
                }, 1500);
                
                // Send immediate update with flipped cards
                io.to(roomId).emit('game-update', {
                  gameState: room.gameState,
                  currentPlayer: room.currentPlayer
                });
                return;
              }
              
              room.gameState.flippedCards = [];
              
              // Check if game is complete
              const allMatched = room.gameState.cards.every(c => c.isMatched);
              if (allMatched) {
                const scores = room.gameState.scores;
                const [p1, p2] = room.players;
                winner = scores[p1.peer] > scores[p2.peer] ? p1.peer : 
                         scores[p1.peer] < scores[p2.peer] ? p2.peer : 'tie';
                gameEnd = true;
              }
            }
          }
        }
        break;
    }

    // Emit game update
    io.to(roomId).emit('game-update', {
      gameState: room.gameState,
      currentPlayer: room.currentPlayer,
      move: move
    });

    // Handle game end
    if (gameEnd) {
      io.to(roomId).emit('game-end', {
        winner,
        finalState: room.gameState
      });
      
      // Reset room for new game
      room.gameState = null;
      room.currentPlayer = undefined;
      room.players.forEach(p => p.ready = false);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    // Remove player from all rooms
    for (const [roomId, room] of gameRooms.entries()) {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        const disconnectedPlayer = room.players[playerIndex];
        
        // Notify other players
        io.to(roomId).emit('player-disconnected', {
          peer: disconnectedPlayer.peer,
          players: room.players.filter(p => p.id !== socket.id)
        });
        
        // Remove player or clean up room
        if (room.players.length === 1) {
          gameRooms.delete(roomId);
        } else {
          room.players.splice(playerIndex, 1);
        }
        
        break;
      }
    }
  });
});

const PORT = process.env.SOCKET_PORT || 3001;

server.listen(PORT, () => {
  console.log(`🎮 Game WebSocket server running on port ${PORT}`);
  console.log(`🌍 CORS enabled for all origins`);
  console.log(`📊 Game rooms: 0 active`);
});

// Clean up old rooms every hour
const oneHour = 60 * 60 * 1000;
setInterval(() => {
  const now = Date.now();
  
  for (const [roomId, room] of gameRooms.entries()) {
    if (now - room.createdAt > oneHour) {
      gameRooms.delete(roomId);
      console.log(`🧹 Cleaned up old room: ${roomId}`);
    }
  }
}, oneHour);
