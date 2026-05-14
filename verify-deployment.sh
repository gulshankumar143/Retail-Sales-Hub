#!/bin/bash

# TrueState Project - Pre-Deployment Verification Script
# Run this script to verify everything is ready for deployment

echo "================================"
echo "TrueState Pre-Deployment Check"
echo "================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter
PASSED=0
FAILED=0

# Function to check pass/fail
check_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC}: $2"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC}: $2"
        ((FAILED++))
    fi
}

# Check Node.js
echo -e "\n${YELLOW}1. Checking Node.js Installation${NC}"
node --version > /dev/null 2>&1
check_status $? "Node.js installed ($(node --version 2>/dev/null))"

npm --version > /dev/null 2>&1
check_status $? "npm installed ($(npm --version 2>/dev/null))"

# Check Backend Setup
echo -e "\n${YELLOW}2. Checking Backend Setup${NC}"
[ -f "backend/package.json" ]
check_status $? "Backend package.json exists"

[ -f "backend/src/index.js" ]
check_status $? "Backend entry point exists"

[ -f "backend/.env" ] || [ -f "backend/.env.example" ]
check_status $? "Backend environment file exists"

[ -d "backend/node_modules" ] || echo -e "${YELLOW}⚠ Warning: Backend dependencies not installed - run 'cd backend && npm install'${NC}"

# Check Frontend Setup
echo -e "\n${YELLOW}3. Checking Frontend Setup${NC}"
[ -f "frontend/package.json" ]
check_status $? "Frontend package.json exists"

[ -f "frontend/src/main.jsx" ]
check_status $? "Frontend entry point exists"

[ -f "frontend/vite.config.js" ]
check_status $? "Frontend Vite config exists"

[ -d "frontend/node_modules" ] || echo -e "${YELLOW}⚠ Warning: Frontend dependencies not installed - run 'cd frontend && npm install'${NC}"

# Check Database Configuration
echo -e "\n${YELLOW}4. Checking Database Configuration${NC}"
[ -f "backend/src/models/sale.model.js" ]
check_status $? "Sales model exists"

[ -f "backend/src/config/db.js" ]
check_status $? "Database config exists"

grep -q "MONGODB_URL" backend/.env 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ PASS${NC}: MongoDB URL configured in .env"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ Warning: MongoDB URL not found in .env - needed for deployment${NC}"
fi

# Check Deployment Files
echo -e "\n${YELLOW}5. Checking Deployment Configuration${NC}"
[ -f "backend/Procfile" ]
check_status $? "Heroku Procfile exists"

[ -f "backend/Dockerfile" ]
check_status $? "Backend Dockerfile exists"

[ -f "frontend/Dockerfile" ]
check_status $? "Frontend Dockerfile exists"

[ -f "docker-compose.yml" ]
check_status $? "Docker Compose config exists"

# Check Documentation
echo -e "\n${YELLOW}6. Checking Documentation${NC}"
[ -f "DEPLOYMENT_GUIDE.md" ]
check_status $? "Deployment guide exists"

[ -f "QUICK_DEPLOYMENT.md" ]
check_status $? "Quick deployment guide exists"

[ -f "DEPLOYMENT_READY.md" ]
check_status $? "Deployment ready checklist exists"

# Git Check
echo -e "\n${YELLOW}7. Checking Git Configuration${NC}"
[ -d ".git" ]
check_status $? "Git repository initialized"

[ -f ".gitignore" ]
check_status $? ".gitignore exists"

grep -q "node_modules" .gitignore 2>/dev/null
check_status $? "node_modules added to .gitignore"

grep -q ".env" .gitignore 2>/dev/null
check_status $? ".env added to .gitignore"

# Summary
echo -e "\n${YELLOW}================================${NC}"
echo -e "Summary: ${GREEN}$PASSED PASSED${NC} | ${RED}$FAILED FAILED${NC}"
echo -e "${YELLOW}================================${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}✓ All checks passed! Project is ready for deployment.${NC}\n"
    echo "Next steps:"
    echo "1. Push to GitHub: git push"
    echo "2. Deploy backend to Railway/Heroku"
    echo "3. Deploy frontend to Vercel/Netlify"
    echo "4. See DEPLOYMENT_GUIDE.md for detailed instructions"
    exit 0
else
    echo -e "\n${RED}✗ Some checks failed. Please review the warnings above.${NC}\n"
    echo "Failed items:"
    echo "- Ensure all dependencies are installed"
    echo "- Verify .env files are configured"
    echo "- Check that all deployment files exist"
    exit 1
fi
