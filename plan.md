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



## Design decision: frontend structure (React, three components)

Lani's frontend is split into three components, each in its own file. No
component handles more than one concern.

### File structure

components/
  OllamaSetup.jsx       (Component 1)
  CommandInput.jsx       (Component 2)
  ParameterForm.jsx      (Component 3)


### Component 1 — OllamaSetup.jsx
- On load, checks `/api/status` to see if Ollama is already installed.
- If installed: never renders, app goes straight to Component 2. This
  component is invisible to the user once Ollama is set up, it is purely
  a one-time gate.
- If not installed: calls `/api/install`, opens SSE connection to
  `/api/events`, and shows install progress as a percentage using
  useEffect to update state as events stream in.
- Transitions to Component 2 on an explicit "complete" event from the SSE
  stream, not by inferring completion from percentage reaching 100.

### Component 2 — CommandInput.jsx
- User types or speaks a request and hits send.
- Request goes to `/api/chat`, matched against the function catalogue.
- If matched with no parameters needed: executes immediately, shows result,
  stays on this component ready for the next request.
- If matched but needs parameters: hands off matched function name + param
  list (with type hints) to Component 3.

### Component 3 — ParameterForm.jsx
- Renders inputs dynamically based on the parameter list received from
  Component 2.
- User fills form and hits send: goes straight to an execute endpoint,
  then returns to Component 2 for the next request.
- Has a Cancel button: discards the pending function/params and routes
  back to Component 2 with nothing executed.
- No undo system. If a wrong action is executed by mistake, the fix is
  typing a new prompt in Component 2, not a formal undo/redo feature.

## Design decision: Electron wrapper

The whole React app (all three components) is wrapped in Electron rather
than run as a browser tab.

- Frameless window, no OS title bar or browser chrome, behaves like a popup.
- Shape: centered rectangle (not a sidebar). Chosen because Lani is one-shot
  with no conversation history, there is nothing ongoing to keep visible
  after a command executes, so a persistent docked sidebar has no benefit.
  Closer in feel to Spotlight or PowerToys Run than a docked panel.
- Exit: small x button rendered inside the React UI itself, wired via IPC
  to tell the Electron main process to close/hide the window. No reliance
  on OS window chrome for closing, since there isn't any.
