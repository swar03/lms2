require('dotenv').config();
const { sendOTPEmail } = require('./src/services/emailService');

async function testSES() {
  try {
    console.log('Testing AWS SES...');
    await sendOTPEmail('swarchaudhary42@gmail.com', '123456');
    console.log('✅ Email sent successfully! Check your inbox.');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testSES();
