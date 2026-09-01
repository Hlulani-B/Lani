import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { autoUpdater } from 'electron-updater';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let backendProcess = null;

function startBackend() {
  // In dev: backend is at ../backend/index.js relative to frontend/
  // In production: backend is bundled at resources/backend/index.js
  const backendPath = app.isPackaged
    ? path.join(process.resourcesPath, 'backend', 'index.js')
    : path.join(__dirname, '..', '..', 'backend', 'index.js');

  backendProcess = spawn('node', [backendPath], {
    stdio: 'pipe',
    env: { ...process.env },
  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`[Backend] ${data.toString().trim()}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`[Backend Error] ${data.toString().trim()}`);
  });

  backendProcess.on('close', (code) => {
    console.log(`[Backend] Process exited with code ${code}`);
  });
}

function stopBackend() {
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 500,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    backgroundColor: '#ffffff',
    title: 'Lani',
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  return win;
}

// IPC: let the React app close the Electron window
ipcMain.on('close-window', () => {
  app.quit();
});

// ── Auto-update setup ────────────────────────────────────────
// Update check is triggered automatically on app ready (see app.whenReady below).
// If an update is found, it downloads silently and prompts the user to restart.
// No popups if there's no update.

let mainWindow = null;

function setupAutoUpdater() {
  // Don't check for updates in development
  if (!app.isPackaged) return;

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('update-available', (info) => {
    console.log(`[AutoUpdate] Update available: ${info.version}`);
  });

  autoUpdater.on('update-not-available', () => {
    console.log('[AutoUpdate] No updates available');
  });

  autoUpdater.on('download-progress', (progress) => {
    console.log(`[AutoUpdate] Download: ${Math.round(progress.percent)}%`);
  });

  autoUpdater.on('update-downloaded', (info) => {
    console.log(`[AutoUpdate] Update downloaded: ${info.version}`);
    // Prompt the user to restart and install
    if (mainWindow) {
      dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Update Ready',
        message: `A new version (${info.version}) is ready to install.\n\nRestart Lani to apply the update?`,
        buttons: ['Restart Now', 'Later'],
        defaultId: 0,
        cancelId: 1,
      }).then(({ response }) => {
        if (response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
    }
  });

  autoUpdater.on('error', (err) => {
    console.error(`[AutoUpdate] Error: ${err.message}`);
  });

  // Check for updates now
  autoUpdater.checkForUpdates().catch((err) => {
    console.error(`[AutoUpdate] Check failed: ${err.message}`);
  });
}

app.whenReady().then(() => {
  // Start the backend server automatically
  startBackend();
  mainWindow = createWindow();

  // ── Trigger auto-update check on app launch ──
  setupAutoUpdater();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow();
    }
  });
});

app.on('before-quit', () => {
  stopBackend();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
