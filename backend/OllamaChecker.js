import { execFile } from 'child_process';
import http from 'http';

/**
 * Check if Ollama is installed on this computer.
 * Tries the CLI first, then falls back to hitting the local API.
 * @returns {Promise<boolean>}
 */
export async function isOllamaInstalled() {
  // 1. Try the CLI
  try {
    const found = await new Promise((resolve) => {
      execFile('ollama', ['--version'], { timeout: 5000, windowsHide: true }, (error) => {
        resolve(!error);
      });
    });
    if (found) return true;
  } catch {
    // fall through to API check
  }

  // 2. Try the local API
  try {
    return await new Promise((resolve) => {
      const req = http.get('http://localhost:11434', { timeout: 3000 }, (res) => {
        resolve(res.statusCode === 200);
        res.resume();
      });
      req.on('error', () => resolve(false));
      req.on('timeout', () => { req.destroy(); resolve(false); });
    });
  } catch {
    return false;
  }
}

/**
 * Check if a specific Ollama model is available locally.
 * @param {string} model - Model name (e.g. "llama3.2")
 * @returns {Promise<boolean>}
 */
export async function isModelAvailable(model) {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:11434/api/tags', { timeout: 3000 }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const models = (json.models || []).map(m => m.name);
          resolve(models.some(name => name.startsWith(model)));
        } catch {
          resolve(false);
        }
      });
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}
