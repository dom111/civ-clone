import {Yield} from '../Yield.js';
import assert from 'assert';

describe('Yield', () => {
  it('should default to a value of 0', () => {
    const testYield = new Yield();

    assert.strictEqual(testYield.value(), 0);
  });

  it('should accept a Number as an argument to the constructor', () => {
    const testYield = new Yield(1);

    assert.strictEqual(testYield.value(), 1);
  });

  it('should accept another Yield as an argument to the constructor', () => {
    const testYield = new Yield(new Yield(2));

    assert.strictEqual(testYield.value(), 2);
  });

  it('should accept a Number as an argument to add', () => {
    const testYield = new Yield(1);

    testYield.add(2);

    assert.strictEqual(testYield.value(), 3);
  });

  it('should accept another Yield as an argument to add', () => {
    const testYield = new Yield(2);

    testYield.add(new Yield(2));

    assert.strictEqual(testYield.value(), 4);
  });

  it('should accept a Number as an argument to subtract', () => {
    const testYield = new Yield(6);

    testYield.subtract(1);

    assert.strictEqual(testYield.value(), 5);
  });

  it('should accept another Yield as an argument to subtract', () => {
    const testYield = new Yield(7);

    testYield.subtract(new Yield(1));

    assert.strictEqual(testYield.value(), 6);
  });

  it('should handle adding a negative number should be the same as subtract', () => {
    const testYield = new Yield(1);

    testYield.add(-1);

    assert.strictEqual(testYield.value(), 0);
  });

  it('should handle adding a negative number should be the same as subtract with a Yield', () => {
    const testYield = new Yield(1);

    testYield.add(new Yield(-2));

    assert.strictEqual(testYield.value(), -1);
  });

  it('should accept a Number as an argument to subtract', () => {
    const testYield = new Yield(-4);

    testYield.subtract(-2);

    assert.strictEqual(testYield.value(), -2);
  });

  it('should accept another Yield as an argument to subtract', () => {
    const testYield = new Yield(-5);

    testYield.subtract(new Yield(-2));

    assert.strictEqual(testYield.value(), -3);
  });

  it('should accept another Yield as an argument to subtract', () => {
    const testYield = new Yield(-5);

    testYield.subtract(new Yield(-2));

    assert.strictEqual(testYield.value(), -3);
  });
});
