import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

class PowerUserAction {
  static godModeFolderCreate() {
    return windowsSettingsCommands.god_mode_folder_create;
  }

  static showHiddenFiles() {
    return windowsSettingsCommands.show_hidden_files;
  }

  static hideHiddenFiles() {
    return windowsSettingsCommands.hide_hidden_files;
  }

  static showFileExtensions() {
    return windowsSettingsCommands.show_file_extensions;
  }

  static hideFileExtensions() {
    return windowsSettingsCommands.hide_file_extensions;
  }

  static windowsFeaturesOpen() {
    return windowsSettingsCommands.windows_features_open;
  }

  static windowsFeaturesList() {
    return windowsSettingsCommands.windows_features_list;
  }

  static windowsFeaturesEnable(feature) {
    return windowsSettingsCommands.windows_features_enable.replace('{FEATURE}', feature);
  }

  static windowsFeaturesDisable(feature) {
    return windowsSettingsCommands.windows_features_disable.replace('{FEATURE}', feature);
  }

  static wslEnable() {
    return windowsSettingsCommands.wsl_enable;
  }

  static hyperVEnable() {
    return windowsSettingsCommands.hyperv_enable;
  }

  static developerModeOn() {
    return windowsSettingsCommands.developer_mode_on;
  }

  static developerModeOff() {
    return windowsSettingsCommands.developer_mode_off;
  }

  static longPathSupportEnable() {
    return windowsSettingsCommands.long_path_support_enable;
  }

  static remoteDesktopOn() {
    return windowsSettingsCommands.remote_desktop_on;
  }

  static remoteDesktopOff() {
    return windowsSettingsCommands.remote_desktop_off;
  }

  static uacLevelNeverNotify() {
    return windowsSettingsCommands.uac_level_never_notify;
  }

  static uacLevelDefault() {
    return windowsSettingsCommands.uac_level_default;
  }

  static hostsFileOpen() {
    return windowsSettingsCommands.hosts_file_open;
  }

  static envVariablesOpen() {
    return windowsSettingsCommands.env_variables_open;
  }

  static envVariableSetUser(name, value) {
    return windowsSettingsCommands.env_variable_set_user
      .replace('{NAME}', name)
      .replace('{VALUE}', value);
  }

  static envVariableSetSystem(name, value) {
    return windowsSettingsCommands.env_variable_set_system
      .replace('{NAME}', name)
      .replace('{VALUE}', value);
  }

  static startupAppsList() {
    return windowsSettingsCommands.startup_apps_list;
  }

  static startupAppsSettingsOpen() {
    return windowsSettingsCommands.startup_apps_settings_open;
  }

  static scheduledTasksList() {
    return windowsSettingsCommands.scheduled_tasks_list;
  }

  static scheduledTasksOpen() {
    return windowsSettingsCommands.scheduled_tasks_open;
  }

  static activationStatus() {
    return windowsSettingsCommands.activation_status;
  }

  static productKeyShow() {
    return windowsSettingsCommands.product_key_show;
  }

  static windowsVersionShow() {
    return windowsSettingsCommands.windows_version_show;
  }

  static windowsBuildShow() {
    return windowsSettingsCommands.windows_build_show;
  }

  static numlockOnStartup() {
    return windowsSettingsCommands.numlock_on_startup;
  }

  static telemetryLevelMinimum() {
    return windowsSettingsCommands.telemetry_level_minimum;
  }

  static cortanaDisable() {
    return windowsSettingsCommands.cortana_disable;
  }

  static searchIndexingRebuild() {
    return windowsSettingsCommands.search_indexing_rebuild;
  }

  static staticIpSet(adapter, ip, prefix, gateway) {
    return windowsSettingsCommands.static_ip_set
      .replace('{ADAPTER}', adapter)
      .replace('{IP}', ip)
      .replace('{PREFIX}', prefix)
      .replace('{GATEWAY}', gateway);
  }

  static dnsSet(adapter, dns1, dns2) {
    return windowsSettingsCommands.dns_set
      .replace('{ADAPTER}', adapter)
      .replace('{DNS1}', dns1)
      .replace('{DNS2}', dns2);
  }

  static dnsResetDhcp(adapter) {
    return windowsSettingsCommands.dns_reset_dhcp.replace('{ADAPTER}', adapter);
  }

  static printSpoolerRestart() {
    return windowsSettingsCommands.print_spooler_restart;
  }

  static defaultAppsSettingsOpen() {
    return windowsSettingsCommands.default_apps_settings_open;
  }

  static resetDefaultApps() {
    return windowsSettingsCommands.reset_default_apps;
  }
}

export default PowerUserAction;
