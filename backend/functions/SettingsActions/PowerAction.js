import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

class PowerAction {
  static sleep() {
    return windowsSettingsCommands.sleep;
  }

  static hibernate() {
    return windowsSettingsCommands.hibernate;
  }

  static shutdown() {
    return windowsSettingsCommands.shutdown;
  }

  static restart() {
    return windowsSettingsCommands.restart;
  }

  static lock() {
    return windowsSettingsCommands.lock;
  }

  static signOut() {
    return windowsSettingsCommands.sign_out;
  }

  static cancelShutdown() {
    return windowsSettingsCommands.cancel_shutdown;
  }

  static powerPlanBalanced() {
    return windowsSettingsCommands.power_plan_balanced;
  }

  static powerPlanHighPerformance() {
    return windowsSettingsCommands.power_plan_high_performance;
  }

  static powerPlanPowerSaver() {
    return windowsSettingsCommands.power_plan_power_saver;
  }

  static powerPlanList() {
    return windowsSettingsCommands.power_plan_list;
  }

  static batteryReport() {
    return windowsSettingsCommands.battery_report;
  }

  static hibernateEnable() {
    return windowsSettingsCommands.hibernate_enable;
  }

  static hibernateDisable() {
    return windowsSettingsCommands.hibernate_disable;
  }

  static fastStartupEnable() {
    return windowsSettingsCommands.fast_startup_enable;
  }

  static fastStartupDisable() {
    return windowsSettingsCommands.fast_startup_disable;
  }
}

export default PowerAction;
