const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1';

// Test individual endpoints
const tests = {
  async register() {
    console.log('📝 Testing Registration Endpoint\n');
    
    const testData = {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      mobile: '9876543210',
      password: 'securepass123'
    };

    console.log('Request:');
    console.log(`POST ${BASE_URL}/auth/register`);
    console.log(JSON.stringify(testData, null, 2));
    console.log('\n---\n');

    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, testData);
      
      console.log('✅ Success Response:');
      console.log(JSON.stringify(response.data, null, 2));
      
      if (response.data.devOTP) {
        console.log('\n🔑 Development OTP:', response.data.devOTP);
        console.log('\n💡 Next step: Verify with this OTP');
        console.log(`node test-single-endpoint.js verify ${response.data.email} ${response.data.devOTP}`);
      }
    } catch (error) {
      console.log('❌ Error Response:');
      console.log('Status:', error.response?.status);
      console.log('Data:', JSON.stringify(error.response?.data, null, 2));
    }
  },

  async verify(email, otp) {
    console.log('✅ Testing Verify OTP Endpoint\n');
    
    const testData = { email, otp };

    console.log('Request:');
    console.log(`POST ${BASE_URL}/auth/verify-otp`);
    console.log(JSON.stringify(testData, null, 2));
    console.log('\n---\n');

    try {
      const response = await axios.post(`${BASE_URL}/auth/verify-otp`, testData);
      
      console.log('✅ Success Response:');
      console.log(JSON.stringify(response.data, null, 2));
      
      console.log('\n💡 Next step: Login with your credentials');
      console.log(`node test-single-endpoint.js login ${email} password`);
    } catch (error) {
      console.log('❌ Error Response:');
      console.log('Status:', error.response?.status);
      console.log('Data:', JSON.stringify(error.response?.data, null, 2));
    }
  },

  async resend(email) {
    console.log('🔄 Testing Resend OTP Endpoint\n');
    
    const testData = { email };

    console.log('Request:');
    console.log(`POST ${BASE_URL}/auth/resend-otp`);
    console.log(JSON.stringify(testData, null, 2));
    console.log('\n---\n');

    try {
      const response = await axios.post(`${BASE_URL}/auth/resend-otp`, testData);
      
      console.log('✅ Success Response:');
      console.log(JSON.stringify(response.data, null, 2));
      
      if (response.data.devOTP) {
        console.log('\n🔑 New OTP:', response.data.devOTP);
      }
    } catch (error) {
      console.log('❌ Error Response:');
      console.log('Status:', error.response?.status);
      console.log('Data:', JSON.stringify(error.response?.data, null, 2));
    }
  },

  async login(email, password) {
    console.log('🔐 Testing Login Endpoint\n');
    
    const testData = { email, password };

    console.log('Request:');
    console.log(`POST ${BASE_URL}/auth/login`);
    console.log(JSON.stringify(testData, null, 2));
    console.log('\n---\n');

    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, testData);
      
      console.log('✅ Success Response:');
      console.log(JSON.stringify(response.data, null, 2));
      
      console.log('\n🎫 Token:', response.data.token);
      console.log('\n💡 Next step: Get user info');
      console.log(`node test-single-endpoint.js me ${response.data.token}`);
    } catch (error) {
      console.log('❌ Error Response:');
      console.log('Status:', error.response?.status);
      console.log('Data:', JSON.stringify(error.response?.data, null, 2));
    }
  },

  async me(token) {
    console.log('👤 Testing Get Current User Endpoint\n');

    console.log('Request:');
    console.log(`GET ${BASE_URL}/auth/me`);
    console.log('Authorization: Bearer', token.substring(0, 20) + '...');
    console.log('\n---\n');

    try {
      const response = await axios.get(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Success Response:');
      console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log('❌ Error Response:');
      console.log('Status:', error.response?.status);
      console.log('Data:', JSON.stringify(error.response?.data, null, 2));
    }
  },

  async health() {
    console.log('💚 Testing Health Check\n');

    console.log('Request:');
    console.log(`GET ${BASE_URL.replace('/api/v1', '')}/health`);
    console.log('\n---\n');

    try {
      const response = await axios.get(`${BASE_URL.replace('/api/v1', '')}/health`);
      
      console.log('✅ Success Response:');
      console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log('❌ Error Response:');
      console.log('Status:', error.response?.status);
      console.log('Data:', JSON.stringify(error.response?.data, null, 2));
    }
  }
};

// Parse command line arguments
const [,, command, ...args] = process.argv;

async function main() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║     EMAIL API ENDPOINT TESTER             ║');
  console.log('╚════════════════════════════════════════════╝\n');

  if (!command || !tests[command]) {
    console.log('Usage: node test-single-endpoint.js <command> [args]\n');
    console.log('Available commands:');
    console.log('  health                           - Test health check');
    console.log('  register                         - Test registration');
    console.log('  verify <email> <otp>            - Test OTP verification');
    console.log('  resend <email>                  - Test resend OTP');
    console.log('  login <email> <password>        - Test login');
    console.log('  me <token>                      - Test get current user');
    console.log('\nExamples:');
    console.log('  node test-single-endpoint.js health');
    console.log('  node test-single-endpoint.js register');
    console.log('  node test-single-endpoint.js verify john@example.com 123456');
    console.log('  node test-single-endpoint.js login john@example.com password123');
    return;
  }

  await tests[command](...args);
  
  console.log('\n✅ Test completed!\n');
}

main().catch(error => {
  console.error('\n❌ Test failed:', error.message);
  process.exit(1);
});