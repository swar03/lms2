const { sendEmail } = require('./src/services/emailService');

async function testEmail() {
  console.log('Testing email service...');
  
  try {
    const result = await sendEmail(
      'swarchaudhary42@gmail.com', 
      'welcome', 
      { fullName: 'Test User' }
    );
    
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('Message ID:', result.messageId);
    } else {
      console.log('❌ Email failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testEmail();