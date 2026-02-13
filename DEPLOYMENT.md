# Deployment Guide - Haikambe Tsame Clan Digital Archive

## Production Deployment Checklist

### Prerequisites
- [ ] MongoDB Atlas account (or MongoDB server)
- [ ] GitHub repository
- [ ] Domain name (optional)

---

## Backend Deployment

### Option 1: Railway (Recommended)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Service**
   - Select the `server` directory as root
   - Railway will auto-detect Node.js

4. **Set Environment Variables**
   ```
   PORT=5000
   NODE_ENV=production
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/haikambe-tsame
   JWT_SECRET=super-secure-random-string-here
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```

5. **Deploy**
   - Railway will automatically build and deploy
   - Note your backend URL (e.g., `https://your-app.railway.app`)

### Option 2: Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - New → Web Service
   - Connect repository
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`

3. **Environment Variables**
   (Same as Railway)

### Option 3: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
cd server
heroku create haikambe-tsame-api

# Set environment variables
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - New Project → Import Git Repository
   - Select your repository

3. **Configure Project**
   - Framework Preset: Vite
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```

5. **Deploy**
   - Click "Deploy"
   - Your app will be live at `https://your-app.vercel.app`

### Option 2: Netlify

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **Import Project**
   - Add new site → Import from Git
   - Choose repository

3. **Build Settings**
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`

4. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```

---

## Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free tier

2. **Create Cluster**
   - Build a Database → Shared (Free)
   - Choose cloud provider and region
   - Create cluster

3. **Create Database User**
   - Database Access → Add New Database User
   - Choose password authentication
   - Save username and password

4. **Whitelist IP Address**
   - Network Access → Add IP Address
   - Allow access from anywhere: `0.0.0.0/0` (for production, restrict this)

5. **Get Connection String**
   - Clusters → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `haikambe-tsame`

---

## Post-Deployment Steps

### 1. Create Initial Admin User

```bash
# Using Postman or curl
curl -X POST https://your-backend-url.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@haikambetsame.com",
    "password": "secure-password",
    "fullName": "System Administrator",
    "role": "Super Admin"
  }'
```

### 2. Test the Application
- [ ] Login works
- [ ] Creating members works
- [ ] Family tree displays
- [ ] All pages load correctly

### 3. Security Hardening
- [ ] Change default JWT_SECRET to a strong random string
- [ ] Enable HTTPS (most platforms enable by default)
- [ ] Restrict MongoDB IP whitelist
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategy

### 4. Custom Domain (Optional)

**Vercel:**
- Settings → Domains → Add domain
- Follow DNS configuration instructions

**Railway:**
- Settings → Domains → Custom Domain
- Add CNAME record to your DNS

---

## Environment Variables Quick Reference

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/haikambe-tsame
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
CLIENT_URL=https://your-frontend.vercel.app
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend.railway.app/api
```

---

## Monitoring & Maintenance

### Logging
- Railway/Render provide built-in logs
- Monitor errors and performance

### Backups
- MongoDB Atlas: Enable automated backups
- Export data regularly

### Updates
- Keep dependencies updated
- Monitor security vulnerabilities
- Test updates in development first

---

## Troubleshooting

### CORS Errors
- Ensure `CLIENT_URL` in backend matches frontend URL
- Check CORS configuration in `server.js`

### Connection Errors
- Verify MongoDB connection string
- Check IP whitelist in MongoDB Atlas
- Ensure environment variables are set correctly

### Build Failures
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Check build logs for specific errors

---

## Cost Estimation

### Free Tier (Recommended for start)
- **MongoDB Atlas:** Free (512MB storage, shared cluster)
- **Railway:** $5/month credit (sufficient for small apps)
- **Vercel:** Free (hobby plan)
- **Total:** ~$0-5/month

### Production Tier
- **MongoDB Atlas:** ~$9/month (M2 cluster)
- **Railway/Render:** ~$7-20/month
- **Vercel Pro:** ~$20/month (optional)
- **Total:** ~$16-50/month

---

## Need Help?

Contact your system administrator or refer to:
- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
