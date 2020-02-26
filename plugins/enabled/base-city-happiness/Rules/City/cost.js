import {Anarchy, Despotism, Monarchy} from '../../../base-governments/Governments.js';
import {Happiness, Unhappiness} from '../../Yields.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Luxuries} from '../../../base-luxuries/Yields.js';
import PlayerGovernmentRegistry from '../../../base-player-government/PlayerGovernmentRegistry.js';
import {Production} from '../../../base-terrain-yields/Yields.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import {Trade} from '../../../base-terrain-yield-trade/Yields.js';
import UnitRegistry from '../../../core-unit/UnitRegistry.js';

RulesRegistry.register(new Rule(
  'city:cost:happiness:luxuries',
  new Criterion((cityYield) => cityYield instanceof Luxuries),
  new Effect((cityYield, city, yields) => {
    const [happiness] = yields.filter((cityYield) => cityYield instanceof Happiness);

    happiness.add(Math.floor(cityYield.value() / 2));
  })
));

RulesRegistry.register(new Rule(
  'city:cost:unhappiness:base',
  new Criterion((cityYield) => cityYield instanceof Unhappiness),
  // TODO: factor in difficulty levels
  new Effect((cityYield, city) => cityYield.add(Math.max(city.size - 5, 0)))
));

RulesRegistry.register(new Rule(
  'city:cost:unhappiness:martial-law',
  new Criterion((cityYield) => cityYield instanceof Unhappiness),
  new Criterion((cityYield, city) => {
    const [playerGovernment] = PlayerGovernmentRegistry.getBy('player', city.player);

    // TODO: add Communism
    if (playerGovernment) {
      return playerGovernment.is(Anarchy, Despotism, Monarchy);
    }

    return false;
  }),
  new Effect((cityYield, city) => cityYield.subtract(Math.min(
    4,
    Math.min(
      cityYield.value(),
      UnitRegistry.getBy('tile', city.tile).length
    )
  )))
));

RulesRegistry.register(new Rule(
  'city:cost:production:civil-disorder',
  new Criterion((cityYield) => cityYield instanceof Production),
  new Criterion((cityYield, city, yields) => RulesRegistry.get('city:civil-disorder')
    .some((rule) => rule.validate(city, yields))
  ),
  new Effect((cityYield) => cityYield.subtract(cityYield.value()))
));

RulesRegistry.register(new Rule(
  'city:cost:trade:civil-disorder',
  new Criterion((cityYield) => cityYield instanceof Trade),
  new Criterion((cityYield, city, yields) => RulesRegistry.get('city:civil-disorder')
    .some((rule) => rule.validate(city, yields))
  ),
  new Effect((cityYield) => cityYield.subtract(cityYield.value()))
));
