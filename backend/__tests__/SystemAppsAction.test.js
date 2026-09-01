import SystemAppsAction from '../functions/SettingsActions/SystemAppsAction.js';
import { windowsSettingsCommands } from '../functions/WindowSettingsCommands.js';

describe('SystemAppsAction', () => {
  const simpleMethods = [
    ['taskManagerOpen', 'task_manager_open'],
    ['controlPanelOpen', 'control_panel_open'],
    ['deviceManagerOpen', 'device_manager_open'],
    ['diskManagementOpen', 'disk_management_open'],
    ['servicesOpen', 'services_open'],
    ['eventViewerOpen', 'event_viewer_open'],
    ['registryEditorOpen', 'registry_editor_open'],
    ['fileExplorerOpen', 'file_explorer_open'],
    ['restartExplorer', 'restart_explorer'],
    ['recycleBinEmpty', 'recycle_bin_empty'],
    ['recycleBinOpen', 'recycle_bin_open'],
  ];

  test.each(simpleMethods)('%s returns correct command', (method, key) => {
    expect(SystemAppsAction[method]()).toBe(windowsSettingsCommands[key]);
  });

  test('taskManagerOpen launches taskmgr', () => {
    expect(SystemAppsAction.taskManagerOpen()).toContain('taskmgr');
  });

  test('recycleBinEmpty uses Clear-RecycleBin', () => {
    expect(SystemAppsAction.recycleBinEmpty()).toContain('Clear-RecycleBin');
  });
});
