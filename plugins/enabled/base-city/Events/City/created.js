import {Irrigation, Road} from '../../../base-terrain-improvements/Improvements.js';

engine.on('city:created', (city) => {
  engine.emit('tile:improvement-built', city.tile, new Irrigation());
  engine.emit('tile:improvement-built', city.tile, new Road());
});
