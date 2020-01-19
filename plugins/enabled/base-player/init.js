import AIPlayer from '../core-player/AIPlayer.js';
import Civilization from '../core-civilization/Civilization.js';
import {Settlers} from '../base-unit/Units/Settlers.js';

const players = [],
  playersToAction = []
;

let worldMap;

engine.on('player:turn-end', async () => {
  if (playersToAction.length) {
    engine.setData('currentPlayer', playersToAction.shift());
    engine.emit('player:turn-start', engine.data('currentPlayer'));
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

engine.on('turn:start', (Time) => {
  playersToAction.push(...players);
  engine.setData('currentPlayer', playersToAction.shift());

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
      city.foodStorage += city.surplusFood;

      if (city.foodStorage >= ((city.size * 10) + 10)) {
        engine.emit('city:grow', city);
      }
      else if (city.foodStorage < 1) {
        engine.emit('city:shrink', city);
      }

      if (city.building) {
        const production = Math.max(city.production -
          // TODO: convert to Rule
          Math.max(city.units.length - city.size, 0), 0)
        ;

        // console.log(`${city.name} ${city.building} [${city.buildProgress} + ${production} / ${city.buildCost}]`);

        if (production > 0) {
          city.buildProgress += production;

          if (city.buildProgress >= city.buildCost) {
            engine.emit('city:building-complete', city, new (city.building)({
              player,
              city,
              tile: city.tile,
            }));

            city.building = false;
          }
        }
      }
    });
  });

  const showMap = true;

  if (showMap) {
    if ((Time.turn % 50) === 0) {
      const mapData = worldMap.map.map((row) => row.map((tile) => (
        {
          terrain: tile.terrain.constructor.name,
          units: tile.units.map((unit) => (
            {
              player: unit.player.civilization.people,
              name: unit.constructor.name,
            }
          )),
          city: tile.city && {
            player: tile.city.player.civilization.people,
            name: tile.city.name,
          },
        }
      )))
      ;

      const lookup = {
        Babylonian: '\u001b[38;5;233;48;5;47m',
        English: '\u001b[38;5;255;48;5;164m',
        German: '\u001b[38;5;255;48;5;20m',
        Japanese: '\u001b[38;5;255;48;5;88m',
        Roman: '\u001b[38;5;244;48;5;15m',
        Russian: '\u001b[38;5;244;48;5;254m',
        Spanish: '\u001b[38;5;233;48;5;173m',

        Arctic: '\u001b[38;5;253;48;5;254mA',
        Desert: '\u001b[38;5;228;48;5;229mD',
        Forest: '\u001b[38;5;23;48;5;22mF',
        Grassland: '\u001b[38;5;40;48;5;41mG',
        Hills: '\u001b[38;5;100;48;5;101mH',
        Jungle: '\u001b[38;5;71;48;5;72mJ',
        Mountains: '\u001b[38;5;242;48;5;243mM',
        Ocean: '\u001b[38;5;17;48;5;18mO',
        Plains: '\u001b[38;5;142;48;5;144mP',
        River: '\u001b[38;5;26;48;5;27mR',
        Swamp: '\u001b[38;5;131;48;5;130mS',
        Tundra: '\u001b[38;5;222;48;5;223mT',

        Terrain: '\u001b[0m',
      };

      console.log(mapData.map((row) => row.map((tile) => tile.city ?
        `${lookup[tile.city.player]}#\u001b[0m` :
        tile.units.length ?
          `${lookup[tile.units[0].player]}${tile.units[0].name.substr(0, 1)}\u001b[0m` :
          `${lookup[tile.terrain] || tile.terrain}\u001b[0m`
      ).join('')).join('\n'));
    }
  }

  engine.emit('player:turn-start', engine.data('currentPlayer'));
});

engine.on('world:built', (map) => {
  const startingSquares = map.getBy((tile) => tile.surroundingArea.score() >= 150)
      .filter((tile) => tile.isLand),
    numberOfPlayers = engine.option('players', 6),
    usedStartSquares = []
  ;

  worldMap = map;

  if (! startingSquares.length > numberOfPlayers) {
    // TODO: ensure this at generation stage
    throw new TypeError(`Invalid World, not enough valid starting squares ${startingSquares.length}.`);
  }

  let availableCivilizations = Civilization.civilizations;

  for (let i = 0; i < numberOfPlayers; i++) {
    const player = AIPlayer.get();

    player.chooseCivilization(availableCivilizations);
    availableCivilizations = availableCivilizations.filter((civilization) => ! (player.civilization instanceof civilization));

    const [startingSquare] = startingSquares
      .sort((a, b) =>
        Math.min(...usedStartSquares.map((tile) => tile.distanceFrom(a))) -
        Math.min(...usedStartSquares.map((tile) => tile.distanceFrom(b)))
      )
      .splice(Math.floor(startingSquares.length * Math.random()), 1)
    ;

    usedStartSquares.push(startingSquare);

    if (! startingSquare) {
      throw new TypeError(`startSquare is ${startingSquare}.`);
    }

    players.push(player);

    new Settlers({
      player,
      tile: startingSquare,
    });
  }
});

