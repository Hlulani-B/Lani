import express from 'express';
import cors from 'cors';
import { isOllamaInstalled, isModelAvailable } from './functions/OllamaChecker.js';
import { installOllama, pullModel } from './functions/OllamaInstaller.js';
import listForOllama from './functions/ListForOllama.js';
import CommandExecutor from './functions/CommandExecutor.js';
import NetworkInfoHelper from './functions/NetworkInfoHelper.js';

// Import all action classes for dynamic calling
import VolumeAction from './functions/SettingsActions/VolumeAction.js';
import BrightnessAction from './functions/SettingsActions/BrightnessAction.js';
import WifiAction from './functions/SettingsActions/WifiAction.js';
import BluetoothAction from './functions/SettingsActions/BluetoothAction.js';
import ThemeAction from './functions/SettingsActions/ThemeAction.js';
import PowerAction from './functions/SettingsActions/PowerAction.js';
import DisplayAction from './functions/SettingsActions/DisplayAction.js';
import ClipboardAction from './functions/SettingsActions/ClipboardAction.js';
import ScreenshotAction from './functions/SettingsActions/ScreenshotAction.js';
import SystemAppsAction from './functions/SettingsActions/SystemAppsAction.js';
import MouseKeyboardAction from './functions/SettingsActions/MouseKeyboardAction.js';
import AccessibilityAction from './functions/SettingsActions/AccessibilityAction.js';
import NetworkAction from './functions/SettingsActions/NetworkAction.js';
import WindowsUpdateAction from './functions/SettingsActions/WindowsUpdateAction.js';
import SettingsPagesAction from './functions/SettingsActions/SettingsPagesAction.js';
import PrivacyAction from './functions/SettingsActions/PrivacyAction.js';
import NotificationsAction from './functions/SettingsActions/NotificationsAction.js';
import RegionInputAction from './functions/SettingsActions/RegionInputAction.js';
import StorageAction from './functions/SettingsActions/StorageAction.js';
import SoundDevicesAction from './functions/SettingsActions/SoundDevicesAction.js';
import VpnProxyAction from './functions/SettingsActions/VpnProxyAction.js';
import UserAccountsAction from './functions/SettingsActions/UserAccountsAction.js';
import DefenderAction from './functions/SettingsActions/DefenderAction.js';
import TaskbarAction from './functions/SettingsActions/TaskbarAction.js';
import PowerUserAction from './functions/SettingsActions/PowerUserAction.js';
import MiscAction from './functions/SettingsActions/MiscAction.js';

// Map of class names to action classes for dynamic calling
const actionMap = {
  VolumeAction, BrightnessAction, WifiAction, BluetoothAction,
  ThemeAction, PowerAction, DisplayAction, ClipboardAction,
  ScreenshotAction, SystemAppsAction, MouseKeyboardAction,
  AccessibilityAction, NetworkAction, WindowsUpdateAction,
  SettingsPagesAction, PrivacyAction, NotificationsAction,
  RegionInputAction, StorageAction, SoundDevicesAction,
  VpnProxyAction, UserAccountsAction, DefenderAction,
  TaskbarAction, PowerUserAction, MiscAction,
};

/**
 * Parse an action string like "VolumeAction.volumeUp()" or "VolumeAction.volumeSet"
 * into { className, methodName }.
 */
function parseAction(actionStr) {
  const cleaned = actionStr.replace(/\(.*\)/, '').trim();
  const dotIndex = cleaned.lastIndexOf('.');
  if (dotIndex === -1) return null;
  return {
    className: cleaned.substring(0, dotIndex),
    methodName: cleaned.substring(dotIndex + 1),
  };
}

/**
 * Call an action function by its class and method name.
 * @param {string} className - e.g. "VolumeAction"
 * @param {string} methodName - e.g. "volumeUp"
 * @param {Array} args - arguments to pass
 * @returns {string} The PowerShell command string
 */
function callAction(className, methodName, args = []) {
  const ActionClass = actionMap[className];
  if (!ActionClass) throw new Error(`Unknown action class: ${className}`);
  if (typeof ActionClass[methodName] !== 'function') throw new Error(`Unknown method: ${className}.${methodName}`);
  return ActionClass[methodName](...args);
}

/**
 * Build the args array for a given action from auto-filled values + user-provided values.
 * The order must match the function signature.
 * @param {string} action - e.g. "PowerUserAction.staticIpSet"
 * @param {object} values - combined auto-filled + user-provided values
 * @returns {Array} args in the correct order
 */
