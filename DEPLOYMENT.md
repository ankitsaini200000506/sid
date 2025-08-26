# 🚀 Netlify Deployment Guide

## Method 1: Automatic Deployment (Recommended)

### Step 1: Push to GitHub
1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub Repository**:
   - Go to GitHub.com
   - Create a new repository
   - Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy on Netlify
1. **Go to Netlify**: https://netlify.com
2. **Sign up/Login** with your GitHub account
3. **Click "New site from Git"**
4. **Choose GitHub** and select your repository
5. **Configure build settings**:
   - **Build command**: `npm run build:web`
   - **Publish directory**: `web-build`
   - **Node version**: `18`
6. **Click "Deploy site"**

## Method 2: Manual Deployment

### Step 1: Build Locally
```bash
# Install dependencies
npm install

# Build for web
npm run build:web
```

### Step 2: Deploy to Netlify
1. **Go to Netlify**: https://netlify.com
2. **Drag and drop** the `web-build` folder to Netlify
3. **Wait for deployment** to complete

## Method 3: Netlify CLI

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Build and Deploy
```bash
# Build the project
npm run build:web

# Deploy to Netlify
netlify deploy --prod --dir=web-build
```

## Troubleshooting

### If Build Fails
1. **Check Node version**: Make sure you're using Node 18
2. **Clear cache**: `npx expo start --clear`
3. **Update dependencies**: `npm update`

### If Site Doesn't Load
1. **Check build logs** in Netlify dashboard
2. **Verify publish directory** is correct
3. **Check for environment variables** if needed

### Environment Variables (if needed)
In Netlify dashboard, go to Site settings > Environment variables and add:
- `NODE_VERSION`: `18`
- Any Firebase config variables if needed

## Custom Domain (Optional)
1. **Go to Netlify dashboard**
2. **Site settings > Domain management**
3. **Add custom domain**
4. **Configure DNS** as instructed

## Success!
Your restaurant ordering system will be live at: `https://your-site-name.netlify.app`

## Features Available Online
- ✅ Menu browsing
- ✅ Shopping cart
- ✅ Payment processing
- ✅ Admin dashboard
- ✅ Order management
- ✅ Real-time notifications 