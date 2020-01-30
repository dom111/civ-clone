import Criteria from './Criteria.js';
import Criterion from './Criterion.js';
import Effect from './Effect.js';
import OneCriteria from './OneCriteria.js';
import Rule from './Rule.js';
import RulesRegistry from './RulesRegistry.js';
import process from 'process';

// Needed by the registry - perhaps this needs to be injected?
global.engine = {
  on() {},
  emit() {},
};

const __filename = process.argv[1].replace(/.+\/plugins\//, 'plugins/');

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
  }
  ),
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

const tests = [
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