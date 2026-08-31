import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

class PrivacyAction {
  static privacySettingsOpen() {
    return windowsSettingsCommands.privacy_settings_open;
  }

  static cameraSettingsOpen() {
    return windowsSettingsCommands.camera_settings_open;
  }

  static cameraAccessOn() {
    return windowsSettingsCommands.camera_access_on;
  }

  static cameraAccessOff() {
    return windowsSettingsCommands.camera_access_off;
  }

  static microphoneSettingsOpen() {
    return windowsSettingsCommands.microphone_settings_open;
  }

  static microphoneAccessOn() {
    return windowsSettingsCommands.microphone_access_on;
  }

  static microphoneAccessOff() {
    return windowsSettingsCommands.microphone_access_off;
  }

  static locationSettingsOpen() {
    return windowsSettingsCommands.location_settings_open;
  }

  static locationAccessOn() {
    return windowsSettingsCommands.location_access_on;
  }

  static locationAccessOff() {
    return windowsSettingsCommands.location_access_off;
  }

  static contactsSettingsOpen() {
    return windowsSettingsCommands.contacts_settings_open;
  }

  static calendarSettingsOpen() {
    return windowsSettingsCommands.calendar_settings_open;
  }

  static appDiagnosticsSettingsOpen() {
    return windowsSettingsCommands.app_diagnostics_settings_open;
  }

  static documentsAccessSettingsOpen() {
    return windowsSettingsCommands.documents_access_settings_open;
  }

  static advertisingIdOff() {
    return windowsSettingsCommands.advertising_id_off;
  }

  static advertisingIdOn() {
    return windowsSettingsCommands.advertising_id_on;
  }

  static activityHistoryOff() {
    return windowsSettingsCommands.activity_history_off;
  }

  static diagnosticDataSettingsOpen() {
    return windowsSettingsCommands.diagnostic_data_settings_open;
  }
}

export default PrivacyAction;
