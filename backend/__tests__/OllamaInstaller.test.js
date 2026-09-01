import { installOllama, pullModel } from '../functions/OllamaInstaller.js';
import https from 'https';
import { execFile } from 'child_process';

jest.mock('child_process');

// Helper: mock a successful download response
function mockDownloadSuccess(size = 100) {
  const mockResponse = {
    statusCode: 200,
    headers: { 'content-length': String(size) },
    on: jest.fn((event, handler) => {
      if (event === 'data') handler(Buffer.from('x'.repeat(size)));
      if (event === 'end') handler();
    }),
  };
  jest.spyOn(https, 'get').mockImplementation((url, opts, cb) => {
    const callback = typeof opts === 'function' ? opts : cb;
    callback(mockResponse);
    return { on: jest.fn() };
  });
}

// Helper: mock a failed download
function mockDownloadFail() {
  jest.spyOn(https, 'get').mockImplementation(() => ({
    on: jest.fn((event, handler) => {
      if (event === 'error') handler(new Error('network error'));
    }),
  }));
}

describe('OllamaInstaller', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  // ── installOllama ─────────────────────────────────────────

  describe('installOllama', () => {
    test('calls onProgress with downloading step', async () => {
      mockDownloadSuccess();
      execFile.mockImplementation((path, args, opts, cb) => cb(null));

      const onProgress = jest.fn();
      await installOllama(onProgress);

      const downloadCalls = onProgress.mock.calls.filter(c => c[0].step === 'downloading');
      expect(downloadCalls.length).toBeGreaterThan(0);
    });

    test('calls onProgress with installing step', async () => {
      mockDownloadSuccess();
      execFile.mockImplementation((path, args, opts, cb) => cb(null));

      const onProgress = jest.fn();
      await installOllama(onProgress);

      const installCalls = onProgress.mock.calls.filter(c => c[0].step === 'installing');
      expect(installCalls.length).toBeGreaterThan(0);
    });

    test('returns true on successful install', async () => {
      mockDownloadSuccess();
      execFile.mockImplementation((path, args, opts, cb) => cb(null));

      const result = await installOllama();
      expect(result).toBe(true);
    });

    test('returns false when download fails', async () => {
      mockDownloadFail();

      const result = await installOllama();
      expect(result).toBe(false);
    });

    test('returns false when installer fails', async () => {
      mockDownloadSuccess();
      execFile.mockImplementation((path, args, opts, cb) => cb(new Error('install failed')));

      const result = await installOllama();
      expect(result).toBe(false);
    });

    test('runs installer with /VERYSILENT flag', async () => {
      mockDownloadSuccess();
      execFile.mockImplementation((path, args, opts, cb) => cb(null));

      await installOllama();

      expect(execFile).toHaveBeenCalledWith(
        expect.stringContaining('OllamaSetup.exe'),
        ['/VERYSILENT', '/NORESTART'],
        expect.objectContaining({ timeout: 120000 }),
        expect.any(Function)
      );
    });

    test('reports error step on failure', async () => {
      mockDownloadFail();

      const onProgress = jest.fn();
      await installOllama(onProgress);

      const errorCalls = onProgress.mock.calls.filter(c => c[0].step === 'error');
      expect(errorCalls.length).toBe(1);
      expect(errorCalls[0][0].message).toContain('network error');
    });

    test('reports download progress with percent', async () => {
      mockDownloadSuccess(200);
      execFile.mockImplementation((path, args, opts, cb) => cb(null));

      const onProgress = jest.fn();
      await installOllama(onProgress);

      const percentCalls = onProgress.mock.calls.filter(
        c => c[0].step === 'downloading' && c[0].percent > 0
      );
      expect(percentCalls.length).toBeGreaterThan(0);
    });
  });

  // ── pullModel ─────────────────────────────────────────────

  describe('pullModel', () => {
    test('returns true on successful pull', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('{"status":"success"}'),
      });

      const result = await pullModel('llama3.2');
      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:11434/api/pull',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    test('sends correct model name in request body', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('{}'),
      });

      await pullModel('llama3.2');

      const body = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(body.name).toBe('llama3.2');
      expect(body.stream).toBe(false);
    });

    test('returns false when fetch fails', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('connection refused'));

      const result = await pullModel('llama3.2');
      expect(result).toBe(false);
    });

    test('returns false when response is not ok', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });

      const result = await pullModel('llama3.2');
      expect(result).toBe(false);
    });

    test('calls onProgress with pulling step', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('{}'),
      });

      const onProgress = jest.fn();
      await pullModel('llama3.2', onProgress);

      const pullCalls = onProgress.mock.calls.filter(c => c[0].step === 'pulling');
      expect(pullCalls.length).toBeGreaterThan(0);
    });

    test('reports error step on failure', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('timeout'));

      const onProgress = jest.fn();
      await pullModel('llama3.2', onProgress);

      const errorCalls = onProgress.mock.calls.filter(c => c[0].step === 'error');
      expect(errorCalls.length).toBe(1);
      expect(errorCalls[0][0].message).toContain('timeout');
    });
  });
});
