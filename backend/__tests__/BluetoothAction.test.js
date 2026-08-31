import BluetoothAction from '../SettingsActions/BluetoothAction.js';
import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

describe('BluetoothAction', () => {
  test('bluetoothOn returns correct command', () => {
    expect(BluetoothAction.bluetoothOn()).toBe(windowsSettingsCommands.bluetooth_on);
  });

  test('bluetoothOff returns correct command', () => {
    expect(BluetoothAction.bluetoothOff()).toBe(windowsSettingsCommands.bluetooth_off);
  });

  test('bluetoothSettingsOpen returns correct command', () => {
    expect(BluetoothAction.bluetoothSettingsOpen()).toBe(windowsSettingsCommands.bluetooth_settings_open);
  });
});
