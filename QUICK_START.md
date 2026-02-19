# Quick Start Guide - Ramadan Notifications

## What's Been Added

Your Ramadan app now has automatic push notifications! Here's what happens:

### Notification Schedule (for each day):
1. **15 minutes before Sehri** - "Only 15 minutes left for Sehri!"
2. **10 minutes before Sehri** - "Only 10 minutes left for Sehri!"
3. **5 minutes before Sehri** - "Only 5 minutes left for Sehri!"
4. **At Sehri time** - Shows the Sehri dua in Arabic and English
5. **15 minutes before Iftar** - "Only 15 minutes left for Iftar!"
6. **10 minutes before Iftar** - "Only 10 minutes left for Iftar!"
7. **5 minutes before Iftar** - "Only 5 minutes left for Iftar!"
8. **At Iftar time** - Shows the Iftar dua in Arabic and English

## How to Run

### For Android:

```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..

# Run the app
npx react-native run-android
```

### First Time Setup:
1. When the app opens, it will request notification permissions - **tap "Allow"**
2. All notifications are automatically scheduled for the entire Ramadan month
3. You'll see a bell icon in the top-right corner of the app

## Managing Notifications

Tap the **bell icon** (🔔) in the top-right corner to:
- **Reschedule All** - Refresh all notifications
- **Cancel All** - Turn off all notifications
- **View Scheduled** - See how many notifications are scheduled
- **Close** - Go back to the app

## Testing

To test if notifications are working:

1. Open the app and grant permissions
2. Check your notification settings: Settings > Apps > Taqwim > Notifications (should be enabled)
3. Wait for the scheduled times, or modify the code to test sooner

### Quick Test (Optional):
Edit `services/NotificationService.js` and add this test notification in the `configure` method:

```javascript
// Test notification (fires in 10 seconds)
setTimeout(() => {
  PushNotification.localNotification({
    channelId: 'ramadan-notifications',
    title: '🌙 Test Notification',
    message: 'Notifications are working!',
  });
}, 10000);
```

## Important Notes

- Notifications are scheduled when the app first opens
- They persist even after closing the app
- On Android 12+, you may need to manually enable "Alarms & reminders" permission in app settings
- Disable battery optimization for the app to ensure notifications work reliably

## Files Modified/Created

- ✅ `services/NotificationService.js` - New notification service
- ✅ `App.js` - Initializes notifications on startup
- ✅ `components/CalenderPage.js` - Added notification settings button
- ✅ `android/app/src/main/AndroidManifest.xml` - Added permissions
- ✅ `package.json` - Added notification dependencies

Enjoy your Ramadan app with timely notifications! 🌙✨
