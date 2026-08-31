import TaskbarAction from '../SettingsActions/TaskbarAction.js';
import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

describe('TaskbarAction', () => {
  test('taskbarAlignLeft returns correct command', () => {
    expect(TaskbarAction.taskbarAlignLeft()).toBe(windowsSettingsCommands.taskbar_align_left);
  });

  test('taskbarAlignCenter returns correct command', () => {
    expect(TaskbarAction.taskbarAlignCenter()).toBe(windowsSettingsCommands.taskbar_align_center);
  });

  test('taskbarHideAuto returns correct command', () => {
    expect(TaskbarAction.taskbarHideAuto()).toBe(windowsSettingsCommands.taskbar_hide_auto);
  });

  test('taskbarSettingsOpen returns correct command', () => {
    expect(TaskbarAction.taskbarSettingsOpen()).toBe(windowsSettingsCommands.taskbar_settings_open);
  });

  test('widgetsSettingsOpen returns correct command', () => {
    expect(TaskbarAction.widgetsSettingsOpen()).toBe(windowsSettingsCommands.widgets_settings_open);
  });

  test('searchBoxSettingsOpen returns correct command', () => {
    expect(TaskbarAction.searchBoxSettingsOpen()).toBe(windowsSettingsCommands.search_box_settings_open);
  });

  test('taskbarAlignLeft sets TaskbarAl to 0', () => {
    expect(TaskbarAction.taskbarAlignLeft()).toContain('TaskbarAl -Value 0');
  });

  test('taskbarAlignCenter sets TaskbarAl to 1', () => {
    expect(TaskbarAction.taskbarAlignCenter()).toContain('TaskbarAl -Value 1');
  });
});
