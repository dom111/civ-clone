import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import {Production} from '../../base-yields/Yields.js';
import Rule from '../../core-rules/Rule.js';
import Rules from '../../core-rules/Rules.js';

Rules.register(new Rule(
  'city:cost:production:base',
  new Criterion((tileYield) => tileYield instanceof Production),
  // For units like Caravan/Diplomat, they could extend a FreeUnit class or something and these could be filtered out
  new Effect((tileYield, city) => {
    const supportedUnits = city.units.length;

    if (supportedUnits > city.size) {
      tileYield.subtract(supportedUnits - city.size);
    }
  })
));
