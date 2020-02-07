import {Science} from '../../../base-science/Yields.js';

engine.on('city:yield', (cityYield, city) => {
  if (cityYield instanceof Science) {
    engine.emit('player:yield', cityYield, city.player);
  }
});
