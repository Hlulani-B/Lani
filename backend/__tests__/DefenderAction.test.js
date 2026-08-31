import DefenderAction from '../SettingsActions/DefenderAction.js';
import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

describe('DefenderAction', () => {
  test('defenderSettingsOpen returns correct command', () => {
    expect(DefenderAction.defenderSettingsOpen()).toBe(windowsSettingsCommands.defender_settings_open);
  });

  test('defenderRealTimeProtectionOn returns correct command', () => {
    expect(DefenderAction.defenderRealTimeProtectionOn()).toBe(windowsSettingsCommands.defender_real_time_protection_on);
  });

  test('defenderRealTimeProtectionOff returns correct command', () => {
    expect(DefenderAction.defenderRealTimeProtectionOff()).toBe(windowsSettingsCommands.defender_real_time_protection_off);
  });

  test('defenderQuickScan returns correct command', () => {
    expect(DefenderAction.defenderQuickScan()).toBe(windowsSettingsCommands.defender_quick_scan);
  });

  test('defenderFullScan returns correct command', () => {
    expect(DefenderAction.defenderFullScan()).toBe(windowsSettingsCommands.defender_full_scan);
  });

  test('defenderUpdateSignatures returns correct command', () => {
    expect(DefenderAction.defenderUpdateSignatures()).toBe(windowsSettingsCommands.defender_update_signatures);
  });

  test('defenderStatus returns correct command', () => {
    expect(DefenderAction.defenderStatus()).toBe(windowsSettingsCommands.defender_status);
  });

  test('defenderQuickScan uses QuickScan type', () => {
    expect(DefenderAction.defenderQuickScan()).toContain('QuickScan');
  });

  test('defenderFullScan uses FullScan type', () => {
    expect(DefenderAction.defenderFullScan()).toContain('FullScan');
  });
});
