---
title: 'Mezuril'
description: 'A Linux panel and macOS menu-bar indicator for Claude and Codex usage, reset times, and recent consumption rates.'
draft: true
startedOn: '2026-09-01'
completedOn: '2026-09-02'
languages: [python]
tags: [desktop, developer-tools]
---

Mezuril keeps Claude and Codex usage visible in the desktop panel or menu bar. Its purpose is practical: seeing how much allowance remains, and when it resets, can help decide which work to start next. Each service gets its own indicator, with compact percentages beside an icon and a fuller breakdown one click away.

The application reads usage information through the existing Claude Code and Codex sign-ins. It handles the usage windows reported by each service, including Claude's session and weekly windows and Codex's primary and optional secondary window. The display keeps those windows separate, since reaching one limit and reaching another can mean different things for the next task.

A ring around each icon shows the selected window's percentage. By default, it follows the most-used active window; preferences can pin it to a particular one. Linux uses color to distinguish normal usage, warning levels, and an exhausted allowance. On macOS, monochrome icons follow the menu bar's appearance, while numbers, menus, and notifications communicate the remaining detail.

Clicking an indicator shows usage, reset times, and when the information was last updated. Desktop notifications mark configured thresholds and limits, with repeated polls suppressed from announcing the same crossing again during a reset period. Preferences let each usage window have its own display fields and notification choices. Saving applies those changes to the running application.

Recent history adds another way to interpret the numbers. Mezuril calculates a consumption rate from samples within the same reset period, then estimates whether that rate would exhaust the allowance before the next reset. It waits for at least two samples spanning ten minutes before showing a rate. The estimate reflects recent activity, so a change in workload can change the outlook.

The app also distinguishes an old reading from a fresh one. If a refresh fails, it retains the last known values and marks them stale; an empty reading has a separate unavailable state. Requests run away from the interface thread, and repeated failures increase the wait before retrying. This keeps a temporary connection problem visible without replacing useful context with a misleading zero.

Mezuril is written in Python with shared data, formatting, history, and alert logic. GTK and XApp provide the Linux Mint Cinnamon interface; rumps and PyObjC provide the macOS interface. Matching preferences on both platforms completed the initial cross-platform version, accepted on September 2, 2026. The supported desktop targets are Linux Mint Cinnamon and Apple Silicon macOS; the readings depend on the services' reported usage and an available sign-in.
