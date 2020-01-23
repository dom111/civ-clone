import Generator from '../core-world-generator/Generator.js';
import {Water} from '../core-terrain/Types.js';
import World from './World.js';

// __filename is undefined?
import process from 'process';
const __filename = process.argv[1].replace(/.+\/plugins\//, 'plugins/');


class WaterFillGenerator extends Generator {
  #height;
  #width;

  constructor({
    height,
    width,
  }) {
    super({height, width});

    this.#height = height;
    this.#width = width;
  }

  generate() {
    return new Array(this.#height * this.#width)
      .fill(0)
      .map(() => new Water())
    ;
  }
}

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

const tests = [
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

  [tile.getSurroundingArea(1).length, 9, 'Check returned tileset is expected length'],
  [tileset.length, 25, 'Check returned tileset is expected length'],
  [tile.getSurroundingArea(3).length, 49, 'Check returned tileset is expected length'],
  [tileset.includes(world.get(2, 2)), true, 'Check returned tileset includes expected `Tile`s'],
  [tileset.includes(world.get(158, 98)), true, 'Check returned tileset includes expected `Tile`s'],
];

tests.forEach(([value, check, label = false], i) => {
  if (value !== check) {
    if (label) {
      throw new TypeError(`${__filename}: ${label} failed - ${value} !== ${check}.`);
    }
    else {
      throw new TypeError(`${__filename}: Expected [${i}] to be equal, but ${value} !== ${check}.`);
    }
  }
});

console.log(`${__filename}: ${tests.length} test${tests.length === 1 ? '' : 's'} passed.`);