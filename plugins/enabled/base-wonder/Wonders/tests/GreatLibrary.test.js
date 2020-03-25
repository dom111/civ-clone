import {Alphabet} from '../../../base-science/Advances.js';
import {GreatLibrary} from '../../Wonders.js';
import PlayerResearch from '../../../base-science/PlayerResearch.js';
import PlayerResearchRegistry from '../../../base-science/PlayerResearchRegistry.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import WonderRegistry from '../../../core-wonder/WonderRegistry.js';
import assert from 'assert';
import getPlayers from '../../../base-player/tests/lib/getPlayers.js';
import researchComplete from '../../Rules/Player/research-complete.js';

describe('GreatLibrary', () => {
  it('should grant a technology to the player when three other players have discovered it', () => {
    const rulesRegistry = new RulesRegistry(),
      wonderRegistry = new WonderRegistry(),
      playerResearchRegistry = new PlayerResearchRegistry(),
      [player1Research, player2Research, player3Research, player4Research] = getPlayers({
        n: 4,
        rulesRegistry,
      })
        .map((player) => new PlayerResearch({
          player,
          rulesRegistry,
        }))
    ;

    rulesRegistry.register(
      ...researchComplete({
        playerResearchRegistry,
        wonderRegistry,
      })
    );

    playerResearchRegistry.register(player1Research, player2Research, player3Research, player4Research);

    wonderRegistry.register(new GreatLibrary({
      player: player1Research.player(),
      rulesRegistry,
    }));

    assert(! player1Research.completed(Alphabet));

    [
      player2Research,
      player3Research,
      player4Research,
    ]
      .forEach((playerResearch) => playerResearch.addAdvance(Alphabet))
    ;

    assert(player1Research.completed(Alphabet));
  });
});
