const fs = require('fs');
const path = require('path');

// Create web-build directory if it doesn't exist
const buildDir = path.join(__dirname, 'web-build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Create a simple index.html file
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WPLCHMY.AI: Restaurant Self-Ordering System</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
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
            max-width: 500px;
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
        }
        p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .features {
            text-align: left;
            margin: 20px 0;
        }
        .features li {
            margin: 10px 0;
            color: #555;
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
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🍽️ WPLCHMY.AI</h1>
        <h2>Restaurant Self-Ordering System</h2>
        <p>A modern restaurant ordering system with QR integration, real-time order management, and seamless payment processing.</p>
        
        <div class="features">
            <h3>✨ Features:</h3>
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
        
        <p><strong>🚀 Coming Soon!</strong></p>
        <p>This application is currently being deployed. Please check back soon for the full interactive experience.</p>
        
        <div style="margin-top: 30px;">
            <a href="https://github.com" class="button">View Source Code</a>
            <a href="mailto:contact@example.com" class="button">Contact Us</a>
        </div>
    </div>
</body>
</html>`;

// Write the index.html file
fs.writeFileSync(path.join(buildDir, 'index.html'), indexHtml);

// Create a _redirects file for Netlify
const redirects = `/*    /index.html   200`;
fs.writeFileSync(path.join(buildDir, '_redirects'), redirects);

console.log('✅ Static build created successfully in web-build/ directory');
console.log('📁 Files created:');
console.log('   - index.html (main page)');
console.log('   - _redirects (Netlify routing)');
console.log('');
console.log('🚀 Ready for Netlify deployment!');
console.log('   Upload the web-build/ folder to Netlify'); 