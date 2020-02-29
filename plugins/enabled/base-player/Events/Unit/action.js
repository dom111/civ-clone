engine.on('unit:action', (unit) => {
  if ((unit.moves.value() <= .1)) {
    unit.player.activeUnit = false;
    unit.active = false;

    // engine.emit('unit:activate-next', unit.player);
  }
});
