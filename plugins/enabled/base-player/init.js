import AIPlayer from '../core-player/AIPlayer.js';
import Civilization from '../core-civilization/Civilization.js';
import Unit from '../core-unit/Unit.js';

// TODO: rather than do this, maybe have a `Players` class that can be used instead, so that `engine` can be immutable
const players = [],
  playersToAction = []
;

let currentPlayer;

engine.on('world:built', (map) => {
  const startingSquares = map.getBy((tile) => tile.surroundingArea.score() >= 150),
    numberOfPlayers = engine.option('players', 3)
  ;

  if (! startingSquares.length > numberOfPlayers) {
    // TODO: ensure this at generation stage
    throw new TypeError(`Invalid World, not enough valid starting squares ${startingSquares.length}.`);
  }

  let availableCivilizations = Civilization.civilizations;

  startingSquares.sort(() => Math.floor(3 * Math.random()) - 1);

  for (let i = 0; i < numberOfPlayers; i++) {
    const player = new AIPlayer();

    // TODO: use Civilization.available or something
    player.chooseCivilization(availableCivilizations);
    availableCivilizations = availableCivilizations.filter((civilization) => ! (player.civilization instanceof civilization));

    const [startSquare] = startingSquares.splice(Math.floor(startingSquares.length * Math.random()), 1);

    if (! startSquare) {
      throw new TypeError(`startSquare is ${startSquare}.`);
    }

    players.push(player);

    Unit.fromName('Settlers', {
      player,
      tile: startSquare,
    });
  }
});

engine.on('turn:start', (Time) => {
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
      city.foodStorage += city.surplusFood;

      if (city.foodStorage >= ((city.size * 10) + 10)) {
        city.size++;
        city.foodStorage = 0;

        engine.emit('city:grow', city);
      }
      else if (city.foodStorage < 1) {
        city.size--;
        city.foodStorage = ((city.size * 10) + 10);

        engine.emit('city:shrink', city);
      }

      if (city.building) {
        city.buildProgress += Math.max(city.production -
          // TODO: this needs to be controlled via some kind of a PlayerEffect
          Math.max(city.units.length - city.size, 0),
        Math.round(Math.random()))
        ;

        if (city.buildProgress >= city.building.cost) {
          new (city.building)({
            player,
            city,
            tile: city.tile,
          });

          engine.emit('city:built', city, city.building);

          city.building = false;
        }
      }
    });
  });

  if ((Time.turn % 50) === 0) {
    const {map} = players[0].cities[0].tile,
      mapData = map.map.map((row) => row.map((tile) => (
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
      Arctic: '\u001b[48;5;254m',
      Desert: '\u001b[48;5;229m',
      Forest: '\u001b[48;5;22m',
      Grassland: '\u001b[48;5;41m',
      Hills: '\u001b[48;5;101m',
      Jungle: '\u001b[48;5;72m',
      Mountains: '\u001b[48;5;243m',
      Ocean: '\u001b[48;5;18m',
      Plains: '\u001b[48;5;144m',
      River: '\u001b[48;5;27m',
      Swamp: '\u001b[48;5;130m',
      Tundra: '\u001b[48;5;223m',
      Terrain: '\u001b[0m',
    };

    console.log(mapData.map((row) => row.map((tile) => tile.city ?
      `${lookup[tile.city.player]}#\u001b[0m` :
      tile.units.length ?
        `${lookup[tile.units[0].player]}${tile.units[0].name.substr(0, 1)}\u001b[0m` :
        `${lookup[tile.terrain] || tile.terrain} \u001b[0m`
    ).join('')).join('\n'));
  }

  engine.emit('player:turn-start', currentPlayer);
});

engine.on('player:turn-start', async (player) => {
  await player.takeTurn();

  engine.emit('player:turn-end', player);
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

engine.on('player:visibility-changed', (player) => {
  // clear the visibility
  player.visibleTiles.splice(0, player.visibleTiles.length);
});

engine.on('unit:created', (unit) => {
  if (! unit.player.activeUnit) {
    unit.player.activeUnit = unit;
  }

  unit.tile.units.push(unit);
});

engine.on('unit:activate', (unit) => {
  unit.player.activeUnit = unit;
  unit.active = true;
});

engine.on('city:shrink', (city) => {
  if (city.production + city.size < city.units.length) {
    city.units.splice(0, city.units.length - (city.production + city.size)).forEach((unit) => unit.disband());
  }
});

engine.on('unit:moved', (unit, from) => {
  unit.applyVisibility();

  from.units = from.units.filter((tileUnit) => tileUnit !== unit);

  if ((unit.movesLeft <= 0.1) && (currentPlayer.activeUnit === unit)) {
    unit.player.activeUnit = false;
    unit.active = false;

    engine.emit('unit:activate-next', unit.player);
  }
});

engine.on('unit:action', (unit) => {
  if ((unit.movesLeft <= 0.1) && (currentPlayer.activeUnit === unit)) {
    unit.player.activeUnit = false;
    unit.active = false;

    engine.emit('unit:activate-next', unit.player);
  }
});

engine.on('unit:destroyed', (unit) => {
  unit.player.units = unit.player.units.filter((playerUnit) => playerUnit !== unit);
  unit.tile.units = unit.tile.units.filter((tileUnit) => tileUnit !== unit);
  unit.active = false;
  unit.destroyed = true;

  if (unit.city) {
    unit.city.units = unit.city.units.filter((cityUnit) => cityUnit !== unit);
  }

  if (currentPlayer === unit.player) {
    if (unit.player.activeUnit === unit) {
      unit.player.activeUnit = false;
    }

    engine.emit('unit:activate-next', unit.player);
  }
});

engine.on('unit:activate-next', () => {
  if (currentPlayer.unitsToAction.length) {
    engine.emit('unit:activate', currentPlayer.unitsToAction[0]);
  }
  else {
    engine.emit('player:turn-end');
  }
});
