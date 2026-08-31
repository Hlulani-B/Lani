import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

class SoundDevicesAction {
  static soundSettingsOpen() {
    return windowsSettingsCommands.sound_settings_open;
  }

  static playbackDevicesOpen() {
    return windowsSettingsCommands.playback_devices_open;
  }

  static listAudioDevices() {
    return windowsSettingsCommands.list_audio_devices;
  }

  static soundSchemeNone() {
    return windowsSettingsCommands.sound_scheme_none;
  }
}

export default SoundDevicesAction;
