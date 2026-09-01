import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

class MouseKeyboardAction {
  static mouseSettingsOpen() {
    return windowsSettingsCommands.mouse_settings_open;
  }

  static swapMouseButtons() {
    return windowsSettingsCommands.swap_mouse_buttons;
  }

  static restoreMouseButtons() {
    return windowsSettingsCommands.restore_mouse_buttons;
  }

  static keyboardSettingsOpen() {
    return windowsSettingsCommands.keyboard_settings_open;
  }

  static onScreenKeyboardOpen() {
    return windowsSettingsCommands.on_screen_keyboard_open;
  }
}

export default MouseKeyboardAction;
