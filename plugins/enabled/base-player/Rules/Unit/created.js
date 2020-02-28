import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'unit:created:set-active',
  new Effect((unit) => {
    if (! unit.player.activeUnit) {
      unit.player.activeUnit = unit;
    }
  })
));

RulesRegistry.register(new Rule(
  'unit:created:visibility',
  new Effect((unit) => unit.applyVisibility())
));
