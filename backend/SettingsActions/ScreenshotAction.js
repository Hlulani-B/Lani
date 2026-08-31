import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

class ScreenshotAction {
  static screenshotFullscreen() {
    return windowsSettingsCommands.screenshot_fullscreen;
  }

  static screenshotActiveWindow() {
    return windowsSettingsCommands.screenshot_active_window;
  }

  static snippingToolOpen() {
    return windowsSettingsCommands.snipping_tool_open;
  }
}

export default ScreenshotAction;
