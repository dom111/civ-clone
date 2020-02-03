import Criteria from '../Criteria.js';
import Criterion from '../Criterion.js';
import Effect from '../Effect.js';
import OneCriteria from '../OneCriteria.js';
import Rule from '../Rule.js';
import RulesRegistry from '../RulesRegistry.js';
import test from '../../core-test/test.js';

test('Rules.test.js', () => {
  const emptyRule = new Rule(
      'empty:rule'
    ),
    emptyCriteria = new Criteria(),
    emptyCriterion = new Criterion(),
    emptyOneCriteria = new OneCriteria(),
    even = new Criterion((x) => x % 2 === 0),
    square = new Criterion((x) => {
      const i = Math.sqrt(x);

      return i === Math.floor(i);
    }),
    evenAndSquare = new Criteria(even, square),
    evenOrSquare = new OneCriteria(even, square),
    evenRule = new Rule('number:even', even),
    squareRule = new Rule('number:square', square),
    evenAndSquareRule = new Rule('number:even-and-square', evenAndSquare),
    evenOrSquareRule = new Rule('number:even-or-square', evenOrSquare),
    ruleWithJustEffect = new Rule('effect', new Effect(() => 42)),
    ruleThatSquares = new Rule('effect', new Effect((n) => n ** 2))
  ;

  [
    emptyRule,
    evenRule,
    squareRule,
    evenAndSquareRule,
    evenOrSquareRule,
  ].forEach((rule) => RulesRegistry.register(rule));

  return [
    [emptyRule.validate(), true, 'Check empty rule validates successfully'],
    [typeof emptyRule.process(), 'undefined', 'Check empty rule processes successfully'],
    [emptyCriteria.validate(), true, 'Check empty Criteria validates successfully'],
    [emptyCriterion.validate(), true, 'Check empty Criterion validates successfully'],
    [emptyOneCriteria.validate(), true, 'Check empty OneCriteria validates successfully'],
    [RulesRegistry.get('empty').length, 1],
    [even.validate(2), true],
    [even.validate(1), false],
    [square.validate(4), true],
    [square.validate(3), false],
    [evenAndSquare.validate(4), true],
    [evenAndSquare.validate(9), false],
    [evenOrSquare.validate(6), true],
    [evenOrSquare.validate(25), true],
    [evenOrSquare.validate(13), false],
    [RulesRegistry.get('number').length, 4],
    [ruleWithJustEffect.validate(), true],
    [ruleWithJustEffect.process(), 42],
    [ruleThatSquares.process(5), 25],
  ];
});
