engine.on('unit:moved', (unit) => {
  unit.applyVisibility();

  if (unit.moves.value() <= .1) {
    unit.active = false;
  }
});
