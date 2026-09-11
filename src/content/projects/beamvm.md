---
title: 'BeamVM'
description: 'A game about making games for a virtual machine and vector CRT, balancing drawing time against game logic.'
draft: false
publishedOn: '2026-09-11'
startedOn: '2026-08-25'
completedOn: '2026-09-08'
languages: [rust, beamvm-dsl, wgsl]
tags: [games, graphics, developer-tools, public]
repositoryUrl: 'https://github.com/bishopdynamics/BeamVM'
images:
  - id: rockfield
    src: '../../assets/projects/beamvm/program_rockfield.png'
    alt: 'BeamVM showing green vector rocks and a ship beside source code, timing meters, and a cycle-budget strip.'
    caption: 'Rockfield on the original machine, with its source and cycle-budget tools.'
  - id: rockfield-dim
    src: '../../assets/projects/beamvm/program_rockfield_dim.png'
    alt: 'BeamVM showing the Rockfield repair exercise beside its problem brief and timing meters.'
    caption: 'A Rockfield repair exercise, with the problem brief and timing tools.'
  - id: time-travel
    src: '../../assets/projects/beamvm/debugger_timetravel.png'
    alt: 'BeamVM showing a past Splitstorm state with Replay and Branch controls, source code, and machine-state inspection.'
    caption: 'Scrubbing back through execution to inspect an earlier machine state.'
  - id: shell
    src: '../../assets/projects/beamvm/program_shell.png'
    alt: "BeamVM's green CRT shell listing programs in its virtual examples directory beside the shell brief."
    caption: "The shell listing programs inside BeamVM's virtual filesystem."
  - id: pro-coprocessor
    src: '../../assets/projects/beamvm/debugger_avg.png'
    alt: "BeamVM Pro displaying a vector sign alongside the graphics coprocessor's active display list and separate budget meters."
    caption: "Inspecting the Pro graphics coprocessor's display list."
  - id: doom
    src: '../../assets/projects/beamvm/doom_play.png'
    alt: "Vector outlines from DOOM's hangar with its HUD, program brief, and separate CPU and graphics budget meters."
    caption: "DOOM's first shareware map rendered as vectors on the Pro machine."
coverId: rockfield
---

I wanted to make a video game built around a virtual machine, and the idea that appealed to me was a game about making games under specific restrictions.

The display was part of the attraction. CRTs are fascinating pieces of technology, and vector displays give them a character that I wanted to explore. BeamVM became a fictional machine whose programming language lets you write games while sharing a limited amount of time between drawing on the CRT and running game logic.

## Sharing time with the beam

On the original machine, drawing and logic compete for the same budget. Time spent tracing the display is time that cannot be spent updating the game. Working within that constraint is the game: deciding what to draw, how often to draw it, and how much computation the program can afford.

BeamVM's integrated editor and time-travel debugger let you inspect that process, step through a program, and return to an earlier point in its execution.

## Learning by fixing games

To make it easier to get started, we created a series of small games with specific problems to solve. They give you something concrete to investigate and repair while learning how the machine works. They also gave us useful cases for testing BeamVM itself.

Then the scope grew. A launcher made the programs easier to reach, followed by a minimal Unix-like shell. The fictional machine was becoming a place to run and work on programs, as well as a set of programming challenges.

## But can it run DOOM?

Eventually I asked the inevitable question. The answer, at first, was no.

So I dreamed up a **Pro** version of the fictional hardware. It added a graphics coprocessor of sorts: the main CPU could dispatch draw commands and let them run asynchronously while it continued with the program's logic.

That made a different approach possible. We stripped the first two shareware maps down to the data we needed and preprocessed the sprites into outlines the display could render. The result is a playable game derived from DOOM's original content, with significant compromises to fit BeamVM's machine and display.

The tested scope is **the first two shareware maps**. In theory, the conversion pipeline could handle the full DOOM and DOOM II campaigns, but I have not tested it beyond those two maps.

What began as a constrained game-making environment had grown a launcher, a shell, and a more capable hardware model in pursuit of that one extra challenge.
