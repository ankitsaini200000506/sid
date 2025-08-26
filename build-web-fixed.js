const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting SIDDHI Restaurant App build process...');

try {
  // Ensure web-build directory is clean
  const buildDir = path.join(__dirname, 'web-build');
  if (fs.existsSync(buildDir)) {
    console.log('🧹 Cleaning existing web-build directory...');
    fs.rmSync(buildDir, { recursive: true, force: true });
  }

  console.log('📦 Installing dependencies...');
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });

  console.log('🌐 Building Expo web app...');
  execSync('npx expo export --platform web --output-dir web-build --no-minify', { stdio: 'inherit' });

  // Verify the build output
  if (fs.existsSync(path.join(buildDir, 'index.html'))) {
    console.log('✅ Build completed successfully!');
    console.log('📁 Files in web-build/:');
    const files = fs.readdirSync(buildDir);
    files.forEach(file => {
      console.log(`   - ${file}`);
    });
    console.log('');
    console.log('🚀 Ready for Netlify deployment!');
  } else {
    throw new Error('Build output not found');
  }

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 