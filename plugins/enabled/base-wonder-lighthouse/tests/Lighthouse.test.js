import Lighthouse from '../Lighthouse.js';
import RulesRegistry from '../../core-rules-registry/RulesRegistry.js';
import {Trireme} from '../../base-unit-transport/Units.js';
import WonderRegistry from '../../core-wonder/WonderRegistry.js';
import assert from 'assert';
import getPlayers from '../../base-player/tests/lib/getPlayers.js';
import unitYield from '../../base-unit-transport/Rules/Unit/yield.js';
import wonderUnitYield from '../Rules/Unit/yield.js';

describe('Lighthouse', () => {
  it('should provide an additional move for NavalUnits', () => {
    const rulesRegistry = new RulesRegistry(),
      wonderRegistry = new WonderRegistry(),
      [player] = getPlayers({
        rulesRegistry,
      })
    ;

    rulesRegistry.register(
      ...unitYield(),
      ...wonderUnitYield({
        wonderRegistry,
      })
    );

    const unit = new Trireme({
      player,
      rulesRegistry,
    });

    assert.strictEqual(unit.movement().value(), 3);

    wonderRegistry.register(new Lighthouse({
      player,
      rulesRegistry,
    }));

    assert.strictEqual(unit.movement().value(), 4);
  });
});
