engine.on('unit:created', (unit) => {
  if (! unit.player.activeUnit) {
    unit.player.activeUnit = unit;
  }

  unit.tile.units.push(unit);
});

engine.on('unit:activate', (unit) => {
  unit.player.activeUnit = unit;
  unit.activate();
});

engine.on('unit:action', (unit) => {
  if ((unit.movesLeft <= .1)) {
    unit.player.activeUnit = false;
    unit.active = false;

    engine.emit('unit:activate-next', unit.player);
  }
});

engine.on('unit:destroyed', (unit) => {
  unit.player.units = unit.player.units.filter((playerUnit) => playerUnit !== unit);
  unit.tile.units = unit.tile.units.filter((tileUnit) => tileUnit !== unit);

  if (unit.city) {
    unit.city.units = unit.city.units.filter((cityUnit) => cityUnit !== unit);
  }

  unit.active = false;
  unit.destroyed = true;
});

engine.on('unit:activate-next', (player) => {
  if (player.unitsToAction.length) {
    engine.emit('unit:activate', player.unitsToAction[0]);
  }
  else {
    engine.emit('player:turn-end');
  }
});

engine.on('unit:moved', (unit, from, to) => {
  unit.applyVisibility();

  from.units = from.units.filter((tileUnit) => tileUnit !== unit);
  to.units.push(unit);

  if (unit.movesLeft <= 0.1) {
    unit.active = false;
  }
});

