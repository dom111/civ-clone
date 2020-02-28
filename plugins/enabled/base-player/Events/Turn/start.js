import CityRegistry from '../../../core-city/CityRegistry.js';
import CurrentPlayerRegistry from '../../CurrentPlayerRegistry.js';
import PlayerRegistry from '../../PlayerRegistry.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import UnitRegistry from '../../../core-unit/UnitRegistry.js';

engine.on('turn:start', () => {
  PlayerRegistry.entries()
    .forEach((player) => {
      // process cities first in case units are created
      CityRegistry.getBy('player', player)
        .forEach((city) => city.yields(player)
          .forEach((cityYield) => RulesRegistry.get('city:process-yield')
            .filter((rule) => rule.validate(cityYield, city))
            .forEach((rule) => rule.process(cityYield, city))
          )
        )
      ;

      UnitRegistry.getBy('player', player)
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

          unit.movesLeft = unit.movement;

          if (! unit.busy) {
            unit.busy = false;
            unit.active = true;
          }
        })
      ;

      CurrentPlayerRegistry.register(player);
    })
  ;

  const [currentPlayer] = CurrentPlayerRegistry.entries();

  engine.emit('player:turn-start', currentPlayer);
});
