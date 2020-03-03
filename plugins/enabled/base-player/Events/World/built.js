import {Food, Production} from '../../../base-terrain-yields/Yields.js';
import AIPlayer from '../../../core-player/AIPlayer.js';
import CivilizationRegistry from '../../../core-civilization/CivilizationRegistry.js';
import {Land} from '../../../core-terrain/Types.js';
import PlayerRegistry from '../../PlayerRegistry.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import {Settlers} from '../../../base-unit/Units.js';

const cache = new Map(),
  tileScore = (tile) => {
    if (! cache.has(tile)) {
      cache.set(tile, tile.getSurroundingArea()
        .score({
          values: [[Food, 4], [Production, 2]],
        })
      );
    }

    return cache.get(tile);
  }
;

engine.on('world:built', (map) => {
  engine.emit('world:generate-start-tiles');

  const numberOfPlayers = engine.option('players', 5),
    usedStartSquares = []
  ;

  let startingSquares = map.getBy((tile) => tile.terrain instanceof Land)
    .sort((a, b) => tileScore(b) - tileScore(a))
    .slice(0, numberOfPlayers * 20)
  ;

  engine.emit('world:start-tiles', startingSquares);

  let availableCivilizations = CivilizationRegistry.entries();

  for (let i = 0; i < numberOfPlayers; i++) {
    const player = AIPlayer.get();

    RulesRegistry.get('player:added')
      .filter((rule) => rule.validate(player))
      .forEach((rule) => rule.process(player))
    ;

    player.chooseCivilization(availableCivilizations);
    availableCivilizations = availableCivilizations.filter((Civilization) => ! (player.civilization instanceof Civilization));

    startingSquares = startingSquares
      .filter((tile) => ! usedStartSquares.includes(tile))
      .filter((tile) => usedStartSquares.every((startSquare) => startSquare.distanceFrom(tile) > 10))
    ;

    const startingSquare = startingSquares[Math.floor(startingSquares.length * Math.random())];

    if (! startingSquare) {
      throw new TypeError(`base-player/Events/World/built.js: startingSquare is '${startingSquare}'.`);
    }

    usedStartSquares.push(startingSquare);

    PlayerRegistry.register(player);

    new Settlers({
      player,
      tile: startingSquare,
    });

    // ensure surrounding tiles are visible
    startingSquare.getSurroundingArea()
      .forEach((tile) => engine.emit('tile:seen', tile, player))
    ;
  }

  engine.emit('game:start');
});
