import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

class AccessibilityAction {
  static magnifierOpen() {
    return windowsSettingsCommands.magnifier_open;
  }

  static narratorOpen() {
    return windowsSettingsCommands.narrator_open;
  }

  static narratorToggle() {
    return windowsSettingsCommands.narrator_toggle;
  }

  static colorFiltersSettingsOpen() {
    return windowsSettingsCommands.color_filters_settings_open;
  }

  static colorFiltersOn() {
    return windowsSettingsCommands.color_filters_on;
  }

  static colorFiltersOff() {
    return windowsSettingsCommands.color_filters_off;
  }

  static highContrastSettingsOpen() {
    return windowsSettingsCommands.high_contrast_settings_open;
  }

  static stickyKeysSettingsOpen() {
    return windowsSettingsCommands.sticky_keys_settings_open;
  }

  static narratorSettingsOpen() {
    return windowsSettingsCommands.narrator_settings_open;
  }

  static magnifierSettingsOpen() {
    return windowsSettingsCommands.magnifier_settings_open;
  }

  static closedCaptionsSettingsOpen() {
    return windowsSettingsCommands.closed_captions_settings_open;
  }

  static mousePointerSettingsOpen() {
    return windowsSettingsCommands.mouse_pointer_settings_open;
  }

  static cursorSizeSettingsOpen() {
    return windowsSettingsCommands.cursor_size_settings_open;
  }
}

export default AccessibilityAction;
