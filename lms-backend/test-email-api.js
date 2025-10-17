const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1';

console.log('🧪 Testing Email Verification API\n');

async function testRegistration() {
  console.log('1️⃣ Testing Registration...');
  
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      fullName: 'Test User',
      email: 'test@example.com',
      mobile: '1234567890',
      password: 'password123'
    });

    console.log('✅ Registration Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.data.devOTP) {
      console.log('\n🔑 OTP for testing:', response.data.devOTP);
      return { email: response.data.email, otp: response.data.devOTP };
    }
    
    return { email: response.data.email };
  } catch (error) {
    console.log('❌ Registration Failed:');
    console.log(error.response?.data || error.message);
    return null;
  }
}

async function testVerifyOTP(email, otp) {
  console.log('\n2️⃣ Testing OTP Verification...');
  console.log(`Email: ${email}`);
  console.log(`OTP: ${otp}`);
  
  try {
    const response = await axios.post(`${BASE_URL}/auth/verify-otp`, {
      email,
      otp
    });

    console.log('✅ Verification Response:');
    console.log(JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.log('❌ Verification Failed:');
    console.log(error.response?.data || error.message);
    return false;
  }
}

async function testResendOTP(email) {
  console.log('\n3️⃣ Testing Resend OTP...');
  
  try {
    const response = await axios.post(`${BASE_URL}/auth/resend-otp`, {
      email
    });

    console.log('✅ Resend OTP Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.data.devOTP) {
      console.log('\n🔑 New OTP:', response.data.devOTP);
      return response.data.devOTP;
    }
    
    return null;
  } catch (error) {
    console.log('❌ Resend OTP Failed:');
    console.log(error.response?.data || error.message);
    return null;
  }
}

async function testLogin(email, password) {
  console.log('\n4️⃣ Testing Login...');
  
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password
    });

    console.log('✅ Login Response:');
    console.log(JSON.stringify(response.data, null, 2));
    return response.data.token;
  } catch (error) {
    console.log('❌ Login Failed:');
    console.log(error.response?.data || error.message);
    return null;
  }
}

async function testGetMe(token) {
  console.log('\n5️⃣ Testing Get Current User...');
  
  try {
    const response = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('✅ Current User Response:');
    console.log(JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.log('❌ Get User Failed:');
    console.log(error.response?.data || error.message);
    return false;
  }
}

async function runFullTest() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   EMAIL VERIFICATION API TEST SUITE       ║');
  console.log('╚════════════════════════════════════════════╝\n');

  // Test 1: Registration
  const registrationData = await testRegistration();
  if (!registrationData) {
    console.log('\n❌ Test suite stopped - Registration failed');
    return;
  }

  // Wait a bit for email to be sent
  console.log('\n⏳ Waiting 2 seconds for email to be sent...');
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 2: Verify OTP
  if (registrationData.otp) {
    const verified = await testVerifyOTP(registrationData.email, registrationData.otp);
    
    if (verified) {
      // Test 3: Login after verification
      const token = await testLogin(registrationData.email, 'password123');
      
      if (token) {
        // Test 4: Get current user
        await testGetMe(token);
      }
    }
  } else {
    console.log('\n⚠️  No OTP returned. Check your email or console logs for the OTP.');
    console.log('📧 If using Ethereal Email, check console for preview URL');
    
    // Test resend OTP
    const newOTP = await testResendOTP(registrationData.email);
    
    if (newOTP) {
      console.log('\n💡 You can now verify with OTP:', newOTP);
      console.log('Run this command to verify:');
      console.log(`curl -X POST ${BASE_URL}/auth/verify-otp -H "Content-Type: application/json" -d '{"email":"${registrationData.email}","otp":"${newOTP}"}'`);
    }
  }

  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║          TEST SUITE COMPLETED             ║');
  console.log('╚════════════════════════════════════════════╝');
}

// Run tests
runFullTest().catch(error => {
  console.error('\n❌ Test suite error:', error.message);
  process.exit(1);
});