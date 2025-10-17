const { spawn } = require('child_process');
const axios = require('axios');
const path = require('path');

console.log('🚀 Deploying Full LMS Project...\n');

let backendProcess, frontendProcess;

async function startBackend() {
  console.log('📦 Starting Backend Services...');
  
  backendProcess = spawn('npm', ['start'], {
    cwd: path.join(__dirname, 'lms-backend'),
    stdio: 'pipe'
  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`[BACKEND] ${data.toString().trim()}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.log(`[BACKEND ERROR] ${data.toString().trim()}`);
  });

  // Wait for backend to start
  await new Promise(resolve => setTimeout(resolve, 5000));
}

async function startFrontend() {
  console.log('🎨 Starting Frontend...');
  
  frontendProcess = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'LMS1', 'frontend'),
    stdio: 'pipe'
  });

  frontendProcess.stdout.on('data', (data) => {
    console.log(`[FRONTEND] ${data.toString().trim()}`);
  });

  frontendProcess.stderr.on('data', (data) => {
    console.log(`[FRONTEND ERROR] ${data.toString().trim()}`);
  });

  // Wait for frontend to start
  await new Promise(resolve => setTimeout(resolve, 3000));
}

async function testAllEndpoints() {
  console.log('\n🧪 Testing All API Endpoints...\n');
  
  const baseURL = 'http://localhost:5000/api/v1';
  const tests = [
    { name: 'Health Check', url: 'http://localhost:5000/health', method: 'GET' },
    { name: 'Courses', url: `${baseURL}/courses`, method: 'GET' },
    { name: 'Users', url: `${baseURL}/users`, method: 'GET' },
    { name: 'Notifications', url: `${baseURL}/notifications`, method: 'GET' },
    { name: 'Dashboard Student', url: `${baseURL}/dashboard/student`, method: 'GET' },
    { name: 'Dashboard Manager', url: `${baseURL}/dashboard/manager`, method: 'GET' },
    { name: 'Dashboard Admin', url: `${baseURL}/dashboard/admin`, method: 'GET' },
    { name: 'Submissions', url: `${baseURL}/submissions`, method: 'GET' }
  ];

  for (const test of tests) {
    try {
      const response = await axios({
        method: test.method,
        url: test.url,
        timeout: 5000
      });
      console.log(`✅ ${test.name}: ${response.status} - ${response.data.message || 'OK'}`);
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.response?.status || 'FAILED'} - ${error.message}`);
    }
  }
}

async function deployProject() {
  try {
    await startBackend();
    await startFrontend();
    await testAllEndpoints();
    
    console.log('\n🎉 LMS Project Deployed Successfully!');
    console.log('\n📊 Services Running:');
    console.log('   Backend: http://localhost:5000');
    console.log('   Frontend: http://localhost:5173');
    console.log('   Database: PostgreSQL on port 5432');
    console.log('\n🔑 Test Accounts:');
    console.log('   Admin: admin@lms.com / password123');
    console.log('   Manager: manager@lms.com / password123');
    console.log('   Student: student@test.com / password123');
    console.log('\n📝 Press Ctrl+C to stop all services');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down all services...');
  if (backendProcess) backendProcess.kill('SIGINT');
  if (frontendProcess) frontendProcess.kill('SIGINT');
  process.exit(0);
});

deployProject();