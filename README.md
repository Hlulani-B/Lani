# Lani

## Problem

Windows has hundreds of settings spread across Settings, Control Panel, Registry, and hidden menus. Two groups of people struggle with this.

The first group is people who are not computer literate. They know what they want, for example turning off notifications or connecting to wifi, but they do not know the path to get there, and clicking through nested menus is confusing and intimidating.

The second group is people who do know how to do these things but do not want to spend time navigating menus every time. Even a simple task like toggling dark mode or checking battery health means stopping what they are doing, opening Settings, and hunting through several screens.

Both groups end up either giving up, asking someone else for help, or searching online for instructions that are often outdated or wrong for their Windows version.

## Solution

Lani is a command line tool for Windows that lets a person type or speak what they want in plain language, and it carries out the action for them.

Instead of remembering menu paths, the user just says what they want, for example turn up the volume, turn on dark mode, or show me my wifi networks. Lani uses Ollama running locally to understand the request and match it to the correct action, then runs the matching PowerShell command behind the scenes.

This removes the need to know where a setting lives. For the computer illiterate user, it replaces confusing menus with plain conversation. For the experienced user, it replaces repetitive clicking with a single typed instruction.

## Progress So Far

### 1. PowerShell Command Map

Created `WindowSettingsCommands.js` — a map of 250+ Windows settings actions to their PowerShell command strings. Commands are organised into categories:

- Volume, Brightness, WiFi, Bluetooth, Theme, Power, Display
- Clipboard, Screenshot, System Apps, Mouse/Keyboard, Accessibility
- Network/Firewall, Windows Update, Settings Pages, Privacy
- Notifications, Region/Input, Storage, Sound Devices
- VPN/Proxy, User Accounts, Windows Defender, Taskbar
- Power User (hidden files, features, remote desktop, UAC, etc.)
- Misc (screen off, run dialog, system info, uptime)

Each entry is the raw PowerShell command ready to be executed with `powershell -NoProfile -Command "<command>"`.

### 2. Settings Action Classes

Created 26 class files in `SettingsActions/` — one class per file, each wrapping the related commands as static methods. Parameterised commands (like `volumeSet`, `wallpaperSet`, `vpnConnect`) accept arguments and replace the placeholders before returning the command string.

Example usage:

```js
import VolumeAction from './SettingsActions/VolumeAction.js';

const cmd = VolumeAction.volumeUp();       // returns the PowerShell command string
const cmd2 = VolumeAction.volumeSet(50);   // replaces {LEVEL} with 50
```

### 3. Command Executor

Created `CommandExecutor.js` — takes a command string from any action class and executes it on the OS via `powershell -NoProfile -Command`. Returns a Promise that resolves with the trimmed stdout.

- Input validation (rejects empty, null, or non-string commands)
- Configurable timeout (defaults to 30 seconds)
- Attaches `stderr` and `stdout` to errors for debugging
- Uses `execFile` (no shell interpolation)

Example usage:

```js
import CommandExecutor from './CommandExecutor.js';
import VolumeAction from './SettingsActions/VolumeAction.js';

await CommandExecutor.execute(VolumeAction.volumeUp());
```

### 4. Tests

Written 293 Jest tests covering:

- Every method on every action class (275 tests) — verifies correct command strings and placeholder replacement
- CommandExecutor (18 tests) — covers success paths, input validation, error handling, and action class integration

Run tests with:

```bash
cd backend
npm test
```

### What Is Next

- Connect Ollama for natural language understanding — map user input to the correct action class and method
- Build the CLI interface for typed and spoken input
- Add support for commands that require admin privileges (UAC elevation)