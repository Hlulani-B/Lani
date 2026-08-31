import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

class WindowsUpdateAction {
  static windowsUpdateCheck() {
    return windowsSettingsCommands.windows_update_check;
  }

  static windowsUpdateSettingsOpen() {
    return windowsSettingsCommands.windows_update_settings_open;
  }

  static pauseUpdatesOpen() {
    return windowsSettingsCommands.pause_updates_open;
  }
}

export default WindowsUpdateAction;
