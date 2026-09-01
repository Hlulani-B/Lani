import PowerUserAction from '../functions/SettingsActions/PowerUserAction.js';
import { windowsSettingsCommands } from '../functions/WindowSettingsCommands.js';

describe('PowerUserAction', () => {
  const simpleMethods = [
    ['godModeFolderCreate', 'god_mode_folder_create'],
    ['showHiddenFiles', 'show_hidden_files'],
    ['hideHiddenFiles', 'hide_hidden_files'],
    ['showFileExtensions', 'show_file_extensions'],
    ['hideFileExtensions', 'hide_file_extensions'],
    ['windowsFeaturesOpen', 'windows_features_open'],
    ['windowsFeaturesList', 'windows_features_list'],
    ['wslEnable', 'wsl_enable'],
    ['hyperVEnable', 'hyperv_enable'],
    ['developerModeOn', 'developer_mode_on'],
    ['developerModeOff', 'developer_mode_off'],
    ['longPathSupportEnable', 'long_path_support_enable'],
    ['remoteDesktopOn', 'remote_desktop_on'],
    ['remoteDesktopOff', 'remote_desktop_off'],
    ['uacLevelNeverNotify', 'uac_level_never_notify'],
    ['uacLevelDefault', 'uac_level_default'],
    ['hostsFileOpen', 'hosts_file_open'],
    ['envVariablesOpen', 'env_variables_open'],
    ['startupAppsList', 'startup_apps_list'],
    ['startupAppsSettingsOpen', 'startup_apps_settings_open'],
    ['scheduledTasksList', 'scheduled_tasks_list'],
    ['scheduledTasksOpen', 'scheduled_tasks_open'],
    ['activationStatus', 'activation_status'],
    ['productKeyShow', 'product_key_show'],
    ['windowsVersionShow', 'windows_version_show'],
    ['windowsBuildShow', 'windows_build_show'],
    ['numlockOnStartup', 'numlock_on_startup'],
    ['telemetryLevelMinimum', 'telemetry_level_minimum'],
    ['cortanaDisable', 'cortana_disable'],
    ['searchIndexingRebuild', 'search_indexing_rebuild'],
    ['printSpoolerRestart', 'print_spooler_restart'],
    ['defaultAppsSettingsOpen', 'default_apps_settings_open'],
    ['resetDefaultApps', 'reset_default_apps'],
  ];

  test.each(simpleMethods)('%s returns correct command', (method, key) => {
    expect(PowerUserAction[method]()).toBe(windowsSettingsCommands[key]);
  });

  test('windowsFeaturesEnable replaces FEATURE placeholder', () => {
    expect(PowerUserAction.windowsFeaturesEnable('NetFx3')).toBe(
      windowsSettingsCommands.windows_features_enable.replace('{FEATURE}', 'NetFx3')
    );
  });

  test('windowsFeaturesDisable replaces FEATURE placeholder', () => {
    expect(PowerUserAction.windowsFeaturesDisable('NetFx3')).toBe(
      windowsSettingsCommands.windows_features_disable.replace('{FEATURE}', 'NetFx3')
    );
  });

  test('envVariableSetUser replaces NAME and VALUE placeholders', () => {
    expect(PowerUserAction.envVariableSetUser('MY_VAR', 'my_value')).toBe(
      windowsSettingsCommands.env_variable_set_user
        .replace('{NAME}', 'MY_VAR')
        .replace('{VALUE}', 'my_value')
    );
  });

  test('envVariableSetSystem replaces NAME and VALUE placeholders', () => {
    expect(PowerUserAction.envVariableSetSystem('SYS_VAR', 'sys_value')).toBe(
      windowsSettingsCommands.env_variable_set_system
        .replace('{NAME}', 'SYS_VAR')
        .replace('{VALUE}', 'sys_value')
    );
  });

  test('staticIpSet replaces all placeholders', () => {
    expect(PowerUserAction.staticIpSet('Ethernet', '192.168.1.10', '24', '192.168.1.1')).toBe(
      windowsSettingsCommands.static_ip_set
        .replace('{ADAPTER}', 'Ethernet')
        .replace('{IP}', '192.168.1.10')
        .replace('{PREFIX}', '24')
        .replace('{GATEWAY}', '192.168.1.1')
    );
  });

  test('dnsSet replaces all placeholders', () => {
    expect(PowerUserAction.dnsSet('Ethernet', '8.8.8.8', '8.8.4.4')).toBe(
      windowsSettingsCommands.dns_set
        .replace('{ADAPTER}', 'Ethernet')
        .replace('{DNS1}', '8.8.8.8')
        .replace('{DNS2}', '8.8.4.4')
    );
  });

  test('dnsResetDhcp replaces ADAPTER placeholder', () => {
    expect(PowerUserAction.dnsResetDhcp('Wi-Fi')).toBe(
      windowsSettingsCommands.dns_reset_dhcp.replace('{ADAPTER}', 'Wi-Fi')
    );
  });

  test('showHiddenFiles sets Hidden to 1', () => {
    expect(PowerUserAction.showHiddenFiles()).toContain('Value 1');
  });

  test('hideHiddenFiles sets Hidden to 2', () => {
    expect(PowerUserAction.hideHiddenFiles()).toContain('Value 2');
  });

  test('showFileExtensions sets HideFileExt to 0', () => {
    expect(PowerUserAction.showFileExtensions()).toContain('Value 0');
  });

  test('hideFileExtensions sets HideFileExt to 1', () => {
    expect(PowerUserAction.hideFileExtensions()).toContain('Value 1');
  });

  test('remoteDesktopOn disables deny connections', () => {
    expect(PowerUserAction.remoteDesktopOn()).toContain('fDenyTSConnections -Value 0');
  });

  test('uacLevelNeverNotify sets ConsentPromptBehaviorAdmin to 0', () => {
    expect(PowerUserAction.uacLevelNeverNotify()).toContain('Value 0');
  });

  test('uacLevelDefault sets ConsentPromptBehaviorAdmin to 5', () => {
    expect(PowerUserAction.uacLevelDefault()).toContain('Value 5');
  });
});
