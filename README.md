# civ-clone


# This is no-longer under development, please sees the @civ-clone organisation where work is continuing.

This monorepo is to be archived in favour of the new approach, being package-based and intermitently developed.

The closest package to this is probably [civ-clone/electron-renderer] which has some prerequisites.

[civ-clone/electron-renderer]: https://github.com/civ-clone/electron-renderer

---

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

In the `ascii-renderer` plugin there's currently a crude ASCII map output that shows the state of play every turn so you
can observe progress.

## Running

```sh
yarn start
#  or:
# yarn start:fit
#  will fill the available terminal space
# --renderTurns=n
#  will update the renderer every x turns, setting to 0 disables the renderer and produces text based output instead
# --reportTurns=n 
#  will print out a status report of all civilizations in game
# --players=n
#  will add n players to the game
```

## Core Concepts

### Plugins

The entirety of the logic is provided as plugins, some are `core` or `base` which are the primary components of the game
itself and would need a suitable replacement to be removed, but should be possible to augment as required.

Plugins are executed in a separate environment to help segregate external scripts from gaining access to your files
without your say, but this system could do with a bit more work. Currently the `Engine` instance is shared with the
plugins, but it might be better to just expose a dummy object that only provides the event system.

The plugin resolution allows for simple dependencies and most major bugs have been worked out.

### Rules

I'm currently going through the process for replacing all hard-coded logic with a more flexible `Rule`-based system
which, in theory, should allow for any and all concepts used within the game to be replaced or added to to allow a wide
variety of modification and customisation. The aim is that plugin packs could provide an experience similar to any of
the game versions in the Civilization series without too much work.

## TODO

Loads! See [`TODO`](TODO.md) for the bigger ideas that are outstanding as well as looking for `// TODO` in the
codebase.

## Contributing

Please run:

```sh
yarn install # or npm install
```

to add the dev dependencies to help make your life easier.

The contribute to the project, fork the repo, create a branch and make your changes. Once you are happy with them,
ensure that `yarn lint # or npm run lint` and `yarn test # or npm run test` return successfully and open a PR!
