# Push Notification Setup for Ramadan App

## Features Implemented

The app now sends push notifications for Sehri and Iftar times:

### Notification Schedule:
- **15 minutes before** Sehri/Iftar
- **10 minutes before** Sehri/Iftar  
- **5 minutes before** Sehri/Iftar
- **At exact time** of Sehri/Iftar (includes duas)

### Duas Included:
- **Sehri Dua**: وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ
- **Iftar Dua**: اللَّهُمَّ إِنِّي لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ

## Setup Instructions

### 1. Install Dependencies (Already Done)
```bash
npm install react-native-push-notification @react-native-community/push-notification-ios
```

### 2. Android Setup

#### Link the package (for React Native < 0.60):
```bash
npx react-native link react-native-push-notification
```

For React Native 0.60+, auto-linking should work automatically.

#### Rebuild the app:
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### 3. iOS Setup (if needed)

```bash
cd ios
pod install
cd ..
npx react-native run-ios
```

## Testing Notifications

1. **Grant Permissions**: When you first open the app, it will request notification permissions. Make sure to allow them.

2. **Check Scheduled Notifications**: The app automatically schedules all notifications when it starts.

3. **Test Immediately**: To test notifications without waiting, you can modify the `NotificationService.js` file to schedule a test notification a few seconds in the future.

## Troubleshooting

### Notifications not appearing on Android:
1. Check that notification permissions are granted in Settings > Apps > Taqwim > Notifications
2. Ensure battery optimization is disabled for the app
3. Check that "Do Not Disturb" mode is off

### Notifications not scheduling:
1. Check the console logs for any errors
2. Verify that the dates in data.json are in the future
3. Make sure the app has been opened at least once to schedule notifications

## File Structure

```
services/
  └── NotificationService.js    # Handles all notification logic
App.js                          # Initializes notifications on app start
android/app/src/main/
  └── AndroidManifest.xml       # Android permissions and receivers
```

## Customization

To customize notification messages or timing, edit `services/NotificationService.js`:

- Change notification titles/messages in the `scheduleRamadanNotifications` method
- Modify the duas at the top of the file
- Adjust timing offsets (currently 15, 10, 5 minutes)
