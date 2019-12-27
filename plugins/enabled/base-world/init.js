// events
import World from './World.js';

engine.on('tile-improvement-built', (tile, improvement) => {
  if (! tile.improvements.includes(improvement)) {
    tile.improvements.push(improvement);
  }
});

engine.on('tile-improvement-pillaged', (tile, improvement) => {
  if (tile.improvements.includes(improvement)) {
    tile.improvements = tile.improvements.filter((currentImprovement) => currentImprovement !== improvement);
  }
});

engine.on('tile-seen', (tile, player) => tile.seenBy[player.id] = 1);
engine.on('build', () => {
  engine.map = new World();
});
