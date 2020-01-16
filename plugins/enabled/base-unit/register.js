import {Catapult, Cavalry, Militia, Settlers, Trireme} from './Units.js';
import Registry from '../core-unit/Registry.js';

engine.on('build', () => {
  Registry.register(Catapult);
  Registry.register(Cavalry);
  Registry.register(Militia);
  Registry.register(Settlers);
  Registry.register(Trireme);
});
