import MouseKeyboardAction from '../functions/SettingsActions/MouseKeyboardAction.js';
import { windowsSettingsCommands } from '../functions/WindowSettingsCommands.js';

describe('MouseKeyboardAction', () => {
  test('mouseSettingsOpen returns correct command', () => {
    expect(MouseKeyboardAction.mouseSettingsOpen()).toBe(windowsSettingsCommands.mouse_settings_open);
  });

  test('swapMouseButtons returns correct command', () => {
    expect(MouseKeyboardAction.swapMouseButtons()).toBe(windowsSettingsCommands.swap_mouse_buttons);
  });

  test('restoreMouseButtons returns correct command', () => {
    expect(MouseKeyboardAction.restoreMouseButtons()).toBe(windowsSettingsCommands.restore_mouse_buttons);
  });

  test('keyboardSettingsOpen returns correct command', () => {
    expect(MouseKeyboardAction.keyboardSettingsOpen()).toBe(windowsSettingsCommands.keyboard_settings_open);
  });

  test('onScreenKeyboardOpen returns correct command', () => {
    expect(MouseKeyboardAction.onScreenKeyboardOpen()).toBe(windowsSettingsCommands.on_screen_keyboard_open);
  });

  test('swapMouseButtons uses SwapMouseButton true', () => {
    expect(MouseKeyboardAction.swapMouseButtons()).toContain('SwapMouseButton($true)');
  });

  test('restoreMouseButtons uses SwapMouseButton false', () => {
    expect(MouseKeyboardAction.restoreMouseButtons()).toContain('SwapMouseButton($false)');
  });
});
