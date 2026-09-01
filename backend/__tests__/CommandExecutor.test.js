import { execFile } from 'child_process';
import CommandExecutor from '../functions/CommandExecutor.js';

jest.mock('child_process');

describe('CommandExecutor', () => {
  let mockExecFile;

  beforeEach(() => {
    mockExecFile = execFile;
    mockExecFile.mockReset();
  });

  // ── successful execution ──────────────────────────────────

  describe('execute – success', () => {
    test('resolves with trimmed stdout', () => {
      mockExecFile.mockImplementation((app, args, opts, cb) => {
        cb(null, '  hello world  \n', '');
      });

      return CommandExecutor.execute('Write-Output "hello"').then(result => {
        expect(result).toBe('hello world');
      });
    });

    test('resolves empty string when stdout is blank', () => {
      mockExecFile.mockImplementation((app, args, opts, cb) => {
        cb(null, '', '');
      });

      return CommandExecutor.execute('Write-Output ""').then(result => {
        expect(result).toBe('');
      });
    });

    test('calls powershell with -NoProfile -Command and the command string', () => {
      mockExecFile.mockImplementation((app, args, opts, cb) => {
        cb(null, 'ok', '');
      });

      const cmd = '(New-Object -ComObject WScript.Shell).SendKeys([char]175)';
      return CommandExecutor.execute(cmd).then(() => {
        expect(mockExecFile).toHaveBeenCalledTimes(1);
        expect(mockExecFile).toHaveBeenCalledWith(
          'powershell',
          ['-NoProfile', '-Command', cmd],
          expect.objectContaining({ timeout: 30000, windowsHide: true }),
          expect.any(Function)
        );
      });
    });

    test('passes custom timeout to execFile', () => {
      mockExecFile.mockImplementation((app, args, opts, cb) => {
        cb(null, 'ok', '');
      });

      return CommandExecutor.execute('test', { timeout: 5000 }).then(() => {
        const opts = mockExecFile.mock.calls[0][2];
        expect(opts.timeout).toBe(5000);
      });
    });

    test('defaults timeout to 30000 when no options given', () => {
      mockExecFile.mockImplementation((app, args, opts, cb) => {
        cb(null, 'ok', '');
      });

      return CommandExecutor.execute('test').then(() => {
        const opts = mockExecFile.mock.calls[0][2];
        expect(opts.timeout).toBe(30000);
      });
    });

    test('always sets windowsHide to true', () => {
      mockExecFile.mockImplementation((app, args, opts, cb) => {
        cb(null, 'ok', '');
      });

      return CommandExecutor.execute('test', { timeout: 9999 }).then(() => {
        const opts = mockExecFile.mock.calls[0][2];
        expect(opts.windowsHide).toBe(true);
      });
    });
  });

  // ── input validation ──────────────────────────────────────

  describe('execute – input validation', () => {
    test('rejects when command is empty string', () => {
      return CommandExecutor.execute('').catch(err => {
        expect(err.message).toBe('Command must be a non-empty string');
      });
    });

    test('rejects when command is null', () => {
      return CommandExecutor.execute(null).catch(err => {
        expect(err.message).toBe('Command must be a non-empty string');
      });
    });

    test('rejects when command is undefined', () => {
      return CommandExecutor.execute(undefined).catch(err => {
        expect(err.message).toBe('Command must be a non-empty string');
      });
    });

    test('rejects when command is a number', () => {
      return CommandExecutor.execute(42).catch(err => {
        expect(err.message).toBe('Command must be a non-empty string');
      });
    });

    test('does not call execFile when validation fails', () => {
      return CommandExecutor.execute('').catch(() => {
        expect(mockExecFile).not.toHaveBeenCalled();
      });
    });
  });

  // ── error handling ────────────────────────────────────────

  describe('execute – error handling', () => {
    test('rejects with error when execFile returns an error', () => {
      const execError = new Error('Command failed');
      mockExecFile.mockImplementation((app, args, opts, cb) => {
        cb(execError, '', 'Something went wrong');
      });

      return CommandExecutor.execute('bad-command').catch(err => {
        expect(err).toBe(execError);
        expect(err.stderr).toBe('Something went wrong');
        expect(err.stdout).toBe('');
      });
    });

    test('attaches stderr to the error object', () => {
      const execError = new Error('fail');
      mockExecFile.mockImplementation((app, args, opts, cb) => {
        cb(execError, '', 'Access is denied');
      });

      return CommandExecutor.execute('test').catch(err => {
        expect(err.stderr).toBe('Access is denied');
      });
    });

    test('attaches stdout to the error object', () => {
      const execError = new Error('fail');
      mockExecFile.mockImplementation((app, args, opts, cb) => {
        cb(execError, 'partial output', 'error info');
      });

      return CommandExecutor.execute('test').catch(err => {
        expect(err.stdout).toBe('partial output');
      });
    });

    test('does not resolve when error occurs', () => {
      mockExecFile.mockImplementation((app, args, opts, cb) => {
        cb(new Error('fail'), '', '');
      });

      const thenFn = jest.fn();
      return CommandExecutor.execute('test').then(thenFn).catch(() => {
        expect(thenFn).not.toHaveBeenCalled();
      });
    });
  });

  // ── integration with action classes ───────────────────────

  describe('execute – action class integration', () => {
    test('accepts command string from VolumeAction.volumeUp()', () => {
      mockExecFile.mockImplementation((app, args, opts, cb) => {
        cb(null, '', '');
      });

      const command = `(New-Object -ComObject WScript.Shell).SendKeys([char]175)`;
      return CommandExecutor.execute(command).then(() => {
        const passedCommand = mockExecFile.mock.calls[0][1][2];
        expect(passedCommand).toBe(command);
      });
    });

    test('accepts parameterised command from VolumeAction.volumeSet()', () => {
      mockExecFile.mockImplementation((app, args, opts, cb) => {
        cb(null, '', '');
      });

      const command = `Add-Type -TypeDefinition 'test' -Name Vol; 1..50 | ForEach-Object { [Win32.Vol]::keybd_event(0xAF,0,0,0) }`;
      return CommandExecutor.execute(command).then(() => {
        const passedCommand = mockExecFile.mock.calls[0][1][2];
        expect(passedCommand).toBe(command);
      });
    });

    test('accepts command string from PowerAction.shutdown()', () => {
      mockExecFile.mockImplementation((app, args, opts, cb) => {
        cb(null, '', '');
      });

      return CommandExecutor.execute('shutdown /s /t 0').then(() => {
        const passedCommand = mockExecFile.mock.calls[0][1][2];
        expect(passedCommand).toBe('shutdown /s /t 0');
      });
    });
  });
});
