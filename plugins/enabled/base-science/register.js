import {
  Alphabet,
  BronzeWorking,
  HorsebackRiding,
  IronWorking,
  MapMaking,
  Masonry,
  Mathematics,
  Writing,
} from './Advances.js';
import AdvanceRegistry from '../core-science/AdvanceRegistry.js';

[
  Alphabet,
  BronzeWorking,
  HorsebackRiding,
  IronWorking,
  MapMaking,
  Masonry,
  Mathematics,
  Writing,
]
  .forEach((Advance) => AdvanceRegistry.register(Advance))
;
