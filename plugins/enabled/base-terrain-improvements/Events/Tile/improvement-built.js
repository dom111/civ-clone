engine.on('tile:improvement-built', (tile, improvement) => {
  if (! tile.improvements.some((existingImprovement) => existingImprovement instanceof improvement.constructor)) {
    tile.improvements.push(improvement);
  }
});
