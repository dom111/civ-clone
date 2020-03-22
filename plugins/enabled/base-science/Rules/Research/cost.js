import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

// see: https://forums.civfanatics.com/threads/how-many-bulbs-need-for-the-current-tech.376195/#post-13810088
export const getRules = () => [
  new Rule(
    'research:cost:base',
    new Effect((Advance, playerResearch) => (
      (
        playerResearch.complete()
          .length + 1
      ) * (
        6 + (
          2 * (
            playerResearch.player()
              .difficultyLevel ||
            0
          )
        )
      )
    ))
  ),
];

export default getRules;
