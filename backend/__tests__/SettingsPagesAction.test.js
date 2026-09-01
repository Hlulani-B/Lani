import SettingsPagesAction from '../functions/SettingsActions/SettingsPagesAction.js';
import { windowsSettingsCommands } from '../functions/WindowSettingsCommands.js';

describe('SettingsPagesAction', () => {
  const simpleMethods = [
    ['settingsSystemOpen', 'settings_system_open'],
    ['settingsAppsOpen', 'settings_apps_open'],
    ['settingsAccountsOpen', 'settings_accounts_open'],
    ['settingsTimeLanguageOpen', 'settings_time_language_open'],
    ['settingsGamingOpen', 'settings_gaming_open'],
    ['settingsPrivacyOpen', 'settings_privacy_open'],
    ['settingsEaseOfAccessOpen', 'settings_ease_of_access_open'],
    ['settingsSearchOpen', 'settings_search_open'],
    ['settingsStorageOpen', 'settings_storage_open'],
    ['settingsMultitaskingOpen', 'settings_multitasking_open'],
    ['settingsTabletModeOpen', 'settings_tablet_mode_open'],
    ['settingsProjectingOpen', 'settings_projecting_open'],
    ['settingsSharedExperiencesOpen', 'settings_shared_experiences_open'],
    ['settingsFamilyOptionsOpen', 'settings_family_options_open'],
    ['settingsTroubleshootOpen', 'settings_troubleshoot_open'],
    ['settingsActivationOpen', 'settings_activation_open'],
    ['settingsBackupOpen', 'settings_backup_open'],
    ['settingsRecoveryOpen', 'settings_recovery_open'],
    ['settingsDevelopersOpen', 'settings_developers_open'],
    ['settingsAboutOpen', 'settings_about_open'],
    ['notificationsSettingsOpen', 'notifications_settings_open'],
    ['doNotDisturbSettingsOpen', 'do_not_disturb_settings_open'],
    ['focusAssistOff', 'focus_assist_off'],
  ];

  test.each(simpleMethods)('%s returns correct command', (method, key) => {
    expect(SettingsPagesAction[method]()).toBe(windowsSettingsCommands[key]);
  });

  test('settingsSystemOpen uses ms-settings: URI', () => {
    expect(SettingsPagesAction.settingsSystemOpen()).toContain('ms-settings:');
  });

  test('settingsAboutOpen navigates to about page', () => {
    expect(SettingsPagesAction.settingsAboutOpen()).toContain('ms-settings:about');
  });
});