function buildArgs(action, values) {
  const signatures = {
    'PowerUserAction.staticIpSet': ['adapter', 'ip', 'prefix', 'gateway'],
    'PowerUserAction.dnsSet': ['adapter', 'dns1', 'dns2'],
    'PowerUserAction.dnsResetDhcp': ['adapter'],
  };

  const sig = signatures[action];
  if (!sig) return [];
  return sig.map(name => values[name]);
}

/**
 * For network-related actions, auto-detect parameters the user shouldn't
 * have to type manually (adapter name, current IP, prefix, gateway, DNS).
 * Returns auto-filled values + only the params the user still needs to provide.
 */
async function autoFillNetworkParams(action, ollamaParams) {
  const adapter = await NetworkInfoHelper.getActiveAdapter();
  const paramNames = ollamaParams.map(p => p.name);

  if (action === 'PowerUserAction.staticIpSet') {
    const defaults = await NetworkInfoHelper.getStaticIpDefaults();
    const autoFilled = {};
    const remainingParams = [];

    for (const p of ollamaParams) {
      if (p.name === 'adapter') {
        autoFilled.adapter = adapter;
      } else if (p.name === 'prefix') {
        autoFilled.prefix = defaults.prefix;
      } else if (p.name === 'gateway') {
        autoFilled.gateway = defaults.gateway;
      } else {
        remainingParams.push(p);
      }
    }

    return { autoFilled, params: remainingParams };
  }

  if (action === 'PowerUserAction.dnsSet') {
    const defaults = await NetworkInfoHelper.getDnsDefaults();
    const autoFilled = {};
    const remainingParams = [];

    for (const p of ollamaParams) {
      if (p.name === 'adapter') {
        autoFilled.adapter = adapter;
      } else {
        remainingParams.push(p);
      }
    }

    return { autoFilled, params: remainingParams, currentDns: defaults };
  }

  if (action === 'PowerUserAction.dnsResetDhcp') {
    return {
      autoFilled: { adapter },
      params: [],
    };
  }

  // Not a network action — return as-is
  return { autoFilled: {}, params: ollamaParams };
}

const app = express();
const PORT = process.env.PORT || 3000;
const DEFAULT_MODEL = 'llama3.2';

app.use(cors());
app.use(express.json());

// ── State ────────────────────────────────────────────────────
let status = {
  ollamaInstalled: false,
  modelAvailable: false,
  installing: false,
  currentStep: '',
  message: '',
  percent: 0,
};

// Check actual system state on startup (survives backend restarts)
async function initializeStatus() {
  status.ollamaInstalled = await isOllamaInstalled();
  if (status.ollamaInstalled) {
    status.modelAvailable = await isModelAvailable(DEFAULT_MODEL);
    if (status.modelAvailable) {
      status.currentStep = 'ready';
      status.message = 'Lani is ready!';
      status.percent = 100;
    }
  }
  console.log(`[Init] Ollama installed: ${status.ollamaInstalled}, Model available: ${status.modelAvailable}`);
}

// SSE clients
let sseClients = [];

function broadcast(data) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach(res => res.write(payload));
}

function updateStatus(updates) {
  Object.assign(status, updates);
  broadcast(status);
}

// ── Routes ───────────────────────────────────────────────────

// GET /api/status — current state
app.get('/api/status', async (_req, res) => {
  // Refresh checks each time
  status.ollamaInstalled = await isOllamaInstalled();
  if (status.ollamaInstalled) {
    status.modelAvailable = await isModelAvailable(DEFAULT_MODEL);
    if (status.modelAvailable) {
      status.currentStep = 'ready';
    }
  }
  res.json(status);
});

// GET /api/events — SSE stream for live progress
app.get('/api/events', (_req, res) => {
  console.log('[Backend] SSE client connected to /api/events');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send current state immediately
  console.log('[Backend] Sending initial status:', status);
  res.write(`data: ${JSON.stringify(status)}\n\n`);

  sseClients.push(res);
  console.log(`[Backend] SSE clients count: ${sseClients.length}`);
  _req.on('close', () => {
    console.log('[Backend] SSE client disconnected');
    sseClients = sseClients.filter(c => c !== res);
    console.log(`[Backend] SSE clients count: ${sseClients.length}`);
  });
});

