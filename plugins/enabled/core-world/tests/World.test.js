import FillGenerator from '../../base-world-generator/FillGenerator.js';
import {Water} from '../../core-terrain/Types.js';
import World from '../World.js';
import assert from 'assert';

describe('World', () => {
  const height = 100,
    width = 160
  ;

  const world = new World(new FillGenerator({
    height,
    width,
    Terrain: Water,
  }));

  world.build();

  const tile = world.get(0, 0);

  // base map
  it('should extract dimensions from the generator', () => {
    assert.strictEqual(world.height(), height);
    assert.strictEqual(world.width(), width);
  });

  it('should return the expected `Tile`s', () => {
    assert.strictEqual(world.get(90, 90).x(), 90);
    assert.strictEqual(world.get(90, 90).y(), 90);
    assert.strictEqual(world.get(50, 90).x(), 50);
    assert.strictEqual(world.get(50, 90).y(), 90);
  });

  describe('Tile', () => {
    // Tile tests
    it('should handle distance over wrapping tiles', () => {
      assert.strictEqual(tile.distanceFrom(world.get(158, 98)) < 3, true);
    });

    it('should return expected distances for other tiles', () => {
      assert.strictEqual(tile.distanceFrom(world.get(0, 0)), 0);
      assert.strictEqual(tile.distanceFrom(world.get(4, 0)), 4);
      assert.strictEqual(world.get(89, 45).distanceFrom(world.get(93, 45)), 4);
    });
  });
});
