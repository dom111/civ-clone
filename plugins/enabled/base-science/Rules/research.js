import {
  Alphabet,
  BronzeWorking,
  CeremonialBurial,
  CodeOfLaws,
  IronWorking,
  MapMaking,
  Masonry,
  Mathematics,
  Monarchy,
  Mysticism,
  Writing,
} from '../Advances.js';
import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import Rule from '../../core-rules/Rule.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';

[
  [CodeOfLaws, Alphabet],
  [IronWorking, BronzeWorking],
  [MapMaking, Alphabet],
  [Mathematics, Alphabet, Masonry],
  [Monarchy, CodeOfLaws, Mysticism],
  [Mysticism, CeremonialBurial],
  [Writing, Alphabet],
]
  .forEach(([Advance, ...requiredAdvances]) => {
    RulesRegistry.register(new Rule(
      `research:advance:${Advance.name.toLowerCase()}`,
      new Criterion((CheckAdvance) => CheckAdvance === Advance),
      new Effect((Advance, discoveredAdvances) =>
        requiredAdvances.every((RequiredAdvance) =>
          discoveredAdvances.some((advance) => advance instanceof RequiredAdvance)
        )
      )
    ));
  })
;
