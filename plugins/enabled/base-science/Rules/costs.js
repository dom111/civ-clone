import {
  Alphabet,
  BronzeWorking,
  CeremonialBurial,
  CodeOfLaws,
  HorsebackRiding,
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
  [Alphabet, 20],
  [BronzeWorking, 20],
  [CeremonialBurial, 20],
  [CodeOfLaws, 20],
  [HorsebackRiding, 20],
  [IronWorking, 30],
  [MapMaking, 50],
  [Masonry, 30],
  [Mathematics, 50],
  [Monarchy, 50],
  [Mysticism, 50],
  [Writing, 40],
]
  .forEach(([Advance, cost]) => {
    RulesRegistry.register(new Rule(
      `advance:cost:${Advance.name.toLowerCase()}`,
      new Criterion((Entity) => Entity === Advance),
      new Effect(() => cost)
    ));
  })
;
