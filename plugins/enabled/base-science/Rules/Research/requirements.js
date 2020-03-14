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
  TheWheel,
  Writing,
} from '../../Advances.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => [
  ...[
    [Astronomy, Mathematics, Mysticism],
    [BridgeBuilding, Construction, IronWorking],
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
    .map(([Advance, ...requiredAdvances]) => new Rule(
      `research:requirements:${Advance.name.toLowerCase()}`,
      new Criterion((CheckAdvance) => CheckAdvance === Advance),
      new Effect((Advance, discoveredAdvances) =>
        requiredAdvances.every((RequiredAdvance) =>
          discoveredAdvances.some((advance) => advance instanceof RequiredAdvance)
        )
      )
    ))
  ,
];

export default getRules;
