import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

class VolumeAction {
  static volumeUp() {
    return windowsSettingsCommands.volume_up;
  }

  static volumeDown() {
    return windowsSettingsCommands.volume_down;
  }

  static volumeMute() {
    return windowsSettingsCommands.volume_mute;
  }

  static volumeSet(level) {
    return windowsSettingsCommands.volume_set.replace('{LEVEL}', level);
  }

  static volumeMixerOpen() {
    return windowsSettingsCommands.volume_mixer_open;
  }
}

export default VolumeAction;
