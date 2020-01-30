import {Alphabet, BronzeWorking, CeremonialBurial, CodeOfLaws, IronWorking, MapMaking, Masonry, Mathematics, Monarchy, Mysticism, Writing} from '../Advances.js';
import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import Rule from '../../core-rules/Rule.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'research:advance:codeoflaws',
  new Criterion((Advance) => Advance === CodeOfLaws),
  new Effect((Advance, discoveredAdvances) =>
    discoveredAdvances.some((advance) => advance instanceof Alphabet)
  )
));
RulesRegistry.register(new Rule(
  'research:advance:ironworking',
  new Criterion((Advance) => Advance === IronWorking),
  new Effect((Advance, discoveredAdvances) =>
    discoveredAdvances.some((advance) => advance instanceof BronzeWorking)
  )
));
RulesRegistry.register(new Rule(
  'research:advance:mapmaking',
  new Criterion((Advance) => Advance === MapMaking),
  new Effect((Advance, discoveredAdvances) =>
    discoveredAdvances.some((advance) => advance instanceof Alphabet)
  )
));
RulesRegistry.register(new Rule(
  'research:advance:mathematics',
  new Criterion((Advance) => Advance === Mathematics),
  new Effect((Advance, discoveredAdvances) =>
    discoveredAdvances.some((advance) => advance instanceof Alphabet) &&
    discoveredAdvances.some((advance) => advance instanceof Masonry)
  )
));
RulesRegistry.register(new Rule(
  'research:advance:mysticism',
  new Criterion((Advance) => Advance === Monarchy),
  new Effect((Advance, discoveredAdvances) =>
    discoveredAdvances.some((advance) => advance instanceof CodeOfLaws) &&
    discoveredAdvances.some((advance) => advance instanceof Mysticism)
  )
));
RulesRegistry.register(new Rule(
  'research:advance:mysticism',
  new Criterion((Advance) => Advance === Mysticism),
  new Effect((Advance, discoveredAdvances) =>
    discoveredAdvances.some((advance) => advance instanceof CeremonialBurial)
  )
));
RulesRegistry.register(new Rule(
  'research:advance:writing',
  new Criterion((Advance) => Advance === Writing),
  new Effect((Advance, discoveredAdvances) =>
    discoveredAdvances.some((advance) => advance instanceof Alphabet)
  )
));
