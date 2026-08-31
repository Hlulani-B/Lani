import BrightnessAction from '../SettingsActions/BrightnessAction.js';
import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

describe('BrightnessAction', () => {
  test('brightnessSet replaces LEVEL placeholder', () => {
    expect(BrightnessAction.brightnessSet(75)).toBe(
      windowsSettingsCommands.brightness_set.replace('{LEVEL}', '75')
    );
  });

  test('brightnessSet with zero', () => {
    expect(BrightnessAction.brightnessSet(0)).toContain('WmiSetBrightness(1,0)');
  });

  test('brightnessSet with max value', () => {
    expect(BrightnessAction.brightnessSet(100)).toContain('WmiSetBrightness(1,100)');
  });

  test('brightnessUp returns correct command', () => {
    expect(BrightnessAction.brightnessUp()).toBe(windowsSettingsCommands.brightness_up);
  });

  test('brightnessDown returns correct command', () => {
    expect(BrightnessAction.brightnessDown()).toBe(windowsSettingsCommands.brightness_down);
  });
});
