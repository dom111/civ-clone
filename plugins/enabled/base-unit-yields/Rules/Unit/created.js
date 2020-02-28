import {Attack} from '../../../core-unit-yields/Yields/Attack.js';
import {Defence} from '../../../core-unit-yields/Yields/Defence.js';
import Effect from '../../../core-rules/Effect.js';
import {Movement} from '../../../core-unit-yields/Yields/Movement.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import UnitRegistry from '../../../core-unit/UnitRegistry.js';
import {Visibility} from '../../../core-unit-yields/Yields/Visibility.js';

RulesRegistry.register(new Rule(
  'unit:created:yields',
  new Effect((unit) => {
    [Attack, Defence, Movement, Visibility]
      .forEach((Yield) => {
        const unitYield = new Yield();

        RulesRegistry.get(`unit:yield:${Yield.name.toLowerCase()}`)
          .filter((rule) => rule.validate(unit, unitYield))
          .forEach((rule) => rule.process(unit, unitYield))
        ;

        // caching these here for easy access.
        unit[Yield.name.toLowerCase()] = unitYield.value();
      })
    ;

    unit.movesLeft = unit.movement;
  })
));

RulesRegistry.register(new Rule(
  'unit:created:register',
  new Effect((unit) =>   UnitRegistry.register(unit))
));

RulesRegistry.register(new Rule(
  'unit:created:event',
  new Effect((unit) => engine.emit('unit:created', unit))
));
