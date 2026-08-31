import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

class ClipboardAction {
  static clipboardHistoryOn() {
    return windowsSettingsCommands.clipboard_history_on;
  }

  static clipboardHistoryOff() {
    return windowsSettingsCommands.clipboard_history_off;
  }

  static clipboardHistoryOpen() {
    return windowsSettingsCommands.clipboard_history_open;
  }

  static clipboardGet() {
    return windowsSettingsCommands.clipboard_get;
  }

  static clipboardSet(text) {
    return windowsSettingsCommands.clipboard_set.replace('{TEXT}', text);
  }
}

export default ClipboardAction;
