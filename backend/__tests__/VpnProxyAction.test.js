import VpnProxyAction from '../SettingsActions/VpnProxyAction.js';
import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

describe('VpnProxyAction', () => {
  test('vpnSettingsOpen returns correct command', () => {
    expect(VpnProxyAction.vpnSettingsOpen()).toBe(windowsSettingsCommands.vpn_settings_open);
  });

  test('proxySettingsOpen returns correct command', () => {
    expect(VpnProxyAction.proxySettingsOpen()).toBe(windowsSettingsCommands.proxy_settings_open);
  });

  test('proxyEnable returns correct command', () => {
    expect(VpnProxyAction.proxyEnable()).toBe(windowsSettingsCommands.proxy_enable);
  });

  test('proxyDisable returns correct command', () => {
    expect(VpnProxyAction.proxyDisable()).toBe(windowsSettingsCommands.proxy_disable);
  });

  test('vpnConnect replaces all placeholders', () => {
    expect(VpnProxyAction.vpnConnect('MyVPN', 'user1', 'pass123')).toBe(
      windowsSettingsCommands.vpn_connect
        .replace('{VPN_NAME}', 'MyVPN')
        .replace('{USER}', 'user1')
        .replace('{PASSWORD}', 'pass123')
    );
  });

  test('vpnConnect contains rasdial', () => {
    expect(VpnProxyAction.vpnConnect('VPN', 'u', 'p')).toContain('rasdial');
  });

  test('vpnDisconnect replaces VPN_NAME placeholder', () => {
    expect(VpnProxyAction.vpnDisconnect('MyVPN')).toBe(
      windowsSettingsCommands.vpn_disconnect.replace('{VPN_NAME}', 'MyVPN')
    );
  });

  test('vpnDisconnect contains /disconnect flag', () => {
    expect(VpnProxyAction.vpnDisconnect('TestVPN')).toContain('/disconnect');
  });

  test('proxyEnable sets ProxyEnable to 1', () => {
    expect(VpnProxyAction.proxyEnable()).toContain('Value 1');
  });

  test('proxyDisable sets ProxyEnable to 0', () => {
    expect(VpnProxyAction.proxyDisable()).toContain('Value 0');
  });
});
