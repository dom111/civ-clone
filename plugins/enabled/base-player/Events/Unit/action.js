engine.on('unit:action', (unit) => {
  if ((unit.movesLeft <= .1)) {
    unit.player.activeUnit = false;
    unit.active = false;

    // engine.emit('unit:activate-next', unit.player);
  }
});
