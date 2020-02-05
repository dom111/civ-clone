import LandFillGenerator from './LandFillGenerator.js';
import World from '../World.js';
import test from '../../core-test/test.js';

test('Tileset.test.js', () => {
  const tinyWorld = new World(new LandFillGenerator({
    height: 10,
    width: 10,
  }));

  tinyWorld.build();

  const tile = tinyWorld.get(3, 3),
    anotherTile = tinyWorld.get(4,4),
    tileSurroundingArea2 = tile.getSurroundingArea(),
    tileSurroundingArea0 = tile.getSurroundingArea(0),
    tileSurroundingArea4 = tile.getSurroundingArea(4)
  ;

  return [
    [tileSurroundingArea2.length, 25, 'Check returned Tileset is expected length'],
    [tileSurroundingArea2.includes(anotherTile), true, 'Check getSurroundingArea(2) returns Tileset that includes `anotherTile`'],
    [tileSurroundingArea0.length, 1, 'Check returned Tileset is expected length'],
    [tileSurroundingArea0.includes(tile), true, 'Check getSurroundingArea(0) returns Tileset with only `tile`'],
    [tileSurroundingArea4.length, 81, 'Check returned Tileset is expected length'],
  ];
});
