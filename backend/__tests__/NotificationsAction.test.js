import NotificationsAction from '../SettingsActions/NotificationsAction.js';
import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

describe('NotificationsAction', () => {
  test('notificationsSettingsPageOpen returns correct command', () => {
    expect(NotificationsAction.notificationsSettingsPageOpen()).toBe(
      windowsSettingsCommands.notifications_settings_page_open
    );
  });

  test('notificationSoundOff returns correct command', () => {
    expect(NotificationsAction.notificationSoundOff()).toBe(
      windowsSettingsCommands.notification_sound_off
    );
  });

  test('notificationSoundOn returns correct command', () => {
    expect(NotificationsAction.notificationSoundOn()).toBe(
      windowsSettingsCommands.notification_sound_on
    );
  });

  test('lockScreenNotificationsOff returns correct command', () => {
    expect(NotificationsAction.lockScreenNotificationsOff()).toBe(
      windowsSettingsCommands.lock_screen_notifications_off
    );
  });

  test('notificationsAllOff returns correct command', () => {
    expect(NotificationsAction.notificationsAllOff()).toBe(
      windowsSettingsCommands.notifications_all_off
    );
  });

  test('notificationsAllOn returns correct command', () => {
    expect(NotificationsAction.notificationsAllOn()).toBe(
      windowsSettingsCommands.notifications_all_on
    );
  });

  test('notificationSoundOn sets value to 1', () => {
    expect(NotificationsAction.notificationSoundOn()).toContain('Value 1');
  });

  test('notificationsAllOff sets ToastEnabled to 0', () => {
    expect(NotificationsAction.notificationsAllOff()).toContain('Value 0');
  });
});
