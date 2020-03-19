import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => [
  new Rule(
    'turn:year:4000bc-1ad',
    new Criterion((turn) => turn < 102),
    new Effect((turn) => (turn * 40) - 4040)
  ),
  new Rule(
    'turn:year:1ad-1000ad',
    new Criterion((turn) => turn > 101),
    new Criterion((turn) => turn < 152),
    new Effect((turn) => (turn - 101) * 20)
  ),
  new Rule(
    'turn:year:1000ad-1500ad',
    new Criterion((turn) => turn > 151),
    new Criterion((turn) => turn < 202),
    new Effect((turn) => ((turn - 151) * 10) + 1000)
  ),
  new Rule(
    'turn:year:1500ad-1750ad',
    new Criterion((turn) => turn > 201),
    new Criterion((turn) => turn < 252),
    new Effect((turn) => ((turn - 201) * 5) + 1500)
  ),
  new Rule(
    'turn:year:1750ad-1850ad',
    new Criterion((turn) => turn > 251),
    new Criterion((turn) => turn < 302),
    new Effect((turn) => ((turn - 251) * 2) + 1750)
  ),
  new Rule(
    'turn:year:1850ad-onwards',
    new Criterion((turn) => turn > 301),
    new Effect((turn) => (turn - 301) + 1850)
  ),
];

export default getRules;
