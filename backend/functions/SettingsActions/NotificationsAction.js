import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

class NotificationsAction {
  static notificationsSettingsPageOpen() {
    return windowsSettingsCommands.notifications_settings_page_open;
  }

  static notificationSoundOff() {
    return windowsSettingsCommands.notification_sound_off;
  }

  static notificationSoundOn() {
    return windowsSettingsCommands.notification_sound_on;
  }

  static lockScreenNotificationsOff() {
    return windowsSettingsCommands.lock_screen_notifications_off;
  }

  static notificationsAllOff() {
    return windowsSettingsCommands.notifications_all_off;
  }

  static notificationsAllOn() {
    return windowsSettingsCommands.notifications_all_on;
  }
}

export default NotificationsAction;
