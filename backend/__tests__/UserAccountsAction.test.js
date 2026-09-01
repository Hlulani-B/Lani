import UserAccountsAction from '../functions/SettingsActions/UserAccountsAction.js';
import { windowsSettingsCommands } from '../functions/WindowSettingsCommands.js';

describe('UserAccountsAction', () => {
  test('accountsSettingsOpen returns correct command', () => {
    expect(UserAccountsAction.accountsSettingsOpen()).toBe(windowsSettingsCommands.accounts_settings_open);
  });

  test('listLocalUsers returns correct command', () => {
    expect(UserAccountsAction.listLocalUsers()).toBe(windowsSettingsCommands.list_local_users);
  });

  test('addLocalUser replaces USERNAME and PASSWORD placeholders', () => {
    expect(UserAccountsAction.addLocalUser('john', 'secret123')).toBe(
      windowsSettingsCommands.add_local_user
        .replace('{USERNAME}', 'john')
        .replace('{PASSWORD}', 'secret123')
    );
  });

  test('addLocalUser contains New-LocalUser', () => {
    expect(UserAccountsAction.addLocalUser('test', 'pw')).toContain('New-LocalUser');
  });

  test('removeLocalUser replaces USERNAME placeholder', () => {
    expect(UserAccountsAction.removeLocalUser('john')).toBe(
      windowsSettingsCommands.remove_local_user.replace('{USERNAME}', 'john')
    );
  });

  test('makeUserAdmin replaces USERNAME placeholder', () => {
    expect(UserAccountsAction.makeUserAdmin('john')).toBe(
      windowsSettingsCommands.make_user_admin.replace('{USERNAME}', 'john')
    );
  });

  test('makeUserAdmin adds to Administrators group', () => {
    expect(UserAccountsAction.makeUserAdmin('test')).toContain('Administrators');
  });

  test('disableUserAccount replaces USERNAME placeholder', () => {
    expect(UserAccountsAction.disableUserAccount('john')).toBe(
      windowsSettingsCommands.disable_user_account.replace('{USERNAME}', 'john')
    );
  });

  test('signInOptionsOpen returns correct command', () => {
    expect(UserAccountsAction.signInOptionsOpen()).toBe(windowsSettingsCommands.sign_in_options_open);
  });
});
