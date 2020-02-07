import FillGenerator from '../../base-world-generator/FillGenerator.js';
import World from '../World.js';
import assert from 'assert';

describe('Tileset', () => {
  const tinyWorld = new World(new FillGenerator({
    height: 10,
    width: 10,
  }));

  tinyWorld.build();

  const tile = tinyWorld.get(0, 0),
    anotherTile = tinyWorld.get(1,1),
    wrappedTile = tinyWorld.get(8,8),
    tileSurroundingArea2 = tile.getSurroundingArea(),
    tileSurroundingArea0 = tile.getSurroundingArea(0),
    tileSurroundingArea1 = tile.getSurroundingArea(1),
    tileSurroundingArea4 = tile.getSurroundingArea(4)
  ;

  it('should include the expected `Tile`s', () => {
    assert.strictEqual(tileSurroundingArea2.includes(anotherTile), true);
    assert.strictEqual(tileSurroundingArea2.includes(wrappedTile), true);
    assert.strictEqual(tileSurroundingArea2.includes(tinyWorld.get(5, 5)), false);
    assert.strictEqual(tileSurroundingArea1.includes(tinyWorld.get(2, 2)), false);
  });

  it('should be the expected length', () => {
    assert.strictEqual(tileSurroundingArea0.length, 1);
    assert.strictEqual(tileSurroundingArea2.length, 25);
    assert.strictEqual(tileSurroundingArea4.length, 81);
  });
});
