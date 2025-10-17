const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1';

async function testIntegration() {
  console.log('🧪 Testing LMS Backend Integration...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing health check...');
    const health = await axios.get('http://localhost:5000/health');
    console.log('✅ Health check:', health.data.message);
    console.log('📊 Database:', health.data.database);

    // Test 2: Test Authentication
    console.log('\n2. Testing authentication...');
    const authResponse = await axios.post(`${BASE_URL}/auth/test`, {
      email: 'student@test.com',
      role: 'STUDENT',
      fullName: 'Test Student'
    });
    console.log('✅ Test auth successful');
    const token = authResponse.data.token;

    // Test 3: Get Courses
    console.log('\n3. Testing courses endpoint...');
    const coursesResponse = await axios.get(`${BASE_URL}/courses`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Courses retrieved:', coursesResponse.data.data?.length || 0, 'courses');

    // Test 4: Get Dashboard
    console.log('\n4. Testing dashboard endpoint...');
    const dashboardResponse = await axios.get(`${BASE_URL}/dashboard/student`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Dashboard data retrieved');

    // Test 5: Get Notifications
    console.log('\n5. Testing notifications endpoint...');
    const notificationsResponse = await axios.get(`${BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Notifications retrieved:', notificationsResponse.data.data?.length || 0, 'notifications');

    console.log('\n🎉 All tests passed! Backend is ready for frontend integration.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.log('\n💡 Make sure the server is running: npm start');
  }
}

// Run tests if server is available
setTimeout(testIntegration, 2000);