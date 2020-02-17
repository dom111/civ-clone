import CityRegistry from '../../../core-city/CityRegistry.js';
import {Gold} from '../../../base-currency/Yields.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import {Science} from '../../../base-science/Yields.js';

engine.on('player:turn-start', async (player) => {
  CityRegistry.getBy('player', player)
    .forEach((city) => {
      RulesRegistry.get('city:happiness')
        .filter((rule) => rule.validate(city))
        .forEach((rule) => rule.process(city))
      ;

      city.yields()
        .forEach((cityYield) => {
          if ([Gold, Science].some((Yield) => cityYield instanceof Yield)) {
            engine.emit('player:yield', cityYield, player);
          }
        })
      ;
    }
    )
  ;

  await player.takeTurn();

  engine.emit('player:turn-end', player);
});
