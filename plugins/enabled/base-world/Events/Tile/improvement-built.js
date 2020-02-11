const clearTileCache = (tile) => tile.clearYieldCache();

engine.on('tile:improvement-built', clearTileCache);
engine.on('tile:improvement-pillaged', clearTileCache);
