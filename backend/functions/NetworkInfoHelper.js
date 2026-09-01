// NetworkInfoHelper.js
// Auto-detects network parameters the user should never have to type manually:
// active adapter name, current IP, subnet prefix, gateway, and current DNS servers.
// These feed into staticIpSet, dnsSet, and dnsResetDhcp so the popup form only
// asks for what the user actually needs to decide (e.g. the new static IP),
// not values the system already knows.

import CommandExecutor from './CommandExecutor.js';

/**
 * Returns the name of the currently active network adapter
 * (the one with a default gateway set, i.e. actually connected).
 * e.g. "Wi-Fi" or "Ethernet"
 */
async function getActiveAdapter() {
  const cmd = `Get-NetIPConfiguration | Where-Object { $_.IPv4DefaultGateway } | Select-Object -First 1 -ExpandProperty InterfaceAlias`;
  const result = await CommandExecutor.execute(cmd);
  return result.trim();
}

/**
 * Returns the current IPv4 address for a given adapter.
 * If no adapter name is passed, uses the active adapter.
 */
async function getCurrentIp(adapter) {
  const targetAdapter = adapter || await getActiveAdapter();
  const cmd = `Get-NetIPAddress -InterfaceAlias "${targetAdapter}" -AddressFamily IPv4 | Select-Object -First 1 -ExpandProperty IPAddress`;
  const result = await CommandExecutor.execute(cmd);
  return result.trim();
}

/**
 * Returns the subnet prefix length (e.g. 24 for a /24) for a given adapter.
 * If no adapter name is passed, uses the active adapter.
 */
async function getSubnetPrefix(adapter) {
  const targetAdapter = adapter || await getActiveAdapter();
  const cmd = `Get-NetIPAddress -InterfaceAlias "${targetAdapter}" -AddressFamily IPv4 | Select-Object -First 1 -ExpandProperty PrefixLength`;
  const result = await CommandExecutor.execute(cmd);
  return parseInt(result.trim(), 10);
}

/**
 * Returns the default gateway for a given adapter.
 * If no adapter name is passed, uses the active adapter.
 */
async function getGateway(adapter) {
  const targetAdapter = adapter || await getActiveAdapter();
  const cmd = `Get-NetIPConfiguration -InterfaceAlias "${targetAdapter}" | Select-Object -ExpandProperty IPv4DefaultGateway | Select-Object -ExpandProperty NextHop`;
  const result = await CommandExecutor.execute(cmd);
  return result.trim();
}

/**
 * Returns the current DNS servers configured on a given adapter, as an array.
 * If no adapter name is passed, uses the active adapter.
 * Array may have 1 or 2 entries (dns1, dns2).
 */
async function getCurrentDns(adapter) {
  const targetAdapter = adapter || await getActiveAdapter();
  const cmd = `Get-DnsClientServerAddress -InterfaceAlias "${targetAdapter}" -AddressFamily IPv4 | Select-Object -ExpandProperty ServerAddresses`;
  const result = await CommandExecutor.execute(cmd);
  return result
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

/**
 * Convenience function that gathers everything needed to pre-fill
 * the staticIpSet form in one call: adapter, current ip, prefix, gateway.
 * The user only needs to supply the NEW ip they want (and optionally
 * a new prefix/gateway if they want to override the detected ones).
 */
async function getStaticIpDefaults() {
  const adapter = await getActiveAdapter();
  const [ip, prefix, gateway] = await Promise.all([
    getCurrentIp(adapter),
    getSubnetPrefix(adapter),
    getGateway(adapter),
  ]);
  return { adapter, ip, prefix, gateway };
}

/**
 * Convenience function that gathers everything needed to pre-fill
 * the dnsSet / dnsResetDhcp forms: adapter and current dns servers.
 * The user only needs to supply new dns1 (and optionally dns2) if
 * they're changing DNS, or nothing at all if resetting to DHCP.
 */
async function getDnsDefaults() {
  const adapter = await getActiveAdapter();
  const dnsServers = await getCurrentDns(adapter);
  return {
    adapter,
    dns1: dnsServers[0] || '',
    dns2: dnsServers[1] || '',
  };
}

export default {
  getActiveAdapter,
  getCurrentIp,
  getSubnetPrefix,
  getGateway,
  getCurrentDns,
  getStaticIpDefaults,
  getDnsDefaults,
};