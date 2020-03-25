import {
  Colossus,
  CopernicusObservatory,
  GreatLibrary,
  GreatWall,
  HangingGardens,
  Lighthouse,
  MagellansExpedition,
  Oracle,
  Pyramids,
} from '../../Wonders.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => [
  ...[
    [Colossus, 200],
    [CopernicusObservatory, 300],
    [GreatLibrary, 300],
    [GreatWall, 300],
    [HangingGardens, 300],
    [Lighthouse, 200],
    [MagellansExpedition, 400],
    [Oracle, 300],
    [Pyramids, 300],
  ]
    .map(([Wonder, cost]) => new Rule(
      `city:build-cost:${Wonder.name.toLowerCase()}`,
      new Criterion((constructor) => constructor === Wonder),
      new Effect(() => cost)
    )),
];

export default getRules;
