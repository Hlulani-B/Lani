import CommandExecutor from '../functions/CommandExecutor.js';
import NetworkInfoHelper from '../functions/NetworkInfoHelper.js';

jest.mock('../functions/CommandExecutor.js');

describe('NetworkInfoHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── getActiveAdapter ──────────────────────────────────────────
  describe('getActiveAdapter', () => {
    it('should return the active adapter name', async () => {
      CommandExecutor.execute.mockResolvedValue('Wi-Fi');
      const result = await NetworkInfoHelper.getActiveAdapter();
      expect(result).toBe('Wi-Fi');
      expect(CommandExecutor.execute).toHaveBeenCalledTimes(1);
      expect(CommandExecutor.execute.mock.calls[0][0]).toContain('Get-NetIPConfiguration');
    });

    it('should trim whitespace from the result', async () => {
      CommandExecutor.execute.mockResolvedValue('  Ethernet  \n');
      const result = await NetworkInfoHelper.getActiveAdapter();
      expect(result).toBe('Ethernet');
    });
  });

  // ── getCurrentIp ──────────────────────────────────────────────
  describe('getCurrentIp', () => {
    it('should return the current IP for a given adapter', async () => {
      CommandExecutor.execute.mockResolvedValue('192.168.1.100');
      const result = await NetworkInfoHelper.getCurrentIp('Wi-Fi');
      expect(result).toBe('192.168.1.100');
      expect(CommandExecutor.execute.mock.calls[0][0]).toContain('Wi-Fi');
      expect(CommandExecutor.execute.mock.calls[0][0]).toContain('Get-NetIPAddress');
    });

    it('should use the active adapter if no adapter is provided', async () => {
      // First call is getActiveAdapter, second is getCurrentIp
      CommandExecutor.execute
        .mockResolvedValueOnce('Ethernet')   // getActiveAdapter
        .mockResolvedValueOnce('10.0.0.5');  // getCurrentIp
      const result = await NetworkInfoHelper.getCurrentIp();
      expect(result).toBe('10.0.0.5');
      expect(CommandExecutor.execute).toHaveBeenCalledTimes(2);
    });
  });

  // ── getSubnetPrefix ───────────────────────────────────────────
  describe('getSubnetPrefix', () => {
    it('should return the subnet prefix as an integer', async () => {
      CommandExecutor.execute.mockResolvedValue('24');
      const result = await NetworkInfoHelper.getSubnetPrefix('Wi-Fi');
      expect(result).toBe(24);
      expect(typeof result).toBe('number');
    });

    it('should use the active adapter if no adapter is provided', async () => {
      CommandExecutor.execute
        .mockResolvedValueOnce('Wi-Fi')  // getActiveAdapter
        .mockResolvedValueOnce('24');    // getSubnetPrefix
      const result = await NetworkInfoHelper.getSubnetPrefix();
      expect(result).toBe(24);
      expect(CommandExecutor.execute).toHaveBeenCalledTimes(2);
    });
  });

  // ── getGateway ────────────────────────────────────────────────
  describe('getGateway', () => {
    it('should return the default gateway', async () => {
      CommandExecutor.execute.mockResolvedValue('192.168.1.1');
      const result = await NetworkInfoHelper.getGateway('Wi-Fi');
      expect(result).toBe('192.168.1.1');
      expect(CommandExecutor.execute.mock.calls[0][0]).toContain('IPv4DefaultGateway');
    });

    it('should use the active adapter if no adapter is provided', async () => {
      CommandExecutor.execute
        .mockResolvedValueOnce('Wi-Fi')      // getActiveAdapter
        .mockResolvedValueOnce('10.0.0.1');  // getGateway
      const result = await NetworkInfoHelper.getGateway();
      expect(result).toBe('10.0.0.1');
    });
  });

  // ── getCurrentDns ─────────────────────────────────────────────
  describe('getCurrentDns', () => {
    it('should return an array of DNS server addresses', async () => {
      CommandExecutor.execute.mockResolvedValue('8.8.8.8\n8.8.4.4');
      const result = await NetworkInfoHelper.getCurrentDns('Wi-Fi');
      expect(result).toEqual(['8.8.8.8', '8.8.4.4']);
    });

    it('should handle a single DNS server', async () => {
      CommandExecutor.execute.mockResolvedValue('1.1.1.1');
      const result = await NetworkInfoHelper.getCurrentDns('Ethernet');
      expect(result).toEqual(['1.1.1.1']);
    });

    it('should filter out empty lines', async () => {
      CommandExecutor.execute.mockResolvedValue('8.8.8.8\n\n8.8.4.4\n');
      const result = await NetworkInfoHelper.getCurrentDns('Wi-Fi');
      expect(result).toEqual(['8.8.8.8', '8.8.4.4']);
    });

    it('should use the active adapter if no adapter is provided', async () => {
      CommandExecutor.execute
        .mockResolvedValueOnce('Wi-Fi')              // getActiveAdapter
        .mockResolvedValueOnce('8.8.8.8\n1.1.1.1'); // getCurrentDns
      const result = await NetworkInfoHelper.getCurrentDns();
      expect(result).toEqual(['8.8.8.8', '1.1.1.1']);
    });
  });

  // ── getStaticIpDefaults ───────────────────────────────────────
  describe('getStaticIpDefaults', () => {
    it('should return adapter, ip, prefix, and gateway', async () => {
      CommandExecutor.execute
        .mockResolvedValueOnce('Wi-Fi')       // getActiveAdapter
        .mockResolvedValueOnce('192.168.1.5') // getCurrentIp
        .mockResolvedValueOnce('24')          // getSubnetPrefix
        .mockResolvedValueOnce('192.168.1.1'); // getGateway

      const result = await NetworkInfoHelper.getStaticIpDefaults();
      expect(result).toEqual({
        adapter: 'Wi-Fi',
        ip: '192.168.1.5',
        prefix: 24,
        gateway: '192.168.1.1',
      });
    });

    it('should call getActiveAdapter once and reuse the result', async () => {
      CommandExecutor.execute
        .mockResolvedValueOnce('Ethernet')     // getActiveAdapter
        .mockResolvedValueOnce('10.0.0.5')     // getCurrentIp
        .mockResolvedValueOnce('16')           // getSubnetPrefix
        .mockResolvedValueOnce('10.0.0.1');    // getGateway

      await NetworkInfoHelper.getStaticIpDefaults();
      // First call is getActiveAdapter; the rest pass the adapter explicitly
      expect(CommandExecutor.execute).toHaveBeenCalledTimes(4);
    });
  });

  // ── getDnsDefaults ────────────────────────────────────────────
  describe('getDnsDefaults', () => {
    it('should return adapter, dns1, and dns2', async () => {
      CommandExecutor.execute
        .mockResolvedValueOnce('Wi-Fi')              // getActiveAdapter
        .mockResolvedValueOnce('8.8.8.8\n8.8.4.4'); // getCurrentDns

      const result = await NetworkInfoHelper.getDnsDefaults();
      expect(result).toEqual({
        adapter: 'Wi-Fi',
        dns1: '8.8.8.8',
        dns2: '8.8.4.4',
      });
    });

    it('should handle a single DNS server (dns2 empty)', async () => {
      CommandExecutor.execute
        .mockResolvedValueOnce('Ethernet')   // getActiveAdapter
        .mockResolvedValueOnce('1.1.1.1');   // getCurrentDns

      const result = await NetworkInfoHelper.getDnsDefaults();
      expect(result).toEqual({
        adapter: 'Ethernet',
        dns1: '1.1.1.1',
        dns2: '',
      });
    });

    it('should handle no DNS servers', async () => {
      CommandExecutor.execute
        .mockResolvedValueOnce('Wi-Fi')  // getActiveAdapter
        .mockResolvedValueOnce('');      // getCurrentDns

      const result = await NetworkInfoHelper.getDnsDefaults();
      expect(result).toEqual({
        adapter: 'Wi-Fi',
        dns1: '',
        dns2: '',
      });
    });
  });
});
