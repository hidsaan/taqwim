# Build Instructions - Ramadan Taqwim with Notifications

## Prerequisites

- Node.js (>= 18)
- React Native development environment set up
- Android Studio (for Android)
- Xcode (for iOS, Mac only)

## Step-by-Step Build Process

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `react-native-push-notification` - Main notification library
- `@react-native-community/push-notification-ios` - iOS support
- All other existing dependencies

### 2. Android Build

#### Clean Previous Builds
```bash
cd android
./gradlew clean
cd ..
```

#### Run on Android Device/Emulator
```bash
npx react-native run-android
```

Or if you prefer to build manually:
```bash
cd android
./gradlew assembleDebug
cd ..
```

The APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

#### For Release Build
```bash
cd android
./gradlew assembleRelease
cd ..
```

### 3. iOS Build (Mac only)

#### Install Pods
```bash
cd ios
pod install
cd ..
```

#### Run on iOS Simulator
```bash
npx react-native run-ios
```

#### For Device/Release
Open `ios/Taqwim.xcworkspace` in Xcode and build from there.

## First Run Setup

### When App Launches:

1. **Grant Permissions**: The app will request notification permissions
   - Tap "Allow" when prompted
   - This is required for notifications to work

2. **Automatic Scheduling**: The app automatically schedules all 240 notifications
   - 8 notifications per day
   - 30 days of Ramadan
   - Total: 240 notifications

3. **Verify Setup**: 
   - Tap the bell icon (🔔) in the top-right corner
   - Select "View Scheduled"
   - Should show 240 notifications scheduled

## Testing Notifications

### Quick Test Method:

1. Open `services/NotificationService.js`
2. Add this code in the `configure()` method:

```javascript
// Test notification after 10 seconds
setTimeout(() => {
  PushNotification.localNotification({
    channelId: 'ramadan-notifications',
    title: '🌙 Test Notification',
    message: 'Notifications are working!',
  });
}, 10000);
```

3. Rebuild and run the app
4. Wait 10 seconds - you should see a test notification

### Test Scheduled Notifications:

To test without waiting for actual prayer times, modify the time calculation in `NotificationService.js`:

```javascript
// Change this line in createNotificationDate method:
date.setMinutes(minutes - minutesOffset);

// To this (adds 1 minute from now for testing):
const now = new Date();
date.setHours(now.getHours());
date.setMinutes(now.getMinutes() + 1);
```

## Common Build Issues

### Issue: Metro Bundler Cache
```bash
npx react-native start --reset-cache
```

### Issue: Node Modules Corruption
```bash
rm -rf node_modules
npm install
```

### Issue: Android Gradle Issues
```bash
cd android
./gradlew clean
./gradlew --stop
cd ..
```

### Issue: iOS Pod Issues
```bash
cd ios
rm -rf Pods
pod install
cd ..
```

## Device-Specific Settings

### After Installation:

#### Android 12+ Devices:
1. Go to: Settings > Apps > Taqwim
2. Enable "Alarms & reminders"
3. Set Battery to "Unrestricted"

#### Xiaomi/MIUI Devices:
1. Settings > Apps > Manage apps > Taqwim
2. Enable "Autostart"
3. Battery saver > No restrictions

#### Huawei Devices:
1. Settings > Apps > Taqwim > Battery
2. App launch > Manage manually
3. Enable all three options

## Verification Checklist

- [ ] App builds successfully
- [ ] App launches without crashes
- [ ] Notification permission prompt appears
- [ ] Bell icon visible in top-right corner
- [ ] Tapping bell icon shows settings menu
- [ ] "View Scheduled" shows 240 notifications
- [ ] Test notification appears (if added)
- [ ] Calendar displays correctly
- [ ] Sehri/Iftar times show notification hints

## Build Outputs

### Debug APK Location:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Release APK Location:
```
android/app/build/outputs/apk/release/app-release.apk
```

### iOS Build:
Build through Xcode for device/App Store distribution

## Next Steps After Build

1. Install the app on your device
2. Grant notification permissions
3. Check notification settings in device settings
4. Wait for scheduled times or use test method
5. Verify notifications appear at correct times

## Support

If you encounter issues:
1. Check `TROUBLESHOOTING.md` for common solutions
2. Review `NOTIFICATION_SETUP.md` for detailed setup
3. Check React Native documentation
4. Review Android/iOS notification settings

## Production Checklist

Before releasing to users:

- [ ] Remove test notifications from code
- [ ] Test on multiple devices
- [ ] Verify all 240 notifications schedule correctly
- [ ] Test notification appearance and sound
- [ ] Verify duas display correctly in notifications
- [ ] Test battery impact
- [ ] Verify notifications survive device restart
- [ ] Test in different Android versions
- [ ] Update app version in package.json
- [ ] Generate signed APK/AAB for release

---

**Build Time**: ~2-5 minutes (depending on machine)
**App Size**: ~30-40 MB (debug), ~15-20 MB (release)
**Minimum Android Version**: Android 5.0 (API 21)
**Target Android Version**: Android 14 (API 34)
