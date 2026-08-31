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

### 4. Live Test

Created `liveTest.js` — a script that runs safe read-only PowerShell commands through `CommandExecutor` to verify the system actually works on the host OS. Confirmed execution of system info, network, and display commands on a live Windows machine.

### 5. Ollama Function Catalogue

Created `ListForOllama.js` — exports a single string containing all 200+ available functions organised by category. This string is fed to Ollama as part of the system prompt so the model knows which action class and method to call for any given user request.

### 6. Ollama Check / Install Pipeline

Three new files handle the full Ollama lifecycle:

- **`OllamaChecker.js`** — helper functions `isOllamaInstalled()` and `isModelAvailable(model)` that return booleans. Checks via CLI first (`ollama --version`), then falls back to the HTTP API at `localhost:11434`.
- **`OllamaInstaller.js`** — `installOllama(onProgress)` downloads the Windows installer and runs it silently. `pullModel(model, onProgress)` downloads a model via the Ollama API. Both accept a progress callback for live updates.
- **`index.js`** — Express server (port 3000) that ties everything together:
  - `GET /api/status` — returns current state (installed, model available, busy installing, etc.)
  - `GET /api/events` — Server-Sent Events (SSE) stream for live progress updates
  - `POST /api/install` — triggers Ollama + model installation. The installer checks if Ollama is already installed and skips installation if so. Returns progress updates via SSE.
  - `POST /api/chat` — forwards user messages to Ollama for natural language understanding

**Frontend Integration:**

The installer sends percentage updates to the frontend via SSE (Server-Sent Events). The frontend should:

1. Connect to the SSE endpoint for live progress:
```js
const eventSource = new EventSource('http://localhost:3000/api/events');
eventSource.onmessage = (event) => {
  const status = JSON.parse(event.data);
  // status.percent — current progress percentage (0-100)
  // status.message — human-readable progress message
  // status.currentStep — current step (downloading, installing, pulling, ready, error)
  updateProgressBar(status.percent);
  updateStatusText(status.message);
};
```

2. Call the install endpoint to start installation:
```js
await fetch('http://localhost:3000/api/install', { method: 'POST' });
```

The console logs progress every 10% to reduce noise, while the SSE broadcasts every percentage update to connected frontend clients for smooth progress bar updates.

### 7. Tests

Written 325 Jest tests across 30 suites covering:

- Every method on every action class (275 tests) — verifies correct command strings and placeholder replacement
- CommandExecutor (18 tests) — covers success paths, input validation, error handling, and action class integration
- OllamaChecker (12 tests) — covers CLI and HTTP detection paths, error handling, model availability
- OllamaInstaller (14 tests) — covers install flow, progress callbacks, error scenarios
- ListForOllama (6 tests) — verifies catalogue content and format

Run tests with:

```bash
cd backend
npm test
```

### What Is Next

- Connect Ollama for natural language understanding — map user input to the correct action class and method using the function catalogue
- Build the CLI interface for typed and spoken input
- Build the frontend that connects to the SSE endpoint for live installation progress
- Add support for commands that require admin privileges (UAC elevation)