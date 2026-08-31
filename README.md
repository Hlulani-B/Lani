# Lani

## Problem

Windows has hundreds of settings spread across Settings, Control Panel, Registry, and hidden menus. Two groups of people struggle with this.

The first group is people who are not computer literate. They know what they want, for example turning off notifications or connecting to wifi, but they do not know the path to get there, and clicking through nested menus is confusing and intimidating.

The second group is people who do know how to do these things but do not want to spend time navigating menus every time. Even a simple task like toggling dark mode or checking battery health means stopping what they are doing, opening Settings, and hunting through several screens.

Both groups end up either giving up, asking someone else for help, or searching online for instructions that are often outdated or wrong for their Windows version.

## Solution

Lani is a command line tool for Windows that lets a person type or speak what they want in plain language, and it carries out the action for them.

Instead of remembering menu paths, the user just says what they want, for example turn up the volume, turn on dark mode, or show me my wifi networks. Lani uses Ollama running locally to understand the request and match it to the correct action, then runs the matching PowerShell command behind the scenes.

This removes the need to know where a setting lives. For the computer illiterate user, it replaces confusing menus with plain conversation. For the experienced user, it replaces repetitive clicking with a single typed instruction.