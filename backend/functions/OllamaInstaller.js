import https from 'https';
import { execFile, spawn } from 'child_process';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const OLLAMA_DOWNLOAD_URL = 'https://ollama.com/download/OllamaSetup.exe';

/**
 * Download a file from a URL, reporting progress via a callback.
 * @param {string} url
 * @param {string} dest
 * @param {function} onProgress - called with { downloaded, total, percent }
 * @returns {Promise<void>}
 */
function downloadFile(url, dest, onProgress) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);

    https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close();
        return downloadFile(response.headers.location, dest, onProgress).then(resolve, reject);
      }

      if (response.statusCode !== 200) {
        file.close();
        return reject(new Error(`Download failed with status ${response.statusCode}`));
      }

      const total = parseInt(response.headers['content-length'] || '0', 10);
      let downloaded = 0;

      response.on('data', (chunk) => {
        downloaded += chunk.length;
        file.write(chunk);
        if (onProgress) {
          onProgress({
            downloaded,
            total,
            percent: total > 0 ? Math.round((downloaded / total) * 100) : 0,
          });
        }
      });

      response.on('end', () => {
        file.end();
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      reject(err);
    });
  });
}

/**
 * Install Ollama on this computer.
 * Downloads the Windows installer and runs it silently.
 * @param {function} onProgress - called with { step, message, percent? }
 * @returns {Promise<boolean>}
 */
export async function installOllama(onProgress) {
  const notify = (step, message, percent) => {
    if (onProgress) onProgress({ step, message, percent });
  };

  try {
    // Step 1 — Download
    notify('downloading', 'Downloading AI engine...', 0);

    const installerPath = join(tmpdir(), 'OllamaSetup.exe');
    await downloadFile(OLLAMA_DOWNLOAD_URL, installerPath, ({ percent }) => {
      notify('downloading', `Downloading... ${percent}%`, percent);
    });

    notify('downloading', 'Download complete', 100);

    // Step 2 — Install silently (requires admin privileges)
    notify('installing', 'Installing...', 0);

    await new Promise((resolve, reject) => {
      // Use PowerShell Start-Process with -Verb RunAs to request admin privileges
      // This will show a UAC prompt, but the install itself is silent
      const psCommand = `Start-Process -FilePath '${installerPath.replace(/'/g, "''")}' -ArgumentList '/VERYSILENT','/NORESTART' -Verb RunAs -Wait`;
      
      const proc = spawn('powershell', ['-NoProfile', '-Command', psCommand], {
        timeout: 120000,
        windowsHide: true,
      });

      let stderr = '';
      proc.stderr.on('data', (data) => { stderr += data.toString(); });

      proc.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Installer exited with code ${code}: ${stderr}`));
        } else {
          resolve();
        }
      });

      proc.on('error', (err) => {
        reject(new Error(`Failed to start installer: ${err.message}`));
      });
    });

    notify('installed', 'Installation complete', 100);
    return true;
  } catch (error) {
    notify('error', `Installation failed: ${error.message}`, 0);
    return false;
  }
}

/**
 * Pull an Ollama model.
 * @param {string} model - e.g. "llama3.2"
 * @param {function} onProgress - called with { step, message, percent? }
 * @returns {Promise<boolean>}
 */
export async function pullModel(model, onProgress) {
  const notify = (step, message, percent) => {
    if (onProgress) onProgress({ step, message, percent });
  };

  try {
    notify('pulling', 'Preparing AI model...', 0);

    const body = JSON.stringify({ name: model, stream: false });

    await new Promise((resolve, reject) => {
      // Use fetch (available in Node 18+)
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 600000); // 10 min for large models

      fetch('http://localhost:11434/api/pull', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        signal: controller.signal,
      }).then(async (res) => {
        clearTimeout(timeout);
        if (!res.ok) return reject(new Error(`Pull failed: ${res.status}`));
        const text = await res.text();
        notify('pulling', 'AI model ready', 100);
        resolve();
      }).catch((err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    return true;
  } catch (error) {
    notify('error', `Setup failed: ${error.message}`, 0);
    return false;
  }
}
