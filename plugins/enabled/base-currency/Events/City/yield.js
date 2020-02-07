import {Gold} from '../../Yields.js';

engine.on('city:yield', (cityYield, city) => {
  if (cityYield instanceof Gold) {
    engine.emit('player:yield', cityYield, city.player);
  }
});
