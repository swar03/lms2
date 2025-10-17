const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1';

async function testLoginFlow() {
  console.log('🧪 Testing Complete Login Flow\n');

  // Test with your email
  const testEmail = 'swar.c@somaiya.edu';
  const testPassword = 'your-password'; // Replace with actual password

  console.log('1️⃣ Testing Login...');
  console.log(`Email: ${testEmail}`);
  
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: testEmail,
      password: testPassword
    });

    console.log('✅ Login Response:');
    console.log(JSON.stringify(response.data, null, 2));

    if (response.data.token) {
      const token = response.data.token;
      console.log('\n🎫 Token received:', token.substring(0, 20) + '...');

      // Test dashboard access
      console.log('\n2️⃣ Testing Dashboard Access...');
      const dashboardResponse = await axios.get(`${BASE_URL}/student/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('✅ Dashboard Response:');
      console.log(JSON.stringify(dashboardResponse.data, null, 2));

      console.log('\n✅ Login flow working! User can access dashboard.');
    }
  } catch (error) {
    console.log('❌ Error:');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.message);
    console.log('Full error:', JSON.stringify(error.response?.data, null, 2));

    if (error.response?.data?.needsVerification) {
      console.log('\n⚠️  Email not verified. User needs to verify email first.');
    }
  }
}

testLoginFlow();