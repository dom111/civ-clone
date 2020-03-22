import Generator from '../BaseGenerator.js';
import assert from 'assert';

describe('BaseGenerator', () => {
  const height = 10,
    width = 10,
    generator = new Generator({
      height,
      width,
    })
  ;

  generator.generate();

  it('should return the expected dimensions', () => {
    assert.strictEqual(generator.height(), height);
    assert.strictEqual(generator.width(), width);
  });

  it('should correctly convert coordinates to an index', () => {
    assert.strictEqual(generator.coordsToIndex(0, 2), 20);
    assert.strictEqual(generator.getNeighbours(
      generator.coordsToIndex(0, 2)
    ).includes(
      generator.coordsToIndex(10, 1)
    ), true)
    ;
  });

  it('should calculate distance correctly', () => {
    assert.strictEqual(generator.distanceFrom(
      generator.coordsToIndex(0, 0),
      generator.coordsToIndex(9, 9)
    ) < 1.5, true)
    ;
    assert.strictEqual(generator.distanceFrom(
      generator.coordsToIndex(0, 0),
      generator.coordsToIndex(0, 9)
    ), 1)
    ;
  });
});
