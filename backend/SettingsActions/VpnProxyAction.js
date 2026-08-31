import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

class VpnProxyAction {
  static vpnSettingsOpen() {
    return windowsSettingsCommands.vpn_settings_open;
  }

  static proxySettingsOpen() {
    return windowsSettingsCommands.proxy_settings_open;
  }

  static proxyEnable() {
    return windowsSettingsCommands.proxy_enable;
  }

  static proxyDisable() {
    return windowsSettingsCommands.proxy_disable;
  }

  static vpnConnect(vpnName, user, password) {
    return windowsSettingsCommands.vpn_connect
      .replace('{VPN_NAME}', vpnName)
      .replace('{USER}', user)
      .replace('{PASSWORD}', password);
  }

  static vpnDisconnect(vpnName) {
    return windowsSettingsCommands.vpn_disconnect.replace('{VPN_NAME}', vpnName);
  }
}

export default VpnProxyAction;
