import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

class DisplayAction {
  static displaySettingsOpen() {
    return windowsSettingsCommands.display_settings_open;
  }

  static displayPcScreenOnly() {
    return windowsSettingsCommands.display_pc_screen_only;
  }

  static displayDuplicate() {
    return windowsSettingsCommands.display_duplicate;
  }

  static displayExtend() {
    return windowsSettingsCommands.display_extend;
  }

  static displaySecondScreenOnly() {
    return windowsSettingsCommands.display_second_screen_only;
  }

  static batterySaverSettingsOpen() {
    return windowsSettingsCommands.battery_saver_settings_open;
  }
}

export default DisplayAction;
