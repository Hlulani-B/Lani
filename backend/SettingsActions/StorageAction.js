import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

class StorageAction {
  static storageSettingsOpen() {
    return windowsSettingsCommands.storage_settings_open;
  }

  static storageSenseOn() {
    return windowsSettingsCommands.storage_sense_on;
  }

  static storageSenseOff() {
    return windowsSettingsCommands.storage_sense_off;
  }

  static diskCleanupOpen() {
    return windowsSettingsCommands.disk_cleanup_open;
  }

  static diskSpaceReport() {
    return windowsSettingsCommands.disk_space_report;
  }
}

export default StorageAction;
