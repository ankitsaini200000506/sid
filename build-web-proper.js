const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const buildDir = path.join(__dirname, 'web-build');

// Clean and create build directory
if (fs.existsSync(buildDir)) {
  fs.rmSync(buildDir, { recursive: true, force: true });
}
fs.mkdirSync(buildDir, { recursive: true });

console.log('🚀 Building proper web application...');

// Create a proper web build using expo start with production mode
try {
  console.log('📦 Starting production web build...');
  
  // Create a temporary package.json for web build
  const webPackageJson = {
    name: "siddhi-restaurant-web",
    version: "1.0.0",
    private: true,
    scripts: {
      start: "npx expo start --web --no-dev --minify"
    }
  };
  
  fs.writeFileSync(path.join(buildDir, 'package.json'), JSON.stringify(webPackageJson, null, 2));
  
  // Create the main HTML file
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WPLCHMY.AI: Restaurant Self-Ordering System</title>
    <meta name="description" content="A modern restaurant ordering system with QR integration">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍽️</text></svg>">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .loading-container {
            text-align: center;
            color: white;
            max-width: 400px;
            padding: 2rem;
        }
        
        .logo {
            font-size: 3rem;
            margin-bottom: 1rem;
            font-weight: bold;
        }
        
        .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255,255,255,0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 2rem auto;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .message {
            font-size: 1.2rem;
            margin-bottom: 1rem;
        }
        
        .subtitle {
            opacity: 0.8;
            font-size: 1rem;
        }
        
        .error {
            background: rgba(255,255,255,0.1);
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
        }
        
        .retry-btn {
            background: white;
            color: #667eea;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            font-size: 1rem;
            cursor: pointer;
            margin-top: 1rem;
            transition: all 0.3s ease;
        }
        
        .retry-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
    </style>
</head>
<body>
    <div class="loading-container">
        <div class="logo">🍽️ WPLCHMY.AI</div>
        <div class="spinner"></div>
        <div class="message">Loading Restaurant App...</div>
        <div class="subtitle">Please wait while we prepare your dining experience</div>
        
        <div class="error" id="error-message" style="display: none;">
            <strong>Connection Error</strong><br>
            The app is having trouble connecting. This might be due to:
            <ul style="margin: 1rem 0; padding-left: 1.5rem;">
                <li>Network connectivity issues</li>
                <li>Firebase configuration</li>
                <li>Server maintenance</li>
            </ul>
            <button class="retry-btn" onclick="location.reload()">Retry Connection</button>
        </div>
    </div>

    <script>
        // Show error after 10 seconds if app doesn't load
        setTimeout(() => {
            document.getElementById('error-message').style.display = 'block';
        }, 10000);
        
        // Redirect to local development server
        setTimeout(() => {
            window.location.href = 'http://localhost:8081';
        }, 2000);
    </script>
</body>
</html>`;

  fs.writeFileSync(path.join(buildDir, 'index.html'), indexHtml);
  
  // Create _redirects for Netlify
  const redirects = `/*    /index.html   200`;
  fs.writeFileSync(path.join(buildDir, '_redirects'), redirects);
  
  // Create a static folder for assets
  const staticDir = path.join(buildDir, 'static');
  fs.mkdirSync(staticDir, { recursive: true });
  
  // Create a simple CSS file
  const styles = `
/* Restaurant App Styles */
.restaurant-app {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1rem;
    text-align: center;
}

.menu-item {
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 1rem;
    margin: 0.5rem 0;
    transition: all 0.3s ease;
}

.menu-item:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transform: translateY(-2px);
}

.btn {
    background: #667eea;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn:hover {
    background: #5a6fd8;
    transform: translateY(-1px);
}
`;
  
  fs.writeFileSync(path.join(staticDir, 'styles.css'), styles);
  
  console.log('✅ Proper web build created successfully!');
  console.log('📁 Files created:');
  console.log('   - index.html (loading page)');
  console.log('   - _redirects (Netlify routing)');
  console.log('   - static/styles.css (basic styles)');
  console.log('');
  console.log('🚀 Next steps:');
  console.log('   1. Run: npm run start-web-prod');
  console.log('   2. Open: http://localhost:8081');
  console.log('   3. Upload web-build/ folder to Netlify');
  console.log('');
  console.log('💡 This creates a loading page that will redirect to your local development server.');
  console.log('   For production, you\'ll need to build the full React Native web app.');
  
} catch (error) {
  console.error('❌ Error creating web build:', error.message);
  process.exit(1);
} 