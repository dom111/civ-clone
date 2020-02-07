import {
  Alphabet,
  Astronomy,
  BronzeWorking,
  CeremonialBurial,
  Chivalry,
  CodeOfLaws,
  Currency,
  Feudalism,
  HorsebackRiding,
  IronWorking,
  MapMaking,
  Masonry,
  Mathematics,
  Monarchy,
  Mysticism,
  Navigation,
  Pottery,
  TheWheel,
  Writing,
} from '../Advances.js';
import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import Rule from '../../core-rules/Rule.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';

[
  [Alphabet, 20],
  [Astronomy, 80],
  [BronzeWorking, 20],
  [CeremonialBurial, 20],
  [Chivalry, 70],
  [CodeOfLaws, 20],
  [Currency, 60],
  [Feudalism, 60],
  [HorsebackRiding, 20],
  [IronWorking, 30],
  [MapMaking, 50],
  [Masonry, 30],
  [Mathematics, 50],
  [Monarchy, 50],
  [Mysticism, 50],
  [Navigation, 120],
  [Pottery, 20],
  [TheWheel, 40],
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
