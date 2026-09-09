---
title: 'Wallflower'
description: 'A Linux kiosk system pairing a Chromium display agent with a Home Assistant dashboard for managing screens, configuration, and updates.'
draft: true
languages: [c, python, typescript, rust, shell, javascript]
tags: [home-assistant, kiosks, desktop]
---

Wallflower turns Linux devices into centrally managed browser displays. Each kiosk runs Chromium under a custom compositor, while Wallflower Manager brings the devices together in a Home Assistant add-on. It addresses the work around keeping a dashboard on a screen: starting the browser, configuring the display, recovering from a crash, and reaching the device when something goes wrong.

The system is designed around ARM64 and x86-64 Linux devices, with Debian packaging and a separate Raspberry Pi image build. The displayed page can be a Home Assistant dashboard or another web page; the management tools live alongside that content.

## A browser with its own display manager

The device-side core is **wfcomp**, an X11 compositor written in C. It launches Chromium, manages its lifecycle, and can restart it after a crash with a delay between attempts. On supported graphics hardware, it handles splash rendering and animated transitions. Display controls include rotation and software or hardware brightness, depending on the device.

There is also a software fallback for systems without usable GPU acceleration. That keeps the browser available but gives up compositor effects such as transitions. It is a practical distinction for a project spanning small embedded devices and conventional PCs: the visual experience depends on the graphics path available.

## Managing screens from Home Assistant

Wallflower Manager discovers agents on the local network and presents them for adoption. Once adopted, a kiosk has a place in the dashboard with status information, a live thumbnail, configuration controls, and update management. Remote VNC access, browser console logs, and Chromium debugging tools help investigate a screen without standing in front of it.

The Manager uses a Python backend and a Svelte interface written in TypeScript. Its MQTT integration exposes kiosk sensors and controls to Home Assistant. One useful distinction is between the configured startup page and the browser's current page: an automation can navigate a kiosk temporarily, while a reboot returns it to its saved startup URL.

## Handling the rest of the device

Wallflower also includes the pieces needed before the browser appears. A Rust program draws the early boot splash, and a Python setup service coordinates network detection, Wi-Fi provisioning through a captive portal, and the handoff to the display agent. A separate updater downloads and installs the agent's Debian package and checks the installed version.

This remains a project under development. The tracked backlog includes idle dimming and timeout behavior, along with packaging and browser-control issues. The implemented system brings display control, remote inspection, provisioning, and Home Assistant integration into one project, while those remaining device-management details continue to need attention.
