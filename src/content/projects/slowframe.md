---
title: 'Slowframe'
description: 'A Home Assistant add-on that renders dashboards into periodically refreshed images for e-ink panels, older tablets, and simple displays.'
draft: true
startedOn: '2026-08-03'
completedOn: '2026-08-04'
languages: [python, javascript, html, css]
tags: [home-assistant, dashboards]
---

Slowframe lets a simple display show a Home Assistant dashboard without running the dashboard itself. A headless Chromium browser renders the page on the Home Assistant host, and the display fetches the finished image. The intended clients include e-ink panels, older tablets, and digital picture frames with limited browser capabilities.

That moves the work of loading and drawing a modern web interface onto the host. The display needs to handle an image in a supported format, while Slowframe takes care of producing new captures on a schedule. The result is a periodically refreshed view rather than an interactive dashboard.

## One frame, one image URL

A frame is a saved capture target with its own image URL. Its settings select a dashboard and view, output dimensions, zoom, and capture interval. A settle-time option leaves extra time for graphs or camera stills to finish drawing before the screenshot is taken.

Frames are managed through a web interface behind Home Assistant Ingress. It provides previews, capture status, errors, and a manual capture button. Definitions are stored in SQLite so they persist across restarts and updates. Theme selection and URL query parameters let a frame use the dashboard's existing presentation options, including parameters understood by kiosk-mode setups.

## Preparing an image for the panel

The capture pipeline can rotate the image, convert it to greyscale, reduce its color levels, and apply dithering. Floyd–Steinberg and Atkinson dithering provide options for representing gradients on displays with very few shades. Output can be PNG, JPEG, or BMP, allowing the chosen format to match the display's decoder.

The backend is Python with FastAPI, Playwright, and Pillow. It reuses one Chromium process and captures one page at a time, keeping simultaneous frame schedules from opening a batch of competing renders.

Rendering and serving are separate. Clients receive a completed cached file while new captures happen in the background. If a later capture fails, the last successful image remains available and the management interface reports the error. An unwatched frame pauses its recurring captures; the next fetch returns the cache and wakes the capture loop.

## Keeping the client requirements small

The image server deliberately uses plain HTTP without authentication or TLS. That accommodates older clients, but it also means anyone who can reach that server can fetch its images. Slowframe is intended for a trusted local network, with dashboard content chosen for that access model. The configuration interface remains behind Home Assistant's login.

Capturing authenticated dashboards requires a Home Assistant user token, and the add-on targets 64-bit x86 and ARM hosts. The display receives a rendered snapshot: touch controls, live interaction, and continuous video remain the dashboard's job on a capable browser.
