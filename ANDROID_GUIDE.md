# How to Turn Exhale into an Android App (.aab)
Since Exhale is built as a Progressive Web App (PWA), you can easily package it into an Android App Bundle (`.aab`) file ready for the Google Play Store using free tools. You do not need to write any Android code.
## Prerequisites
1. **Deploy the App**: Ensure your application is deployed to a public URL (e.g., `https://your-exhale-app.pages.dev`).
2. **Google Play Developer Account**: You need an active account to upload apps to the Play Store ($25 one-time fee).
## Step 1: Generate the Android Package
We will use **PWABuilder**, a Microsoft-backed tool that wraps PWAs into native app packages.
1. Go to [https://www.pwabuilder.com/](https://www.pwabuilder.com/).
2. Enter your deployed application URL (e.g., `https://your-project.aurelia.so`) and click **Start**.
3. Wait for the audit to complete. You should see a high score because we have already added the required `manifest.json` and `service-worker.js`.
4. Click the **Package for Stores** button.
5. Select **Android** (Google Play).
6. Fill in the details:
   - **Package ID**: e.g., `com.exhale.tracker` (Must be unique).
   - **App Name**: Exhale.
   - **Launcher Name**: Exhale.
   - **Signing Key**: Choose "Generate a new signing key" (Save this key safely! You need it for future updates).
7. Click **Generate**.
8. Download the zip file. Inside, you will find the **`.aab` file** (Android App Bundle) and the **`.apk` file** (for testing on your phone).
## Step 2: Test on Your Device
1. Transfer the `.apk` file from the downloaded zip to your Android phone.
2. Tap to install it.
3. Verify that the app opens, the splash screen appears, and it functions correctly.
## Step 3: Upload to Google Play Console
1. Go to the [Google Play Console](https://play.google.com/console).
2. Click **Create App**.
3. Fill in the app details (Name, Language, etc.).
4. Navigate to **Production** (or Internal Testing) in the sidebar.
5. Click **Create new release**.
6. Upload the **`.aab` file** you generated in Step 1.
7. Complete the rest of the store listing (Screenshots, Description, Content Rating, etc.).
8. Submit for review!
## Customizing Icons (Recommended)
The current app uses a default placeholder icon. To make it look professional:
1. Create a 512x512 PNG logo.
2. Replace the `vite.svg` in the `public` folder with your new icon (or update `manifest.json` to point to your new PNG files).
3. Re-deploy your web app.
4. Re-run the PWABuilder process to generate a new `.aab` with the correct icons.
## Troubleshooting
- **"Manifest not found"**: Ensure you deployed the latest version of the code containing `public/manifest.json`.
- **"Service Worker missing"**: Ensure `public/sw.js` is present and `index.html` has the registration script.
- **"Asset Links"**: For a verified "Trusted Web Activity" (removes the browser URL bar completely), you may need to setup Digital Asset Links. PWABuilder provides instructions for this during generation.