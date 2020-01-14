import {Catapult, Cavalry, Militia, Settlers} from './Units.js';
import Unit from '../core-unit/Unit.js';

engine.on('build', () => {
  Unit.register(Catapult);
  Unit.register(Cavalry);
  Unit.register(Militia);
  Unit.register(Settlers);
});
