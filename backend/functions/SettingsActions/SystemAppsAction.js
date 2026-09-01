import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

class SystemAppsAction {
  static taskManagerOpen() {
    return windowsSettingsCommands.task_manager_open;
  }

  static controlPanelOpen() {
    return windowsSettingsCommands.control_panel_open;
  }

  static deviceManagerOpen() {
    return windowsSettingsCommands.device_manager_open;
  }

  static diskManagementOpen() {
    return windowsSettingsCommands.disk_management_open;
  }

  static servicesOpen() {
    return windowsSettingsCommands.services_open;
  }

  static eventViewerOpen() {
    return windowsSettingsCommands.event_viewer_open;
  }

  static registryEditorOpen() {
    return windowsSettingsCommands.registry_editor_open;
  }

  static fileExplorerOpen() {
    return windowsSettingsCommands.file_explorer_open;
  }

  static restartExplorer() {
    return windowsSettingsCommands.restart_explorer;
  }

  static recycleBinEmpty() {
    return windowsSettingsCommands.recycle_bin_empty;
  }

  static recycleBinOpen() {
    return windowsSettingsCommands.recycle_bin_open;
  }
}

export default SystemAppsAction;
