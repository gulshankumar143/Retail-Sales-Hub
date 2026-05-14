# TrueState Project - Deployment Guide

## Project Overview
- **Frontend**: React 18 with Vite (runs on port 3000)
- **Backend**: Node.js/Express API (runs on port 7000)
- **Database**: MongoDB Atlas (Cloud)
- **Total Records**: 250,000 sales records

---

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Local Testing Before Deployment](#local-testing-before-deployment)
4. [Backend Deployment Options](#backend-deployment-options)
5. [Frontend Deployment Options](#frontend-deployment-options)
6. [Full-Stack Deployment Solutions](#full-stack-deployment-solutions)

---

## Pre-Deployment Checklist

- [ ] MongoDB Atlas cluster is active and data is imported
- [ ] All environment variables are configured
- [ ] Backend builds successfully (`npm run build` equivalent)
- [ ] Frontend builds successfully (`npm run build`)
- [ ] No console errors in development
- [ ] APIs tested with Postman/Insomnia
- [ ] Frontend connected to backend API successfully

---

## Environment Setup

### Backend Environment Variables
Create/Update `.env` file in `backend/`:

```env
# MongoDB Connection
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Server Port
PORT=7000

# Environment
NODE_ENV=production
```

### Frontend Environment Variables
Create `.env` file in `frontend/`:

```env
# Backend API URL (for production, use your deployed backend URL)
VITE_API_URL=https://your-backend-domain.com
```

Update `frontend/src/services/api.js` to use the environment variable:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7000';

const client = axios.create({
  baseURL: `${API_URL}/api`
});
```

---

## Local Testing Before Deployment

### 1. Test Backend Locally
```bash
cd backend
npm install
npm run dev
# Should output: Backend running on port 7000
```

### 2. Test Frontend Locally
```bash
cd frontend
npm install
npm run dev
# Should output: Local:   http://localhost:3000/
```

### 3. Verify API Connection
- Open http://localhost:3000 in browser
- Check Network tab to ensure API calls go to http://localhost:7000/api
- Test dashboard and sales pages load data correctly

---

## Backend Deployment Options

### Option A: Deploy on Heroku (Recommended for Quick Start)

#### Prerequisites:
- Heroku CLI installed
- GitHub account

#### Steps:
1. **Install Heroku CLI**
   ```bash
   # Windows
   choco install heroku-cli
   # Or download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Create Heroku Account & Login**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd backend
   heroku create your-app-name
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URL="your_mongodb_url"
   heroku config:set NODE_ENV=production
   heroku config:set PORT=7000
   ```

5. **Create Procfile** in `backend/` directory:
   ```
   web: node src/index.js
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

7. **Verify**
   ```bash
   heroku open
   # Should show API Running Successfully message
   ```

**Backend URL**: `https://your-app-name.herokuapp.com`

---

### Option B: Deploy on Railway.app

#### Steps:
1. **Go to railway.app** and sign up with GitHub
2. **Create New Project** → Connect GitHub repo
3. **Select `backend` folder** as deployment directory
4. **Add Environment Variables**:
   - `MONGODB_URL`
   - `NODE_ENV=production`
   - `PORT=7000`
5. **Deploy** (automatic on push to main)

**Backend URL**: `https://your-project.railway.app`

---

### Option C: Deploy on AWS EC2

#### Steps:
1. **Launch EC2 Instance** (Ubuntu 22.04)
2. **SSH into instance**
   ```bash
   ssh -i "key.pem" ubuntu@your-instance-public-ip
   ```

3. **Install Node.js & MongoDB Client**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo apt-get install npm
   ```

4. **Clone Repository & Install Dependencies**
   ```bash
   git clone https://github.com/your-repo.git
   cd truestate/backend
   npm install
   ```

5. **Set Environment Variables**
   ```bash
   sudo nano /etc/environment
   # Add: MONGODB_URL="your_mongodb_url"
   source /etc/environment
   ```

6. **Install PM2 (Process Manager)**
   ```bash
   sudo npm install -g pm2
   pm2 start src/index.js --name "truestate-backend"
   pm2 startup
   pm2 save
   ```

7. **Configure Nginx as Reverse Proxy**
   ```bash
   sudo apt-get install nginx
   sudo nano /etc/nginx/sites-available/default
   ```
   
   Add:
   ```nginx
   server {
       listen 80 default_server;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:7000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo systemctl restart nginx
   ```

**Backend URL**: `http://your-domain.com` or `https://your-domain.com` (with SSL)

---

## Frontend Deployment Options

### Option A: Deploy on Vercel (Recommended)

#### Steps:
1. **Go to vercel.com** and sign up with GitHub
2. **Import Project** → Select your GitHub repo
3. **Configure Build**:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Root Directory: `frontend`
4. **Add Environment Variables**:
   - `VITE_API_URL=https://your-backend-url.com`
5. **Deploy** (automatic)

**Frontend URL**: `https://your-project.vercel.app`

---

### Option B: Deploy on Netlify

#### Steps:
1. **Go to netlify.com** and sign up with GitHub
2. **New Site from Git** → Select repo
3. **Configure Build**:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Add Environment Variable**:
   - `VITE_API_URL=https://your-backend-url.com`
5. **Deploy** (automatic)

**Frontend URL**: `https://your-site.netlify.app`

---

### Option C: Deploy on AWS S3 + CloudFront

#### Steps:
1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Create S3 Bucket**
   - AWS S3 → Create bucket (name: `truestate-frontend`)
   - Block public access OFF
   - Enable static website hosting

3. **Upload Build Files**
   ```bash
   aws s3 sync dist/ s3://truestate-frontend --delete
   ```

4. **Configure Bucket Policy**
   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Effect": "Allow",
               "Principal": "*",
               "Action": "s3:GetObject",
               "Resource": "arn:aws:s3:::truestate-frontend/*"
           }
       ]
   }
   ```

5. **Create CloudFront Distribution** (for CDN + HTTPS)

**Frontend URL**: CloudFront domain or custom domain

---

## Full-Stack Deployment Solutions

### Solution 1: Vercel (Frontend) + Heroku (Backend)

Best for: Quick, free tier option
Cost: Free to $7/month

**Setup Steps:**
1. Deploy backend to Heroku (see Option A above)
2. Deploy frontend to Vercel (see Frontend Option A above)
3. In Vercel environment: `VITE_API_URL=https://your-heroku-app.herokuapp.com`

**Pros**: Easy setup, free tier available
**Cons**: Heroku free tier discontinued (now paid), no auto-scaling

---

### Solution 2: Railway.app (Frontend + Backend)

Best for: Simple, all-in-one solution
Cost: Pay as you go (~$5-20/month)

**Setup Steps:**
1. Connect GitHub to Railway.app
2. Create two services:
   - Service 1: Backend (`backend` folder)
   - Service 2: Frontend (`frontend` folder)
3. Set environment variables for each service
4. Add MongoDB plugin (or use MongoDB Atlas)

**Pros**: Simple, competitive pricing, good performance
**Cons**: Less documentation than major platforms

---

### Solution 3: AWS (Full-Stack)

Best for: Production-ready, scalable
Cost: ~$20-50/month (with free tier benefits)

**Architecture**:
- Frontend: S3 + CloudFront
- Backend: EC2 or Lambda + API Gateway
- Database: MongoDB Atlas (free tier)
- Optional: Application Load Balancer

---

### Solution 4: Docker + Any Cloud Provider

Best for: Consistent deployment across environments
Cost: Variable

**Setup:**

1. **Create `Dockerfile` for Backend** (`backend/Dockerfile`):
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 7000

CMD ["node", "src/index.js"]
```

2. **Create `Dockerfile` for Frontend** (`frontend/Dockerfile`):
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

3. **Create `docker-compose.yml`** (root directory):
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
    ports:
      - "7000:7000"
    environment:
      MONGODB_URL: ${MONGODB_URL}
      NODE_ENV: production
    depends_on:
      - mongo

  frontend:
    build:
      context: ./frontend
    ports:
      - "3000:80"
    environment:
      VITE_API_URL: http://backend:7000

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

4. **Deploy to Docker Hub / AWS ECR / Any Cloud**:
   ```bash
   docker-compose build
   docker-compose push
   ```

---

## Step-by-Step Deployment Walkthrough (Recommended for Beginners)

### Quickest Path: Vercel + Railway

**Day 1:**

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. **Deploy Backend (5 minutes)**
   - Go to railway.app → Sign up with GitHub
   - Create new project → Connect this repo
   - Add environment variables
   - Done! Backend URL: `https://xxx.railway.app`

3. **Deploy Frontend (5 minutes)**
   - Go to vercel.com → Import project
   - Add `VITE_API_URL=https://xxx.railway.app`
   - Deploy → Done!

**Total Time**: 15 minutes

---

## Post-Deployment Checklist

- [ ] Backend API is responding (`GET /`)
- [ ] Frontend loads without CORS errors
- [ ] Database connection confirmed (check logs)
- [ ] All API endpoints working (test with Postman)
- [ ] Dashboard loads sales data
- [ ] Sales page displays 250k records
- [ ] Filters/pagination working
- [ ] Export to CSV working
- [ ] Mobile responsive layout working
- [ ] No sensitive data exposed in frontend code

---

## Monitoring & Logs

### Heroku
```bash
heroku logs --tail
```

### Railway
Dashboard → Service → Logs

### AWS EC2
```bash
pm2 logs
tail -f /var/log/nginx/access.log
```

---

## Cost Estimates

| Option | Monthly Cost | Setup Time |
|--------|-------------|-----------|
| Vercel + Railway | $5-15 | 15 min |
| Vercel + Heroku | $7-14 | 20 min |
| AWS (full) | $10-50 | 1 hour |
| Docker + AWS | $15-30 | 2 hours |
| Railway (both) | $5-10 | 15 min |

---

## Common Issues & Solutions

### CORS Errors
**Solution**: Update backend CORS in `src/index.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

### MongoDB Connection Timeout
**Solution**: 
- Check MongoDB Atlas IP whitelist (allow all IPs: 0.0.0.0/0)
- Verify connection string in environment variable
- Check MongoDB cluster status

### Build Fails on Deploy Platform
**Solution**:
- Remove `.env` from git (use `.gitignore`)
- Ensure all dependencies in package.json
- Check Node version compatibility

### Large Dataset (250k records) Slow on Dashboard
**Solution**:
- Add pagination (already implemented)
- Add database indexes
- Implement caching with Redis
- Use aggregation pipelines for reports

---

## Next Steps

1. Choose deployment option from above
2. Set up MongoDB Atlas (if not already done) ✅
3. Push to GitHub
4. Configure environment variables on chosen platform
5. Deploy and test
6. Monitor logs for errors
7. Set up custom domain (optional)

---

## Support Resources

- MongoDB Atlas: https://docs.atlas.mongodb.com
- Express.js: https://expressjs.com
- React/Vite: https://vitejs.dev
- Vercel: https://vercel.com/docs
- Railway: https://railway.app/docs
- Heroku: https://devcenter.heroku.com
