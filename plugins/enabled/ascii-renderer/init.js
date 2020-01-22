import Time from '../core-turn-based-game/Time.js';

let map;

engine.on('world:built', (world) => map = world);

engine.on('turn:start', () => {
  const showMap = true,
    everyXTurns = 10
  ;

  if (showMap && ((Time.turn % everyXTurns) === 1)) {
    const lookup = {
      Babylonian: '\u001b[38;5;233;48;5;47m',
      English: '\u001b[38;5;88;48;5;255m',
      German: '\u001b[38;5;255;48;5;20m',
      Japanese: '\u001b[38;5;255;48;5;88m',
      Roman: '\u001b[38;5;255;48;5;53m',
      Russian: '\u001b[38;5;0;48;5;214m',
      Spanish: '\u001b[38;5;208;48;5;167m',

      Arctic: '\u001b[38;5;250;48;5;254m',
      Desert: '\u001b[38;5;230;48;5;227m',
      Forest: '\u001b[38;5;29;48;5;22m',
      Grassland: '\u001b[38;5;144;48;5;41m',
      Hills: '\u001b[38;5;143;48;5;101m',
      Jungle: '\u001b[38;5;70;48;5;72m',
      Mountains: '\u001b[38;5;249;48;5;243m',
      Ocean: '\u001b[38;5;57;48;5;18m',
      Plains: '\u001b[38;5;179;48;5;144m',
      River: '\u001b[38;5;24;48;5;27m',
      Swamp: '\u001b[38;5;202;48;5;130m',
      Tundra: '\u001b[38;5;174;48;5;223m',

      Terrain: '\u001b[0m',
    };

    // Specials
    lookup.Seal = lookup.Arctic;
    lookup.Oasis = lookup.Desert;
    lookup.Horse = lookup.Forest;
    lookup.Cow = lookup.Shield = lookup.Grassland;
    lookup.Caribou = lookup.Tundra;

    console.log(map.map.map((row) => row.map((tile) => (
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
      .map(
        (row) => row.map((tile) => tile.city ?
          `${lookup[tile.city.player]}#\u001b[0m` :
          tile.units.length ?
            `${lookup[tile.units[0].player]}${tile.units[0].name.substr(0, 1)}\u001b[0m` :
            `${lookup[tile.terrain] || tile.terrain}${tile.terrain.substr(0, 1)}\u001b[0m`
        )
          .join('')
      )
      .join('\n'))
    ;
  }
});
