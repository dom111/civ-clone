import TileImprovementRegistry from '../../../core-tile-improvements/TileImprovementRegistry.js';

engine.on('tile:improvement-built', (tile, improvement) => {
  if (! TileImprovementRegistry.getBy('tile', tile)
    .some((existingImprovement) => existingImprovement instanceof improvement.constructor)
  ) {
    TileImprovementRegistry.getBy('tile', tile).push(improvement);
  }
});
