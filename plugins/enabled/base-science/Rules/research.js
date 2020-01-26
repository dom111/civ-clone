import {Alphabet, BronzeWorking, IronWorking, MapMaking, Masonry, Mathematics, Writing} from '../Advances.js';
import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import Rule from '../../core-rules/Rule.js';
import Rules from '../../core-rules/Rules.js';

Rules.register(new Rule(
  'research:advance:mathematics',
  new Criterion((Advance) => Advance === IronWorking),
  new Effect((Advance, discoveredAdvances) =>
    discoveredAdvances.some((advance) => advance instanceof BronzeWorking)
  )
));
Rules.register(new Rule(
  'research:advance:mathematics',
  new Criterion((Advance) => Advance === Writing),
  new Effect((Advance, discoveredAdvances) =>
    discoveredAdvances.some((advance) => advance instanceof Alphabet)
  )
));
Rules.register(new Rule(
  'research:advance:mapmaking',
  new Criterion((Advance) => Advance === MapMaking),
  new Effect((Advance, discoveredAdvances) =>
    discoveredAdvances.some((advance) => advance instanceof Alphabet)
  )
));
Rules.register(new Rule(
  'research:advance:writing',
  new Criterion((Advance) => Advance === Mathematics),
  new Effect((Advance, discoveredAdvances) =>
    discoveredAdvances.some((advance) => advance instanceof Alphabet) &&
    discoveredAdvances.some((advance) => advance instanceof Masonry)
  )
));
