import SoundDevicesAction from '../functions/SettingsActions/SoundDevicesAction.js';
import { windowsSettingsCommands } from '../functions/WindowSettingsCommands.js';

describe('SoundDevicesAction', () => {
  test('soundSettingsOpen returns correct command', () => {
    expect(SoundDevicesAction.soundSettingsOpen()).toBe(windowsSettingsCommands.sound_settings_open);
  });

  test('playbackDevicesOpen returns correct command', () => {
    expect(SoundDevicesAction.playbackDevicesOpen()).toBe(windowsSettingsCommands.playback_devices_open);
  });

  test('listAudioDevices returns correct command', () => {
    expect(SoundDevicesAction.listAudioDevices()).toBe(windowsSettingsCommands.list_audio_devices);
  });

  test('soundSchemeNone returns correct command', () => {
    expect(SoundDevicesAction.soundSchemeNone()).toBe(windowsSettingsCommands.sound_scheme_none);
  });

  test('playbackDevicesOpen launches mmsys.cpl', () => {
    expect(SoundDevicesAction.playbackDevicesOpen()).toContain('mmsys.cpl');
  });

  test('listAudioDevices uses Win32_SoundDevice', () => {
    expect(SoundDevicesAction.listAudioDevices()).toContain('Win32_SoundDevice');
  });
});
