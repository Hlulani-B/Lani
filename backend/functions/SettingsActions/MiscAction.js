import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

class MiscAction {
  static screenOff() {
    return windowsSettingsCommands.screen_off;
  }

  static openRunDialog() {
    return windowsSettingsCommands.open_run_dialog;
  }

  static systemInfo() {
    return windowsSettingsCommands.system_info;
  }

  static installedAppsList() {
    return windowsSettingsCommands.installed_apps_list;
  }

  static uptime() {
    return windowsSettingsCommands.uptime;
  }
}

export default MiscAction;
