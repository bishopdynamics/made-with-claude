---
title: 'FantasyBoy'
description: 'A Python fantasy console with a 6502-inspired CPU, a C-subset compiler, a debugging emulator, and three example games.'
draft: false
publishedOn: '2026-09-09'
startedOn: '2026-02-03'
completedOn: '2026-02-05'
languages: [python, c]
tags: [games, emulation, developer-tools, public]
repositoryUrl: 'https://github.com/bishopdynamics/FantasyBoy'
images:
  - id: keen
    src: '../../assets/projects/fantasyboy/keen.png'
    alt: 'FantasyBoy showing the Keen platformer beside CPU registers, disassembly, memory buffers, and sprite previews.'
    caption: 'Keen, the scrolling platformer, alongside the emulator’s debugging tools.'
  - id: tetris
    src: '../../assets/projects/fantasyboy/tetris.png'
    alt: 'FantasyBoy showing a Tetris board and next piece beside registers, bytecode, memory, and sprite panels.'
    caption: 'Tetris provides a familiar game to inspect on the fictional machine.'
  - id: breakout
    src: '../../assets/projects/fantasyboy/breakout.png'
    alt: 'FantasyBoy showing Breakout with colored bricks and a paddle beside its CPU, memory, disassembly, and sprite panels.'
    caption: 'Breakout, one of the example games used to exercise the console.'
coverId: keen
---

FantasyBoy was my first project with Claude. I was still trying to work out whether AI coding tools could produce something substantial, and a small CPU emulator seemed like an interesting way to find out.

I did the original work roughly February 3–5, 2026.

I wanted to build an emulator for a simple processor. The 6502 appealed to me, and I liked the idea of an invented console inspired by the Game Boy. That became FantasyBoy: a fictional machine with a 6502-style CPU, its own graphics and instruction set, a debugging emulator, and games to exercise it.

## A console with its tools exposed

The emulator is written in Python. Its display is 256×200 pixels with RGB332 color, and it has a sprite system for the games to use. Beside the game display, the debugging interface exposes registers, flags, stack and memory views, instruction history, disassembled bytecode, and sprite previews.

You can pause execution, step through instructions, and set breakpoints. The working and display buffers are visible too, so the interface shows both the game and the machine producing it.

## A compiler and games to test it

FantasyBoy includes a small C-subset compiler that produces ROMs for the fictional CPU. Compile-time functions can generate graphics data and embed it directly in the ROM, giving the games a way to bring their assets along with their code.

I asked Claude to create example games so there would be something concrete to test and validate against. The project includes Breakout, a scrolling platformer called Keen, and Tetris. Together, they exercise the compiler, CPU, graphics, sprites, and input through playable programs.

## Learning how to work with Claude

I remember doing the original work mainly with Sonnet. There may have been some Opus involvement, but I am not certain. At the time, I was still learning which models were available, what they were good at, and how to approach a project with an LLM. I had not yet developed a process for managing context and memory.

The result changed how I thought about these tools. What started as a way to evaluate them became a complete small console project: an emulator, compiler, debugging interface, and games built through iterative work with Claude.

## Returning to an older project

The much later commits tell a different part of the story. I asked Fable and Astra to review the existing project and moved it into my current project-process template. That review and housekeeping happened after the original implementation; they should not be mistaken for the period when FantasyBoy was first built.

The [public repository](https://github.com/bishopdynamics/FantasyBoy) contains the source, example games, and instructions for compiling and running them.
