// Startup script for LMS Backend
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting LMS Backend Setup...');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env file not found. Creating sample .env...');
  const sampleEnv = `# Database
DATABASE_URL="postgresql://username:password@localhost:5432/lms_db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"

# Frontend URL
FRONTEND_URL="http://localhost:5173"

# Environment
NODE_ENV="development"

# Port
PORT=3000`;
  
  fs.writeFileSync(envPath, sampleEnv);
  console.log('✅ Sample .env file created. Please update with your actual values.');
}

// Check if node_modules exists
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('📦 Installing dependencies...');
  exec('npm install axios', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Error installing dependencies:', error);
      return;
    }
    console.log('✅ Dependencies installed successfully');
    startServer();
  });
} else {
  startServer();
}

function startServer() {
  console.log('\n🔄 Starting database migration...');
  exec('npx prisma migrate dev', (error, stdout, stderr) => {
    if (error) {
      console.log('⚠️  Database migration failed. Make sure PostgreSQL is running and DATABASE_URL is correct.');
      console.log('You can run manually: npx prisma migrate dev');
    } else {
      console.log('✅ Database migration completed');
    }
    
    console.log('\n🌱 Seeding database...');
    exec('npx prisma db seed', (error, stdout, stderr) => {
      if (error) {
        console.log('⚠️  Database seeding failed. You can run manually: npx prisma db seed');
      } else {
        console.log('✅ Database seeded successfully');
      }
      
      console.log('\n🚀 Starting LMS Backend Server...');
      console.log('\n📋 Quick Start Guide:');
      console.log('   1. Make sure PostgreSQL is running');
      console.log('   2. Update .env file with your database credentials');
      console.log('   3. Server will start on http://localhost:3000');
      console.log('   4. Test enrollment workflow with: npm run test-enrollment');
      console.log('\n🔗 Key Endpoints:');
      console.log('   • POST /api/register - Register student');
      console.log('   • POST /api/login - Login');
      console.log('   • GET /api/courses - List courses');
      console.log('   • POST /api/enrollments - Enroll in course');
      console.log('   • GET /api/notifications - Get notifications');
      console.log('   • GET /api/dashboard/student - Student dashboard');
      console.log('   • GET /api/dashboard/manager - Manager dashboard');
      console.log('\n💡 Enrollment Workflow:');
      console.log('   1. Student registers → Creates PENDING enrollment');
      console.log('   2. Manager gets notification');
      console.log('   3. Manager approves/denies via dashboard');
      console.log('   4. Student gets notification about decision');
      
      // Start the actual server
      require('./src/app.js');
    });
  });
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down LMS Backend Server...');
  process.exit(0);
});