import StorageAction from '../SettingsActions/StorageAction.js';
import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

describe('StorageAction', () => {
  test('storageSettingsOpen returns correct command', () => {
    expect(StorageAction.storageSettingsOpen()).toBe(windowsSettingsCommands.storage_settings_open);
  });

  test('storageSenseOn returns correct command', () => {
    expect(StorageAction.storageSenseOn()).toBe(windowsSettingsCommands.storage_sense_on);
  });

  test('storageSenseOff returns correct command', () => {
    expect(StorageAction.storageSenseOff()).toBe(windowsSettingsCommands.storage_sense_off);
  });

  test('diskCleanupOpen returns correct command', () => {
    expect(StorageAction.diskCleanupOpen()).toBe(windowsSettingsCommands.disk_cleanup_open);
  });

  test('diskSpaceReport returns correct command', () => {
    expect(StorageAction.diskSpaceReport()).toBe(windowsSettingsCommands.disk_space_report);
  });

  test('storageSenseOn sets value to 1', () => {
    expect(StorageAction.storageSenseOn()).toContain('Value 1');
  });

  test('storageSenseOff sets value to 0', () => {
    expect(StorageAction.storageSenseOff()).toContain('Value 0');
  });
});
