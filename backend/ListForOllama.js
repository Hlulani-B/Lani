// ListForOllama.js
// Exports a string listing every available action function for Ollama to reference
// when mapping natural language input to the correct action.

const listForOllama = `
=== LANI — AVAILABLE FUNCTIONS ===

Each function is called as: ClassName.methodName(args)
The function returns a PowerShell command string that gets executed on the OS.

--- VOLUME ---
VolumeAction.volumeUp()                    → Raise system volume by one step
VolumeAction.volumeDown()                  → Lower system volume by one step
VolumeAction.volumeMute()                  → Toggle mute on/off
VolumeAction.volumeSet(level)              → Set volume to exact level (0-100)
VolumeAction.volumeMixerOpen()             → Open the volume mixer window

--- BRIGHTNESS (laptops only) ---
BrightnessAction.brightnessSet(level)      → Set screen brightness to exact level (0-100)
BrightnessAction.brightnessUp()            → Increase brightness by 10%
BrightnessAction.brightnessDown()          → Decrease brightness by 10%

--- WIFI ---
WifiAction.wifiOn()                        → Turn on the Wi-Fi adapter
WifiAction.wifiOff()                       → Turn off the Wi-Fi adapter
WifiAction.wifiDisconnect()                → Disconnect from current Wi-Fi network
WifiAction.wifiListNetworks()              → List all visible Wi-Fi networks
WifiAction.wifiListProfiles()              → List saved Wi-Fi profiles
WifiAction.wifiShowPassword(ssid)          → Show the saved password for a Wi-Fi network

--- BLUETOOTH ---
BluetoothAction.bluetoothOn()              → Turn on Bluetooth
BluetoothAction.bluetoothOff()             → Turn off Bluetooth
BluetoothAction.bluetoothSettingsOpen()    → Open Bluetooth settings page

--- THEME / APPEARANCE ---
ThemeAction.darkModeOn()                   → Enable dark mode for apps and system
ThemeAction.darkModeOff()                  → Disable dark mode (switch to light mode)
ThemeAction.accentColorSettingsOpen()      → Open accent colour settings
ThemeAction.wallpaperSet(path)             → Set desktop wallpaper to the given file path
ThemeAction.nightLightSettingsOpen()       → Open night light settings
ThemeAction.airplaneModeSettingsOpen()     → Open airplane mode settings

--- POWER ---
PowerAction.sleep()                        → Put the computer to sleep
PowerAction.hibernate()                    → Hibernate the computer
PowerAction.shutdown()                     → Shut down the computer immediately
PowerAction.restart()                      → Restart the computer immediately
PowerAction.lock()                         → Lock the workstation
PowerAction.signOut()                      → Sign out the current user
PowerAction.cancelShutdown()               → Cancel a pending shutdown or restart
PowerAction.powerPlanBalanced()            → Switch to Balanced power plan
PowerAction.powerPlanHighPerformance()     → Switch to High Performance power plan
PowerAction.powerPlanPowerSaver()          → Switch to Power Saver plan
PowerAction.powerPlanList()                → List all available power plans
PowerAction.batteryReport()                → Generate a battery health report (HTML)
PowerAction.hibernateEnable()              → Enable hibernation (needs admin)
PowerAction.hibernateDisable()             → Disable hibernation (needs admin)
PowerAction.fastStartupEnable()            → Enable fast startup (needs admin)
PowerAction.fastStartupDisable()           → Disable fast startup (needs admin)

--- DISPLAY ---
DisplayAction.displaySettingsOpen()        → Open display settings
DisplayAction.displayPcScreenOnly()        → Show only on the primary screen
DisplayAction.displayDuplicate()           → Duplicate display to second screen
DisplayAction.displayExtend()              → Extend display to second screen
DisplayAction.displaySecondScreenOnly()    → Show only on the second screen
DisplayAction.batterySaverSettingsOpen()   → Open battery saver settings

--- CLIPBOARD ---
ClipboardAction.clipboardHistoryOn()       → Enable clipboard history
ClipboardAction.clipboardHistoryOff()      → Disable clipboard history
ClipboardAction.clipboardHistoryOpen()     → Open clipboard history panel (Win+Ctrl+V)
ClipboardAction.clipboardGet()             → Get current clipboard text content
ClipboardAction.clipboardSet(text)         → Set clipboard text to the given value

--- SCREENSHOT ---
ScreenshotAction.screenshotFullscreen()    → Take a full-screen screenshot (to clipboard)
ScreenshotAction.screenshotActiveWindow()  → Take a screenshot of the active window
ScreenshotAction.snippingToolOpen()        → Open the snipping tool / screen clip

--- SYSTEM APPS ---
SystemAppsAction.taskManagerOpen()         → Open Task Manager
SystemAppsAction.controlPanelOpen()        → Open Control Panel
SystemAppsAction.deviceManagerOpen()       → Open Device Manager
SystemAppsAction.diskManagementOpen()      → Open Disk Management
SystemAppsAction.servicesOpen()            → Open Services manager
SystemAppsAction.eventViewerOpen()         → Open Event Viewer
SystemAppsAction.registryEditorOpen()      → Open Registry Editor
SystemAppsAction.fileExplorerOpen()        → Open File Explorer
SystemAppsAction.restartExplorer()         → Restart Windows Explorer process
SystemAppsAction.recycleBinEmpty()         → Empty the Recycle Bin
SystemAppsAction.recycleBinOpen()          → Open the Recycle Bin

--- MOUSE / KEYBOARD ---
MouseKeyboardAction.mouseSettingsOpen()    → Open mouse settings
MouseKeyboardAction.swapMouseButtons()     → Swap left and right mouse buttons
MouseKeyboardAction.restoreMouseButtons()  → Restore normal mouse button layout
MouseKeyboardAction.keyboardSettingsOpen() → Open keyboard accessibility settings
MouseKeyboardAction.onScreenKeyboardOpen() → Open the on-screen keyboard

--- ACCESSIBILITY ---
AccessibilityAction.magnifierOpen()              → Open the Magnifier tool
AccessibilityAction.narratorOpen()               → Open the Narrator tool
AccessibilityAction.narratorToggle()             → Toggle Narrator on/off
AccessibilityAction.colorFiltersSettingsOpen()   → Open colour filter settings
AccessibilityAction.colorFiltersOn()             → Enable colour filters
AccessibilityAction.colorFiltersOff()            → Disable colour filters
AccessibilityAction.highContrastSettingsOpen()   → Open high contrast settings
AccessibilityAction.stickyKeysSettingsOpen()     → Open sticky keys settings
AccessibilityAction.narratorSettingsOpen()       → Open Narrator settings
AccessibilityAction.magnifierSettingsOpen()      → Open Magnifier settings
AccessibilityAction.closedCaptionsSettingsOpen() → Open closed captioning settings
AccessibilityAction.mousePointerSettingsOpen()   → Open mouse pointer settings
AccessibilityAction.cursorSizeSettingsOpen()     → Open cursor size settings

--- NETWORK / FIREWALL ---
NetworkAction.firewallOn()                 → Enable Windows Firewall on all profiles
NetworkAction.firewallOff()                → Disable Windows Firewall on all profiles
NetworkAction.networkSettingsOpen()        → Open network status settings
NetworkAction.ipConfigShow()               → Show full IP configuration
NetworkAction.flushDns()                   → Flush the DNS resolver cache
NetworkAction.networkReset()               → Reset all network adapters

--- WINDOWS UPDATE ---
WindowsUpdateAction.windowsUpdateCheck()       → Check for Windows updates
WindowsUpdateAction.windowsUpdateSettingsOpen() → Open Windows Update settings
WindowsUpdateAction.pauseUpdatesOpen()         → Open pause updates settings

--- SETTINGS PAGES ---
SettingsPagesAction.settingsSystemOpen()           → Open main Settings app
SettingsPagesAction.settingsAppsOpen()             → Open Apps & Features settings
SettingsPagesAction.settingsAccountsOpen()         → Open Your Account info settings
SettingsPagesAction.settingsTimeLanguageOpen()     → Open Date & Time settings
SettingsPagesAction.settingsGamingOpen()           → Open Gaming / Game Bar settings
SettingsPagesAction.settingsPrivacyOpen()          → Open Privacy settings
SettingsPagesAction.settingsEaseOfAccessOpen()     → Open Ease of Access settings
SettingsPagesAction.settingsSearchOpen()           → Open Search settings
SettingsPagesAction.settingsStorageOpen()          → Open Storage settings
SettingsPagesAction.settingsMultitaskingOpen()     → Open Multitasking settings
SettingsPagesAction.settingsTabletModeOpen()       → Open Tablet Mode settings
SettingsPagesAction.settingsProjectingOpen()       → Open Projecting to this PC settings
SettingsPagesAction.settingsSharedExperiencesOpen() → Open Shared Experiences settings
SettingsPagesAction.settingsFamilyOptionsOpen()    → Open Family settings
SettingsPagesAction.settingsTroubleshootOpen()     → Open Troubleshoot settings
SettingsPagesAction.settingsActivationOpen()       → Open Activation settings
SettingsPagesAction.settingsBackupOpen()           → Open Backup settings
SettingsPagesAction.settingsRecoveryOpen()         → Open Recovery settings
SettingsPagesAction.settingsDevelopersOpen()       → Open Developer settings
SettingsPagesAction.settingsAboutOpen()            → Open About / system info page
SettingsPagesAction.notificationsSettingsOpen()    → Open Notifications settings
SettingsPagesAction.doNotDisturbSettingsOpen()     → Open Do Not Disturb settings
SettingsPagesAction.focusAssistOff()               → Turn off Focus Assist

--- PRIVACY ---
PrivacyAction.privacySettingsOpen()          → Open Privacy settings
PrivacyAction.cameraSettingsOpen()           → Open camera privacy settings
PrivacyAction.cameraAccessOn()               → Allow camera access
PrivacyAction.cameraAccessOff()              → Deny camera access
PrivacyAction.microphoneSettingsOpen()       → Open microphone privacy settings
PrivacyAction.microphoneAccessOn()           → Allow microphone access
PrivacyAction.microphoneAccessOff()          → Deny microphone access
PrivacyAction.locationSettingsOpen()         → Open location privacy settings
PrivacyAction.locationAccessOn()             → Allow location access
PrivacyAction.locationAccessOff()            → Deny location access
PrivacyAction.contactsSettingsOpen()         → Open contacts privacy settings
PrivacyAction.calendarSettingsOpen()         → Open calendar privacy settings
PrivacyAction.appDiagnosticsSettingsOpen()   → Open app diagnostics settings
PrivacyAction.documentsAccessSettingsOpen()  → Open documents access settings
PrivacyAction.advertisingIdOff()             → Disable advertising ID
PrivacyAction.advertisingIdOn()              → Enable advertising ID
PrivacyAction.activityHistoryOff()           → Disable activity history tracking
PrivacyAction.diagnosticDataSettingsOpen()   → Open diagnostic data / feedback settings

--- NOTIFICATIONS ---
NotificationsAction.notificationsSettingsPageOpen()  → Open notifications settings page
NotificationsAction.notificationSoundOff()           → Disable notification sounds
NotificationsAction.notificationSoundOn()            → Enable notification sounds
NotificationsAction.lockScreenNotificationsOff()     → Hide notifications on lock screen
NotificationsAction.notificationsAllOff()            → Disable all notifications
NotificationsAction.notificationsAllOn()             → Enable all notifications

--- REGION / LANGUAGE / INPUT ---
RegionInputAction.regionSettingsOpen()       → Open Region & Language settings
RegionInputAction.languageSettingsOpen()     → Open language settings
RegionInputAction.dateTimeSettingsOpen()     → Open Date & Time settings
RegionInputAction.setTimezone(timezone)      → Set the system timezone by name
RegionInputAction.syncTimeNow()              → Force sync the system clock now
RegionInputAction.switchInputLanguage()      → Switch keyboard input language
RegionInputAction.regionFormatSettingsOpen() → Open region format settings

--- STORAGE ---
StorageAction.storageSettingsOpen()          → Open Storage settings
StorageAction.storageSenseOn()               → Enable Storage Sense (auto cleanup)
StorageAction.storageSenseOff()              → Disable Storage Sense
StorageAction.diskCleanupOpen()              → Open Disk Cleanup tool
StorageAction.diskSpaceReport()              → Show disk space usage per drive

--- SOUND DEVICES ---
SoundDevicesAction.soundSettingsOpen()       → Open Sound settings
SoundDevicesAction.playbackDevicesOpen()     → Open Playback Devices control panel
SoundDevicesAction.listAudioDevices()        → List all audio devices
SoundDevicesAction.soundSchemeNone()         → Set sound scheme to No Sounds

--- VPN / PROXY ---
VpnProxyAction.vpnSettingsOpen()             → Open VPN settings
VpnProxyAction.proxySettingsOpen()           → Open Proxy settings
VpnProxyAction.proxyEnable()                 → Enable the configured proxy
VpnProxyAction.proxyDisable()                → Disable the proxy
VpnProxyAction.vpnConnect(vpnName, user, password) → Connect to a VPN by name
VpnProxyAction.vpnDisconnect(vpnName)        → Disconnect from a VPN

--- USER ACCOUNTS ---
UserAccountsAction.accountsSettingsOpen()    → Open Accounts / other users settings
UserAccountsAction.listLocalUsers()          → List all local user accounts
UserAccountsAction.addLocalUser(username, password) → Create a new local user account
UserAccountsAction.removeLocalUser(username) → Delete a local user account
UserAccountsAction.makeUserAdmin(username)   → Grant a user administrator privileges
UserAccountsAction.disableUserAccount(username) → Disable a user account
UserAccountsAction.signInOptionsOpen()       → Open Sign-in options settings

--- WINDOWS DEFENDER ---
DefenderAction.defenderSettingsOpen()              → Open Windows Security settings
DefenderAction.defenderRealTimeProtectionOn()      → Enable real-time protection
DefenderAction.defenderRealTimeProtectionOff()     → Disable real-time protection
DefenderAction.defenderQuickScan()                 → Run a quick virus scan
DefenderAction.defenderFullScan()                  → Run a full virus scan
DefenderAction.defenderUpdateSignatures()          → Update virus signature definitions
DefenderAction.defenderStatus()                    → Show Defender health status

--- TASKBAR ---
TaskbarAction.taskbarAlignLeft()           → Align taskbar icons to the left
TaskbarAction.taskbarAlignCenter()         → Align taskbar icons to the center
TaskbarAction.taskbarHideAuto()            → Auto-hide the taskbar
TaskbarAction.taskbarSettingsOpen()        → Open Taskbar settings
TaskbarAction.widgetsSettingsOpen()        → Open Widgets settings
TaskbarAction.searchBoxSettingsOpen()      → Open Search box settings

--- POWER USER / ADVANCED ---
PowerUserAction.godModeFolderCreate()      → Create a GodMode folder on desktop
PowerUserAction.showHiddenFiles()          → Show hidden files and folders
PowerUserAction.hideHiddenFiles()          → Hide hidden files and folders
PowerUserAction.showFileExtensions()       → Show known file extensions
PowerUserAction.hideFileExtensions()       → Hide known file extensions
PowerUserAction.windowsFeaturesOpen()      → Open Windows Features dialog
PowerUserAction.windowsFeaturesList()      → List all optional Windows features
PowerUserAction.windowsFeaturesEnable(feature)  → Enable a Windows feature by name
PowerUserAction.windowsFeaturesDisable(feature) → Disable a windows feature by name
PowerUserAction.wslEnable()                → Enable Windows Subsystem for Linux
PowerUserAction.hyperVEnable()             → Enable Hyper-V
PowerUserAction.developerModeOn()          → Enable Developer Mode
PowerUserAction.developerModeOff()         → Disable Developer Mode
PowerUserAction.longPathSupportEnable()    → Enable long path support
PowerUserAction.remoteDesktopOn()          → Enable Remote Desktop
PowerUserAction.remoteDesktopOff()         → Disable Remote Desktop
PowerUserAction.uacLevelNeverNotify()      → Set UAC to never notify
PowerUserAction.uacLevelDefault()          → Set UAC to default level
PowerUserAction.hostsFileOpen()            → Open the hosts file in Notepad
PowerUserAction.envVariablesOpen()         → Open Environment Variables editor
PowerUserAction.envVariableSetUser(name, value)   → Set a user environment variable
PowerUserAction.envVariableSetSystem(name, value) → Set a system environment variable
PowerUserAction.startupAppsList()          → List startup applications
PowerUserAction.startupAppsSettingsOpen()  → Open Startup Apps settings
PowerUserAction.scheduledTasksList()       → List active scheduled tasks
PowerUserAction.scheduledTasksOpen()       → Open Task Scheduler
PowerUserAction.activationStatus()         → Show Windows activation status
PowerUserAction.productKeyShow()           → Show the Windows product key
PowerUserAction.windowsVersionShow()       → Show Windows version (winver)
PowerUserAction.windowsBuildShow()         → Show Windows build details
PowerUserAction.numlockOnStartup()         → Enable NumLock at startup
PowerUserAction.telemetryLevelMinimum()    → Set telemetry to minimum level
PowerUserAction.cortanaDisable()           → Disable Cortana
PowerUserAction.searchIndexingRebuild()    → Rebuild the search index
PowerUserAction.staticIpSet(adapter, ip, prefix, gateway) → Set a static IP address
PowerUserAction.dnsSet(adapter, dns1, dns2)               → Set DNS servers
PowerUserAction.dnsResetDhcp(adapter)      → Reset DNS to DHCP (automatic)
PowerUserAction.printSpoolerRestart()      → Restart the print spooler service
PowerUserAction.defaultAppsSettingsOpen()  → Open Default Apps settings
PowerUserAction.resetDefaultApps()         → Run image repair (closest safe reset)

--- MISC ---
MiscAction.screenOff()               → Turn off the display / monitor
MiscAction.openRunDialog()           → Open the Run dialog (Win+R)
MiscAction.systemInfo()              → Show full computer information
MiscAction.installedAppsList()       → List all installed applications
MiscAction.uptime()                  → Show the last boot time

=== END OF FUNCTION LIST ===
`;

export default listForOllama;
