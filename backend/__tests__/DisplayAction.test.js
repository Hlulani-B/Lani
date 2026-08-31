import DisplayAction from '../SettingsActions/DisplayAction.js';
import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

describe('DisplayAction', () => {
  const simpleMethods = [
    ['displaySettingsOpen', 'display_settings_open'],
    ['displayPcScreenOnly', 'display_pc_screen_only'],
    ['displayDuplicate', 'display_duplicate'],
    ['displayExtend', 'display_extend'],
    ['displaySecondScreenOnly', 'display_second_screen_only'],
    ['batterySaverSettingsOpen', 'battery_saver_settings_open'],
  ];

  test.each(simpleMethods)('%s returns correct command', (method, key) => {
    expect(DisplayAction[method]()).toBe(windowsSettingsCommands[key]);
  });

  test('displayPcScreenOnly uses /internal flag', () => {
    expect(DisplayAction.displayPcScreenOnly()).toContain('/internal');
  });

  test('displayExtend uses /extend flag', () => {
    expect(DisplayAction.displayExtend()).toContain('/extend');
  });
});
