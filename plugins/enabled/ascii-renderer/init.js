import CityRegistry from '../core-city/CityRegistry.js';
import GoodyHutRegistry from '../core-goody-huts/GoodyHutRegistry.js';
import PlayerRegistry from '../core-player/PlayerRegistry.js';
import Turn from '../core-turn-based-game/Turn.js';
import UnitRegistry from '../core-unit/UnitRegistry.js';
import Year from '../core-game-year/Year.js';

let map;

/**
 * @param cityRegistry {CityRegistry}
 * @param everyXTurns {number}
 * @param goodyHutRegistry {GoodyHutRegistry}
 * @param mapToRender {World}
 * @param playerRegistry {PlayerRegistry}
 * @param observingPlayers {Player[]}
 * @param showMap {string}
 * @param topCorner {boolean}
 * @param turn {Turn}
 * @param unitRegistry {UnitRegistry}
 * @param year {Year}
 */
export const renderMap = ({
  cityRegistry = CityRegistry.getInstance(),
  everyXTurns = parseInt(engine.option('renderTurns', 1), 10),
  goodyHutRegistry = GoodyHutRegistry.getInstance(),
  mapToRender = map,
  playerRegistry = PlayerRegistry.getInstance(),
  observingPlayers = playerRegistry.entries(),
  showMap = engine.option('showMap'),
  topCorner = true,
  turn = Turn.getInstance(),
  unitRegistry = UnitRegistry.getInstance(),
  year = Year.getInstance(),
} = {}) => {
  if (! mapToRender) {
    return;
  }

  if (everyXTurns > 0 && (everyXTurns === 1 || (turn.value() % everyXTurns) === 1)) {
    const lookup = {
      American: ('#00005f', '#ffffff', '\u001b[38;5;17;48;5;231m'),
      Aztec: ('#ffff5f', '#5faf00', '\u001b[38;5;227;48;5;70m'),
      Babylonian: ('#121212', '#00ff5f', '\u001b[38;5;233;48;5;47m'),
      Chinese: ('#d75f5f', '#00ff5f', '\u001b[38;5;167;48;5;47m'),
      English: ('#870000', '#eeeeee', '\u001b[38;5;88;48;5;255m'),
      Egyptian: ('#870000', '#ffff5f', '\u001b[38;5;88;48;5;227m'),
      French: ('#eeeeee', '#005fff', '\u001b[38;5;255;48;5;27m'),
      German: ('#eeeeee', '#0000d7', '\u001b[38;5;255;48;5;20m'),
      Greek: ('#005fff', '#eeeeee', '\u001b[38;5;27;48;5;255m'),
      Indian: ('#eeeeee', '#008700', '\u001b[38;5;255;48;5;28m'),
      Japanese: ('#eeeeee', '#870000', '\u001b[38;5;255;48;5;88m'),
      Mongol: ('#eeeeee', '#af5f00', '\u001b[38;5;255;48;5;130m'),
      Polish: ('#000000', '#d70000', '\u001b[38;5;16;48;5;160m'),
      Roman: ('#eeeeee', '#5f005f', '\u001b[38;5;255;48;5;53m'),
      Russian: ('#000000', '#ffaf00', '\u001b[38;5;0;48;5;214m'),
      Spanish: ('#ffff5f', '#d75f5f', '\u001b[38;5;227;48;5;167m'),
      Zulu: ('#5faf00', '#ffaf00', '\u001b[38;5;70;48;5;214m'),

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

    console.log(`${topCorner ? '\x1b[1;1H' : ''}${
      mapToRender.getBy(() => true)
        .map((tile) => {
          const tileUnits = unitRegistry.getBy('tile', tile),
            [city] = cityRegistry.getBy('tile', tile)
          ;

          return {
            goodyHut: goodyHutRegistry.getBy('tile', tile).length > 0,
            terrain: tile.terrain().constructor.name,
            terrainFeatures: tile.terrain().features().map((feature) => feature.constructor.name).join(','),
            units: tileUnits.map((unit) => (
              {
                player: unit.player().civilization.people,
                name: unit.constructor.name,
              }
            )),
            city: city && {
              player: city.player().civilization.people,
              name: city.name(),
            },
            visible: showMap || observingPlayers.some((player) => tile.isVisible(player)), // show only what any player has discovered
          };
        })
        .map(
          (tile, i) => (
            tile.visible ?
              tile.city ?
                `${lookup[tile.city.player]}#\u001b[0m` :
                tile.units.length ?
                  `${lookup[tile.units[0].player]}${lookup[tile.units[0].name] || tile.units[0].name.substr(0, 1)}\u001b[0m` :
                  tile.goodyHut ?
                    '\u001b[38;5;0;48;5;220m!\u001b[0m' :
                    `${lookup[tile.terrain] || tile.terrain}${(tile.terrainFeatures ? tile.terrainFeatures : tile.terrain).substr(0, 1)}\u001b[0m` :
              ' '
          ) + (
            (i % mapToRender.width()) === (mapToRender.width() - 1) ?
              '\n' :
              ''
          )
        )
        .join('')}${
      Math.abs(year.value())
    } ${
      year.value() < 0 ? 'BC' : 'AD'
    } (${
      turn.value()
    }) [${
      observingPlayers.map((player) => `${
        player.civilization
          .nation
      }: C:${
        cityRegistry.getBy('player', player)
          .length
      } [${
        cityRegistry.getBy('player', player)
          .reduce((total, city) => total + city.size(), 0)
      }] U:${
        unitRegistry.getBy('player', player)
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
