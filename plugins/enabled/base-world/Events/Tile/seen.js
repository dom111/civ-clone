engine.on('tile:seen', (tile, player) => {
  if (! player.seenTiles.includes(tile)) {
    player.seenTiles.push(tile);

    engine.emit('player:visibility-changed', player);
  }
});
