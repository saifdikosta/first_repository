/**
 * Direct APK Build Script for Recovery Assistant
 * This script builds an APK directly without requiring Expo Go
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

console.log(`${colors.bright}${colors.cyan}=== Recovery Assistant Direct APK Builder ===${colors.reset}\n`);
console.log(`${colors.yellow}This script will build a standalone APK file for your Android device.${colors.reset}\n`);

// Check if we're in the right directory
if (!fs.existsSync(path.join(process.cwd(), 'package.json'))) {
  console.error(`${colors.red}Error: package.json not found. Make sure you're in the project root directory.${colors.reset}`);
  process.exit(1);
}

// Function to run commands with error handling
function runCommand(command, errorMessage) {
  try {
    console.log(`> ${command}`);
    return execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`${colors.red}${colors.bright}ERROR: ${errorMessage}${colors.reset}`);
    if (error.message) console.error(error.message);
    process.exit(1);
  }
}

// Install dependencies if not installed
function installDependencies() {
  console.log(`\n${colors.bright}Checking dependencies...${colors.reset}`);
  
  if (!fs.existsSync(path.join(process.cwd(), 'node_modules'))) {
    console.log(`${colors.yellow}Installing dependencies...${colors.reset}`);
    runCommand('npm install', 'Failed to install dependencies');
  } else {
    console.log(`${colors.green}Dependencies already installed.${colors.reset}`);
  }
}

// Configure build profile for standalone APK
function configureBuildProfile() {
  console.log(`\n${colors.bright}Configuring build profile for standalone APK...${colors.reset}`);
  
  // Make sure eas.json has the preview profile with buildType: apk
  const easJsonPath = path.join(process.cwd(), 'eas.json');
  if (fs.existsSync(easJsonPath)) {
    try {
      const easConfig = JSON.parse(fs.readFileSync(easJsonPath, 'utf8'));
      
      // Make sure we have the proper preview configuration
      if (!easConfig.build || !easConfig.build.preview || 
          !easConfig.build.preview.android || 
          easConfig.build.preview.android.buildType !== 'apk') {
        
        // Set the correct configuration
        if (!easConfig.build) easConfig.build = {};
        easConfig.build.preview = {
          distribution: "internal",
          android: {
            buildType: "apk"
          }
        };
        
        fs.writeFileSync(easJsonPath, JSON.stringify(easConfig, null, 2));
        console.log(`${colors.green}Successfully updated eas.json configuration.${colors.reset}`);
      } else {
        console.log(`${colors.green}eas.json already properly configured.${colors.reset}`);
      }
    } catch (error) {
      console.error(`${colors.red}Error reading/writing eas.json: ${error.message}${colors.reset}`);
      process.exit(1);
    }
  } else {
    console.log(`${colors.yellow}Creating eas.json file...${colors.reset}`);
    const easConfig = {
      "cli": {
        "version": ">= 5.9.0"
      },
      "build": {
        "preview": {
          "distribution": "internal",
          "android": {
            "buildType": "apk"
          }
        }
      }
    };
    
    fs.writeFileSync(easJsonPath, JSON.stringify(easConfig, null, 2));
    console.log(`${colors.green}Created eas.json file.${colors.reset}`);
  }
}

// Generate local APK using EAS Build
async function buildApk() {
  console.log(`\n${colors.bright}${colors.blue}Starting APK build process...${colors.reset}`);
  
  // Make sure EAS CLI is installed
  try {
    console.log(`${colors.bright}Checking for EAS CLI...${colors.reset}`);
    execSync('npx eas-cli --version', { stdio: 'ignore' });
    console.log(`${colors.green}EAS CLI is available.${colors.reset}`);
  } catch (error) {
    console.log(`${colors.yellow}Installing EAS CLI...${colors.reset}`);
    runCommand('npm install -g eas-cli', 'Failed to install EAS CLI');
  }
  
  // Login to EAS if needed
  console.log(`\n${colors.bright}Checking EAS login status...${colors.reset}`);
  try {
    const whoamiOutput = execSync('npx eas whoami', { stdio: 'pipe' }).toString();
    if (whoamiOutput.includes('Logged in as')) {
      console.log(`${colors.green}Already logged in to EAS.${colors.reset}`);
    } else {
      throw new Error('Not logged in');
    }
  } catch (error) {
    console.log(`${colors.yellow}Please log in to your Expo account:${colors.reset}`);
    runCommand('npx eas login', 'Failed to login to EAS');
  }
  
  // Configure and build
  console.log(`\n${colors.bright}Building APK...${colors.reset}`);
  console.log(`${colors.yellow}This may take several minutes. The APK will be built in the cloud.${colors.reset}\n`);
  
  // Run the build command
  runCommand('npx eas build -p android --profile preview --non-interactive', 'Failed to build APK');
  
  console.log(`\n${colors.bright}${colors.green}Build completed!${colors.reset}`);
  console.log(`${colors.yellow}You can download your APK from the URL above.${colors.reset}`);
  console.log(`${colors.yellow}After downloading, transfer the APK to your Android device and install it.${colors.reset}`);
}

// Main function to run the build process
async function main() {
  try {
    installDependencies();
    configureBuildProfile();
    await buildApk();
  } catch (error) {
    console.error(`${colors.red}Build failed: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Run the script
main(); 