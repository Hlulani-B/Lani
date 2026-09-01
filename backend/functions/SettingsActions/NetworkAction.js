import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

class NetworkAction {
  static firewallOn() {
    return windowsSettingsCommands.firewall_on;
  }

  static firewallOff() {
    return windowsSettingsCommands.firewall_off;
  }

  static networkSettingsOpen() {
    return windowsSettingsCommands.network_settings_open;
  }

  static ipConfigShow() {
    return windowsSettingsCommands.ip_config_show;
  }

  static flushDns() {
    return windowsSettingsCommands.flush_dns;
  }

  static networkReset() {
    return windowsSettingsCommands.network_reset;
  }
}

export default NetworkAction;
