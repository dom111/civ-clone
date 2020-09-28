import CityRegistry from '../../../core-city/CityRegistry.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules-registry/RulesRegistry.js';
import UnitRegistry from '../../../core-unit/UnitRegistry.js';

export const getRules = ({
  rulesRegistry = RulesRegistry.getInstance(),
  cityRegistry = CityRegistry.getInstance(),
  unitRegistry = UnitRegistry.getInstance(),
} = {}) => [
  new Rule(
    'turn:start:player:cities',
    new Effect((player) => {
      const rules = rulesRegistry.get('city:process-yield');

      // process cities first in case units are created
      cityRegistry.getBy('player', player)
        .forEach((city) => city.yields({player})
          .forEach((cityYield) => rules
            .filter((rule) => rule.validate(cityYield, city))
            .forEach((rule) => rule.process(cityYield, city))
          )
        )
      ;
    })
  ),

  new Rule(
    'turn:start:player:units',
    new Effect((player) => unitRegistry.getBy('player', player)
      .forEach((unit) => {
        const busyAction = unit.busy();

        if (busyAction) {
          if (! busyAction.validate()) {
            return;
          }

          busyAction.process();
        }

        unit.setActive();
        unit.moves()
          .set(unit.movement())
        ;
        unit.setWaiting(false);
      })
    )
  ),
];

export default getRules;
