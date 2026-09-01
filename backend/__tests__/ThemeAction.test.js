import ThemeAction from '../functions/SettingsActions/ThemeAction.js';
import { windowsSettingsCommands } from '../functions/WindowSettingsCommands.js';

describe('ThemeAction', () => {
  test('darkModeOn returns correct command', () => {
    expect(ThemeAction.darkModeOn()).toBe(windowsSettingsCommands.dark_mode_on);
  });

  test('darkModeOff returns correct command', () => {
    expect(ThemeAction.darkModeOff()).toBe(windowsSettingsCommands.dark_mode_off);
  });

  test('accentColorSettingsOpen returns correct command', () => {
    expect(ThemeAction.accentColorSettingsOpen()).toBe(windowsSettingsCommands.accent_color_settings_open);
  });

  test('wallpaperSet replaces PATH placeholder', () => {
    const path = 'C:\\Users\\test\\wallpaper.jpg';
    expect(ThemeAction.wallpaperSet(path)).toBe(
      windowsSettingsCommands.wallpaper_set.replace('{PATH}', path)
    );
  });

  test('wallpaperSet contains SystemParametersInfo', () => {
    expect(ThemeAction.wallpaperSet('test.jpg')).toContain('SystemParametersInfo');
  });

  test('nightLightSettingsOpen returns correct command', () => {
    expect(ThemeAction.nightLightSettingsOpen()).toBe(windowsSettingsCommands.night_light_settings_open);
  });

  test('airplaneModeSettingsOpen returns correct command', () => {
    expect(ThemeAction.airplaneModeSettingsOpen()).toBe(windowsSettingsCommands.airplane_mode_settings_open);
  });
});
