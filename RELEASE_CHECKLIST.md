# Daily Focus - Play Store Release Checklist

## Pre-Release Setup ✅
- [x] EAS CLI installed
- [x] App configuration updated (`app.json`)
- [x] Build configuration created (`eas.json`)
- [x] Dependencies installed
- [x] Package.json updated with build scripts

## Account Setup
- [ ] Create Expo account
- [ ] Login with `eas login`
- [ ] Run `eas build:configure` to get project ID
- [ ] Create Google Play Console account ($25 fee)
- [ ] Complete developer profile verification

## App Store Assets
- [ ] App icon ready (512x512 PNG) ✅ Have: `assets/icon.png`
- [ ] Feature graphic created (1024x500 PNG) ❌ **NEED TO CREATE**
- [ ] Screenshots taken (at least 2, phone size) ❌ **NEED TO CREATE**
- [ ] Optional: Tablet screenshots

## Legal Requirements
- [ ] Privacy policy written and published ✅ Template provided
- [ ] Terms of service (optional but recommended)
- [ ] Website with privacy policy link
- [ ] Support email address set up

## App Information
- [ ] App name: "Daily Focus" ✅
- [ ] Short description ready ✅
- [ ] Full description ready ✅
- [ ] Category: Productivity ✅
- [ ] Keywords/tags prepared ✅
- [ ] Contact information ready

## Build Process
- [ ] Test app locally (`npm start`)
- [ ] Build production AAB (`eas build --platform android --profile production`)
- [ ] Download AAB file from build completion email
- [ ] Verify AAB file integrity

## Google Play Console Setup
- [ ] Create new app in Play Console
- [ ] Upload AAB file
- [ ] Complete store listing information
- [ ] Upload graphics (icon, feature graphic, screenshots)
- [ ] Set pricing (Free recommended)
- [ ] Choose distribution countries
- [ ] Complete content rating questionnaire
- [ ] Review all sections for errors

## Final Steps
- [ ] Submit app for review
- [ ] Monitor review status (1-3 days typical)
- [ ] Address any review feedback
- [ ] App published! 🎉

## Post-Launch
- [ ] Monitor Google Play Console for crashes
- [ ] Respond to user reviews
- [ ] Track download and usage statistics
- [ ] Plan future updates

---

## Quick Start Commands

```bash
# 1. Login to Expo
eas login

# 2. Configure project (adds project ID to app.json)
eas build:configure

# 3. Build for production
eas build --platform android --profile production

# 4. Check build status
eas build:list
```

## Important Notes

### Assets Still Needed:
1. **Feature Graphic** (1024x500): Create a banner showcasing your app
2. **Screenshots**: Take 2-8 screenshots of your app in action
3. **Privacy Policy**: Customize the template and publish it on your website

### Estimated Timeline:
- Setup and preparation: 2-4 hours
- Asset creation: 2-3 hours
- Build and upload: 1-2 hours
- Google review: 1-3 days
- **Total: 1-2 days** (plus review time)

### Costs:
- Google Play Console: $25 one-time fee
- Expo account: Free
- App distribution: Free

---

**Current Status**: Ready to start Step 1 (Expo account setup)
**Next Action**: Run `eas login` to begin the process