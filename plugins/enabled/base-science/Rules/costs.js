import {Alphabet, BronzeWorking, HorsebackRiding, IronWorking, MapMaking, Masonry, Mathematics, Writing} from '../Advances.js';
import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import Rule from '../../core-rules/Rule.js';
import Rules from '../../core-rules/Rules.js';

Rules.register(new Rule(
  'advance:cost:alphabet',
  new Criterion((Advance) => Advance === Alphabet),
  new Effect(() => 20)
));
Rules.register(new Rule(
  'advance:cost:bronzeworking',
  new Criterion((Advance) => Advance === BronzeWorking),
  new Effect(() => 20)
));
Rules.register(new Rule(
  'advance:cost:horsebackriding',
  new Criterion((Advance) => Advance === HorsebackRiding),
  new Effect(() => 20)
));
Rules.register(new Rule(
  'advance:cost:ironworking',
  new Criterion((Advance) => Advance === IronWorking),
  new Effect(() => 30)
));
Rules.register(new Rule(
  'advance:cost:mapmaking',
  new Criterion((Advance) => Advance === MapMaking),
  new Effect(() => 50)
));
Rules.register(new Rule(
  'advance:cost:masonry',
  new Criterion((Advance) => Advance === Masonry),
  new Effect(() => 30)
));
Rules.register(new Rule(
  'advance:cost:mathematics',
  new Criterion((Advance) => Advance === Mathematics),
  new Effect(() => 50)
));
Rules.register(new Rule(
  'advance:cost:writing',
  new Criterion((Advance) => Advance === Writing),
  new Effect(() => 40)
));
