import {
  Alphabet,
  Astronomy,
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
  TheWheel,
  Writing,
} from '../../Advances.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

[
  [Astronomy, Mathematics, Mysticism],
  [Chivalry, Feudalism, HorsebackRiding],
  [CodeOfLaws, Alphabet],
  [Construction, Currency, Masonry],
  [Currency, BronzeWorking],
  [Engineering, Construction, TheWheel],
  [Feudalism, Masonry, Monarchy],
  [Gunpowder, Invention, IronWorking],
  [Invention, Engineering, Literacy],
  [IronWorking, BronzeWorking],
  [Literacy, CodeOfLaws, Writing],
  [MapMaking, Alphabet],
  [Mathematics, Alphabet, Masonry],
  [Monarchy, CodeOfLaws, Mysticism],
  [Mysticism, CeremonialBurial],
  [Navigation, Astronomy, MapMaking],
  [Writing, Alphabet],
]
  .forEach(([Advance, ...requiredAdvances]) => {
    RulesRegistry.register(new Rule(
      `research:requirements:${Advance.name.toLowerCase()}`,
      new Criterion((CheckAdvance) => CheckAdvance === Advance),
      new Effect((Advance, discoveredAdvances) =>
        requiredAdvances.every((RequiredAdvance) =>
          discoveredAdvances.some((advance) => advance instanceof RequiredAdvance)
        )
      )
    ));
  })
;
