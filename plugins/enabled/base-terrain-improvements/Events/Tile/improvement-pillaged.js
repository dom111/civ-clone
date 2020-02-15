engine.on('tile:improvement-pillaged', (tile, improvement) => {
  if (tile.improvements.includes(improvement)) {
    tile.improvements = tile.improvements.filter((existingImprovement) => existingImprovement !== improvement);
  }
});
