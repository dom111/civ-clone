import UnitRegistry from '../core-unit/UnitRegistry.js';

engine.on('unit:created', (unit) => {
  if (! unit.player.activeUnit) {
    unit.player.activeUnit = unit;
  }

  UnitRegistry.register(unit);

  unit.applyVisibility();
});

engine.on('unit:activate', (unit) => {
  unit.player.activeUnit = unit;
  unit.activate();
});

engine.on('unit:action', (unit) => {
  if ((unit.movesLeft <= .1)) {
    unit.player.activeUnit = false;
    unit.active = false;

    // engine.emit('unit:activate-next', unit.player);
  }
});

engine.on('unit:destroyed', (unit) => {
  // TODO: debatable if this should happen, or if it should stay and be represented with the destroyed flag
  UnitRegistry.unregister(unit);


  unit.active = false;
  unit.destroyed = true;
});

engine.on('unit:moved', (unit) => {
  unit.applyVisibility();

  if (unit.movesLeft <= 0.1) {
    unit.active = false;
  }
});

