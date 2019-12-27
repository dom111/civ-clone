# civ-clone

Open source, plugin-driven, 4x games, written in JavaScript (node).

Every component of the game is defined by 'plugins' so the core part of the game itself is just a mechanism for plugin
management and dependency loading.

## Aims

The aims for this project are to:

- build a working clone of the original Civilization.
- make the engine extensible enough that concepts from any Civilization game can be written and included.
- make the engine decoupled from a renderer so that it's possible to run a headless, AI-driven game, as well as a single
  or multi-player game driven via either a rich GUI or even command-line.
- allow third-party contributed plugins to augment the game.

## Set-up

Clone the repository, run:

```sh
yarn install # or npm install
yarn start # or npm start
```

## Contributing

The contribute to the project, fork the repo, create a branch and make your changes. Once you are happy with them,
ensure that `yarn lint # or npm run lint` returns successfully and open a PR!
