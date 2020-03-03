import {
  Alphabet,
  Astronomy,
  BridgeBuilding,
  BronzeWorking,
  CeremonialBurial,
  Chivalry,
  CodeOfLaws,
  Construction,
  Currency,
  Engineering,
  Feudalism,
  Gunpowder,
  HorsebackRiding,
  Invention,
  IronWorking,
  Literacy,
  MapMaking,
  Masonry,
  Mathematics,
  Monarchy,
  Mysticism,
  Navigation,
  Pottery,
  TheWheel,
  Writing,
} from '../../Advances.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

[
  [Alphabet, 20],
  [Astronomy, 80],
  [BridgeBuilding, 60],
  [BronzeWorking, 20],
  [CeremonialBurial, 20],
  [Chivalry, 70],
  [CodeOfLaws, 20],
  [Construction, 50],
  [Currency, 60],
  [Engineering, 70],
  [Feudalism, 60],
  [Gunpowder, 110],
  [HorsebackRiding, 20],
  [Invention, 100],
  [IronWorking, 30],
  [Literacy, 80],
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
      `research:cost:${Advance.name.toLowerCase()}`,
      new Criterion((Entity) => Entity === Advance),
      new Effect(() => cost)
    ));
  })
;
