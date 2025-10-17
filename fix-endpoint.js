// Quick fix for the endpoint URL issue
// Change from: /api/v1/auth/test
// Change to:   /api/auth/test

// The backend routes are mounted as:
// app.use('/api', authRoutes); 
// And the test route is: router.post('/auth/test', ...)
// So the full path is: /api/auth/test

console.log('✅ Correct endpoint URL: http://localhost:5000/api/auth/test');
console.log('❌ Incorrect URL you were using: http://localhost:5000/api/v1/auth/test');