# 🧪 Test Login & Dashboard Guide

## Quick Test Steps

### 1. Start Backend
```bash
cd lms-backend
npm start
```

Wait for: `✅ Server ready for frontend integration!`

### 2. Start Frontend
```bash
cd LMS1/frontend
npm run dev
```

### 3. Test Login Flow

#### Option A: Use Test Dashboard (Recommended)
1. Go to: `http://localhost:5173/test-dashboard`
2. If not logged in, you'll be redirected to login
3. Login with: `swar.c@somaiya.edu` / your-password
4. You'll see all user data and dashboard data in JSON format
5. Click "Go to Real Dashboard" to see the actual dashboard

#### Option B: Direct Login
1. Go to: `http://localhost:5173/login`
2. Enter email: `swar.c@somaiya.edu`
3. Enter password
4. Click "Sign in"
5. Should redirect to `/dashboard`

## Troubleshooting

### Issue: "Please verify your email first"
**Solution:**
1. Go to `/register` and register with your email
2. Check console logs for OTP (development mode shows OTP)
3. Go to `/verify-otp` and enter OTP
4. Then login

### Issue: Stuck on login page after clicking "Sign in"
**Check:**
1. Open browser console (F12)
2. Look for errors
3. Check Network tab for API calls
4. Verify token is saved in localStorage

### Issue: Redirected back to login after successful login
**Cause:** ProtectedRoute not recognizing user role
**Solution:** Already fixed - ProtectedRoute now handles both `role` and `roles`

### Issue: Dashboard shows "Loading..." forever
**Check:**
1. Backend is running on port 5000
2. Check browser console for errors
3. Verify API calls in Network tab
4. Check backend console for errors

## Debug Commands

### Check if user is logged in (Browser Console)
```javascript
console.log('Token:', localStorage.getItem('token'));
console.log('User:', JSON.parse(localStorage.getItem('user')));
```

### Test API directly (Backend)
```bash
cd lms-backend
node test-login-flow.js
```

### Clear login state (Browser Console)
```javascript
localStorage.clear();
location.reload();
```

## Expected Flow

1. **Register** → Email sent with OTP
2. **Verify OTP** → Email verified
3. **Login** → Token saved, user data saved
4. **Dashboard** → Loads user-specific data

## API Endpoints Being Used

- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user
- `GET /api/v1/student/dashboard` - Get dashboard data
- `GET /api/v1/student/profile` - Get profile
- `PUT /api/v1/student/profile` - Update profile

## Success Indicators

✅ Login page shows "Login successful!" toast
✅ Browser redirects to `/dashboard`
✅ Dashboard shows user name
✅ Dashboard shows course modules
✅ No errors in console

## Test Accounts

| Email | Password | Status |
|-------|----------|--------|
| admin@lms.com | password123 | ✅ Pre-verified |
| manager@lms.com | password123 | ✅ Pre-verified |
| swar.c@somaiya.edu | your-password | ⚠️ Needs verification |

## Quick Fix Commands

### Reset everything
```bash
# Backend
cd lms-backend
npm run setup

# Frontend
cd LMS1/frontend
# Clear browser localStorage
# Refresh page
```

### Check server status
```bash
curl http://localhost:5000/health
```

### Test login API
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lms.com","password":"password123"}'
```

---

**If still having issues, use the Test Dashboard at `/test-dashboard` to see exactly what's happening!**