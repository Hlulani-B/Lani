import NetworkAction from '../functions/SettingsActions/NetworkAction.js';
import { windowsSettingsCommands } from '../functions/WindowSettingsCommands.js';

describe('NetworkAction', () => {
  test('firewallOn returns correct command', () => {
    expect(NetworkAction.firewallOn()).toBe(windowsSettingsCommands.firewall_on);
  });

  test('firewallOff returns correct command', () => {
    expect(NetworkAction.firewallOff()).toBe(windowsSettingsCommands.firewall_off);
  });

  test('networkSettingsOpen returns correct command', () => {
    expect(NetworkAction.networkSettingsOpen()).toBe(windowsSettingsCommands.network_settings_open);
  });

  test('ipConfigShow returns correct command', () => {
    expect(NetworkAction.ipConfigShow()).toBe(windowsSettingsCommands.ip_config_show);
  });

  test('flushDns returns correct command', () => {
    expect(NetworkAction.flushDns()).toBe(windowsSettingsCommands.flush_dns);
  });

  test('networkReset returns correct command', () => {
    expect(NetworkAction.networkReset()).toBe(windowsSettingsCommands.network_reset);
  });

  test('firewallOn enables all profiles', () => {
    expect(NetworkAction.firewallOn()).toContain('Domain,Public,Private');
  });
});
