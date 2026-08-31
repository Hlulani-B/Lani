import WifiAction from '../SettingsActions/WifiAction.js';
import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

describe('WifiAction', () => {
  test('wifiOn returns correct command', () => {
    expect(WifiAction.wifiOn()).toBe(windowsSettingsCommands.wifi_on);
  });

  test('wifiOff returns correct command', () => {
    expect(WifiAction.wifiOff()).toBe(windowsSettingsCommands.wifi_off);
  });

  test('wifiDisconnect returns correct command', () => {
    expect(WifiAction.wifiDisconnect()).toBe(windowsSettingsCommands.wifi_disconnect);
  });

  test('wifiListNetworks returns correct command', () => {
    expect(WifiAction.wifiListNetworks()).toBe(windowsSettingsCommands.wifi_list_networks);
  });

  test('wifiListProfiles returns correct command', () => {
    expect(WifiAction.wifiListProfiles()).toBe(windowsSettingsCommands.wifi_list_profiles);
  });

  test('wifiShowPassword replaces SSID placeholder', () => {
    expect(WifiAction.wifiShowPassword('MyNetwork')).toBe(
      windowsSettingsCommands.wifi_show_password.replace('{SSID}', 'MyNetwork')
    );
  });

  test('wifiShowPassword contains key=clear', () => {
    expect(WifiAction.wifiShowPassword('TestWifi')).toContain('key=clear');
  });
});
