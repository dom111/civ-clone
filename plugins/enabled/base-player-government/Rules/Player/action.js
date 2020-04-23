import {Anarchy} from '../../../base-governments/Governments.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import PlayerGovernmentRegistry from '../../PlayerGovernmentRegistry.js';
import {Revolution} from '../../PlayerActions.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = ({
  playerGovernmentRegistry = PlayerGovernmentRegistry.getInstance(),
} = {}) => [
  new Rule(
    'player:action:revolution',
    new Criterion((player) => playerGovernmentRegistry.getBy('player', player)
      .some((playerGovernment) => ! playerGovernment.is(Anarchy))
    ),
    new Effect((player) => playerGovernmentRegistry.getBy('player', player)
      .map((playerGovernment) => new Revolution(playerGovernment))
    )
  ),
];

export default getRules;
