import notifee, { TriggerType, AndroidImportance } from '@notifee/react-native';
import { SEHRI_DUA, IFTAR_DUA } from '../constants/duas';

class NotificationService {
  constructor() {
    this.createChannel();
  }

  createChannel = async () => {
    await notifee.createChannel({
      id: 'ramadan-notifications',
      name: 'Ramadan Prayer Times',
      importance: AndroidImportance.HIGH,
      sound: 'default',
      vibration: true,
    });
  };

  requestPermissions = async () => {
    await notifee.requestPermission();
  };

  parseTime = (timeString) => {
    // Handle AM/PM format (e.g., "05:49 AM")
    const timeMatch = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!timeMatch) {
      throw new Error(`Invalid time format: ${timeString}`);
    }
    
    let hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);
    const period = timeMatch[3].toUpperCase();
    
    // Convert to 24-hour format
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return { hours, minutes };
  };

  createNotificationDate = (dateString, timeString, minutesOffset = 0) => {
    // Parse the date string (YYYY-MM-DD format)
    const [year, month, day] = dateString.split('-').map(Number);
    const { hours, minutes } = this.parseTime(timeString);

    // Create date in local timezone
    const date = new Date(year, month - 1, day, hours, minutes - minutesOffset, 0, 0);

    return date;
  };

  scheduleNotification = async (id, title, message, date, data = {}) => {
    if (date > new Date()) {
      await notifee.createTriggerNotification(
        {
          id: id.toString(),
          title: title,
          body: message,
          data: data, // Pass navigation data
          android: {
            channelId: 'ramadan-notifications',
            importance: AndroidImportance.HIGH,
            sound: 'default',
            vibrationPattern: [300, 500],
            pressAction: {
              id: 'default',
            },
          },
          ios: {
            sound: 'default',
            categoryId: 'ramadan',
          },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: date.getTime(),
        }
      );
      console.log(`Scheduled notification ${id} for ${date.toLocaleString()}`);
    } else {
      console.log(`Skipped notification ${id} - date in past: ${date.toLocaleString()}`);
    }
  };

  scheduleRamadanNotifications = async (ramadanData) => {
    await this.cancelAllNotifications();

    for (const day of ramadanData) {
      const baseId = day.ramadan * 1000;

      // Sehri notifications (15, 10, 5 minutes before and at time)
      const sehriTimes = [
        { offset: 15, id: baseId + 1, message: `Hurry Up! 15 minutes left for Sehri!` },
        { offset: 10, id: baseId + 2, message: `Hurry Up! 10 minutes left for Sehri!` },
        { offset: 5, id: baseId + 3, message: `Hurry Up! 5 minutes left for Sehri!` },
        { offset: 0, id: baseId + 4, message: `Time to Fast - Day ${day.ramadan} of Ramadan` },
      ];

      for (const time of sehriTimes) {
        await this.scheduleNotification(
          time.id,
          '🌙 Sehri Time',
          time.message,
          this.createNotificationDate(day.date, day.sehri, time.offset),
          {
            screen: 'DuaDisplay',
            duaType: 'sehri',
            minutesLeft: time.offset,
            ramadanDay: day.ramadan,
          }
        );
      }

      // Iftar notifications (15, 10, 5 minutes before and at time)
      const iftarTimes = [
        { offset: 15, id: baseId + 5, message: `Get Ready! 15 minutes left for Iftar!` },
        { offset: 10, id: baseId + 6, message: `Get Ready! 10 minutes left for Iftar!` },
        { offset: 5, id: baseId + 7, message: `Get Ready! 5 minutes left for Iftar!` },
        { offset: 0, id: baseId + 8, message: `Time to Break Your Fast - Day ${day.ramadan} of Ramadan` },
      ];

      for (const time of iftarTimes) {
        await this.scheduleNotification(
          time.id,
          '🌅 Iftar Time',
          time.message,
          this.createNotificationDate(day.date, day.iftar, time.offset),
          {
            screen: 'DuaDisplay',
            duaType: 'iftar',
            minutesLeft: time.offset,
            ramadanDay: day.ramadan,
          }
        );
      }
    }

    const scheduled = await this.getScheduledNotifications();
    console.log(`Successfully scheduled ${scheduled.length} Ramadan notifications!`);
  };

  cancelAllNotifications = async () => {
    await notifee.cancelAllNotifications();
  };

  getScheduledNotifications = async () => {
    return await notifee.getTriggerNotifications();
  };

  // Set up notification press handler
  setupNotificationHandler = (navigationRef) => {
    // Handle notification press when app is in foreground or background
    notifee.onForegroundEvent(async ({ type, detail }) => {
      if (type === 1) { // EventType.PRESS
        const { data } = detail.notification;
        if (data && data.screen === 'DuaDisplay' && navigationRef?.current) {
          navigationRef.current.navigate('DuaDisplay', {
            duaType: data.duaType,
            minutesLeft: data.minutesLeft,
            ramadanDay: data.ramadanDay,
          });
        }
      }
    });

    // Handle notification press when app is opened from quit state
    notifee.getInitialNotification().then((initialNotification) => {
      if (initialNotification) {
        const { data } = initialNotification.notification;
        if (data && data.screen === 'DuaDisplay' && navigationRef?.current) {
          // Wait a bit for navigation to be ready
          setTimeout(() => {
            navigationRef.current?.navigate('DuaDisplay', {
              duaType: data.duaType,
              minutesLeft: data.minutesLeft,
              ramadanDay: data.ramadanDay,
            });
          }, 500);
        }
      }
    });
  };
}

export default new NotificationService();
