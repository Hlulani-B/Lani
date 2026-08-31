import ScreenshotAction from '../SettingsActions/ScreenshotAction.js';
import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

describe('ScreenshotAction', () => {
  test('screenshotFullscreen returns correct command', () => {
    expect(ScreenshotAction.screenshotFullscreen()).toBe(windowsSettingsCommands.screenshot_fullscreen);
  });

  test('screenshotActiveWindow returns correct command', () => {
    expect(ScreenshotAction.screenshotActiveWindow()).toBe(windowsSettingsCommands.screenshot_active_window);
  });

  test('snippingToolOpen returns correct command', () => {
    expect(ScreenshotAction.snippingToolOpen()).toBe(windowsSettingsCommands.snipping_tool_open);
  });
});
