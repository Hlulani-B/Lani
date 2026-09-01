import PrivacyAction from '../functions/SettingsActions/PrivacyAction.js';
import { windowsSettingsCommands } from '../functions/WindowSettingsCommands.js';

describe('PrivacyAction', () => {
  const simpleMethods = [
    ['privacySettingsOpen', 'privacy_settings_open'],
    ['cameraSettingsOpen', 'camera_settings_open'],
    ['cameraAccessOn', 'camera_access_on'],
    ['cameraAccessOff', 'camera_access_off'],
    ['microphoneSettingsOpen', 'microphone_settings_open'],
    ['microphoneAccessOn', 'microphone_access_on'],
    ['microphoneAccessOff', 'microphone_access_off'],
    ['locationSettingsOpen', 'location_settings_open'],
    ['locationAccessOn', 'location_access_on'],
    ['locationAccessOff', 'location_access_off'],
    ['contactsSettingsOpen', 'contacts_settings_open'],
    ['calendarSettingsOpen', 'calendar_settings_open'],
    ['appDiagnosticsSettingsOpen', 'app_diagnostics_settings_open'],
    ['documentsAccessSettingsOpen', 'documents_access_settings_open'],
    ['advertisingIdOff', 'advertising_id_off'],
    ['advertisingIdOn', 'advertising_id_on'],
    ['activityHistoryOff', 'activity_history_off'],
    ['diagnosticDataSettingsOpen', 'diagnostic_data_settings_open'],
  ];

  test.each(simpleMethods)('%s returns correct command', (method, key) => {
    expect(PrivacyAction[method]()).toBe(windowsSettingsCommands[key]);
  });

  test('cameraAccessOn sets value to Allow', () => {
    expect(PrivacyAction.cameraAccessOn()).toContain('"Allow"');
  });

  test('cameraAccessOff sets value to Deny', () => {
    expect(PrivacyAction.cameraAccessOff()).toContain('"Deny"');
  });

  test('advertisingIdOn sets Enabled to 1', () => {
    expect(PrivacyAction.advertisingIdOn()).toContain('Value 1');
  });

  test('advertisingIdOff sets Enabled to 0', () => {
    expect(PrivacyAction.advertisingIdOff()).toContain('Value 0');
  });
});
