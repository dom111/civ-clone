engine.on('unit:moved', (unit) => {
  unit.applyVisibility();

  if (unit.movesLeft <= 0.1) {
    unit.active = false;
  }
});
