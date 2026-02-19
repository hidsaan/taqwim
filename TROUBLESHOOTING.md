# Troubleshooting Guide - Ramadan Notifications

## Common Issues and Solutions

### 1. Notifications Not Appearing

#### Check Permissions
```
Settings > Apps > Taqwim > Notifications
```
Make sure all notification permissions are enabled.

#### Android 12+ Specific
On Android 12 and above, you need to enable "Alarms & reminders":
```
Settings > Apps > Taqwim > Alarms & reminders > Allow
```

#### Battery Optimization
Disable battery optimization for the app:
```
Settings > Apps > Taqwim > Battery > Unrestricted
```

### 2. App Crashes on Launch

#### Clean and Rebuild
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

#### Clear Cache
```bash
npx react-native start --reset-cache
```

### 3. Notifications Not Scheduling

#### Check Console Logs
Look for errors in Metro bundler or Android logcat:
```bash
npx react-native log-android
```

#### Verify Dates
Make sure the dates in `components/data.json` are in the future. Past dates won't schedule notifications.

#### Manual Reschedule
Open the app and tap the bell icon (🔔), then select "Reschedule All".

### 4. Build Errors

#### Gradle Issues
```bash
cd android
./gradlew clean
./gradlew --stop
cd ..
```

#### Node Modules
```bash
rm -rf node_modules
npm install
```

#### Linking Issues (React Native < 0.60)
```bash
npx react-native link react-native-push-notification
```

### 5. Notifications Appear Late or Not on Time

#### Disable Battery Saver
Battery saver mode can delay notifications. Disable it or add the app to exceptions.

#### Check Do Not Disturb
Some DND settings block all notifications. Configure DND to allow priority notifications.

#### Background Restrictions
```
Settings > Apps > Taqwim > Battery > Background restriction > Remove
```

### 6. Testing Notifications

#### Quick Test Method
Add this to `services/NotificationService.js` in the `configure` method:

```javascript
// Test notification after 10 seconds
setTimeout(() => {
  PushNotification.localNotification({
    channelId: 'ramadan-notifications',
    title: '🌙 Test Notification',
    message: 'If you see this, notifications are working!',
  });
}, 10000);
```

Then rebuild and run the app. You should see a notification after 10 seconds.

### 7. iOS Specific Issues (if applicable)

#### Install Pods
```bash
cd ios
pod install
cd ..
```

#### Request Permissions
iOS requires explicit permission request. The app does this automatically, but make sure you tap "Allow" when prompted.

### 8. Notification Sound Not Playing

#### Check Device Volume
Make sure notification volume is not muted.

#### Notification Settings
```
Settings > Apps > Taqwim > Notifications > Ramadan Prayer Times > Sound
```
Make sure a sound is selected.

### 9. Duplicate Notifications

This can happen if notifications are scheduled multiple times. Solution:

1. Open the app
2. Tap the bell icon (🔔)
3. Select "Cancel All"
4. Select "Reschedule All"

### 10. Notifications Stop After Device Restart

The app includes `RECEIVE_BOOT_COMPLETED` permission to handle this, but some devices require additional steps:

#### Enable Auto-Start
```
Settings > Apps > Taqwim > Auto-start > Enable
```

#### Xiaomi/MIUI Devices
```
Settings > Apps > Manage apps > Taqwim > Autostart > Enable
Settings > Battery & performance > App battery saver > Taqwim > No restrictions
```

#### Huawei Devices
```
Settings > Apps > Taqwim > Battery > App launch > Manage manually
Enable all three options (Auto-launch, Secondary launch, Run in background)
```

## Debug Commands

### View Scheduled Notifications
Use the bell icon in the app and select "View Scheduled" to see how many notifications are scheduled.

### Check Android Logs
```bash
adb logcat | grep -i notification
```

### Check React Native Logs
```bash
npx react-native log-android
```

## Still Having Issues?

1. Make sure you're running the latest version of the app
2. Check that `components/data.json` has valid dates
3. Verify all dependencies are installed: `npm install`
4. Try uninstalling and reinstalling the app
5. Check device-specific notification settings

## Contact Information

If you continue to experience issues, check:
- React Native Push Notification docs: https://github.com/zo0r/react-native-push-notification
- React Native community forums
- Stack Overflow with tag `react-native-push-notification`
