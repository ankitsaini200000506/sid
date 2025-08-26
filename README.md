# SIDDHI - Restaurant Self-Ordering System

A modern restaurant ordering system with QR integration, real-time order management, and seamless payment processing.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Start web development server
npm run start-web
```

## 🌐 Building for Web

```bash
# Build for production (Netlify)
npm run build:web

# Alternative build with enhanced process
npm run build:web-fixed
```

## 📦 Netlify Deployment

### Build Settings:
- **Build command:** `npm run build:web` or `npm run build:web-fixed`
- **Publish directory:** `web-build`
- **Base directory:** Leave empty
- **Node version:** 18 or higher

### Environment Variables:
- `NODE_VERSION`: 18
- `NPM_FLAGS`: --legacy-peer-deps

## ✨ Features

- 📱 Interactive menu browsing with categories
- 🛒 Smart shopping cart management  
- 💳 Multiple payment methods (Razorpay, UPI, QR)
- 👨‍💼 Real-time admin dashboard
- 📊 Live order tracking and status updates
- 🔔 Instant order notifications
- 📱 QR code integration

## 🛠️ Tech Stack

- React Native + Expo
- TypeScript
- Firebase
- Zustand (State Management)
- NativeWind (Styling)

## 📁 Project Structure

```
sid/
├── app/           # Main application screens
├── components/    # Reusable UI components
├── config/        # Configuration files
├── constants/     # App constants and data
├── services/      # API and service layer
├── store/         # State management
├── types/         # TypeScript type definitions
└── assets/        # Images and static assets
```

## 🔧 Troubleshooting

If you encounter build issues on Netlify:
1. Use `npm run build:web-fixed` instead of `npm run build:web`
2. Ensure Node.js version is 18 or higher
3. Check that all dependencies are properly installed

## 📞 Support

For issues or questions, please check the deployment logs or contact the development team. 
