---
title: 'Simpler Camera Card'
description: 'A Home Assistant card for one Frigate camera, with frozen-stream detection, automatic reconnection, and snapshot and live viewing.'
draft: true
startedOn: '2026-08-15'
completedOn: '2026-08-28'
languages: [typescript]
tags: [home-assistant, cameras]
repositoryUrl: 'https://github.com/bishopdynamics/simpler-camera-card'
---

Simpler Camera Card is a Home Assistant dashboard card for a single Frigate camera. Its focus is the unattended display: a wall kiosk or tablet that keeps a camera view open long enough to encounter network interruptions, service restarts, and browser lifecycle changes.

A stream can fail without looking disconnected to the browser. The socket remains open and the video element reports that it is playing, but the picture has stopped updating. Detecting that condition is central to the card's design.

## Detecting a stalled picture

A watchdog follows the frames presented by the browser. If playback is expected and no new frame arrives within its ten-second window, it reports a stall. It avoids treating a paused video or hidden tab as a failed stream; where frame callbacks are unavailable, it falls back to watching playback time advance.

A separate supervisor owns recovery. It starts with quick retries, then rebuilds the player with progressively longer, randomized delays. Transient failures keep cycling through that recovery path. Each connection attempt obtains a freshly signed Home Assistant URL, so reconnecting does not depend on a stale signature.

While reconnecting, the card can show a dimmed camera snapshot and a small status indicator. It also responds to tab visibility, page restoration, and Home Assistant connection events, covering situations where a browser has suspended normal timers.

## Still images until live video is useful

Continuous video is optional. Snapshot mode periodically fetches a still image without starting the streaming player. Failed refreshes retain the last successfully decoded image, and later polls continue trying. That trades motion for a simpler display path on dashboards with many cameras or limited device resources.

With tap-to-live enabled, a tap temporarily opens the live stream and shows a countdown before returning to snapshots. A second tap returns early. Home Assistant's visual card editor exposes these settings, along with camera selection, labels, aspect ratio, and tap, hold, or double-tap actions.

## A deliberately narrow streaming path

The card is written in TypeScript with Lit and uses go2rtc through Home Assistant's Frigate integration. Live playback uses Media Source Extensions, including the ManagedMediaSource path for capable WebKit browsers. An unsupported browser gets a capability message pointing to snapshot mode.

Video is muted. The card has no recording timeline, camera carousel, or generic-camera streaming fallback. Direct WebRTC support was removed after networking problems in deployment; the current live path goes through Home Assistant's own origin.

The [public repository](https://github.com/bishopdynamics/simpler-camera-card) includes the source, installation instructions, and a prebuilt JavaScript module for Home Assistant. Its attribution document credits the streaming and recovery patterns adapted from Advanced Camera Card, go2rtc, and Frigate.
