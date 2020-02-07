import {Food, Production} from '../base-terrain-yields/Yields.js';
import AIPlayer from '../core-player/AIPlayer.js';
import CityRegistry from '../core-city/CityRegistry.js';
import CivilizationRegistry from '../core-civilization/CivilizationRegistry.js';
import {Land} from '../core-terrain/Types.js';
import PlayerRegistry from './PlayerRegistry.js';
import RulesRegistry from '../core-rules/RulesRegistry.js';
import {Settlers} from '../base-unit/Units.js';
import UnitRegistry from '../core-unit/UnitRegistry.js';

const players = [],
  playersToAction = []
;

let currentPlayer;

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

  // TODO: this is expensive in CPU time - optimise?
  let startingSquares = engine.option('skipSort') ?
    map.getBy((tile) => tile.terrain instanceof Land) :
    map.getBy((tile) => tile.terrain instanceof Land)
      .sort((a, b) => tileScore(b) - tileScore(a))
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

engine.on('game:start', () => {
  console.log(`Game started. ${RulesRegistry.entries().length} rules in play.`);
});

engine.on('turn:start', () => {
  playersToAction.push(...players);
  currentPlayer = playersToAction.shift();

  players.forEach((player) => {
    UnitRegistry.getBy('player', player)
      .sort((a, b) => a.waiting - b.waiting)
      .forEach((unit) => {
        if (unit.busy > 0) {
          unit.busy--;

          if (unit.busy === 0) {
            // TODO: This feels crude - should maybe just have a promise to resolve.
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

    CityRegistry.getBy('player', player)
      .forEach((city) => {
        city.yields(player)
          .forEach((cityYield) => {
            RulesRegistry.get('city:cost')
              .filter((rule) => rule.validate(cityYield, city))
              .forEach((rule) => rule.process(cityYield, city))
            ;

            engine.emit('city:yield', cityYield, city);
          })
        ;
      })
    ;
  });

  engine.emit('player:turn-start', currentPlayer);
});

engine.on('player:defeated', (player) => {
  players.splice(players.indexOf(player), 1);
});

engine.on('player:turn-end', () => {
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

