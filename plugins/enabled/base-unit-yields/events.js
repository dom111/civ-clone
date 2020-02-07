import {Attack, Defence, Movement, Visibility} from '../core-unit-yields/Yields.js';
import RulesRegistry from '../core-rules/RulesRegistry.js';

engine.on('unit:created', (unit) => {
  [Attack, Defence, Movement, Visibility].forEach((Yield) => {
    const unitYield = new Yield();

    RulesRegistry.get(`unit:yield:${Yield.name.toLowerCase()}`)
      .filter((rule) => rule.validate(unit, unitYield))
      .forEach((rule) => rule.process(unit, unitYield))
    ;

    // caching these here for easy access.
    unit[Yield.name.toLowerCase()] = unitYield.value();
  });

  unit.movesLeft = unit.movement;
});