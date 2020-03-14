import CityRegistry from '../../../core-city/CityRegistry.js';
import Effect from '../../../core-rules/Effect.js';
import {Moves} from '../../../core-unit/Yields.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
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
    new Effect((player) => {
      unitRegistry.getBy('player', player)
        .sort((a, b) => a.waiting - b.waiting)
        .forEach((unit) => {
          if (unit.busy > 0) {
            unit.busy--;

            if (unit.busy === 0) {
              // TODO: This feels crude - should maybe just have a promise to resolve.
              if (unit.actionOnComplete) {
                unit.actionOnComplete();
              }
            }
          }

          unit.moves = new Moves(unit.movement);

          if (! unit.busy) {
            unit.busy = false;
            unit.active = true;
          }
        })
      ;
    })
  ),
];

export default getRules;
