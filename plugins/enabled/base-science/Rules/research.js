import {
  Alphabet,
  Astronomy,
  BronzeWorking,
  CeremonialBurial,
  Chivalry,
  CodeOfLaws,
  Feudalism,
  HorsebackRiding,
  IronWorking,
  MapMaking,
  Masonry,
  Mathematics,
  Monarchy,
  Mysticism,
  Navigation,
  Writing,
} from '../Advances.js';
import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import Rule from '../../core-rules/Rule.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';

[
  [Astronomy, Mathematics, Mysticism],
  [Chivalry, Feudalism, HorsebackRiding],
  [CodeOfLaws, Alphabet],
  [Feudalism, Masonry, Monarchy],
  [IronWorking, BronzeWorking],
  [MapMaking, Alphabet],
  [Mathematics, Alphabet, Masonry],
  [Monarchy, CodeOfLaws, Mysticism],
  [Mysticism, CeremonialBurial],
  [Navigation, Astronomy, MapMaking],
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
