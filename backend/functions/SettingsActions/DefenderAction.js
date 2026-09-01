import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

class DefenderAction {
  static defenderSettingsOpen() {
    return windowsSettingsCommands.defender_settings_open;
  }

  static defenderRealTimeProtectionOn() {
    return windowsSettingsCommands.defender_real_time_protection_on;
  }

  static defenderRealTimeProtectionOff() {
    return windowsSettingsCommands.defender_real_time_protection_off;
  }

  static defenderQuickScan() {
    return windowsSettingsCommands.defender_quick_scan;
  }

  static defenderFullScan() {
    return windowsSettingsCommands.defender_full_scan;
  }

  static defenderUpdateSignatures() {
    return windowsSettingsCommands.defender_update_signatures;
  }

  static defenderStatus() {
    return windowsSettingsCommands.defender_status;
  }
}

export default DefenderAction;
