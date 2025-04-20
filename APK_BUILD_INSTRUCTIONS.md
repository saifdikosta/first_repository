# Recovery Assistant APK Build Instructions

Since Expo Go is unable to load your project, here are three alternative methods to create an APK file that you can install directly on your Android device.

## Method 1: EAS Build (Cloud-based)

This method uses Expo Application Services (EAS) to build your APK in the cloud.

```bash
npm run build:android
```

This will:
1. Check and install dependencies
2. Configure the EAS build profile
3. Use EAS cloud services to build your APK
4. Provide a download link for the APK when complete

**Pros**: No need to set up Android SDK locally.  
**Cons**: Requires an Expo account and internet connection.

## Method 2: Direct APK Build

This method also uses EAS but with more configuration options and better error handling.

```bash
npm run build:apk:direct
```

This will:
1. Verify all dependencies
2. Configure the build profile for a standalone APK
3. Build the APK in the cloud via EAS
4. Provide detailed installation instructions

**Pros**: More robust than Method 1, more detailed output.  
**Cons**: Still requires an Expo account and internet connection.

## Method 3: Local Development Build (Requires Android SDK)

This method builds the APK entirely on your local machine without using Expo's cloud services.

```bash
npm run build:apk:local
```

This will:
1. Check for required dependencies (Java, Android SDK)
2. Generate native Android code using Expo Prebuild
3. Build the APK using Gradle
4. Copy the finished APK to the project root

**Pros**: Works offline, no Expo account needed, fully local build.  
**Cons**: Requires Android SDK and Java JDK installed.

## Prerequisites for Method 3 (Local Build)

1. Install Java JDK 11 or later: [Download from Adoptium](https://adoptium.net/temurin/releases/)
2. Install Android Studio: [Download from Android Developers](https://developer.android.com/studio)
3. Set up Android SDK and environment variables:
   - Set `ANDROID_HOME` to your Android SDK location
   - Add Android tools to your PATH

## Installing the APK

After building with any method:

1. Transfer the APK file to your Android device (USB, email, cloud storage)
2. On your Android device, navigate to the APK file
3. Tap to install (you may need to enable "Install from unknown sources" in settings)
4. Open the app after installation

## Troubleshooting

- **Build fails with Java errors**: Ensure you have JDK 11+ installed and JAVA_HOME is set
- **Android SDK not found**: Make sure ANDROID_HOME points to your SDK directory
- **Gradle errors**: Try running `./gradlew clean` in the android directory before building
- **APK doesn't install**: Check if your device allows installation from unknown sources

If you continue to have issues, please refer to the [Expo documentation](https://docs.expo.dev/build/setup/) or open an issue in the project repository. 