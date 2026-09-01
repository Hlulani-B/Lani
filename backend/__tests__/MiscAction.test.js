import MiscAction from '../functions/SettingsActions/MiscAction.js';
import { windowsSettingsCommands } from '../functions/WindowSettingsCommands.js';

describe('MiscAction', () => {
  test('screenOff returns correct command', () => {
    expect(MiscAction.screenOff()).toBe(windowsSettingsCommands.screen_off);
  });

  test('openRunDialog returns correct command', () => {
    expect(MiscAction.openRunDialog()).toBe(windowsSettingsCommands.open_run_dialog);
  });

  test('systemInfo returns correct command', () => {
    expect(MiscAction.systemInfo()).toBe(windowsSettingsCommands.system_info);
  });

  test('installedAppsList returns correct command', () => {
    expect(MiscAction.installedAppsList()).toBe(windowsSettingsCommands.installed_apps_list);
  });

  test('uptime returns correct command', () => {
    expect(MiscAction.uptime()).toBe(windowsSettingsCommands.uptime);
  });

  test('screenOff uses SendMessage', () => {
    expect(MiscAction.screenOff()).toContain('SendMessage');
  });

  test('systemInfo uses Get-ComputerInfo', () => {
    expect(MiscAction.systemInfo()).toContain('Get-ComputerInfo');
  });

  test('installedAppsList uses Win32_Product', () => {
    expect(MiscAction.installedAppsList()).toContain('Win32_Product');
  });
});
