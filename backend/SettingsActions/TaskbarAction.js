import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

class TaskbarAction {
  static taskbarAlignLeft() {
    return windowsSettingsCommands.taskbar_align_left;
  }

  static taskbarAlignCenter() {
    return windowsSettingsCommands.taskbar_align_center;
  }

  static taskbarHideAuto() {
    return windowsSettingsCommands.taskbar_hide_auto;
  }

  static taskbarSettingsOpen() {
    return windowsSettingsCommands.taskbar_settings_open;
  }

  static widgetsSettingsOpen() {
    return windowsSettingsCommands.widgets_settings_open;
  }

  static searchBoxSettingsOpen() {
    return windowsSettingsCommands.search_box_settings_open;
  }
}

export default TaskbarAction;
