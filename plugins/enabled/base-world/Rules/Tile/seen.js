import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => [
  new Rule(
    'tile:seen:player-tiles',
    new Criterion((tile, player) => ! player.seenTiles().includes(tile)),
    new Effect((tile, player) => {
      player.seenTiles().push(tile);

      engine.emit('player:visibility-changed', player);
    })
  ),

  new Rule(
    'tile:seen:event',
    new Effect((tile, player) => engine.emit('tile:seen', tile, player))
  ),
];

export default getRules;
