import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import Settlers from '../../Settlers.js';

export const getRules = () => [
  new Rule(
    'city:building-complete:unit:settlers',
    new Criterion((cityBuild, unit) => unit instanceof Settlers),
    new Effect((cityBuild) => cityBuild.city()
      .shrink()
    )
  ),
];

export default getRules;
