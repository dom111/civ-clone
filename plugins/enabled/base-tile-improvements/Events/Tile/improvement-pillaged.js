import TileImprovementRegistry from '../../../core-tile-improvements/TileImprovementRegistry.js';

engine.on('tile:improvement-pillaged', (tile, improvement) => {
  if (TileImprovementRegistry.getInstance()
    .getBy('tile', tile)
    .includes(improvement)
  ) {
    TileImprovementRegistry.getInstance()
      .unregister(improvement)
    ;
  }
});
