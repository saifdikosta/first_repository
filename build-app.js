const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Recovery Assistant app build process...');
console.log('This script will help you build an APK for Android devices.');

// Check if eas-cli is installed
console.log('📦 Checking for eas-cli installation...');
exec('npx eas-cli --version', (error) => {
  if (error) {
    console.log('⚠️ eas-cli is not installed. Installing it now...');
    exec('npm install -g eas-cli', (err) => {
      if (err) {
        console.error('❌ Failed to install eas-cli. Please install it manually with: npm install -g eas-cli');
        process.exit(1);
      } else {
        console.log('✅ eas-cli installed successfully!');
        buildApp();
      }
    });
  } else {
    console.log('✅ eas-cli is already installed.');
    buildApp();
  }
});

function buildApp() {
  console.log('🔧 Building Recovery Assistant app...');
  console.log('This will take several minutes. Please be patient...');
  
  // Build the app using eas build
  exec('npx eas build -p android --profile preview', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Build failed:', error);
      console.error(stderr);
      return;
    }
    
    console.log(stdout);
    console.log('✅ Build completed successfully!');
    console.log('\n📱 Instructions for installing on your Android device:');
    console.log('1. Download the APK from the URL provided above');
    console.log('2. On your Android device, navigate to the downloaded APK');
    console.log('3. Tap on it to install (you may need to enable "Install from unknown sources" in your settings)');
    console.log('4. Open the app after installation is complete');
    console.log('\nThank you for using Recovery Assistant!');
  });
} 