# Daily Focus - Google Play Store Release Guide

This guide will walk you through the complete process of releasing your Daily Focus app to the Google Play Store.

## Prerequisites

✅ **Completed Setup:**
- EAS CLI installed
- App configuration updated
- Build configuration created

## Step 1: Create Expo Account and Project

1. **Create an Expo account** (if you don't have one):
   ```bash
   eas login
   ```

2. **Initialize your project with EAS**:
   ```bash
   eas build:configure
   ```
   This will update your `app.json` with a project ID.

## Step 2: Google Play Console Setup

1. **Create a Google Play Console account**:
   - Go to [Google Play Console](https://play.google.com/console)
   - Pay the $25 one-time registration fee
   - Complete your developer profile

2. **Create a new app**:
   - Click "Create app"
   - App name: "Daily Focus"
   - Default language: English (United States)
   - App or game: App
   - Free or paid: Free (or paid if you prefer)

## Step 3: Prepare App Store Assets

### Required Assets:
1. **App Icon** (already have: `assets/icon.png`)
2. **Feature Graphic** (1024 x 500 pixels) - **NEED TO CREATE**
3. **Screenshots** (at least 2, up to 8):
   - Phone: 1080 x 1920 or 1080 x 2340 pixels
   - Tablet: 7" and 10" (optional)

### Create Feature Graphic:
- Size: 1024 x 500 pixels
- Should showcase your app's key features
- No text overlays (Google will add the app name)

## Step 4: Build Your App

1. **Build for production**:
   ```bash
   eas build --platform android --profile production
   ```

2. **Wait for build to complete** (usually 10-20 minutes)
   - You'll get a download link for the AAB file
   - Download the `.aab` file to upload to Play Store

## Step 5: Upload to Google Play Console

1. **Go to your app in Play Console**
2. **Navigate to "Release" > "Production"**
3. **Create new release**:
   - Upload the `.aab` file
   - Add release notes (see template below)

### Release Notes Template:
```
Initial release of Daily Focus

Features:
• Clean calendar view for daily planning
• Personal diary for reflections
• Secure cloud sync
• Minimalist, user-friendly design

Stay organized and focused with Daily Focus!
```

## Step 6: Complete Store Listing

### App Information:
- **App name**: Daily Focus
- **Short description**: A simple and elegant daily planning and journaling app
- **Full description**: (Use the one from `store-config.json`)

### Graphics:
- Upload app icon (512 x 512)
- Upload feature graphic (1024 x 500)
- Upload at least 2 phone screenshots

### Categorization:
- **Category**: Productivity
- **Tags**: Add relevant tags like "planning", "diary", "productivity"

### Contact Details:
- **Website**: Your website URL
- **Email**: Your support email
- **Privacy Policy**: Required for apps that handle user data

## Step 7: Content Rating

1. **Complete the content rating questionnaire**
2. **For Daily Focus**: Should be rated "Everyone" or "Everyone 10+"

## Step 8: App Pricing & Distribution

1. **Set pricing**: Free (recommended for initial release)
2. **Select countries**: Choose your target markets
3. **Device categories**: Phone and Tablet

## Step 9: Review and Publish

1. **Review all sections** - ensure no errors
2. **Submit for review**
3. **Wait for Google's review** (usually 1-3 days)

## Step 10: Post-Launch

### Monitor your app:
- Check Google Play Console for crashes
- Monitor user reviews
- Track download statistics

### Future Updates:
```bash
# Update version in app.json, then:
eas build --platform android --profile production
# Upload new AAB to Play Console
```

## Important Notes

### Privacy Policy Requirements:
Your app collects user data (auth, diary entries), so you **MUST** have a privacy policy. Create one that covers:
- What data you collect
- How you use it
- How you protect it
- User rights (deletion, access, etc.)

### App Signing:
- EAS handles app signing automatically
- Google Play App Signing is recommended (enabled by default)

### Testing:
Consider using Internal Testing track first:
```bash
eas build --platform android --profile preview
```

## Troubleshooting

### Common Issues:
1. **Build fails**: Check `eas.json` configuration
2. **Upload rejected**: Ensure AAB is signed and targets recent Android API
3. **Policy violations**: Review Google Play policies

### Getting Help:
- [Expo EAS Documentation](https://docs.expo.dev/build/introduction/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)

## Quick Commands Reference

```bash
# Login to Expo
eas login

# Configure project
eas build:configure

# Build for production
eas build --platform android --profile production

# Check build status
eas build:list

# Submit to Play Store (after setting up credentials)
eas submit --platform android --profile production
```

---

**Next Steps**: Start with Step 1 (Expo account) and work through each step systematically. The entire process typically takes 1-2 days for the initial setup and review.