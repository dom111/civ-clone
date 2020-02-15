import UnitRegistry from '../../../core-unit/UnitRegistry.js';

engine.on('unit:destroyed', (unit) => {
  // TODO: debatable if this should happen, or if it should stay and be represented with the destroyed flag
  UnitRegistry.unregister(unit);


  unit.active = false;
  unit.destroyed = true;
});
