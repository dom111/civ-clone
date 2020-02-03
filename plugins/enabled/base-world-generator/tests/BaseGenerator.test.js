import Generator from '../BaseGenerator.js';
import test from '../../core-test/test.js';

test('BaseGenerator.test.js', () => {
  const height = 10,
    width = 10
  ;

  const generator = new Generator({
    height,
    width,
  });

  generator.generate();

  return [
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
});
