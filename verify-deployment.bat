@echo off
REM TrueState Project - Pre-Deployment Verification Script (Windows)
REM Run this script to verify everything is ready for deployment

setlocal enabledelayedexpansion

cls
echo ================================
echo TrueState Pre-Deployment Check
echo ================================
echo.

set PASSED=0
set FAILED=0

REM Check Node.js
echo 1. Checking Node.js Installation
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [PASS] Node.js installed (!NODE_VERSION!)
    set /a PASSED+=1
) else (
    echo [FAIL] Node.js not installed
    set /a FAILED+=1
)

npm --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo [PASS] npm installed (!NPM_VERSION!)
    set /a PASSED+=1
) else (
    echo [FAIL] npm not installed
    set /a FAILED+=1
)

REM Check Backend Setup
echo.
echo 2. Checking Backend Setup
if exist "backend\package.json" (
    echo [PASS] Backend package.json exists
    set /a PASSED+=1
) else (
    echo [FAIL] Backend package.json missing
    set /a FAILED+=1
)

if exist "backend\src\index.js" (
    echo [PASS] Backend entry point exists
    set /a PASSED+=1
) else (
    echo [FAIL] Backend entry point missing
    set /a FAILED+=1
)

if exist "backend\.env" (
    echo [PASS] Backend .env exists
    set /a PASSED+=1
) else if exist "backend\.env.example" (
    echo [WARN] Backend .env.example exists but .env not found - create .env for deployment
    set /a PASSED+=1
) else (
    echo [FAIL] Backend environment file missing
    set /a FAILED+=1
)

REM Check Frontend Setup
echo.
echo 3. Checking Frontend Setup
if exist "frontend\package.json" (
    echo [PASS] Frontend package.json exists
    set /a PASSED+=1
) else (
    echo [FAIL] Frontend package.json missing
    set /a FAILED+=1
)

if exist "frontend\src\main.jsx" (
    echo [PASS] Frontend entry point exists
    set /a PASSED+=1
) else (
    echo [FAIL] Frontend entry point missing
    set /a FAILED+=1
)

if exist "frontend\vite.config.js" (
    echo [PASS] Frontend Vite config exists
    set /a PASSED+=1
) else (
    echo [FAIL] Frontend Vite config missing
    set /a FAILED+=1
)

REM Check Database Configuration
echo.
echo 4. Checking Database Configuration
if exist "backend\src\models\sale.model.js" (
    echo [PASS] Sales model exists
    set /a PASSED+=1
) else (
    echo [FAIL] Sales model missing
    set /a FAILED+=1
)

if exist "backend\src\config\db.js" (
    echo [PASS] Database config exists
    set /a PASSED+=1
) else (
    echo [FAIL] Database config missing
    set /a FAILED+=1
)

REM Check Deployment Files
echo.
echo 5. Checking Deployment Configuration
if exist "backend\Procfile" (
    echo [PASS] Heroku Procfile exists
    set /a PASSED+=1
) else (
    echo [FAIL] Procfile missing
    set /a FAILED+=1
)

if exist "backend\Dockerfile" (
    echo [PASS] Backend Dockerfile exists
    set /a PASSED+=1
) else (
    echo [FAIL] Backend Dockerfile missing
    set /a FAILED+=1
)

if exist "frontend\Dockerfile" (
    echo [PASS] Frontend Dockerfile exists
    set /a PASSED+=1
) else (
    echo [FAIL] Frontend Dockerfile missing
    set /a FAILED+=1
)

if exist "docker-compose.yml" (
    echo [PASS] Docker Compose config exists
    set /a PASSED+=1
) else (
    echo [FAIL] Docker Compose config missing
    set /a FAILED+=1
)

REM Check Documentation
echo.
echo 6. Checking Documentation
if exist "DEPLOYMENT_GUIDE.md" (
    echo [PASS] Deployment guide exists
    set /a PASSED+=1
) else (
    echo [FAIL] Deployment guide missing
    set /a FAILED+=1
)

if exist "QUICK_DEPLOYMENT.md" (
    echo [PASS] Quick deployment guide exists
    set /a PASSED+=1
) else (
    echo [FAIL] Quick deployment guide missing
    set /a FAILED+=1
)

REM Git Check
echo.
echo 7. Checking Git Configuration
if exist ".git" (
    echo [PASS] Git repository initialized
    set /a PASSED+=1
) else (
    echo [FAIL] Git repository not initialized
    set /a FAILED+=1
)

if exist ".gitignore" (
    echo [PASS] .gitignore exists
    set /a PASSED+=1
) else (
    echo [FAIL] .gitignore missing
    set /a FAILED+=1
)

REM Summary
echo.
echo ================================
echo Summary: %PASSED% PASSED - %FAILED% FAILED
echo ================================
echo.

if %FAILED% equ 0 (
    echo [SUCCESS] All checks passed! Project is ready for deployment.
    echo.
    echo Next steps:
    echo 1. Push to GitHub
    echo 2. Deploy backend to Railway or Heroku
    echo 3. Deploy frontend to Vercel or Netlify
    echo 4. See DEPLOYMENT_GUIDE.md for detailed instructions
    pause
    exit /b 0
) else (
    echo [ERROR] Some checks failed. Please review the items above.
    echo.
    echo Common fixes:
    echo - Install Node.js from https://nodejs.org
    echo - Create .env file with MongoDB URL
    echo - Run: npm install in backend and frontend folders
    pause
    exit /b 1
)
