#!/usr/bin/env node

/**
 * Script to start multiple game server instances for testing fallback logic
 * Usage: node scripts/start-test-servers.js
 */

const { spawn } = require('child_process');
const path = require('path');
const net = require('net');

// Ports for test servers - try a range to find available ones
const PREFERRED_PORTS = [3001, 3002, 3003];
const FALLBACK_PORTS = [3004, 3005, 3006, 3007, 3008, 3009];
const ALL_PORTS = [...PREFERRED_PORTS, ...FALLBACK_PORTS];
const processes = [];
let startedCount = 0;
const TARGET_SERVERS = 3; // How many servers we want to start

console.log('🚀 Starting test game servers for fallback testing...');
console.log('📋 Will try to start 3 servers on available ports from:', ALL_PORTS.join(', '));

// Function to check if a port is available
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.close(() => {
        resolve(true);
      });
    });
    
    server.on('error', () => {
      resolve(false);
    });
  });
}

// Function to start a server on a specific port
async function startServer(port) {
  const isAvailable = await isPortAvailable(port);
  
  if (!isAvailable) {
    console.log(`⚠️  Port ${port} is already in use, skipping...`);
    return null;
  }

  const serverPath = path.join(__dirname, '..', 'server', 'game-server.js');
  
  console.log(`🎮 Starting game server on port ${port}...`);
  
  const serverProcess = spawn('node', [serverPath], {
    env: { ...process.env, SOCKET_PORT: port },
    stdio: 'pipe'
  });

  serverProcess.stdout.on('data', (data) => {
    console.log(`[Server ${port}] ${data.toString().trim()}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`[Server ${port}] ERROR: ${data.toString().trim()}`);
  });

  serverProcess.on('close', (code) => {
    console.log(`[Server ${port}] Process exited with code ${code}`);
  });

  serverProcess.on('error', (error) => {
    console.error(`[Server ${port}] Failed to start:`, error.message);
  });

  return serverProcess;
}

// Start all servers
async function startAllServers() {
  console.log('🔍 Checking port availability...');
  
  for (const port of ALL_PORTS) {
    if (startedCount >= TARGET_SERVERS) {
      console.log(`✅ Target of ${TARGET_SERVERS} servers reached!`);
      break;
    }
    
    const serverProcess = await startServer(port);
    if (serverProcess) {
      processes.push({ process: serverProcess, port });
      startedCount++;
      console.log(`✅ Server ${startedCount}/${TARGET_SERVERS} started on port ${port}`);
    }
  }
  
  if (processes.length === 0) {
    console.log('❌ No servers could be started (all ports in use)');
    console.log('💡 Try stopping existing servers or running: npm run check-ports');
    process.exit(1);
  } else {
    console.log(`\n🎉 Started ${processes.length}/${TARGET_SERVERS} servers successfully!`);
    console.log('📊 Active servers:');
    processes.forEach(({ port }, index) => {
      console.log(`   ${index + 1}. http://localhost:${port}`);
    });
    console.log('\n💡 You can now test the fallback logic in your app.');
    console.log('🔧 To test fallback, stop servers one by one using Ctrl+C.');
    console.log('⏹️  Press Ctrl+C to stop all servers.');
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down all test servers...');
  
  processes.forEach(({ process: serverProcess, port }) => {
    if (serverProcess) {
      console.log(`🔄 Stopping server on port ${port}...`);
      serverProcess.kill('SIGTERM');
    }
  });
  
  setTimeout(() => {
    console.log('✅ All servers stopped.');
    process.exit(0);
  }, 2000);
});

// Start the servers
startAllServers().catch((error) => {
  console.error('❌ Failed to start servers:', error.message);
  process.exit(1);
});
