import VolumeAction from '../SettingsActions/VolumeAction.js';
import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

describe('VolumeAction', () => {
  test('volumeUp returns correct command', () => {
    expect(VolumeAction.volumeUp()).toBe(windowsSettingsCommands.volume_up);
  });

  test('volumeDown returns correct command', () => {
    expect(VolumeAction.volumeDown()).toBe(windowsSettingsCommands.volume_down);
  });

  test('volumeMute returns correct command', () => {
    expect(VolumeAction.volumeMute()).toBe(windowsSettingsCommands.volume_mute);
  });

  test('volumeSet replaces LEVEL placeholder', () => {
    expect(VolumeAction.volumeSet(50)).toBe(
      windowsSettingsCommands.volume_set.replace('{LEVEL}', '50')
    );
  });

  test('volumeSet with different levels', () => {
    expect(VolumeAction.volumeSet(0)).toContain('1..0');
    expect(VolumeAction.volumeSet(100)).toContain('1..100');
  });

  test('volumeMixerOpen returns correct command', () => {
    expect(VolumeAction.volumeMixerOpen()).toBe(windowsSettingsCommands.volume_mixer_open);
  });
});
