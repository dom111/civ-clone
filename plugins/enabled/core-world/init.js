import World from './World.js';

engine.on('tile:improvement-built', (tile, improvement) => {
  if (! tile.improvements.some((improvement) => improvement instanceof improvement.constructor)) {
    tile.improvements.push(improvement);
  }
});

engine.on('tile:improvement-pillaged', (tile, improvement) => {
  if (tile.improvements.some((improvement) => improvement instanceof improvement.constructor)) {
    tile.improvements = tile.improvements.filter((currentImprovement) => currentImprovement !== improvement);
  }
});

engine.on('tile:seen', (tile, player) => tile.seenBy.push(player));
engine.on('build', () => engine.emit('world:built', new World()));
