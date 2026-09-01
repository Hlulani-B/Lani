import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

class ThemeAction {
  static darkModeOn() {
    return windowsSettingsCommands.dark_mode_on;
  }

  static darkModeOff() {
    return windowsSettingsCommands.dark_mode_off;
  }

  static accentColorSettingsOpen() {
    return windowsSettingsCommands.accent_color_settings_open;
  }

  static wallpaperSet(path) {
    return windowsSettingsCommands.wallpaper_set.replace('{PATH}', path);
  }

  static nightLightSettingsOpen() {
    return windowsSettingsCommands.night_light_settings_open;
  }

  static airplaneModeSettingsOpen() {
    return windowsSettingsCommands.airplane_mode_settings_open;
  }
}

export default ThemeAction;
