import express from 'express';
import cors from 'cors';
import { isOllamaInstalled, isModelAvailable } from './OllamaChecker.js';
import { installOllama, pullModel } from './OllamaInstaller.js';

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
  }
  res.json(status);
});

// GET /api/events — SSE stream for live progress
app.get('/api/events', (_req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send current state immediately
  res.write(`data: ${JSON.stringify(status)}\n\n`);

  sseClients.push(res);
  _req.on('close', () => {
    sseClients = sseClients.filter(c => c !== res);
  });
});

// POST /api/install — trigger Ollama install + model pull
app.post('/api/install', async (_req, res) => {
  if (status.installing) {
    return res.json({ message: 'Installation already in progress', status });
  }

  updateStatus({ installing: true, currentStep: 'starting', message: 'Starting installation...', percent: 0 });
  res.json({ message: 'Installation started', status });

  // 1. Install Ollama
  const installed = await installOllama((progress) => {
    updateStatus({
      currentStep: progress.step,
      message: progress.message,
      percent: progress.percent || 0,
    });
  });

  if (!installed) {
    updateStatus({ installing: false, currentStep: 'error', message: 'Ollama installation failed' });
    return;
  }

  updateStatus({ ollamaInstalled: true, currentStep: 'checking', message: 'Verifying installation...', percent: 100 });

  // Wait a moment for Ollama service to start
  await new Promise(r => setTimeout(r, 5000));

  // 2. Pull the default model
  updateStatus({ currentStep: 'pulling', message: `Pulling model ${DEFAULT_MODEL}...`, percent: 0 });

  const pulled = await pullModel(DEFAULT_MODEL, (progress) => {
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
      message: 'Model pull failed. You can retry or pull manually.',
    });
  }
});

// POST /api/chat — send a message to Ollama
app.post('/api/chat', async (req, res) => {
  if (!status.ollamaInstalled) {
    return res.status(400).json({ error: 'Ollama is not installed yet' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }

  try {
    const ollamaRes = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        prompt: message,
        stream: false,
      }),
    });

    if (!ollamaRes.ok) {
      return res.status(502).json({ error: `Ollama error: ${ollamaRes.status}` });
    }

    const data = await ollamaRes.json();
    res.json({ response: data.response });
  } catch (error) {
    res.status(500).json({ error: `Failed to reach Ollama: ${error.message}` });
  }
});

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Lani server running on http://localhost:${PORT}`);

  // Check Ollama on startup
  isOllamaInstalled().then((installed) => {
    status.ollamaInstalled = installed;
    if (installed) {
      console.log('Ollama is installed');
      return isModelAvailable(DEFAULT_MODEL);
    } else {
      console.log('Ollama is NOT installed — frontend will be notified');
    }
  }).then((modelOk) => {
    if (modelOk !== undefined) {
      status.modelAvailable = modelOk;
      if (modelOk) {
        console.log(`Model ${DEFAULT_MODEL} is available`);
        updateStatus({ currentStep: 'ready', message: 'Lani is ready!', percent: 100 });
      } else {
        console.log(`Model ${DEFAULT_MODEL} not found — needs to be pulled`);
        updateStatus({ currentStep: 'needs_model', message: `Model ${DEFAULT_MODEL} needs to be downloaded` });
      }
    } else {
      updateStatus({ currentStep: 'needs_install', message: 'Ollama needs to be installed' });
    }
  });
});

export default app;