// POST /api/install — trigger Ollama install + model pull
app.post('/api/install', async (_req, res) => {
  console.log('[Backend] POST /api/install received');
  console.log('[Backend] Current status:', status);
  
  if (status.installing) {
    console.log('[Backend] Installation already in progress');
    return res.json({ message: 'Installation already in progress', status });
  }

  // Check if Ollama is already installed
  const alreadyInstalled = await isOllamaInstalled();
  if (alreadyInstalled) {
    status.ollamaInstalled = true;
    // Check if model is available
    const modelOk = await isModelAvailable(DEFAULT_MODEL);
    if (modelOk) {
      status.modelAvailable = true;
      // Broadcast ready BEFORE responding so SSE clients catch it
      updateStatus({ installing: false, currentStep: 'ready', message: 'Lani is ready!', percent: 100 });
      return res.json({ message: 'Already installed and ready', status });
    } else {
      // Need to pull model
      updateStatus({ ollamaInstalled: true, currentStep: 'pulling', message: 'Preparing AI model...', percent: 0 });
      res.json({ message: 'Installed, preparing model...', status });
      
      let lastLoggedModelPercent = -1;
      const pulled = await pullModel(DEFAULT_MODEL, (progress) => {
        if (progress.percent !== undefined && progress.percent % 10 === 0 && progress.percent !== lastLoggedModelPercent) {
          console.log(`[Model] ${progress.step}: ${progress.message}`);
          lastLoggedModelPercent = progress.percent;
        }
        updateStatus({
          currentStep: progress.step,
          message: progress.message,
          percent: progress.percent || 0,
        });
      });
      
      if (pulled) {
        updateStatus({
          installing: false,
          modelAvailable: true,
          currentStep: 'ready',
          message: 'Lani is ready!',
          percent: 100,
        });
      } else {
        updateStatus({
          installing: false,
          currentStep: 'error',
          message: 'Setup failed. You can retry.',
        });
      }
      return;
    }
  }

  // Ollama not installed, start installation
  updateStatus({ installing: true, currentStep: 'starting', message: 'Starting installation...', percent: 0 });
  res.json({ message: 'Installation started', status });

  // 1. Install Ollama
  let lastLoggedPercent = -1;
  const installed = await installOllama((progress) => {
    // Log to console only every 10% to reduce noise
    if (progress.percent !== undefined && progress.percent % 10 === 0 && progress.percent !== lastLoggedPercent) {
      console.log(`[Install] ${progress.step}: ${progress.message}`);
      lastLoggedPercent = progress.percent;
    }
    updateStatus({
      currentStep: progress.step,
      message: progress.message,
      percent: progress.percent || 0,
    });
  });

  if (!installed) {
    updateStatus({ installing: false, currentStep: 'error', message: 'Installation failed' });
    return;
  }

  updateStatus({ ollamaInstalled: true, currentStep: 'checking', message: 'Verifying installation...', percent: 100 });

  // Wait for Ollama service to start, then verify
  await new Promise(r => setTimeout(r, 5000));
  const verifyInstalled = await isOllamaInstalled();
  if (!verifyInstalled) {
    updateStatus({ installing: false, currentStep: 'error', message: 'Installation completed but Ollama was not detected. Please restart your computer and try again.' });
    return;
  }
  console.log('[Install] Ollama verified as installed');

  // 2. Pull the default model
  updateStatus({ currentStep: 'pulling', message: 'Preparing AI model...', percent: 0 });

  let lastLoggedModelPercent = -1;
  const pulled = await pullModel(DEFAULT_MODEL, (progress) => {
    // Log to console only every 10% to reduce noise
    if (progress.percent !== undefined && progress.percent % 10 === 0 && progress.percent !== lastLoggedModelPercent) {
      console.log(`[Model] ${progress.step}: ${progress.message}`);
      lastLoggedModelPercent = progress.percent;
    }
    updateStatus({
      currentStep: progress.step,
      message: progress.message,
      percent: progress.percent || 0,
    });
  });

  if (pulled) {
    updateStatus({
      installing: false,
      modelAvailable: true,
      currentStep: 'ready',
      message: 'Lani is ready!',
      percent: 100,
    });
  } else {
    updateStatus({
      installing: false,
      currentStep: 'error',
      message: 'Setup failed. You can retry.',
    });
  }
});

