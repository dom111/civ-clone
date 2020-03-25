import {Lighthouse, MagellansExpedition} from '../../Wonders.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import {Trireme} from '../../../base-unit-transport/Units.js';
import WonderRegistry from '../../../core-wonder/WonderRegistry.js';
import assert from 'assert';
import getPlayers from '../../../base-player/tests/lib/getPlayers.js';
import unitYield from '../../../base-unit-transport/Rules/Unit/yield.js';
import wonderUnitYield from '../../Rules/Unit/yield.js';

describe('MagellansExpedition', () => {
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

    wonderRegistry.register(new MagellansExpedition({
      player,
      rulesRegistry,
    }));

    assert.strictEqual(unit.movement().value(), 4);
  });

  it('should provide two additional moves for NavalUnits if Lighthouse is built within the same Civilization', () => {
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

    wonderRegistry.register(new MagellansExpedition({
      player,
      rulesRegistry,
    }));

    assert.strictEqual(unit.movement().value(), 4);

    wonderRegistry.register(new Lighthouse({
      player,
      rulesRegistry,
    }));

    assert.strictEqual(unit.movement().value(), 5);
  });
});
