@echo off
echo 🚀 Starting Complete LMS System...
echo.

echo 📦 Setting up Backend...
cd lms-backend
call npm run setup
if %errorlevel% neq 0 (
    echo ❌ Backend setup failed
    pause
    exit /b 1
)

echo.
echo 🧪 Verifying APIs...
call npm run verify
if %errorlevel% neq 0 (
    echo ⚠️ Some APIs may have issues, but continuing...
)

echo.
echo 🚀 Starting Backend Server...
start "LMS Backend" cmd /k "cd /d %cd% && npm start"

echo.
echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo 🎨 Starting Frontend...
cd ..\LMS1\frontend
start "LMS Frontend" cmd /k "npm run dev"

echo.
echo 🎉 LMS System Started!
echo.
echo 📊 Services:
echo    Backend: http://localhost:5000
echo    Frontend: http://localhost:5173
echo    Database: PostgreSQL on port 5432
echo.
echo 🔑 Test Accounts:
echo    Admin: admin@lms.com / password123
echo    Manager: manager@lms.com / password123
echo    Student: student@test.com / password123
echo.
echo Press any key to exit...
pause > nul