// POST /api/chat — send a message to Ollama with the full function catalogue
app.post('/api/chat', async (req, res) => {
  if (!status.ollamaInstalled) {
    return res.status(400).json({ error: 'Ollama is not installed yet' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }

  try {
    const systemPrompt = `You are a Windows settings assistant. Given the user's request, match it to exactly one function from the list below.

Return ONLY valid JSON (no markdown, no explanation) with one of these structures:

1. If the function needs NO parameters:
   { "getParameters": false, "action": "ClassName.methodName()" }

2. If the function needs parameters that the user has NOT provided:
   { "getParameters": true, "action": "ClassName.methodName", "params": [{ "name": "paramName", "type": "typeHint" }] }

   Available type hints:
   - "integer" — whole numbers (e.g., volume level 0-100, brightness, subnet prefix)
   - "string" — text input (e.g., SSID, username, VPN name, feature name, timezone)
   - "path" — file path (e.g., wallpaper image path)
   - "ip" — IP address (e.g., 192.168.1.1)
   - "password" — sensitive text (will be masked in UI)

3. If the request is gibberish, unrelated to Windows settings, or cannot be fulfilled:
   { "error": 1, "message": "A friendly message explaining what you can help with" }

Rules:
- Match the user's intent to the closest function.
- If the user already provided the parameter values in their message, include them and set getParameters to false with the full action string including args.
- Only set getParameters to true when the function requires parameters and the user has not supplied them.
- Always specify the correct type hint for each parameter so the frontend can show the right input field.
- If the request is clearly not about Windows settings or computer actions, return the error format.
- Return ONLY the JSON object, nothing else.`;

    const fullPrompt = `${systemPrompt}\n\n${listForOllama}\n\nUser request: "${message}"\n\nJSON response:`;

    const ollamaRes = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        prompt: fullPrompt,
        stream: false,
      }),
    });

    if (!ollamaRes.ok) {
      return res.status(502).json({ error: `Ollama error: ${ollamaRes.status}` });
    }

    const data = await ollamaRes.json();
    const rawResponse = data.response.trim();

    // Parse the JSON from Ollama's response
    let parsed;
    try {
      // Strip markdown code fences if Ollama wraps the JSON
      const cleaned = rawResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      return res.status(502).json({ error: 'Failed to parse Ollama response', raw: rawResponse });
    }

    // If Ollama returned an error (gibberish, unrelated request, etc.)
    if (parsed.error) {
      return res.json({ error: 1, message: parsed.message || "I can only help with Windows settings and actions." });
    }

    // If getParameters is false — execute the action immediately
    if (!parsed.getParameters && parsed.action) {
      try {
        const { className, methodName } = parseAction(parsed.action);
        if (!className || !methodName) {
          return res.json({ error: 1, message: "I couldn't understand that request. Could you rephrase it?" });
        }
        const command = callAction(className, methodName);
        const result = await CommandExecutor.execute(command);
        return res.json({ getParameters: false, action: parsed.action, result });
      } catch (execError) {
        return res.json({ error: 1, message: `Something went wrong: ${execError.message}` });
      }
    }

    // If getParameters is true — check if we can auto-fill network params
    if (parsed.getParameters) {
      const { autoFilled, params: remainingParams, currentDns } =
        await autoFillNetworkParams(parsed.action, parsed.params || []);

      // If all params were auto-filled, execute directly
      if (remainingParams.length === 0) {
        try {
          const { className, methodName } = parseAction(parsed.action);
          const argValues = buildArgs(parsed.action, autoFilled);
          const command = callAction(className, methodName, argValues);
          const result = await CommandExecutor.execute(command);
          return res.json({ getParameters: false, action: parsed.action, autoFilled, result });
        } catch (execError) {
          return res.status(500).json({ error: `Execution failed: ${execError.message}` });
        }
      }

      return res.json({
        getParameters: true,
        action: parsed.action,
        params: remainingParams,
        autoFilled,
        ...(currentDns && { currentDns }),
      });
    }

    // Fallback — no action returned
    res.json({ error: 1, message: "I'm not sure how to help with that. I can control Windows settings like volume, brightness, wifi, theme, and more." });
  } catch (error) {
    res.status(500).json({ error: `Failed to reach Ollama: ${error.message}` });
  }
});

// POST /api/execute — frontend sends action + filled parameters to execute
app.post('/api/execute', async (req, res) => {
  const { action, params, autoFilled } = req.body;
  if (!action) {
    return res.status(400).json({ error: 'action is required' });
  }

  try {
    const { className, methodName } = parseAction(action);
    if (!className || !methodName) {
      return res.status(400).json({ error: `Could not parse action: ${action}` });
    }

    // Combine auto-filled values with user-provided values
    const combinedValues = { ...(autoFilled || {}) };

    let args;
    if (Array.isArray(params)) {
      // params is an array of values in the same order as the function signature
      args = params;
    } else if (params && typeof params === 'object') {
      // params is an object with named values — merge with auto-filled and build ordered args
      Object.assign(combinedValues, params);
      args = buildArgs(action, combinedValues);
    } else {
      // No user params — just use auto-filled
      args = buildArgs(action, combinedValues);
    }

    const command = callAction(className, methodName, args);
    const result = await CommandExecutor.execute(command);

    res.json({ success: true, action, command, result });
  } catch (error) {
    res.status(500).json({ error: `Execution failed: ${error.message}` });
  }
});

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, async () => {
  console.log(`Lani server running on http://localhost:${PORT}`);
  await initializeStatus();
  console.log('Frontend should call POST /api/install to start installation');
});

export default app;
