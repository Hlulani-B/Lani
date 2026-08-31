import WindowsUpdateAction from '../SettingsActions/WindowsUpdateAction.js';
import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

describe('WindowsUpdateAction', () => {
  test('windowsUpdateCheck returns correct command', () => {
    expect(WindowsUpdateAction.windowsUpdateCheck()).toBe(windowsSettingsCommands.windows_update_check);
  });

  test('windowsUpdateSettingsOpen returns correct command', () => {
    expect(WindowsUpdateAction.windowsUpdateSettingsOpen()).toBe(windowsSettingsCommands.windows_update_settings_open);
  });

  test('pauseUpdatesOpen returns correct command', () => {
    expect(WindowsUpdateAction.pauseUpdatesOpen()).toBe(windowsSettingsCommands.pause_updates_open);
  });
});
