import RegionInputAction from '../SettingsActions/RegionInputAction.js';
import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

describe('RegionInputAction', () => {
  test('regionSettingsOpen returns correct command', () => {
    expect(RegionInputAction.regionSettingsOpen()).toBe(windowsSettingsCommands.region_settings_open);
  });

  test('languageSettingsOpen returns correct command', () => {
    expect(RegionInputAction.languageSettingsOpen()).toBe(windowsSettingsCommands.language_settings_open);
  });

  test('dateTimeSettingsOpen returns correct command', () => {
    expect(RegionInputAction.dateTimeSettingsOpen()).toBe(windowsSettingsCommands.date_time_settings_open);
  });

  test('setTimezone replaces TIMEZONE placeholder', () => {
    expect(RegionInputAction.setTimezone('Pacific Standard Time')).toBe(
      windowsSettingsCommands.set_timezone.replace('{TIMEZONE}', 'Pacific Standard Time')
    );
  });

  test('setTimezone contains Set-TimeZone', () => {
    expect(RegionInputAction.setTimezone('UTC')).toContain('Set-TimeZone');
  });

  test('syncTimeNow returns correct command', () => {
    expect(RegionInputAction.syncTimeNow()).toBe(windowsSettingsCommands.sync_time_now);
  });

  test('switchInputLanguage returns correct command', () => {
    expect(RegionInputAction.switchInputLanguage()).toBe(windowsSettingsCommands.switch_input_language);
  });

  test('regionFormatSettingsOpen returns correct command', () => {
    expect(RegionInputAction.regionFormatSettingsOpen()).toBe(windowsSettingsCommands.region_format_settings_open);
  });
});
