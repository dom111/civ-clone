import TileUnitRegistry from '../base-tile-units/TileUnitRegistry.js';

engine.on('unit:created', (unit) => {
  if (! unit.player.activeUnit) {
    unit.player.activeUnit = unit;
  }

  TileUnitRegistry.register(unit);

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
  unit.player.units = unit.player.units.filter((playerUnit) => playerUnit !== unit);
  TileUnitRegistry.unregister(unit);

  if (unit.city) {
    unit.city.units = unit.city.units.filter((cityUnit) => cityUnit !== unit);
  }

  unit.active = false;
  unit.destroyed = true;
});

engine.on('unit:moved', (unit) => {
  unit.applyVisibility();

  if (unit.movesLeft <= 0.1) {
    unit.active = false;
  }
});

