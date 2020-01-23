import Generator from './BaseGenerator.js';

// __filename is undefined?
import process from 'process';
const __filename = process.argv[1].replace(/.+\/plugins\//, 'plugins/');

const height = 10,
  width = 10
;

const generator = new Generator({
  height,
  width,
});

generator.generate();

const tests = [
  [generator.height, height],
  [generator.width, width],
  [generator.coordsToIndex(0, 2), 20],
  [generator.getNeighbours(
    generator.coordsToIndex(0, 2)
  ).includes(
    generator.coordsToIndex(10, 1)
  ), true],
  [generator.distanceFrom(
    generator.coordsToIndex(0, 0),
    generator.coordsToIndex(9, 9)
  ) < 1.5, true],
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