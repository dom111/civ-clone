import TileImprovementRegistry from '../../../core-tile-improvements/TileImprovementRegistry.js';

engine.on('tile:improvement-pillaged', (tile, improvement) => {
  if (TileImprovementRegistry.getBy('tile', tile)
    .includes(improvement)
  ) {
    TileImprovementRegistry.unregister(improvement);
  }
});
