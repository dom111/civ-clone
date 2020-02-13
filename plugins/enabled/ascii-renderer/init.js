import CityRegistry from '../core-city/CityRegistry.js';
import Time from '../core-turn-based-game/Time.js';
import UnitRegistry from '../core-unit/UnitRegistry.js';

const observingPlayers = [];

let map;

const renderMap = () => {
  if (! map) {
    return;
  }

  const showMap = true,
    everyXTurns = parseInt(engine.option('renderTurns', 1), 10)
  ;

  if (showMap && (everyXTurns > 0 && (everyXTurns === 1 || (Time.turn % everyXTurns) === 1))) {
    const lookup = {
      American: '\u001b[38;5;17;48;5;231m',
      Aztec: '\u001b[38;5;202;48;5;70m',
      Babylonian: '\u001b[38;5;233;48;5;47m',
      English: '\u001b[38;5;88;48;5;255m',
      French: '\u001b[38;5;255;48;5;27m',
      German: '\u001b[38;5;255;48;5;20m',
      Greek: '\u001b[38;5;27;48;5;255m',
      Indian: '\u001b[38;5;255;48;5;28m',
      Japanese: '\u001b[38;5;255;48;5;88m',
      Polish: '\u001b[38;5;16;48;5;160m',
      Roman: '\u001b[38;5;255;48;5;53m',
      Russian: '\u001b[38;5;0;48;5;214m',
      Spanish: '\u001b[38;5;208;48;5;167m',

      Arctic: '\u001b[38;5;250;48;5;254m',
      Desert: '\u001b[38;5;248;48;5;227m',
      Forest: '\u001b[38;5;29;48;5;22m',
      Grassland: '\u001b[38;5;144;48;5;41m',
      Hills: '\u001b[38;5;143;48;5;101m',
      Jungle: '\u001b[38;5;70;48;5;72m',
      Mountains: '\u001b[38;5;249;48;5;243m',
      Ocean: '\u001b[38;5;57;48;5;18m',
      Plains: '\u001b[38;5;250;48;5;144m',
      River: '\u001b[38;5;24;48;5;27m',
      Swamp: '\u001b[38;5;202;48;5;130m',
      Tundra: '\u001b[38;5;174;48;5;223m',

      Terrain: '\u001b[0m',

      // units
      Catapult: 'T',
      Cavalry: 'H',
      Musketman: 'G',
      Spearman: 'P',
      Swordman: 'L',
    };

    console.log(`\x1b[1;1H${
      map.getBy(() => true)
        .map((tile) => {
          const tileUnits = UnitRegistry.getBy('tile', tile),
            [city] = CityRegistry.getBy('tile', tile)
          ;

          return {
            terrain: tile.terrain.constructor.name,
            terrainFeatures: tile.terrain.features.map((feature) => feature.constructor.name).join(','),
            units: tileUnits.map((unit) => (
              {
                player: unit.player.civilization.people,
                name: unit.constructor.name,
              }
            )),
            city: city && {
              player: city.player.civilization.people,
              name: city.name,
            },
            visible: engine.option('showMap') || observingPlayers.some((player) => tile.isVisible(player)), // show only what any player has discovered
          };
        })
        .map(
          (tile, i) => (
            tile.visible ?
              tile.city ?
                `${lookup[tile.city.player]}#\u001b[0m` :
                tile.units.length ?
                  `${lookup[tile.units[0].player]}${lookup[tile.units[0].name] || tile.units[0].name.substr(0, 1)}\u001b[0m` :
                  `${lookup[tile.terrain] || tile.terrain}${(tile.terrainFeatures ? tile.terrainFeatures : tile.terrain).substr(0, 1)}\u001b[0m` :
              ' '
          ) + (
            (i % map.width) === (map.width - 1) ?
              '\n' :
              ''
          )
        )
        .join('')}${
      Math.abs(Time.year)
    } ${
      Time.year < 0 ? 'BC' : 'AD'
    } (${
      Time.turn
    }) [${
      observingPlayers.map((player) => `${
        player.civilization
          .nation
      }: C:${
        CityRegistry.getBy('player', player)
          .length
      } [${
        CityRegistry.getBy('player', player)
          .reduce((total, city) => total + city.size, 0)
      }] U:${
        UnitRegistry.getBy('player', player)
          .length
      }`)
        .join(' / ')
    }]`
    );

    if (engine.option('earlyExit')) {
      throw new Error('earlyExit');
    }
  }
};

engine.on('world:built', (world) => map = world);

// engine.on('turn:start', renderMap);
// engine.on('unit:moved', renderMap);
// engine.on('city:created', renderMap);
engine.on('turn:end', renderMap);

engine.on('player:turn-start', (player) => {
  if (! observingPlayers.includes(player)) {
    observingPlayers.push(player);
  }
});
