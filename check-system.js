const axios = require('axios');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function checkPostgreSQL() {
  console.log('🗄️  Checking PostgreSQL...');
  try {
    const { stdout } = await execAsync('docker ps --filter "name=postgres" --format "table {{.Names}}\\t{{.Status}}"');
    if (stdout.includes('postgres')) {
      console.log('✅ PostgreSQL container is running');
      return true;
    } else {
      console.log('❌ PostgreSQL container not found');
      return false;
    }
  } catch (error) {
    console.log('❌ Docker not available or PostgreSQL not running');
    return false;
  }
}

async function checkBackend() {
  console.log('🔧 Checking Backend...');
  try {
    const response = await axios.get('http://localhost:5000/health', { timeout: 3000 });
    console.log('✅ Backend is running:', response.data.message);
    console.log('📊 Database status:', response.data.database);
    return true;
  } catch (error) {
    console.log('❌ Backend not responding on port 5000');
    return false;
  }
}

async function checkFrontend() {
  console.log('🎨 Checking Frontend...');
  try {
    const response = await axios.get('http://localhost:5173', { timeout: 3000 });
    console.log('✅ Frontend is running on port 5173');
    return true;
  } catch (error) {
    console.log('❌ Frontend not responding on port 5173');
    return false;
  }
}

async function testCriticalAPIs() {
  console.log('🧪 Testing Critical APIs...');
  const tests = [
    { name: 'Courses', url: 'http://localhost:5000/api/v1/courses' },
    { name: 'Users', url: 'http://localhost:5000/api/v1/users' },
    { name: 'Dashboard', url: 'http://localhost:5000/api/v1/dashboard/student' },
    { name: 'Notifications', url: 'http://localhost:5000/api/v1/notifications' }
  ];

  let passed = 0;
  for (const test of tests) {
    try {
      await axios.get(test.url, { timeout: 2000 });
      console.log(`✅ ${test.name} API working`);
      passed++;
    } catch (error) {
      console.log(`❌ ${test.name} API failed`);
    }
  }
  
  console.log(`📊 API Status: ${passed}/${tests.length} endpoints working`);
  return passed === tests.length;
}

async function runSystemCheck() {
  console.log('🔍 LMS System Health Check\n');
  
  const dbStatus = await checkPostgreSQL();
  const backendStatus = await checkBackend();
  const frontendStatus = await checkFrontend();
  
  if (backendStatus) {
    await testCriticalAPIs();
  }
  
  console.log('\n📋 System Status Summary:');
  console.log(`   Database: ${dbStatus ? '✅ Running' : '❌ Not Running'}`);
  console.log(`   Backend: ${backendStatus ? '✅ Running' : '❌ Not Running'}`);
  console.log(`   Frontend: ${frontendStatus ? '✅ Running' : '❌ Not Running'}`);
  
  if (dbStatus && backendStatus && frontendStatus) {
    console.log('\n🎉 All systems operational!');
    console.log('🌐 Access your LMS at: http://localhost:5173');
  } else {
    console.log('\n⚠️  Some services need attention:');
    if (!dbStatus) console.log('   - Start PostgreSQL: docker-compose up -d');
    if (!backendStatus) console.log('   - Start Backend: cd lms-backend && npm start');
    if (!frontendStatus) console.log('   - Start Frontend: cd LMS1/frontend && npm run dev');
  }
}

runSystemCheck().catch(console.error);