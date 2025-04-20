/**
 * Expo Development Build APK Generator
 * This script creates a development build APK without using Expo Go
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// ANSI color codes for prettier console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

console.log(`\n${colors.bright}${colors.cyan}=== Expo Development Build APK Generator ===${colors.reset}\n`);
console.log(`${colors.yellow}This script will create a development build APK that you can install directly on your device.${colors.reset}\n`);

// Check if we're in the right directory
if (!fs.existsSync(path.join(process.cwd(), 'package.json'))) {
  console.error(`${colors.red}Error: package.json not found. Make sure you're in the project root directory.${colors.reset}`);
  process.exit(1);
}

// Helper function to run commands and handle errors
function runCommand(command, errorMessage) {
  try {
    console.log(`${colors.dim}> ${command}${colors.reset}`);
    return execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`${colors.red}${colors.bright}ERROR: ${errorMessage}${colors.reset}`);
    console.error(`${colors.dim}${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Install dependencies if needed
function checkDependencies() {
  console.log(`\n${colors.bright}Checking dependencies...${colors.reset}`);
  
  if (!fs.existsSync(path.join(process.cwd(), 'node_modules'))) {
    console.log(`${colors.yellow}Installing dependencies...${colors.reset}`);
    runCommand('npm install', 'Failed to install dependencies');
  } else {
    console.log(`${colors.green}Dependencies already installed.${colors.reset}`);
  }
  
  // Check if we have Java installed (needed for Android builds)
  try {
    execSync('java -version', { stdio: 'ignore' });
    console.log(`${colors.green}Java is installed.${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Java is not installed. Please install JDK 11 or later.${colors.reset}`);
    console.error(`${colors.yellow}Download from: https://adoptium.net/temurin/releases/${colors.reset}`);
    process.exit(1);
  }
  
  // Check if we have Android SDK installed
  const androidHome = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
  if (!androidHome) {
    console.error(`${colors.red}Android SDK not found. Please install Android Studio.${colors.reset}`);
    console.error(`${colors.yellow}Download from: https://developer.android.com/studio${colors.reset}`);
    console.error(`${colors.yellow}Then set ANDROID_HOME environment variable to the SDK location.${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`${colors.green}Android SDK found at: ${androidHome}${colors.reset}`);
  }
}

// Create necessary configuration files
function prepareConfiguration() {
  console.log(`\n${colors.bright}Preparing build configuration...${colors.reset}`);
  
  // Create or update app.json/app.config.js
  if (!fs.existsSync(path.join(process.cwd(), 'app.json')) && 
      !fs.existsSync(path.join(process.cwd(), 'app.config.js'))) {
    console.log(`${colors.yellow}Creating app.json configuration...${colors.reset}`);
    
    const appConfig = {
      "expo": {
        "name": "Recovery Assistant",
        "slug": "recovery-assistant",
        "version": "1.0.0",
        "orientation": "portrait",
        "icon": "./assets/images/icon.png",
        "userInterfaceStyle": "automatic",
        "splash": {
          "image": "./assets/images/splash.png",
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        },
        "assetBundlePatterns": ["**/*"],
        "ios": {
          "supportsTablet": true,
          "bundleIdentifier": "com.recoveryapp.app"
        },
        "android": {
          "adaptiveIcon": {
            "foregroundImage": "./assets/images/adaptive-icon.png",
            "backgroundColor": "#ffffff"
          },
          "package": "com.recoveryapp.app",
          "permissions": [
            "RECEIVE_BOOT_COMPLETED",
            "VIBRATE",
            "SCHEDULE_EXACT_ALARM"
          ]
        }
      }
    };
    
    fs.writeFileSync(path.join(process.cwd(), 'app.json'), JSON.stringify(appConfig, null, 2));
    console.log(`${colors.green}Created app.json file.${colors.reset}`);
  } else {
    console.log(`${colors.green}app.json/app.config.js already exists.${colors.reset}`);
  }
  
  // Ensure we have the right gradle configuration (android/app/build.gradle)
  const androidDir = path.join(process.cwd(), 'android');
  if (!fs.existsSync(androidDir)) {
    console.log(`${colors.yellow}Creating Android project files...${colors.reset}`);
    console.log(`${colors.yellow}Running expo prebuild to generate native code...${colors.reset}`);
    
    runCommand('npx expo prebuild --platform android --clean', 'Failed to generate Android files');
  } else {
    console.log(`${colors.green}Android directory already exists.${colors.reset}`);
  }
}

// Build the APK
function buildApk() {
  console.log(`\n${colors.bright}${colors.blue}Building APK...${colors.reset}`);
  console.log(`${colors.yellow}This may take several minutes...${colors.reset}\n`);
  
  // Change to the android directory and run gradlew assembleDebug
  process.chdir(path.join(process.cwd(), 'android'));
  
  if (os.platform() === 'win32') {
    runCommand('.\\gradlew.bat assembleDebug', 'Failed to build APK');
  } else {
    runCommand('./gradlew assembleDebug', 'Failed to build APK');
  }
  
  // Move back to project root
  process.chdir('..');
  
  // Find the APK path
  const apkPath = path.join(process.cwd(), 'android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
  
  if (fs.existsSync(apkPath)) {
    console.log(`\n${colors.bright}${colors.green}APK build successful!${colors.reset}`);
    console.log(`${colors.yellow}Your APK is located at:${colors.reset}`);
    console.log(`${colors.bright}${apkPath}${colors.reset}\n`);
    
    // Create a more accessible copy of the APK in the project root
    const destPath = path.join(process.cwd(), 'recovery-assistant.apk');
    fs.copyFileSync(apkPath, destPath);
    
    console.log(`${colors.green}A copy of the APK has been placed at:${colors.reset}`);
    console.log(`${colors.bright}${destPath}${colors.reset}\n`);
    console.log(`${colors.yellow}To install on your device:${colors.reset}`);
    console.log(`1. Transfer this APK to your Android device`);
    console.log(`2. On your device, open the file manager and navigate to the APK`);
    console.log(`3. Tap on the APK to install (you might need to enable "Install from unknown sources" in settings)`);
  } else {
    console.error(`${colors.red}Could not find the built APK at the expected location.${colors.reset}`);
    process.exit(1);
  }
}

// Main function
function main() {
  try {
    checkDependencies();
    prepareConfiguration();
    buildApk();
  } catch (error) {
    console.error(`${colors.red}An error occurred: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Run the script
main(); 