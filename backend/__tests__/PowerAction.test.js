import PowerAction from '../SettingsActions/PowerAction.js';
import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

describe('PowerAction', () => {
  const simpleMethods = [
    ['sleep', 'sleep'],
    ['hibernate', 'hibernate'],
    ['shutdown', 'shutdown'],
    ['restart', 'restart'],
    ['lock', 'lock'],
    ['signOut', 'sign_out'],
    ['cancelShutdown', 'cancel_shutdown'],
    ['powerPlanBalanced', 'power_plan_balanced'],
    ['powerPlanHighPerformance', 'power_plan_high_performance'],
    ['powerPlanPowerSaver', 'power_plan_power_saver'],
    ['powerPlanList', 'power_plan_list'],
    ['batteryReport', 'battery_report'],
    ['hibernateEnable', 'hibernate_enable'],
    ['hibernateDisable', 'hibernate_disable'],
    ['fastStartupEnable', 'fast_startup_enable'],
    ['fastStartupDisable', 'fast_startup_disable'],
  ];

  test.each(simpleMethods)('%s returns correct command', (method, key) => {
    expect(PowerAction[method]()).toBe(windowsSettingsCommands[key]);
  });

  test('shutdown command contains /s flag', () => {
    expect(PowerAction.shutdown()).toContain('/s');
  });

  test('restart command contains /r flag', () => {
    expect(PowerAction.restart()).toContain('/r');
  });
});
