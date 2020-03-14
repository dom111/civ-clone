import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => [
  new Rule(
    'unit:created:set-active',
    new Effect((unit) => {
      if (! unit.player.activeUnit) {
        unit.player.activeUnit = unit;
      }
    })
  ),

  new Rule(
    'unit:created:visibility',
    new Effect((unit) => unit.applyVisibility())
  ),
];

export default getRules;
