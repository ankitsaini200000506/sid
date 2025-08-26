const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting simple SIDDHI build...');

try {
  // Clean and create web-build directory
  const buildDir = path.join(__dirname, 'web-build');
  if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true, force: true });
  }
  fs.mkdirSync(buildDir, { recursive: true });

  // Create a working SIDDHI app page
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SIDDHI - Restaurant Self-Ordering System</title>
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
        
        .container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 600px;
            width: 90%;
        }
        
        .logo {
            font-size: 3rem;
            font-weight: bold;
            color: #333;
            margin-bottom: 20px;
        }
        
        .tagline {
            color: #666;
            font-size: 1.2rem;
            margin-bottom: 30px;
        }
        
        .features {
            text-align: left;
            margin: 30px 0;
        }
        
        .features h3 {
            color: #333;
            margin-bottom: 15px;
            text-align: center;
        }
        
        .features ul {
            list-style: none;
            padding: 0;
        }
        
        .features li {
            margin: 10px 0;
            color: #555;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        
        .status {
            background: #e8f5e8;
            color: #2d5a2d;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            border: 1px solid #c3e6c3;
        }
        
        .button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin: 10px;
            transition: transform 0.2s;
        }
        
        .button:hover {
            transform: translateY(-2px);
        }
        
        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 10px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">SIDDHI</div>
        <div class="tagline">Restaurant Self-Ordering System</div>
        
        <div class="status">
            <span class="loading"></span>
            <strong>Your app is being prepared for deployment!</strong>
        </div>
        
        <div class="features">
            <h3>✨ What's Coming:</h3>
            <ul>
                <li>📱 Interactive menu browsing with categories</li>
                <li>🛒 Smart shopping cart management</li>
                <li>💳 Multiple payment methods (Razorpay, UPI, QR)</li>
                <li>👨‍💼 Real-time admin dashboard</li>
                <li>📊 Live order tracking and status updates</li>
                <li>🔔 Instant order notifications</li>
                <li>📱 QR code integration</li>
            </ul>
        </div>
        
        <p style="color: #666; margin: 20px 0;">
            We're working hard to get your restaurant ordering system live. 
            The full interactive experience will be available soon!
        </p>
        
        <div>
            <a href="https://github.com/ankitsaini0506/sid" class="button">View Source Code</a>
            <a href="mailto:contact@example.com" class="button">Contact Us</a>
        </div>
    </div>
    
    <script>
        console.log('SIDDHI Restaurant App - Loading...');
        
        // Simulate app loading
        setTimeout(() => {
            document.querySelector('.status').innerHTML = 
                '<strong>✅ App is ready! Full version coming soon...</strong>';
        }, 3000);
    </script>
</body>
</html>`;

  // Write the main HTML file
  fs.writeFileSync(path.join(buildDir, 'index.html'), indexHtml);
  
  // Create _redirects for Netlify SPA routing
  const redirects = `/*    /index.html   200`;
  fs.writeFileSync(path.join(buildDir, '_redirects'), redirects);
  
  // Create a simple robots.txt
  const robots = `User-agent: *
Allow: /`;
  fs.writeFileSync(path.join(buildDir, 'robots.txt'), robots);
  
  console.log('✅ Simple build completed successfully!');
  console.log('📁 Files created in web-build/:');
  const files = fs.readdirSync(buildDir);
  files.forEach(file => {
    console.log(`   - ${file}`);
  });
  console.log('');
  console.log('🚀 Ready for Netlify deployment!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 