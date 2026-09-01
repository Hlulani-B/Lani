Yes, quite a few. Scanning through the catalogue, these need user-supplied parameters:

```
VolumeAction.volumeSet(level)
BrightnessAction.brightnessSet(level)
WifiAction.wifiShowPassword(ssid)
ThemeAction.wallpaperSet(path)
RegionInputAction.setTimezone(timezone)
VpnProxyAction.vpnConnect(vpnName, user, password)
VpnProxyAction.vpnDisconnect(vpnName)
UserAccountsAction.addLocalUser(username, password)
UserAccountsAction.removeLocalUser(username)
UserAccountsAction.makeUserAdmin(username)
UserAccountsAction.disableUserAccount(username)
PowerUserAction.windowsFeaturesEnable(feature)
PowerUserAction.windowsFeaturesDisable(feature)
PowerUserAction.envVariableSetUser(name, value)
PowerUserAction.envVariableSetSystem(name, value)
PowerUserAction.staticIpSet(adapter, ip, prefix, gateway)
PowerUserAction.dnsSet(adapter, dns1, dns2)
PowerUserAction.dnsResetDhcp(adapter)
```

That's 18 functions needing anywhere from 1 to 4 params each. Since your no-conversation design has the form pop up dynamically, you'll need each param to carry a type hint (text, number, path) so the frontend knows what kind of input to render, plus some of these overlap with your destructive/sensitive action list from earlier (addLocalUser, removeLocalUser, makeUserAdmin, disableUserAccount, staticIpSet), so those probably want a confirm step even after the form is filled, not just execute on submit.

Here's the updated plan.md addition:

```markdown
## Design decision: no conversation flow

Lani will not have a conversational back-and-forth. It's one-shot: the user
types or speaks a request, Ollama matches it to a function, and if that
function needs parameters, a form pops up for the user to fill in. They hit
send and it executes. No session state, no conversation history, no pending
action storage needed.

Ollama receives the full ListForOllama.js catalogue alongside the user's
message in index.js, so it always has the complete function list to match
against, not just a keyword search.

### Functions requiring user-supplied parameters

- VolumeAction.volumeSet(level)
- BrightnessAction.brightnessSet(level)
- WifiAction.wifiShowPassword(ssid)
- ThemeAction.wallpaperSet(path)
- RegionInputAction.setTimezone(timezone)
- VpnProxyAction.vpnConnect(vpnName, user, password)
- VpnProxyAction.vpnDisconnect(vpnName)
- UserAccountsAction.addLocalUser(username, password)
- UserAccountsAction.removeLocalUser(username)
- UserAccountsAction.makeUserAdmin(username)
- UserAccountsAction.disableUserAccount(username)
- PowerUserAction.windowsFeaturesEnable(feature)
- PowerUserAction.windowsFeaturesDisable(feature)
- PowerUserAction.envVariableSetUser(name, value)
- PowerUserAction.envVariableSetSystem(name, value)
- PowerUserAction.staticIpSet(adapter, ip, prefix, gateway)
- PowerUserAction.dnsSet(adapter, dns1, dns2)
- PowerUserAction.dnsResetDhcp(adapter)

Each of these needs a type hint per param (text, number, path) added to the
catalogue so the frontend can render the right input in the popup form.
```