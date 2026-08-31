import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

class BluetoothAction {
  static bluetoothOn() {
    return windowsSettingsCommands.bluetooth_on;
  }

  static bluetoothOff() {
    return windowsSettingsCommands.bluetooth_off;
  }

  static bluetoothSettingsOpen() {
    return windowsSettingsCommands.bluetooth_settings_open;
  }
}

export default BluetoothAction;
