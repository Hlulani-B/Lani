import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

class BrightnessAction {
  static brightnessSet(level) {
    return windowsSettingsCommands.brightness_set.replace('{LEVEL}', level);
  }

  static brightnessUp() {
    return windowsSettingsCommands.brightness_up;
  }

  static brightnessDown() {
    return windowsSettingsCommands.brightness_down;
  }
}

export default BrightnessAction;
