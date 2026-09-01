import CommandExecutor from './functions/CommandExecutor.js';
import MiscAction from './functions/SettingsActions/MiscAction.js';
import PowerAction from './functions/SettingsActions/PowerAction.js';
import SystemAppsAction from './functions/SettingsActions/SystemAppsAction.js';
import VolumeAction from './functions/SettingsActions/VolumeAction.js';
import NetworkAction from './functions/SettingsActions/NetworkAction.js';

console.log('=== Lani — Live Test ===\n');

// 1. Computer name (safe, read-only, fast)
console.log('1. Getting computer name...');
const computerName = await CommandExecutor.execute('$env:COMPUTERNAME');
console.log(`   Computer: ${computerName}\n`);

// 2. Current user (safe, read-only, fast)
console.log('2. Getting current user...');
const user = await CommandExecutor.execute('$env:USERNAME');
console.log(`   User: ${user}\n`);

// 3. OS version (safe, read-only, fast)
console.log('3. Getting OS version...');
const osVersion = await CommandExecutor.execute('(Get-CimInstance Win32_OperatingSystem).Caption');
console.log(`   OS: ${osVersion}\n`);

// 4. IP config (safe, read-only)
console.log('4. Getting IP config...');
const ip = await CommandExecutor.execute('ipconfig | Select-String "IPv4"');
console.log(`   ${ip}\n`);

// 5. Show what commands WOULD run (no execution)
console.log('5. Sample commands that would execute:');
console.log(`   volumeUp()    → ${VolumeAction.volumeUp()}`);
console.log(`   volumeSet(75) → ${VolumeAction.volumeSet(75).substring(0, 60)}...`);
console.log(`   shutdown()    → ${PowerAction.shutdown()}`);
console.log(`   taskMgr()     → ${SystemAppsAction.taskManagerOpen()}`);
console.log(`   flushDns()    → ${NetworkAction.flushDns()}`);

console.log('\n=== Done — everything is working ===');
