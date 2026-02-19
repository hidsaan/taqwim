# 🌙 Ramadan Taqwim - Push Notifications Feature

A complete push notification system for your Ramadan calendar app that reminds users before and at Sehri and Iftar times, including authentic Islamic duas.

## 📱 Features

### Smart Notification System
- **240 Total Notifications** - 8 per day for all 30 days of Ramadan
- **Progressive Reminders** - Alerts at 15, 10, and 5 minutes before prayer times
- **Authentic Duas** - Arabic and English duas displayed at exact prayer times
- **Persistent Scheduling** - Notifications work even when app is closed
- **Boot Persistence** - Survives device restarts
- **User Control** - Easy management through in-app settings

### Notification Schedule (Per Day)

#### Sehri (Pre-dawn meal)
- 🔔 15 minutes before
- 🔔 10 minutes before  
- 🔔 5 minutes before
- 🔔 At exact time with dua

#### Iftar (Breaking fast)
- 🔔 15 minutes before
- 🔔 10 minutes before
- 🔔 5 minutes before
- 🔔 At exact time with dua

## 🚀 Quick Start

### Installation
```bash
# Dependencies are already installed
npm install
```

### Build & Run
```bash
# Android
cd android && ./gradlew clean && cd ..
npx react-native run-android

# iOS (Mac only)
cd ios && pod install && cd ..
npx react-native run-ios
```

### First Launch
1. Grant notification permissions when prompted
2. Notifications are automatically scheduled
3. Tap the bell icon (🔔) to manage settings

## 📂 Project Structure

```
taqwim/
├── services/
│   └── NotificationService.js      # Core notification logic
├── constants/
│   └── duas.js                     # Islamic duas for Sehri & Iftar
├── components/
│   ├── CalenderPage.js             # UI with notification controls
│   ├── SplashScreen.js
│   └── data.json                   # Ramadan schedule
├── App.js                          # App initialization
└── android/
    └── app/src/main/
        └── AndroidManifest.xml     # Android permissions
```

## 🎯 How It Works

### Initialization Flow
1. App launches → Requests permissions
2. User grants permissions
3. Loads Ramadan data from `data.json`
4. Schedules all 240 notifications automatically
5. Notifications persist even after app closes

### Notification Management
- **Bell Icon** (🔔) in top-right corner provides:
  - Reschedule All - Refresh all notifications
  - Cancel All - Disable all notifications
  - View Scheduled - Check notification count
  - Close - Return to app

## 📖 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get started in 5 minutes
- **[BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md)** - Detailed build guide
- **[NOTIFICATION_SETUP.md](NOTIFICATION_SETUP.md)** - Complete setup instructions
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions
- **[NOTIFICATION_FLOW.md](NOTIFICATION_FLOW.md)** - Visual flow diagrams
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Technical details

## 🔧 Configuration

### Customize Notification Timing
Edit `services/NotificationService.js`:

```javascript
// Change these values to adjust timing
this.scheduleNotification(
  baseId + 1,
  '🌙 Sehri Time Approaching',
  `Only 15 minutes left for Sehri!`, // Change message
  this.createNotificationDate(day.date, day.sehri, 15) // Change minutes
);
```

### Customize Duas
Edit `constants/duas.js`:

```javascript
export const SEHRI_DUA = {
  arabic: 'وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ',
  english: 'I intend to keep the fast...',
  // Customize as needed
};
```

## 🧪 Testing

### Quick Test (10 seconds)
Add to `NotificationService.js` in `configure()`:

```javascript
setTimeout(() => {
  PushNotification.localNotification({
    channelId: 'ramadan-notifications',
    title: '🌙 Test Notification',
    message: 'Notifications are working!',
  });
}, 10000);
```

### Verify Scheduled Notifications
1. Open app
2. Tap bell icon (🔔)
3. Select "View Scheduled"
4. Should show: "You have 240 notifications scheduled"

## 📱 Device Setup

### Android 12+ Required Settings
```
Settings > Apps > Taqwim > Alarms & reminders > Allow
Settings > Apps > Taqwim > Battery > Unrestricted
```

### Xiaomi/MIUI Devices
```
Settings > Apps > Taqwim > Autostart > Enable
Settings > Battery > App battery saver > Taqwim > No restrictions
```

### Huawei Devices
```
Settings > Apps > Taqwim > Battery > App launch > Manage manually
Enable: Auto-launch, Secondary launch, Run in background
```

## 🎨 UI Features

- **Bell Icon** - Quick access to notification settings
- **Visual Indicators** - Shows notification schedule under prayer times
- **Today Badge** - Highlights current day
- **Calendar/List Views** - Toggle between viewing modes
- **Beautiful Design** - Ramadan-themed pink/purple color scheme

## 📊 Technical Specifications

- **Library**: react-native-push-notification v8.1.1
- **iOS Support**: @react-native-community/push-notification-ios v1.12.0
- **Notification Channel**: "Ramadan Prayer Times"
- **Priority**: High
- **Sound**: Default notification sound
- **Vibration**: 300ms
- **Persistence**: Yes (survives app closure and device restart)

## 🔐 Permissions Required

### Android
- `VIBRATE` - Notification vibration
- `RECEIVE_BOOT_COMPLETED` - Restore after restart
- `SCHEDULE_EXACT_ALARM` - Precise timing (Android 12+)
- `POST_NOTIFICATIONS` - Show notifications (Android 13+)

### iOS
- User Notification Permission (requested at runtime)

## 🐛 Troubleshooting

### Notifications Not Appearing?
1. Check notification permissions in device settings
2. Disable battery optimization for the app
3. Enable "Alarms & reminders" (Android 12+)
4. Check Do Not Disturb settings

### App Crashes?
```bash
cd android && ./gradlew clean && cd ..
npx react-native start --reset-cache
```

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for more solutions.

## 📝 Duas Included

### Sehri Dua
```
وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ
Wa bisawmi ghadin nawaytu min shahri ramadan
I intend to keep the fast for tomorrow in the month of Ramadan
```

### Iftar Dua
```
اللَّهُمَّ إِنِّي لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ
Allahumma inni laka sumtu wa bika aamantu wa alayka tawakkaltu wa ala rizq-ika-aftartu
O Allah! I fasted for You and I believe in You and I put my trust in You 
and I break my fast with Your sustenance
```

## 🎯 Future Enhancements (Optional)

- [ ] Custom notification sounds
- [ ] Adjustable reminder times
- [ ] Notification history
- [ ] Widget support
- [ ] Multiple language support
- [ ] Qibla direction in notifications
- [ ] Taraweeh prayer reminders

## 📄 License

This notification feature is part of the Taqwim Ramadan calendar app.

## 🤝 Contributing

Feel free to customize the notification messages, timing, or duas to suit your needs.

## 📞 Support

For issues or questions:
1. Check documentation files in the project root
2. Review [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
3. Check React Native Push Notification docs

---

**Made with ❤️ for the Muslim community**

**Ramadan Mubarak! 🌙✨**
