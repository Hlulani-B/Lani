import AccessibilityAction from '../SettingsActions/AccessibilityAction.js';
import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

describe('AccessibilityAction', () => {
  const simpleMethods = [
    ['magnifierOpen', 'magnifier_open'],
    ['narratorOpen', 'narrator_open'],
    ['narratorToggle', 'narrator_toggle'],
    ['colorFiltersSettingsOpen', 'color_filters_settings_open'],
    ['colorFiltersOn', 'color_filters_on'],
    ['colorFiltersOff', 'color_filters_off'],
    ['highContrastSettingsOpen', 'high_contrast_settings_open'],
    ['stickyKeysSettingsOpen', 'sticky_keys_settings_open'],
    ['narratorSettingsOpen', 'narrator_settings_open'],
    ['magnifierSettingsOpen', 'magnifier_settings_open'],
    ['closedCaptionsSettingsOpen', 'closed_captions_settings_open'],
    ['mousePointerSettingsOpen', 'mouse_pointer_settings_open'],
    ['cursorSizeSettingsOpen', 'cursor_size_settings_open'],
  ];

  test.each(simpleMethods)('%s returns correct command', (method, key) => {
    expect(AccessibilityAction[method]()).toBe(windowsSettingsCommands[key]);
  });

  test('colorFiltersOn sets Active to 1', () => {
    expect(AccessibilityAction.colorFiltersOn()).toContain('Value 1');
  });

  test('colorFiltersOff sets Active to 0', () => {
    expect(AccessibilityAction.colorFiltersOff()).toContain('Value 0');
  });
});
