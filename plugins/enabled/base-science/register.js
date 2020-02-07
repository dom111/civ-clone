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
  Pottery,
  Writing,
} from './Advances.js';
import AdvanceRegistry from '../core-science/AdvanceRegistry.js';

[
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
  Pottery,
  Writing,
]
  .forEach((Advance) => AdvanceRegistry.register(Advance))
;
