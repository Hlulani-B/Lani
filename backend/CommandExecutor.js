import { execFile } from 'child_process';

class CommandExecutor {
  /**
   * Execute a PowerShell command on the OS.
   * @param {string} command - The PowerShell command string to execute.
   * @param {object} [options] - Optional overrides.
   * @param {number} [options.timeout] - Max execution time in ms (default 30000).
   * @returns {Promise<string>} Resolved with trimmed stdout.
   */
  static execute(command, options = {}) {
    return new Promise((resolve, reject) => {
      if (!command || typeof command !== 'string') {
        return reject(new Error('Command must be a non-empty string'));
      }

      const timeout = options.timeout || 30000;

      execFile(
        'powershell',
        ['-NoProfile', '-Command', command],
        { timeout, windowsHide: true },
        (error, stdout, stderr) => {
          if (error) {
            error.stderr = stderr;
            error.stdout = stdout;
            return reject(error);
          }
          resolve(stdout.trim());
        }
      );
    });
  }
}

export default CommandExecutor;
