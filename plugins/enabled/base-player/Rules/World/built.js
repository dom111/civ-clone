import {Food, Production} from '../../../base-terrain-yields/Yields.js';
import AIPlayer from '../../../core-player/AIPlayer.js';
import CivilizationRegistry from '../../../core-civilization/CivilizationRegistry.js';
import Effect from '../../../core-rules/Effect.js';
import PlayerRegistry from '../../../core-player/PlayerRegistry.js';
import Rule from '../../../core-rules/Rule.js';
import Settlers from '../../../base-unit-settlers/Settlers.js';

export const getRules = ({
  civilizationRegistry = CivilizationRegistry.getInstance(),
  playerRegistry = PlayerRegistry.getInstance(),
} = {}) => [
  new Rule(
    'world:built:set-up-players',
    new Effect((map) => {
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

      engine.emit('world:generate-start-tiles');

      const numberOfPlayers = engine.option('players', 5),
        usedStartSquares = []
      ;

      let startingSquares = map.getBy((tile) => tile.isLand())
        .sort((a, b) => tileScore(b) - tileScore(a))
        .slice(0, numberOfPlayers * 20)
      ;

      engine.emit('world:start-tiles', startingSquares);

      let availableCivilizations = civilizationRegistry.entries();

      for (let i = 0; i < numberOfPlayers; i++) {
        const player = AIPlayer.get();

        player.chooseCivilization(availableCivilizations);
        availableCivilizations = availableCivilizations.filter((Civilization) => ! (player.civilization instanceof Civilization));

        startingSquares = startingSquares
          .filter((tile) => ! usedStartSquares.includes(tile))
          .filter((tile) => usedStartSquares.every((startSquare) => startSquare.distanceFrom(tile) > 4))
        ;

        const startingSquare = startingSquares[Math.floor(startingSquares.length * Math.random())];

        if (! startingSquare) {
          throw new TypeError(`base-player/Events/World/built.js: startingSquare is '${startingSquare}'.`);
        }

        usedStartSquares.push(startingSquare);

        playerRegistry.register(player);

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
    })
  ),
  new Rule(
    'world:built:event',
    new Effect((world) => engine.emit('world:built', world))
  ),
];

export default getRules;
