import { execFile } from 'child_process';
import http from 'http';
import { isOllamaInstalled, isModelAvailable } from '../functions/OllamaChecker.js';

jest.mock('child_process');
jest.mock('http');

describe('OllamaChecker', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // ── isOllamaInstalled ─────────────────────────────────────

  describe('isOllamaInstalled', () => {
    test('returns true when CLI responds without error', async () => {
      execFile.mockImplementation((cmd, args, opts, cb) => {
        cb(null, 'ollama version 0.3.0');
      });

      const result = await isOllamaInstalled();
      expect(result).toBe(true);
    });

    test('calls ollama --version with correct args', async () => {
      execFile.mockImplementation((cmd, args, opts, cb) => {
        cb(null, '');
      });

      await isOllamaInstalled();
      expect(execFile).toHaveBeenCalledWith(
        'ollama',
        ['--version'],
        expect.objectContaining({ timeout: 5000, windowsHide: true }),
        expect.any(Function)
      );
    });

    test('falls back to API check when CLI fails', async () => {
      execFile.mockImplementation((cmd, args, opts, cb) => {
        cb(new Error('not found'));
      });

      // http.get(url, opts, callback) — callback receives response
      const mockRes = { statusCode: 200, on: jest.fn(), resume: jest.fn() };
      http.get.mockImplementation((url, opts, cb) => {
        cb(mockRes);
        return { on: jest.fn() };
      });

      const result = await isOllamaInstalled();
      expect(result).toBe(true);
      expect(http.get).toHaveBeenCalledWith(
        'http://localhost:11434',
        expect.objectContaining({ timeout: 3000 }),
        expect.any(Function)
      );
    });

    test('returns false when both CLI and API fail', async () => {
      execFile.mockImplementation((cmd, args, opts, cb) => {
        cb(new Error('not found'));
      });

      const mockReq = {
        on: jest.fn((event, handler) => {
          if (event === 'error') handler(new Error('connection refused'));
        }),
      };
      http.get.mockImplementation(() => mockReq);

      const result = await isOllamaInstalled();
      expect(result).toBe(false);
    });

    test('returns false when API returns non-200', async () => {
      execFile.mockImplementation((cmd, args, opts, cb) => {
        cb(new Error('not found'));
      });

      const mockRes = { statusCode: 500, on: jest.fn(), resume: jest.fn() };
      http.get.mockImplementation((url, opts, cb) => {
        cb(mockRes);
        return { on: jest.fn() };
      });

      const result = await isOllamaInstalled();
      expect(result).toBe(false);
    });

    test('returns false when API times out', async () => {
      execFile.mockImplementation((cmd, args, opts, cb) => {
        cb(new Error('not found'));
      });

      const mockReq = {
        on: jest.fn((event, handler) => {
          if (event === 'timeout') handler();
        }),
        destroy: jest.fn(),
      };
      http.get.mockImplementation(() => mockReq);

      const result = await isOllamaInstalled();
      expect(result).toBe(false);
    });
  });

  // ── isModelAvailable ──────────────────────────────────────

  describe('isModelAvailable', () => {
    test('returns true when model is found in tags', async () => {
      // http.get(url, callback) — callback receives the response object
      const mockRes = {
        on: jest.fn((event, handler) => {
          if (event === 'data') handler(JSON.stringify({
            models: [{ name: 'llama3.2:latest' }, { name: 'mistral:latest' }],
          }));
          if (event === 'end') handler();
        }),
      };
      http.get.mockImplementation((url, opts, cb) => {
        cb(mockRes);
        return { on: jest.fn() };
      });

      const result = await isModelAvailable('llama3.2');
      expect(result).toBe(true);
    });

    test('returns false when model is not in tags', async () => {
      const mockRes = {
        on: jest.fn((event, handler) => {
          if (event === 'data') handler(JSON.stringify({
            models: [{ name: 'mistral:latest' }],
          }));
          if (event === 'end') handler();
        }),
      };
      http.get.mockImplementation((url, opts, cb) => {
        cb(mockRes);
        return { on: jest.fn() };
      });

      const result = await isModelAvailable('llama3.2');
      expect(result).toBe(false);
    });

    test('returns false on connection error', async () => {
      const mockReq = {
        on: jest.fn((event, handler) => {
          if (event === 'error') handler(new Error('refused'));
        }),
      };
      http.get.mockImplementation(() => mockReq);

      const result = await isModelAvailable('llama3.2');
      expect(result).toBe(false);
    });

    test('returns false on timeout', async () => {
      const mockReq = {
        on: jest.fn((event, handler) => {
          if (event === 'timeout') handler();
        }),
        destroy: jest.fn(),
      };
      http.get.mockImplementation(() => mockReq);

      const result = await isModelAvailable('llama3.2');
      expect(result).toBe(false);
    });

    test('returns false on invalid JSON response', async () => {
      const mockRes = {
        on: jest.fn((event, handler) => {
          if (event === 'data') handler('not json');
          if (event === 'end') handler();
        }),
      };
      http.get.mockImplementation((url, opts, cb) => {
        cb(mockRes);
        return { on: jest.fn() };
      });

      const result = await isModelAvailable('llama3.2');
      expect(result).toBe(false);
    });

    test('queries the correct API endpoint', async () => {
      const mockRes = {
        on: jest.fn((event, handler) => {
          if (event === 'data') handler(JSON.stringify({ models: [] }));
          if (event === 'end') handler();
        }),
      };
      http.get.mockImplementation((url, opts, cb) => {
        cb(mockRes);
        return { on: jest.fn() };
      });

      await isModelAvailable('llama3.2');
      expect(http.get).toHaveBeenCalledWith(
        'http://localhost:11434/api/tags',
        expect.objectContaining({ timeout: 3000 }),
        expect.any(Function)
      );
    });
  });
});
