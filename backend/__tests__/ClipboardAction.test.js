import ClipboardAction from '../SettingsActions/ClipboardAction.js';
import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

describe('ClipboardAction', () => {
  test('clipboardHistoryOn returns correct command', () => {
    expect(ClipboardAction.clipboardHistoryOn()).toBe(windowsSettingsCommands.clipboard_history_on);
  });

  test('clipboardHistoryOff returns correct command', () => {
    expect(ClipboardAction.clipboardHistoryOff()).toBe(windowsSettingsCommands.clipboard_history_off);
  });

  test('clipboardHistoryOpen returns correct command', () => {
    expect(ClipboardAction.clipboardHistoryOpen()).toBe(windowsSettingsCommands.clipboard_history_open);
  });

  test('clipboardGet returns correct command', () => {
    expect(ClipboardAction.clipboardGet()).toBe(windowsSettingsCommands.clipboard_get);
  });

  test('clipboardSet replaces TEXT placeholder', () => {
    expect(ClipboardAction.clipboardSet('hello world')).toBe(
      windowsSettingsCommands.clipboard_set.replace('{TEXT}', 'hello world')
    );
  });

  test('clipboardSet contains Set-Clipboard', () => {
    expect(ClipboardAction.clipboardSet('test')).toContain('Set-Clipboard');
  });
});
