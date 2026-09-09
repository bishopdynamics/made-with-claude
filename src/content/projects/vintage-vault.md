---
title: 'Vintage Vault'
description: 'A self-hosted game library that seals configured games into versioned bottles for Linux desktops and Steam Deck.'
draft: true
languages: [go, javascript, css]
tags: [games, compatibility, self-hosted]
images:
  - id: library
    src: '../../assets/projects/vintage-vault/library.jpg'
    alt: 'Vintage Vault displaying a grid of game covers with installed, draft, and local-version states.'
    caption: 'The library brings installed games and local drafts into a cover-art grid.'
  - id: create
    src: '../../assets/projects/vintage-vault/create.jpg'
    alt: 'The Vintage Vault creation wizard showing Liero metadata, runtime setup steps, and artwork slots.'
    caption: 'Preparing a bottle begins with game details, artwork, and a runtime choice.'
  - id: tasks
    src: '../../assets/projects/vintage-vault/tasks.jpg'
    alt: 'Vintage Vault sealing a game into its local store, with a progress graph and other jobs queued below.'
    caption: 'Sealing and transfers run through a task queue with visible progress and history.'
coverId: library
---

Vintage Vault is a personal game library for Linux desktops and Steam Deck. A library server holds the collection, while a desktop client prepares games, installs them, and launches them. Its central unit is a **bottle**: a configured game environment with launch instructions, metadata, and a recorded version of its contents.

The project grew out of a bottle idea deferred from Vintage, its sibling Wine integration tool. Vintage uses a shared Wine environment; Vintage Vault gives each Windows game its own environment and pins the Proton build used to run it. That makes a working setup something the library can preserve and distribute across devices, without rebuilding each installation by hand.

A bottle starts as an editable workspace. The creation wizard can prepare a fresh environment or import an existing prefix, look up game information and artwork, and help select launchers. Once the installation is ready, sealing records its contents in a content-addressed store. The runtime is stored separately and shared by bottles that reference it.

During play, the sealed files form a read-only base. A writable overlay holds local changes such as saves, configuration, and tweaks. This separation lets the client replace or repair the base while retaining the player's local state. Updates reuse chunks from the existing installation and fetch the missing content; validation compares the installed base with its sealed index and can repair damage from the local store or server.

The storage design follows the constraints of Steam Deck. Bottle contents remain directory trees, joined with a writable layer using fuse-overlayfs. This avoids depending on root-mounted disk images, while casefold support supplies the case-insensitive filenames Windows software expects. The Flatpak client coordinates host-side mounting and game launch so Proton can see the same files as the interface.

The client combines Go, Wails, and a Svelte interface; the server keeps its catalog in SQLite. A cover-art library leads into game details and tools, with queued operations showing progress and history. Desktop and fullscreen presentation share the interface. Editing depends on a server write key and the Manager experience, so the same application can act as a simple launcher or expose authoring tools.

Current Windows-game support uses Proton through umu-launcher. Plain Wine prefixes can be imported, but plain Wine is no longer a supported launch backend. Native Linux games have a separate direct-launch path. Pinning a runtime preserves a specific configuration; it does not establish compatibility with every game or machine. Vintage Vault remains an actively developed personal library system, with Linux and Steam Deck as its targets.
