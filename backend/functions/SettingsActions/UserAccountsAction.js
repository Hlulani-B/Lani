import { windowsSettingsCommands } from '../WindowSettingsCommands.js';

class UserAccountsAction {
  static accountsSettingsOpen() {
    return windowsSettingsCommands.accounts_settings_open;
  }

  static listLocalUsers() {
    return windowsSettingsCommands.list_local_users;
  }

  static addLocalUser(username, password) {
    return windowsSettingsCommands.add_local_user
      .replace('{USERNAME}', username)
      .replace('{PASSWORD}', password);
  }

  static removeLocalUser(username) {
    return windowsSettingsCommands.remove_local_user.replace('{USERNAME}', username);
  }

  static makeUserAdmin(username) {
    return windowsSettingsCommands.make_user_admin.replace('{USERNAME}', username);
  }

  static disableUserAccount(username) {
    return windowsSettingsCommands.disable_user_account.replace('{USERNAME}', username);
  }

  static signInOptionsOpen() {
    return windowsSettingsCommands.sign_in_options_open;
  }
}

export default UserAccountsAction;
