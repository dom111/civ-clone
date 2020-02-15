engine.on('unit:activate', (unit) => {
  unit.player.activeUnit = unit;
  unit.activate();
});
