# Manual Build Instructions for Daily Focus

Since this is a background environment, you'll need to complete these steps manually on your local machine or development environment.

## Step 1: Prepare Your Environment

1. **Clone this repository** to your local machine
2. **Install dependencies**:
   ```bash
   npm install
   ```

## Step 2: Set Up Expo Account

1. **Install EAS CLI** (if not already installed):
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```
   - Create an account if you don't have one
   - This is free and required for building

## Step 3: Configure Project

1. **Configure EAS Build**:
   ```bash
   eas build:configure
   ```
   - Choose "Yes" when asked about creating eas.json
   - This will update your app.json with a real project ID

## Step 4: Build for Production

1. **Build Android AAB for Play Store**:
   ```bash
   eas build --platform android --profile production
   ```
   
2. **Wait for build to complete** (10-20 minutes)
   - You'll receive an email with download link
   - Download the `.aab` file

## Step 5: Create Play Store Assets

### Feature Graphic
- Use the SVG file created at `assets/feature-graphic.svg`
- Convert to PNG (1024x500 pixels)
- Tools: Inkscape, GIMP, Figma, or online converters

### Screenshots
You need to take screenshots of your app:

1. **Run the app locally**:
   ```bash
   npm start
   ```

2. **Take screenshots** of:
   - Sign in screen
   - Calendar view
   - Diary view
   - Settings screen

3. **Screenshot requirements**:
   - Format: PNG or JPEG
   - Size: 1080x1920 or 1080x2340 pixels
   - At least 2 screenshots, up to 8

## Step 6: Google Play Console

1. **Create Google Play Console account**:
   - Go to [play.google.com/console](https://play.google.com/console)
   - Pay $25 one-time registration fee

2. **Create new app**:
   - App name: "Daily Focus"
   - Language: English (United States)
   - App type: App
   - Free or paid: Free

3. **Upload AAB file**:
   - Go to "Release" > "Production"
   - Create new release
   - Upload the `.aab` file from Step 4

## Step 7: Complete Store Listing

### App Information
- **Short description**: "A simple and elegant daily planning and journaling app"
- **Full description**: (Use the description from the guide)
- **Category**: Productivity

### Graphics
- **App icon**: Use `assets/icon.png` (resize to 512x512 if needed)
- **Feature graphic**: Use the converted PNG from `assets/feature-graphic.svg`
- **Screenshots**: Upload the screenshots you took

### Contact Details
- **Developer email**: Your email address
- **Website**: Your website (optional)
- **Privacy policy**: Required - use the template provided

## Step 8: Privacy Policy

1. **Customize the privacy policy template**:
   - Edit `privacy-policy-template.md`
   - Replace placeholder information with your details
   - Publish it on your website

2. **Add privacy policy URL** to Play Console

## Step 9: Content Rating & Distribution

1. **Complete content rating questionnaire**
   - Should result in "Everyone" rating
   
2. **Set distribution**:
   - Countries: Select your target markets
   - Device categories: Phone and Tablet

## Step 10: Submit for Review

1. **Review all sections** - ensure no errors
2. **Submit app for review**
3. **Wait 1-3 days** for Google's review

## Current Status

✅ **Completed**:
- App configuration updated
- Build configuration created
- Dependencies fixed for Expo SDK 53
- Feature graphic SVG created
- Privacy policy template provided
- Comprehensive documentation created

📋 **Next Actions Required**:
1. Run the build commands above on your local machine
2. Create PNG feature graphic from the SVG
3. Take app screenshots
4. Set up Google Play Console account
5. Complete the upload and submission process

## Troubleshooting

### Common Issues:
- **Build fails**: Ensure you're logged into Expo (`eas login`)
- **Missing assets**: Convert SVG to PNG, take screenshots
- **Play Console errors**: Check all required fields are filled

### Support:
- [Expo Documentation](https://docs.expo.dev/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)

---

**Estimated Time**: 2-4 hours for first-time setup + 1-3 days for Google review