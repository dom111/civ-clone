import WaterFillGenerator from './WaterFillGenerator.js';
import World from '../World.js';
import test from '../../core-test/test.js';

test('World.test.js', () => {
  const height = 100,
    width = 160
  ;

  const world = new World(new WaterFillGenerator({
    height,
    width,
  }));

  world.build();

  const tile = world.get(0, 0),
    tileset = tile.getSurroundingArea()
  ;

  return [
    // base map
    [world.height, height, 'Check dimensions are extracted from generator'],
    [world.width, width, 'Check dimensions are extracted from generator'],

    [world.get(90, 90).x, 90, 'Check returned tile is expected'],
    [world.get(90, 90).y, 90, 'Check returned tile is expected'],
    [world.get(50, 90).x, 50, 'Check returned tile is expected'],
    [world.get(50, 90).y, 90, 'Check returned tile is expected'],

    [tile.distanceFrom(world.get(158, 98)) < 3, true, 'Check distance properly wraps'],
    [tile.distanceFrom(world.get(0, 0)), 0, 'Check distance is 0 for same tile'],
    [tile.distanceFrom(world.get(4, 0)), 4],
    [world.get(89, 45).distanceFrom(world.get(93, 45)), 4],

    [tileset.includes(world.get(2, 2)), true, 'Check returned tileset includes expected `Tile`s'],
    [tileset.includes(world.get(158, 98)), true, 'Check returned tileset includes expected `Tile`s'],
  ];
});
