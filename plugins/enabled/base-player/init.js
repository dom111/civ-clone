import {Food, Production} from '../base-yields/Yields.js';
import AIPlayer from '../core-player/AIPlayer.js';
import Civilization from '../core-civilization/Civilization.js';
import {Land} from '../core-terrain/Types.js';
import Rules from '../core-rules/Rules.js';
import {Settlers} from '../base-unit/Units.js';

const players = [],
  playersToAction = []
;

let currentPlayer;

engine.on('world:built', (map) => {
  engine.emit('world:generate-start-tiles');

  const numberOfPlayers = engine.option('players', 5),
    // TODO: this is expensive in CPU time - optimise
    // TODO: also getBy(() => true) is a hack...
    usedStartSquares = []
  ;

  let startingSquares = map.getBy((tile) => tile.terrain instanceof Land)
    .sort((a, b) =>
      b.getSurroundingArea().score([[Food, 4], [Production, 2]]) -
        a.getSurroundingArea().score([[Food, 4], [Production, 2]])
    )
    .slice(0, numberOfPlayers * 20)
  ;

  engine.emit('world:start-tiles', startingSquares);

  let availableCivilizations = Civilization.civilizations;

  for (let i = 0; i < numberOfPlayers; i++) {
    const player = AIPlayer.get();

    player.chooseCivilization(availableCivilizations);
    availableCivilizations = availableCivilizations.filter((civilization) => ! (player.civilization instanceof civilization));

    startingSquares = startingSquares
      .filter((tile) => ! usedStartSquares.includes(tile))
      .filter((tile) => usedStartSquares.every((startSquare) => startSquare.distanceFrom(tile) > 10))
    ;

    const startingSquare = startingSquares[Math.floor(startingSquares.length * Math.random())];

    if (! startingSquare) {
      throw new TypeError(`base-player/init.js: startingSquare is '${startingSquare}'.`);
    }

    usedStartSquares.push(startingSquare);

    players.push(player);

    new Settlers({
      player,
      tile: startingSquare,
    });
  }
});

engine.on('turn:start', () => {
  playersToAction.push(...players);
  currentPlayer = playersToAction.shift();

  players.forEach((player) => {
    player.units.forEach((unit) => {
      if (unit.busy > 0) {
        unit.busy--;

        if (unit.busy === 0) {
          if (unit.actionOnComplete) {
            unit.actionOnComplete();
          }
        }
      }

      if (! unit.busy) {
        unit.busy = false;
        unit.active = true;
        unit.movesLeft = unit.movement;
      }
    });

    player.cities.forEach((city) => {
      city.yields()
        .forEach((cityYield) => {
          Rules.get('city:cost')
            .filter((rule) => rule.validate(cityYield, city))
            .forEach((rule) => rule.process(cityYield, city))
          ;

          if (cityYield instanceof Food) {
            city.foodStorage += cityYield.value;

            if (
              city.foodStorage >= ((city.size * 10) + 10)
              // Rules.get('city:grow')
              //   .some((rule) => rule.validate(city))
            ) {
              engine.emit('city:grow', city);
            }

            if (
              city.foodStorage < 0
              // Rules.get('city:shrink')
              //   .some((rule) => rule.validate(city))
            ) {
              engine.emit('city:shrink', city);
            }
          }

          if (cityYield instanceof Production) {
            if (city.building) {
              const production = cityYield.value;

              if (production > 0) {
                city.buildProgress += production;

                if (city.buildProgress >= city.buildCost) {
                  engine.emit('city:building-complete', city, new (city.building)({
                    player,
                    city,
                    tile: city.tile,
                  }));

                  city.building = false;
                  city.buildProgress = 0;
                }
              }
            }
          }
        })
      ;
    });
  });

  engine.emit('player:turn-start', currentPlayer);
});

engine.on('player:turn-end', async () => {
  if (playersToAction.length) {
    currentPlayer = playersToAction.shift();
    engine.emit('player:turn-start', currentPlayer);
  }
  else {
    engine.emit('turn:end');
  }
});

engine.on('player:turn-start', async (player) => {
  await player.takeTurn();

  engine.emit('player:turn-end', player);
});

engine.on('player:visibility-changed', (player) => {
  // clear the visibility
  player.visibleTiles.splice(0, player.visibleTiles.length);
});

engine.on('tile:improvement-built', (tile, improvement) => {
  if (! tile.improvements.some((existingImprovement) => existingImprovement instanceof improvement.constructor)) {
    tile.improvements.push(improvement);
  }
});

engine.on('tile:improvement-pillaged', (tile, improvement) => {
  if (tile.improvements.includes(improvement)) {
    tile.improvements = tile.improvements.filter((existingImprovement) => existingImprovement !== improvement);
  }
});

