// windowsSettingsCommands.js
// Map of action name to PowerShell command string.
// Run each command with: powershell -NoProfile -Command "<command>"
// Some actions need admin rights (marked ADMIN). Some need Windows 10/11 only.

export const windowsSettingsCommands = {

  // ---------- VOLUME ----------
  volume_up: `(New-Object -ComObject WScript.Shell).SendKeys([char]175)`,
  volume_down: `(New-Object -ComObject WScript.Shell).SendKeys([char]174)`,
  volume_mute: `(New-Object -ComObject WScript.Shell).SendKeys([char]173)`,
  volume_set: `Add-Type -TypeDefinition '[DllImport("user32.dll")]public static extern void keybd_event(byte b,byte s,int f,int i);' -Name Vol -Namespace Win32; 1..{LEVEL} | ForEach-Object { [Win32.Vol]::keybd_event(0xAF,0,0,0) }`,
  volume_mixer_open: `Start-Process sndvol`,

  // ---------- BRIGHTNESS (laptops only) ----------
  brightness_set: `(Get-WmiObject -Namespace root/WMI -Class WmiMonitorBrightnessMethods).WmiSetBrightness(1,{LEVEL})`,
  brightness_up: `$b=(Get-WmiObject -Namespace root/WMI -Class WmiMonitorBrightness).CurrentBrightness; (Get-WmiObject -Namespace root/WMI -Class WmiMonitorBrightnessMethods).WmiSetBrightness(1,[Math]::Min($b+10,100))`,
  brightness_down: `$b=(Get-WmiObject -Namespace root/WMI -Class WmiMonitorBrightness).CurrentBrightness; (Get-WmiObject -Namespace root/WMI -Class WmiMonitorBrightnessMethods).WmiSetBrightness(1,[Math]::Max($b-10,0))`,

  // ---------- WIFI ----------
  wifi_on: `Get-NetAdapter | Where-Object {$_.InterfaceDescription -like "*Wireless*" -or $_.Name -like "*Wi-Fi*"} | Enable-NetAdapter -Confirm:$false`, // ADMIN
  wifi_off: `Get-NetAdapter | Where-Object {$_.InterfaceDescription -like "*Wireless*" -or $_.Name -like "*Wi-Fi*"} | Disable-NetAdapter -Confirm:$false`, // ADMIN
  wifi_disconnect: `netsh wlan disconnect`,
  wifi_list_networks: `netsh wlan show networks mode=bssid`,
  wifi_list_profiles: `netsh wlan show profiles`,
  wifi_show_password: `netsh wlan show profile name="{SSID}" key=clear`,

  // ---------- BLUETOOTH ----------
  bluetooth_on: `Get-PnpDevice | Where-Object {$_.Class -eq "Bluetooth" -and $_.FriendlyName -like "*Radio*"} | Enable-PnpDevice -Confirm:$false`, // ADMIN
  bluetooth_off: `Get-PnpDevice | Where-Object {$_.Class -eq "Bluetooth" -and $_.FriendlyName -like "*Radio*"} | Disable-PnpDevice -Confirm:$false`, // ADMIN
  bluetooth_settings_open: `Start-Process ms-settings:bluetooth`,

  // ---------- AIRPLANE MODE ----------
  airplane_mode_settings_open: `Start-Process ms-settings:network-airplanemode`, // no reliable direct toggle, open settings page

  // ---------- THEME ----------
  dark_mode_on: `Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" -Name AppsUseLightTheme -Value 0 -Type DWord -Force; Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" -Name SystemUsesLightTheme -Value 0 -Type DWord -Force`,
  dark_mode_off: `Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" -Name AppsUseLightTheme -Value 1 -Type DWord -Force; Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" -Name SystemUsesLightTheme -Value 1 -Type DWord -Force`,
  accent_color_settings_open: `Start-Process ms-settings:personalization-colors`,
  wallpaper_set: `Add-Type -TypeDefinition '[DllImport("user32.dll",CharSet=CharSet.Auto)]public static extern int SystemParametersInfo(int u,int i,string p,int f);' -Name Wall -Namespace Win32; [Win32.Wall]::SystemParametersInfo(20,0,"{PATH}",3)`,

  // ---------- NIGHT LIGHT ----------
  night_light_settings_open: `Start-Process ms-settings:nightlight`, // no simple reliable script toggle

  // ---------- POWER ----------
  sleep: `rundll32.exe powrprof.dll,SetSuspendState 0,1,0`,
  hibernate: `shutdown /h`,
  shutdown: `shutdown /s /t 0`,
  restart: `shutdown /r /t 0`,
  lock: `rundll32.exe user32.dll,LockWorkStation`,
  sign_out: `shutdown /l`,
  cancel_shutdown: `shutdown /a`,

  power_plan_balanced: `powercfg /setactive 381b4222-f694-41f0-9685-ff5bb260df2e`,
  power_plan_high_performance: `powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c`,
  power_plan_power_saver: `powercfg /setactive a1841308-3541-4fab-bc81-f71556f20b4a`,
  power_plan_list: `powercfg /list`,
  battery_report: `powercfg /batteryreport /output "$env:USERPROFILE\\battery-report.html"`,

  hibernate_enable: `powercfg /hibernate on`, // ADMIN
  hibernate_disable: `powercfg /hibernate off`, // ADMIN
  fast_startup_enable: `Set-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" -Name HiberbootEnabled -Value 1`, // ADMIN
  fast_startup_disable: `Set-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" -Name HiberbootEnabled -Value 0`, // ADMIN

  // ---------- DISPLAY ----------
  display_settings_open: `Start-Process ms-settings:display`,
  display_pc_screen_only: `DisplaySwitch.exe /internal`,
  display_duplicate: `DisplaySwitch.exe /clone`,
  display_extend: `DisplaySwitch.exe /extend`,
  display_second_screen_only: `DisplaySwitch.exe /external`,

  // ---------- NOTIFICATIONS / FOCUS ASSIST ----------
  notifications_settings_open: `Start-Process ms-settings:notifications`,
  focus_assist_off: `Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\CloudStore\\Store\\Cache\\DefaultAccount\\*windows.data.notifications.quiethourssettings" -Name Data -Value ([byte[]](0x02,0x01,0x00,0x00)) -ErrorAction SilentlyContinue`, // unreliable across builds, best effort
  do_not_disturb_settings_open: `Start-Process ms-settings:quiethours`,

  // ---------- BATTERY SAVER ----------
  battery_saver_settings_open: `Start-Process ms-settings:batterysaver`,

  // ---------- CLIPBOARD ----------
  clipboard_history_on: `Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Clipboard" -Name EnableClipboardHistory -Value 1 -Type DWord -Force`,
  clipboard_history_off: `Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Clipboard" -Name EnableClipboardHistory -Value 0 -Type DWord -Force`,
  clipboard_history_open: `(New-Object -ComObject WScript.Shell).SendKeys("^(#v)")`,
  clipboard_get: `Get-Clipboard`,
  clipboard_set: `Set-Clipboard -Value "{TEXT}"`,

  // ---------- SCREENSHOT ----------
  screenshot_fullscreen: `(New-Object -ComObject WScript.Shell).SendKeys("{PRTSC}")`,
  screenshot_active_window: `(New-Object -ComObject WScript.Shell).SendKeys("%{PRTSC}")`,
  snipping_tool_open: `Start-Process ms-screenclip:`,

  // ---------- SYSTEM APPS ----------
  task_manager_open: `Start-Process taskmgr`,
  control_panel_open: `Start-Process control`,
  device_manager_open: `Start-Process devmgmt.msc`,
  disk_management_open: `Start-Process diskmgmt.msc`,
  services_open: `Start-Process services.msc`,
  event_viewer_open: `Start-Process eventvwr.msc`,
  registry_editor_open: `Start-Process regedit`,
  file_explorer_open: `Start-Process explorer`,
  restart_explorer: `Stop-Process -Name explorer -Force; Start-Process explorer`,
  recycle_bin_empty: `Clear-RecycleBin -Force`,
  recycle_bin_open: `Start-Process shell:RecycleBinFolder`,

  // ---------- MOUSE / KEYBOARD ----------
  mouse_settings_open: `Start-Process ms-settings:mousetouchpad`,
  swap_mouse_buttons: `Add-Type -TypeDefinition '[DllImport("user32.dll")]public static extern bool SwapMouseButton(bool s);' -Name Mouse -Namespace Win32; [Win32.Mouse]::SwapMouseButton($true)`,
  restore_mouse_buttons: `Add-Type -TypeDefinition '[DllImport("user32.dll")]public static extern bool SwapMouseButton(bool s);' -Name Mouse -Namespace Win32; [Win32.Mouse]::SwapMouseButton($false)`,
  keyboard_settings_open: `Start-Process ms-settings:easeofaccess-keyboard`,
  on_screen_keyboard_open: `Start-Process osk`,

  // ---------- ACCESSIBILITY ----------
  magnifier_open: `Start-Process magnify`,
  narrator_open: `Start-Process narrator`,
  narrator_toggle: `(New-Object -ComObject WScript.Shell).SendKeys("^{ESC}")`, // Ctrl+Win+Enter is the real shortcut, needs SendKeys workaround

  // ---------- FIREWALL / NETWORK ----------
  firewall_on: `Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True`, // ADMIN
  firewall_off: `Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False`, // ADMIN
  network_settings_open: `Start-Process ms-settings:network-status`,
  ip_config_show: `ipconfig /all`,
  flush_dns: `ipconfig /flushdns`, // ADMIN
  network_reset: `Get-NetAdapter | Restart-NetAdapter`, // ADMIN

  // ---------- WINDOWS UPDATE ----------
  windows_update_check: `Start-Process ms-settings:windowsupdate-action`,
  windows_update_settings_open: `Start-Process ms-settings:windowsupdate`,
  pause_updates_open: `Start-Process ms-settings:windowsupdate-pause`,

  // ---------- SETTINGS PAGES (ms-settings: URIs) ----------
  settings_system_open: `Start-Process ms-settings:`,
  settings_apps_open: `Start-Process ms-settings:appsfeatures`,
  settings_accounts_open: `Start-Process ms-settings:yourinfo`,
  settings_time_language_open: `Start-Process ms-settings:dateandtime`,
  settings_gaming_open: `Start-Process ms-settings:gaming-gamebar`,
  settings_privacy_open: `Start-Process ms-settings:privacy`,
  settings_ease_of_access_open: `Start-Process ms-settings:easeofaccess-display`,
  settings_search_open: `Start-Process ms-settings:cortana-windowssearch`,
  settings_storage_open: `Start-Process ms-settings:storagesense`,
  settings_multitasking_open: `Start-Process ms-settings:multitasking`,
  settings_tablet_mode_open: `Start-Process ms-settings:tabletmode`,
  settings_projecting_open: `Start-Process ms-settings:project`,
  settings_shared_experiences_open: `Start-Process ms-settings:crossdevice`,
  settings_family_options_open: `Start-Process ms-settings:family-group`,
  settings_troubleshoot_open: `Start-Process ms-settings:troubleshoot`,
  settings_activation_open: `Start-Process ms-settings:activation`,
  settings_backup_open: `Start-Process ms-settings:backup`,
  settings_recovery_open: `Start-Process ms-settings:recovery`,
  settings_developers_open: `Start-Process ms-settings:developers`,
  settings_about_open: `Start-Process ms-settings:about`,

  // ---------- MISC ----------
  screen_off: `Add-Type -TypeDefinition '[DllImport("user32.dll")]public static extern int SendMessage(int h,int m,int w,int l);' -Name Screen -Namespace Win32; [Win32.Screen]::SendMessage(-1,0x0112,0xF170,2)`,
  open_run_dialog: `(New-Object -ComObject WScript.Shell).SendKeys("^{ESC}r")`,
  system_info: `Get-ComputerInfo`,
  installed_apps_list: `Get-CimInstance Win32_Product | Select-Object Name,Version`,
  uptime: `(Get-CimInstance Win32_OperatingSystem).LastBootUpTime`,

  // ---------- PRIVACY ----------
  privacy_settings_open: `Start-Process ms-settings:privacy`,
  camera_settings_open: `Start-Process ms-settings:privacy-webcam`,
  camera_access_on: `Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\webcam" -Name Value -Value "Allow" -Force`, // ADMIN
  camera_access_off: `Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\webcam" -Name Value -Value "Deny" -Force`, // ADMIN
  microphone_settings_open: `Start-Process ms-settings:privacy-microphone`,
  microphone_access_on: `Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\microphone" -Name Value -Value "Allow" -Force`, // ADMIN
  microphone_access_off: `Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\microphone" -Name Value -Value "Deny" -Force`, // ADMIN
  location_settings_open: `Start-Process ms-settings:privacy-location`,
  location_access_on: `Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\location" -Name Value -Value "Allow" -Force`, // ADMIN
  location_access_off: `Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\location" -Name Value -Value "Deny" -Force`, // ADMIN
  contacts_settings_open: `Start-Process ms-settings:privacy-contacts`,
  calendar_settings_open: `Start-Process ms-settings:privacy-calendar`,
  app_diagnostics_settings_open: `Start-Process ms-settings:privacy-diagnosticsinfo`,
  documents_access_settings_open: `Start-Process ms-settings:privacy-documents`,
  advertising_id_off: `Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo" -Name Enabled -Value 0 -Type DWord -Force`,
  advertising_id_on: `Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo" -Name Enabled -Value 1 -Type DWord -Force`,
  activity_history_off: `Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Privacy" -Name TailoredExperiencesWithDiagnosticDataEnabled -Value 0 -Type DWord -Force`,
  diagnostic_data_settings_open: `Start-Process ms-settings:privacy-feedback`,

  // ---------- NOTIFICATIONS (per app / detail) ----------
  notifications_settings_page_open: `Start-Process ms-settings:notifications`,
  notification_sound_off: `Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Notifications\\Settings" -Name NOC_GLOBAL_SETTING_ALLOW_NOTIFICATION_SOUND -Value 0 -Type DWord -Force`,
  notification_sound_on: `Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Notifications\\Settings" -Name NOC_GLOBAL_SETTING_ALLOW_NOTIFICATION_SOUND -Value 1 -Type DWord -Force`,
  lock_screen_notifications_off: `Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Notifications\\Settings" -Name NOC_GLOBAL_SETTING_ALLOW_TOASTS_ABOVE_LOCK -Value 0 -Type DWord -Force`,
  notifications_all_off: `Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\PushNotifications" -Name ToastEnabled -Value 0 -Type DWord -Force`,
  notifications_all_on: `Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\PushNotifications" -Name ToastEnabled -Value 1 -Type DWord -Force`,

  // ---------- REGION / LANGUAGE / INPUT ----------
  region_settings_open: `Start-Process ms-settings:regionlanguage`,
  language_settings_open: `Start-Process ms-settings:regionlanguage-language`,
  date_time_settings_open: `Start-Process ms-settings:dateandtime`,
  set_timezone: `Set-TimeZone -Name "{TIMEZONE}"`, // ADMIN
  sync_time_now: `w32tm /resync`, // ADMIN
  switch_input_language: `(New-Object -ComObject WScript.Shell).SendKeys("^ ")`,
  region_format_settings_open: `Start-Process ms-settings:regionformatting`,

  // ---------- STORAGE ----------
  storage_settings_open: `Start-Process ms-settings:storagesense`,
  storage_sense_on: `Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\StorageSense\\Parameters\\StoragePolicy" -Name 01 -Value 1 -Type DWord -Force`,
  storage_sense_off: `Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\StorageSense\\Parameters\\StoragePolicy" -Name 01 -Value 0 -Type DWord -Force`,
  disk_cleanup_open: `Start-Process cleanmgr`,
  disk_space_report: `Get-PSDrive -PSProvider FileSystem | Select-Object Name,Used,Free`,

  // ---------- ACCESSIBILITY (detail) ----------
  color_filters_settings_open: `Start-Process ms-settings:easeofaccess-colorfilter`,
  color_filters_on: `Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\ColorFiltering" -Name Active -Value 1 -Type DWord -Force`,
  color_filters_off: `Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\ColorFiltering" -Name Active -Value 0 -Type DWord -Force`,
  high_contrast_settings_open: `Start-Process ms-settings:easeofaccess-highcontrast`,
  sticky_keys_settings_open: `Start-Process ms-settings:easeofaccess-keyboard`,
  narrator_settings_open: `Start-Process ms-settings:easeofaccess-narrator`,
  magnifier_settings_open: `Start-Process ms-settings:easeofaccess-magnifier`,
  closed_captions_settings_open: `Start-Process ms-settings:easeofaccess-closedcaptioning`,
  mouse_pointer_settings_open: `Start-Process ms-settings:easeofaccess-mousepointer`,
  cursor_size_settings_open: `Start-Process ms-settings:easeofaccess-cursorandpointersize`,

  // ---------- SOUND DEVICES ----------
  sound_settings_open: `Start-Process ms-settings:sound`,
  playback_devices_open: `Start-Process mmsys.cpl`,
  list_audio_devices: `Get-CimInstance Win32_SoundDevice`,
  sound_scheme_none: `Set-ItemProperty -Path "HKCU:\\AppEvents\\Schemes" -Name "(Default)" -Value ".None"`,

  // ---------- VPN / PROXY ----------
  vpn_settings_open: `Start-Process ms-settings:network-vpn`,
  proxy_settings_open: `Start-Process ms-settings:network-proxy`,
  proxy_enable: `Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" -Name ProxyEnable -Value 1 -Type DWord -Force`,
  proxy_disable: `Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" -Name ProxyEnable -Value 0 -Type DWord -Force`,
  vpn_connect: `rasdial "{VPN_NAME}" {USER} {PASSWORD}`,
  vpn_disconnect: `rasdial "{VPN_NAME}" /disconnect`,

  // ---------- USER ACCOUNTS ----------
  accounts_settings_open: `Start-Process ms-settings:otherusers`,
  list_local_users: `Get-LocalUser`,
  add_local_user: `New-LocalUser -Name "{USERNAME}" -Password (ConvertTo-SecureString "{PASSWORD}" -AsPlainText -Force)`, // ADMIN
  remove_local_user: `Remove-LocalUser -Name "{USERNAME}"`, // ADMIN
  make_user_admin: `Add-LocalGroupMember -Group "Administrators" -Member "{USERNAME}"`, // ADMIN
  disable_user_account: `Disable-LocalUser -Name "{USERNAME}"`, // ADMIN
  sign_in_options_open: `Start-Process ms-settings:signinoptions`,

  // ---------- WINDOWS DEFENDER ----------
  defender_settings_open: `Start-Process windowsdefender:`,
  defender_real_time_protection_on: `Set-MpPreference -DisableRealtimeMonitoring $false`, // ADMIN
  defender_real_time_protection_off: `Set-MpPreference -DisableRealtimeMonitoring $true`, // ADMIN
  defender_quick_scan: `Start-MpScan -ScanType QuickScan`,
  defender_full_scan: `Start-MpScan -ScanType FullScan`,
  defender_update_signatures: `Update-MpSignature`,
  defender_status: `Get-MpComputerStatus`,

  // ---------- TASKBAR ----------
  taskbar_align_left: `Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name TaskbarAl -Value 0 -Type DWord -Force; Stop-Process -Name explorer -Force; Start-Process explorer`,
  taskbar_align_center: `Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name TaskbarAl -Value 1 -Type DWord -Force; Stop-Process -Name explorer -Force; Start-Process explorer`,
  taskbar_hide_auto: `Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\StuckRects3" -Name Settings -Value ([byte[]](0x30,0x00,0x00,0x00,0xfe,0xff,0xff,0xff,0x02,0x03,0x00,0x00,0x03,0x00,0x00,0x00,0x03,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x60,0x00,0x00,0x00,0x02,0x00,0x00,0x00)) -Force; Stop-Process -Name explorer -Force; Start-Process explorer`,
  taskbar_settings_open: `Start-Process ms-settings:taskbar`,
  widgets_settings_open: `Start-Process ms-settings:taskbar`,
  search_box_settings_open: `Start-Process ms-settings:cortana-windowssearch`,

  // ---------- HARD TO FIND / POWER USER ----------
  god_mode_folder_create: `New-Item -Path "$env:USERPROFILE\\Desktop\\GodMode.{ED7BA470-8E54-465E-825C-99712043E01C}" -ItemType Directory`,
  show_hidden_files: `Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name Hidden -Value 1 -Type DWord -Force; Stop-Process -Name explorer -Force; Start-Process explorer`,
  hide_hidden_files: `Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name Hidden -Value 2 -Type DWord -Force; Stop-Process -Name explorer -Force; Start-Process explorer`,
  show_file_extensions: `Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name HideFileExt -Value 0 -Type DWord -Force; Stop-Process -Name explorer -Force; Start-Process explorer`,
  hide_file_extensions: `Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name HideFileExt -Value 1 -Type DWord -Force; Stop-Process -Name explorer -Force; Start-Process explorer`,

  windows_features_open: `Start-Process optionalfeatures`,
  windows_features_list: `Get-WindowsOptionalFeature -Online`,
  windows_features_enable: `Enable-WindowsOptionalFeature -Online -FeatureName "{FEATURE}" -All`, // ADMIN
  windows_features_disable: `Disable-WindowsOptionalFeature -Online -FeatureName "{FEATURE}"`, // ADMIN

  wsl_enable: `Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux -All -NoRestart`, // ADMIN
  hyperv_enable: `Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All -NoRestart`, // ADMIN
  developer_mode_on: `Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AppModelUnlock" -Name AllowDevelopmentWithoutDevLicense -Value 1 -Type DWord -Force`, // ADMIN
  developer_mode_off: `Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AppModelUnlock" -Name AllowDevelopmentWithoutDevLicense -Value 0 -Type DWord -Force`, // ADMIN
  long_path_support_enable: `Set-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\FileSystem" -Name LongPathsEnabled -Value 1 -Type DWord -Force`, // ADMIN

  remote_desktop_on: `Set-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Terminal Server" -Name fDenyTSConnections -Value 0 -Type DWord -Force; Enable-NetFirewallRule -DisplayGroup "Remote Desktop"`, // ADMIN
  remote_desktop_off: `Set-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Terminal Server" -Name fDenyTSConnections -Value 1 -Type DWord -Force`, // ADMIN

  uac_level_never_notify: `Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" -Name ConsentPromptBehaviorAdmin -Value 0 -Type DWord -Force`, // ADMIN
  uac_level_default: `Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" -Name ConsentPromptBehaviorAdmin -Value 5 -Type DWord -Force`, // ADMIN

  hosts_file_open: `Start-Process notepad "$env:SystemRoot\\System32\\drivers\\etc\\hosts"`, // ADMIN to save
  env_variables_open: `rundll32.exe sysdm.cpl,EditEnvironmentVariables`,
  env_variable_set_user: `[Environment]::SetEnvironmentVariable("{NAME}","{VALUE}","User")`,
  env_variable_set_system: `[Environment]::SetEnvironmentVariable("{NAME}","{VALUE}","Machine")`, // ADMIN

  startup_apps_list: `Get-CimInstance Win32_StartupCommand | Select-Object Name,Command,Location`,
  startup_apps_settings_open: `Start-Process ms-settings:startupapps`,
  scheduled_tasks_list: `Get-ScheduledTask | Where-Object {$_.State -ne "Disabled"}`,
  scheduled_tasks_open: `Start-Process taskschd.msc`,

  activation_status: `slmgr /xpr`,
  product_key_show: `(Get-CimInstance -Query "select * from SoftwareLicensingService").OA3xOriginalProductKey`,
  windows_version_show: `winver`,
  windows_build_show: `Get-ComputerInfo -Property WindowsProductName,WindowsVersion,OsBuildNumber`,

  numlock_on_startup: `Set-ItemProperty -Path "HKU:\\.DEFAULT\\Control Panel\\Keyboard" -Name InitialKeyboardIndicators -Value 2147483650 -Type DWord -Force`, // ADMIN, needs HKU: drive mounted first
  telemetry_level_minimum: `Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" -Name AllowTelemetry -Value 0 -Type DWord -Force`, // ADMIN
  cortana_disable: `Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" -Name AllowCortana -Value 0 -Type DWord -Force`, // ADMIN
  search_indexing_rebuild: `Start-Process control -ArgumentList "srchadmin.dll"`,

  static_ip_set: `New-NetIPAddress -InterfaceAlias "{ADAPTER}" -IPAddress "{IP}" -PrefixLength {PREFIX} -DefaultGateway "{GATEWAY}"`, // ADMIN
  dns_set: `Set-DnsClientServerAddress -InterfaceAlias "{ADAPTER}" -ServerAddresses ("{DNS1}","{DNS2}")`, // ADMIN
  dns_reset_dhcp: `Set-DnsClientServerAddress -InterfaceAlias "{ADAPTER}" -ResetServerAddresses`, // ADMIN

  print_spooler_restart: `Restart-Service -Name Spooler -Force`, // ADMIN
  default_apps_settings_open: `Start-Process ms-settings:defaultapps`,
  reset_default_apps: `Dism /Online /Cleanup-Image /RestoreHealth`, // not exact reset, closest safe native command; true reset is UI only

};

export default windowsSettingsCommands;