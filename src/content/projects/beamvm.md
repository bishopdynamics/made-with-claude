---
title: 'BeamVM'
description: 'A game about making games for a virtual machine and vector CRT, balancing drawing time against game logic.'
draft: true
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
