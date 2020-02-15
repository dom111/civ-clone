import UnitRegistry from '../../../core-unit/UnitRegistry.js';

engine.on('unit:created', (unit) => {
  if (! unit.player.activeUnit) {
    unit.player.activeUnit = unit;
  }

  UnitRegistry.register(unit);

  unit.applyVisibility();
});
