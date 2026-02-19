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
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
  };

  createNotificationDate = (dateString, timeString, minutesOffset = 0) => {
    const date = new Date(dateString);
    const { hours, minutes } = this.parseTime(timeString);

    date.setHours(hours);
    date.setMinutes(minutes - minutesOffset);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
  };

  scheduleNotification = async (id, title, message, date) => {
    if (date > new Date()) {
      await notifee.createTriggerNotification(
        {
          id: id.toString(),
          title: title,
          body: message,
          android: {
            channelId: 'ramadan-notifications',
            importance: AndroidImportance.HIGH,
            sound: 'default',
            vibrationPattern: [300, 500],
            pressAction: {
              id: 'default',
            },
          },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: date.getTime(),
        }
      );
    }
  };

  scheduleRamadanNotifications = async (ramadanData) => {
    await this.cancelAllNotifications();

    for (const day of ramadanData) {
      const baseId = day.ramadan * 1000;

      // Sehri notifications
      await this.scheduleNotification(
        baseId + 1,
        '🌙 Sehri Time Approaching',
        `Only 15 minutes left for Sehri! Day ${day.ramadan}`,
        this.createNotificationDate(day.date, day.sehri, 15)
      );

      await this.scheduleNotification(
        baseId + 2,
        '🌙 Sehri Time Approaching',
        `Only 10 minutes left for Sehri! Day ${day.ramadan}`,
        this.createNotificationDate(day.date, day.sehri, 10)
      );

      await this.scheduleNotification(
        baseId + 3,
        '🌙 Sehri Time Approaching',
        `Only 5 minutes left for Sehri! Day ${day.ramadan}`,
        this.createNotificationDate(day.date, day.sehri, 5)
      );

      await this.scheduleNotification(
        baseId + 4,
        '🌙 Sehri Time - Time to Fast',
        SEHRI_DUA.full,
        this.createNotificationDate(day.date, day.sehri, 0)
      );

      // Iftar notifications
      await this.scheduleNotification(
        baseId + 5,
        '🌅 Iftar Time Approaching',
        `Only 15 minutes left for Iftar! Day ${day.ramadan}`,
        this.createNotificationDate(day.date, day.iftar, 15)
      );

      await this.scheduleNotification(
        baseId + 6,
        '🌅 Iftar Time Approaching',
        `Only 10 minutes left for Iftar! Day ${day.ramadan}`,
        this.createNotificationDate(day.date, day.iftar, 10)
      );

      await this.scheduleNotification(
        baseId + 7,
        '🌅 Iftar Time Approaching',
        `Only 5 minutes left for Iftar! Day ${day.ramadan}`,
        this.createNotificationDate(day.date, day.iftar, 5)
      );

      await this.scheduleNotification(
        baseId + 8,
        '🌅 Iftar Time - Break Your Fast',
        IFTAR_DUA.full,
        this.createNotificationDate(day.date, day.iftar, 0)
      );
    }

    console.log('All Ramadan notifications scheduled successfully!');
  };

  cancelAllNotifications = async () => {
    await notifee.cancelAllNotifications();
  };

  getScheduledNotifications = async () => {
    return await notifee.getTriggerNotifications();
  };
}

export default new NotificationService();
