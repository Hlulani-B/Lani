import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

class WifiAction {
  static wifiOn() {
    return windowsSettingsCommands.wifi_on;
  }

  static wifiOff() {
    return windowsSettingsCommands.wifi_off;
  }

  static wifiDisconnect() {
    return windowsSettingsCommands.wifi_disconnect;
  }

  static wifiListNetworks() {
    return windowsSettingsCommands.wifi_list_networks;
  }

  static wifiListProfiles() {
    return windowsSettingsCommands.wifi_list_profiles;
  }

  static wifiShowPassword(ssid) {
    return windowsSettingsCommands.wifi_show_password.replace('{SSID}', ssid);
  }
}

export default WifiAction;
