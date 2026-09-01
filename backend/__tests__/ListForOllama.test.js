import listForOllama from '../functions/ListForOllama.js';

describe('ListForOllama', () => {
  test('exports a non-empty string', () => {
    expect(typeof listForOllama).toBe('string');
    expect(listForOllama.length).toBeGreaterThan(0);
  });

  test('contains all action class names', () => {
    const expectedClasses = [
      'VolumeAction',
      'BrightnessAction',
      'WifiAction',
      'BluetoothAction',
      'ThemeAction',
      'PowerAction',
      'DisplayAction',
      'ClipboardAction',
      'ScreenshotAction',
      'SystemAppsAction',
      'MouseKeyboardAction',
      'AccessibilityAction',
      'NetworkAction',
      'WindowsUpdateAction',
      'SettingsPagesAction',
      'PrivacyAction',
      'NotificationsAction',
      'RegionInputAction',
      'StorageAction',
      'SoundDevicesAction',
      'VpnProxyAction',
      'UserAccountsAction',
      'DefenderAction',
      'TaskbarAction',
      'PowerUserAction',
      'MiscAction',
    ];

    for (const cls of expectedClasses) {
      expect(listForOllama).toContain(cls);
    }
  });

  test('contains parameterised function signatures', () => {
    expect(listForOllama).toContain('volumeSet(level)');
    expect(listForOllama).toContain('brightnessSet(level)');
    expect(listForOllama).toContain('wallpaperSet(path)');
    expect(listForOllama).toContain('wifiShowPassword(ssid)');
    expect(listForOllama).toContain('vpnConnect(vpnName, user, password)');
    expect(listForOllama).toContain('addLocalUser(username, password)');
    expect(listForOllama).toContain('staticIpSet(adapter, ip, prefix, gateway)');
    expect(listForOllama).toContain('dnsSet(adapter, dns1, dns2)');
    expect(listForOllama).toContain('envVariableSetUser(name, value)');
    expect(listForOllama).toContain('setTimezone(timezone)');
    expect(listForOllama).toContain('clipboardSet(text)');
  });

  test('contains category headers', () => {
    const categories = [
      'VOLUME',
      'BRIGHTNESS',
      'WIFI',
      'BLUETOOTH',
      'THEME',
      'POWER',
      'DISPLAY',
      'CLIPBOARD',
      'SCREENSHOT',
      'SYSTEM APPS',
      'MOUSE / KEYBOARD',
      'ACCESSIBILITY',
      'NETWORK / FIREWALL',
      'WINDOWS UPDATE',
      'SETTINGS PAGES',
      'PRIVACY',
      'NOTIFICATIONS',
      'REGION / LANGUAGE',
      'STORAGE',
      'SOUND DEVICES',
      'VPN / PROXY',
      'USER ACCOUNTS',
      'WINDOWS DEFENDER',
      'TASKBAR',
      'POWER USER',
      'MISC',
    ];

    for (const cat of categories) {
      expect(listForOllama).toContain(cat);
    }
  });

  test('contains description arrows for every listed function', () => {
    const arrowCount = (listForOllama.match(/→/g) || []).length;
    expect(arrowCount).toBeGreaterThanOrEqual(200);
  });

  test('contains admin notes where relevant', () => {
    expect(listForOllama).toContain('needs admin');
  });
});
