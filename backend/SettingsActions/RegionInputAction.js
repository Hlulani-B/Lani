import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

class RegionInputAction {
  static regionSettingsOpen() {
    return windowsSettingsCommands.region_settings_open;
  }

  static languageSettingsOpen() {
    return windowsSettingsCommands.language_settings_open;
  }

  static dateTimeSettingsOpen() {
    return windowsSettingsCommands.date_time_settings_open;
  }

  static setTimezone(timezone) {
    return windowsSettingsCommands.set_timezone.replace('{TIMEZONE}', timezone);
  }

  static syncTimeNow() {
    return windowsSettingsCommands.sync_time_now;
  }

  static switchInputLanguage() {
    return windowsSettingsCommands.switch_input_language;
  }

  static regionFormatSettingsOpen() {
    return windowsSettingsCommands.region_format_settings_open;
  }
}

export default RegionInputAction;
