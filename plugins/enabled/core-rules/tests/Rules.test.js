import And from '../Criteria/And.js';
import Criterion from '../Criterion.js';
import Effect from '../Effect.js';
import Or from '../Criteria/Or.js';
import Rule from '../Rule.js';
import RulesRegistry from '../../core-rules-registry/RulesRegistry.js';
import assert from 'assert';

describe('Rules', () => {
  const emptyRule = new Rule(
      'empty:rule'
    ),
    emptyCriteria = new And(),
    emptyCriterion = new Criterion(),
    emptyOneCriteria = new Or(),
    even = new Criterion((x) => x % 2 === 0),
    square = new Criterion((x) => {
      const i = Math.sqrt(x);

      return i === Math.floor(i);
    }),
    evenAndSquare = new And(even, square),
    evenOrSquare = new Or(even, square),
    evenRule = new Rule('number:even', even),
    squareRule = new Rule('number:square', square),
    evenAndSquareRule = new Rule('number:even-and-square', evenAndSquare),
    evenOrSquareRule = new Rule('number:even-or-square', evenOrSquare),
    ruleWithJustEffect = new Rule('effect', new Effect(() => 42)),
    ruleThatSquares = new Rule('effect', new Effect((n) => n ** 2)),
    rulesRegistry = new RulesRegistry()
  ;

  [
    emptyRule,
    evenRule,
    squareRule,
    evenAndSquareRule,
    evenOrSquareRule,
  ]
    .forEach((rule) => rulesRegistry.register(rule))
  ;

  describe('RulesRegistry', () => {
    it('should return the expected number of rules', () => {
      assert.strictEqual(rulesRegistry.get('empty').length, 1);
      assert.strictEqual(rulesRegistry.get('number').length, 4);
    });
  });

  it('should successfully validate empty rules and criteria', () => {
    assert.strictEqual(emptyRule.validate(), true);
    assert.strictEqual(typeof emptyRule.process(), 'undefined');
    assert.strictEqual(emptyCriteria.validate(), true);
    assert.strictEqual(emptyCriterion.validate(), true);
    assert.strictEqual(emptyOneCriteria.validate(), true);
  });

  it('should successfully validate all combinations', () => {
    assert.strictEqual(even.validate(2), true);
    assert.strictEqual(even.validate(1), false);
    assert.strictEqual(square.validate(4), true);
    assert.strictEqual(square.validate(3), false);
    assert.strictEqual(evenAndSquare.validate(4), true);
    assert.strictEqual(evenAndSquare.validate(9), false);
    assert.strictEqual(evenOrSquare.validate(6), true);
    assert.strictEqual(evenOrSquare.validate(25), true);
    assert.strictEqual(evenOrSquare.validate(13), false);
    assert.strictEqual(ruleWithJustEffect.validate(), true);
    assert.strictEqual(ruleWithJustEffect.process(), 42);
    assert.strictEqual(ruleThatSquares.process(5), 25);
  });
});
