# civ-clone

Open source, plugin-driven, Civilization clone, written in JavaScript (`node`).

## Aims

The aims for this project are to:

- build a working clone of the original Civilization.
- make the engine extensible enough that concepts from any Civilization game can be written and included.
- make the engine decoupled from a renderer so that it's possible to run a headless, AI-driven game, as well as a single
  or multi-player game driven via either a rich GUI or even command-line.
- allow third-party contributed plugins to augment the game.

## Current State

Currently the game is unplayable by a human player, but I'm working on making a simple decision-based AI that is helping
me check the current state of the rules and mechanics.

The world generation is pretty rudimentary, but should be very easy to replace with something else in the future.

In `base-player/init.js` there's currently a crude ASCII map output that shows the state of play every 50 turns so you
can observe progress.

## Set up

```sh
yarn install
```

## Running

```sh
yarn start
```

## Core Concepts

### Plugins

The entirety of the logic is provided as plugins, some are `core` or `base` which are the primary components of the game
itself and would need a suitable replacement to be removed, but should be possible to augment as required.

Plugins are executed in a separate environment to help segregate external scripts from gaining access to your files
without your say, but this system could do with a bit more work. Currently the `Engine` instance is shared with the
plugins, but it might be better to just expose a dummy object that only provides the event system.

The plugin resolution allows for simple dependencies but there are some issues that need to be ironed out (cyclic
dependencies, failed initialisation, etc).

### Rules

I'm currently going through the process for replacing all hard-coded logic with a more flexible `Rule`-based system
which, in theory, should allow for any and all concepts used within the game to be replaced or added to to allow a wide
variety of modification and customisation. The aim is that plugin packs could provide an experience similar to any of
the game versions in the Civilization series without too much work.

## TODO

Loads! See [`TODO.md`](./TODO.md) for the bigger ideas that are outstanding as well as looking for `// TODO` in the
codebase.

## Contributing

The contribute to the project, fork the repo, create a branch and make your changes. Once you are happy with them,
ensure that `yarn lint # or npm run lint` returns successfully and open a PR!
