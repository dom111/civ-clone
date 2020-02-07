import CityRegistry from '../../../core-city/CityRegistry.js';
import PlayerTreasuryRegistry from '../../PlayerTreasuryRegistry.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

engine.on('player:turn-start', (player) => {
  CityRegistry.getBy('player', player)
    .forEach((city) => {
      const [playerTreasury] = PlayerTreasuryRegistry.getBy('player', player);

      // TODO: add some maintenance costs
      RulesRegistry.get('city:maintenance')
        .filter((rule) => rule.validate(city))
        .forEach((rule) => rule.process(city, playerTreasury))
      ;

      if (playerTreasury < 100) {
        engine.emit('player:treasury-low', player, playerTreasury);
      }
      else if (playerTreasury < 0) {
        engine.emit('player:treasury-exhausted', player, playerTreasury);
        // TODO: sell improvements, disband units
      }
    })
  ;
});
