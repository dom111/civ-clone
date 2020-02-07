import CityRegistry from '../../../core-city/CityRegistry.js';
import UnitRegistry from '../../../core-unit/UnitRegistry.js';

engine.on('city:captured', (capturedCity, player) => {
  capturedCity.size--;

  if (capturedCity.size <= 0) {
    engine.emit('city:destroyed', capturedCity, player);
  }

  if (CityRegistry.getBy('player', capturedCity.player).length === 0) {
    UnitRegistry.getBy('player', capturedCity.player)
      .forEach((unit) => unit.destroy())
    ;

    engine.emit('player:defeated', capturedCity.player, player);
  }

  if (! capturedCity.originalPlayer) {
    capturedCity.originalPlayer = capturedCity.player;
  }

  capturedCity.player = player;
});
