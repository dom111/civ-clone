import {Food, Production} from '../base-yields/Yields.js';
import AIPlayer from '../core-player/AIPlayer.js';
import CivilizationRegistry from '../core-civilization/CivilizationRegistry.js';
import {Land} from '../core-terrain/Types.js';
import RulesRegistry from '../core-rules/RulesRegistry.js';
import {Science} from '../base-science/Yields/Science.js';
import {Settlers} from '../base-unit/Units.js';
import {Trade} from '../base-yield-trade/Yields/Trade.js';

const players = [],
  playersToAction = []
;

let currentPlayer;

engine.on('world:built', (map) => {
  engine.emit('world:generate-start-tiles');

  const numberOfPlayers = engine.option('players', 5),
    usedStartSquares = []
  ;

  // TODO: this is expensive in CPU time - optimise?
  let startingSquares = engine.option('skipSort') ?
    map.getBy((tile) => tile.terrain instanceof Land) :
    map.getBy((tile) => tile.terrain instanceof Land)
      .sort((a, b) =>
        b.getSurroundingArea().score({
          values: [[Food, 4], [Production, 2]],
        }) -
        a.getSurroundingArea().score({
          values: [[Food, 4], [Production, 2]],
        })
      )
      .slice(0, numberOfPlayers * 20)
  ;

  engine.emit('world:start-tiles', startingSquares);

  let availableCivilizations = CivilizationRegistry.entries();

  for (let i = 0; i < numberOfPlayers; i++) {
    const player = AIPlayer.get();

    player.chooseCivilization(availableCivilizations);
    availableCivilizations = availableCivilizations.filter((Civilization) => ! (player.civilization instanceof Civilization));

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

    // ensure surrounding tiles are visible
    startingSquare.getSurroundingArea()
      .forEach((tile) => engine.emit('tile:seen', tile, player))
    ;
  }
});

engine.on('engine:start', () => {
  console.log(`Game started. ${RulesRegistry.entries().length} rules in play.`);
});

engine.on('turn:start', () => {
  playersToAction.push(...players);
  currentPlayer = playersToAction.shift();

  players.forEach((player) => {
    player.units
      .sort((a, b) => a.waiting - b.waiting)
      .forEach((unit) => {
        if (unit.busy > 0) {
          unit.busy--;

          if (unit.busy === 0) {
            if (unit.actionOnComplete) {
              unit.actionOnComplete();
            }
          }
        }

        unit.movesLeft = unit.movement;

        if (! unit.busy) {
          unit.busy = false;
          unit.active = true;
        }
      });

    player.cities.forEach((city) => {
      city.yields(player)
        .forEach((cityYield) => {
          // console.log(`${city.player.civilization.people} city of ${city.name} (${city.size}) has ${cityYield.value} ${cityYield.constructor.name}`);

          RulesRegistry.get('city:cost')
            .filter((rule) => rule.validate(cityYield, city))
            .forEach((rule) => rule.process(cityYield, city))
          ;

          // console.log(`${city.player.civilization.people} city of ${city.name} has ${cityYield.value} ${cityYield.constructor.name}`);
          // console.log(city.tilesWorked.map((tile) => `${tile.terrain.constructor.name} [${tile.yields().map((tileYield) => `${tileYield.value} ${tileYield.constructor.name}`)}]`));

          if (cityYield instanceof Food) {
            city.foodStorage += cityYield.value;

            if (
              city.foodStorage >= ((city.size * 10) + 10)
              // RulesRegistry.get('city:grow')
              //   .some((rule) => rule.validate(city))
            ) {
              engine.emit('city:grow', city);
            }

            if (
              city.foodStorage < 0
              // RulesRegistry.get('city:shrink')
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

          // TODO: abstract this.
          if (cityYield instanceof Trade) {
            // TODO: check rates
            engine.emit('player:yield', player, new Science(cityYield.value));
          }
        })
      ;
    });
  });

  engine.emit('player:turn-start', currentPlayer);
});

engine.on('player:defeated', (player) => {
  players.splice(players.indexOf(player), 1);
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

