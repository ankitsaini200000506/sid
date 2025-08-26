const fs = require('fs');
const path = require('path');

// Create web-build directory if it doesn't exist
const buildDir = path.join(__dirname, 'web-build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Create a more advanced index.html with React app structure
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WPLCHMY.AI: Restaurant Self-Ordering System</title>
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
            color: #333;
        }
        
        .app {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            color: white;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        .main-content {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        
        .tabs {
            display: flex;
            justify-content: center;
            margin-bottom: 30px;
            gap: 10px;
        }
        
        .tab {
            padding: 15px 30px;
            background: #f8f9fa;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
        }
        
        .tab.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .tab:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .content {
            min-height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 30px;
        }
        
        .feature-card {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            transition: transform 0.3s ease;
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
        }
        
        .feature-icon {
            font-size: 3rem;
            margin-bottom: 20px;
        }
        
        .feature-card h3 {
            margin-bottom: 15px;
            color: #333;
        }
        
        .feature-card p {
            color: #666;
            line-height: 1.6;
        }
        
        .cta-section {
            text-align: center;
            margin-top: 40px;
        }
        
        .cta-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 40px;
            border: none;
            border-radius: 15px;
            font-size: 18px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin: 10px;
            transition: all 0.3s ease;
        }
        
        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.2);
        }
        
        .footer {
            text-align: center;
            color: white;
            margin-top: 40px;
            opacity: 0.8;
        }
        
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }
            
            .tabs {
                flex-direction: column;
            }
            
            .feature-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="app">
        <div class="header">
            <h1>🍽️ WPLCHMY.AI</h1>
            <p>Restaurant Self-Ordering System with QR Integration</p>
        </div>
        
        <div class="main-content">
            <div class="tabs">
                <button class="tab active" onclick="showTab('home')">🏠 Home</button>
                <button class="tab" onclick="showTab('menu')">📋 Menu</button>
                <button class="tab" onclick="showTab('cart')">🛒 Cart</button>
                <button class="tab" onclick="showTab('admin')">👨‍💼 Admin</button>
            </div>
            
            <div id="home" class="content">
                <div>
                    <h2>Welcome to WPLCHMY.AI</h2>
                    <p>A modern restaurant ordering system that revolutionizes the dining experience.</p>
                    
                    <div class="feature-grid">
                        <div class="feature-card">
                            <div class="feature-icon">📱</div>
                            <h3>Interactive Menu</h3>
                            <p>Browse our delicious menu with beautiful images and detailed descriptions</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">💳</div>
                            <h3>Easy Payments</h3>
                            <p>Multiple payment options including UPI, cards, and QR codes</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">⚡</div>
                            <h3>Real-time Updates</h3>
                            <p>Track your order status in real-time with instant notifications</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">🔔</div>
                            <h3>Smart Notifications</h3>
                            <p>Get notified when your order is ready or status changes</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="menu" class="content" style="display: none;">
                <div>
                    <h2>📋 Our Menu</h2>
                    <p>Explore our delicious menu with categories like Starters, Fast Food, Breakfast, and more!</p>
                    <div class="cta-section">
                        <button class="cta-button">View Full Menu</button>
                    </div>
                </div>
            </div>
            
            <div id="cart" class="content" style="display: none;">
                <div>
                    <h2>🛒 Shopping Cart</h2>
                    <p>Add items to your cart and manage quantities easily</p>
                    <div class="cta-section">
                        <button class="cta-button">Start Ordering</button>
                    </div>
                </div>
            </div>
            
            <div id="admin" class="content" style="display: none;">
                <div>
                    <h2>👨‍💼 Admin Dashboard</h2>
                    <p>Real-time order management and restaurant operations</p>
                    <div class="cta-section">
                        <button class="cta-button">Admin Login</button>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="cta-section">
            <h2>🚀 Ready to Experience the Future?</h2>
            <p>Join us in revolutionizing the restaurant ordering experience</p>
            <button class="cta-button">Get Started</button>
        </div>
        
        <div class="footer">
            <p>&copy; 2024 WPLCHMY.AI - Restaurant Self-Ordering System</p>
        </div>
    </div>
    
    <script>
        function showTab(tabName) {
            // Hide all content
            const contents = document.querySelectorAll('.content');
            contents.forEach(content => content.style.display = 'none');
            
            // Remove active class from all tabs
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            
            // Show selected content
            document.getElementById(tabName).style.display = 'flex';
            
            // Add active class to clicked tab
            event.target.classList.add('active');
        }
    </script>
</body>
</html>`;

// Write the index.html file
fs.writeFileSync(path.join(buildDir, 'index.html'), indexHtml);

// Create a _redirects file for Netlify
const redirects = `/*    /index.html   200`;
fs.writeFileSync(path.join(buildDir, '_redirects'), redirects);

console.log('✅ Advanced static build created successfully!');
console.log('📁 Files created:');
console.log('   - index.html (interactive landing page)');
console.log('   - _redirects (Netlify routing)');
console.log('');
console.log('🎨 Features included:');
console.log('   - Interactive tabs (Home, Menu, Cart, Admin)');
console.log('   - Responsive design');
console.log('   - Feature showcase');
console.log('   - Modern UI/UX');
console.log('');
console.log('🚀 Ready for Netlify deployment!');
console.log('   Upload the web-build/ folder to Netlify'); 