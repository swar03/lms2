const { spawn } = require('child_process');

console.log('🚀 Starting LMS Backend Server...\n');

const server = spawn('node', ['src/integrated-server.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  detached: false
});

server.on('error', (error) => {
  console.error('❌ Server error:', error.message);
});

server.on('exit', (code, signal) => {
  if (signal) {
    console.log(`\n📊 Server stopped by signal: ${signal}`);
  } else {
    console.log(`\n📊 Server exited with code: ${code}`);
  }
});

// Keep the process alive
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping server...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Stopping server...');
  server.kill('SIGTERM');
});

console.log('📝 Server process started. Press Ctrl+C to stop.');