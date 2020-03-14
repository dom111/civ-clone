import {
  Alphabet, Astronomy,
  BronzeWorking,
  CeremonialBurial, Chivalry, CodeOfLaws, Construction, Currency, Engineering, Feudalism, Gunpowder,
  HorsebackRiding, Invention, IronWorking, Literacy, MapMaking,
  Masonry, Mathematics, Monarchy, Mysticism, Navigation,
  Pottery,
  TheWheel, Writing,
} from '../../../Advances.js';
import AdvanceRegistry from '../../../../core-science/AdvanceRegistry.js';
import Player from '../../../../core-player/Player.js';
import PlayerResearch from '../../../PlayerResearch.js';
import RulesRegistry from '../../../../core-rules/RulesRegistry.js';
import assert from 'assert';
import requirements from '../requirements.js';

describe('Advance', () => {
  const rulesRegistry = new RulesRegistry(),
    player = new Player({rulesRegistry}),
    advanceRegistry = new AdvanceRegistry(),
    playerResearch = new PlayerResearch({player, rulesRegistry, advanceRegistry}),
    noPrerequisites = [
      Alphabet,
      BronzeWorking,
      CeremonialBurial,
      HorsebackRiding,
      Masonry,
      Pottery,
      TheWheel,
    ]
  ;

  rulesRegistry.register(
    ...requirements()
  );

  advanceRegistry.register(
    ...[
      Alphabet,
      Astronomy,
      BronzeWorking,
      CeremonialBurial,
      Chivalry,
      CodeOfLaws,
      Construction,
      Currency,
      Engineering,
      Feudalism,
      Gunpowder,
      HorsebackRiding,
      Invention,
      IronWorking,
      Literacy,
      MapMaking,
      Masonry,
      Mathematics,
      Monarchy,
      Mysticism,
      Navigation,
      Pottery,
      TheWheel,
      Writing,
    ]
  );

  noPrerequisites.forEach((Advance) => {
    it(`should be possible to discover ${Advance.name} without any prerequisites being discovered`, () => {
      assert(playerResearch.available()
        .includes(Advance)
      );
    });
  });

  advanceRegistry.entries()
    .filter((Advance) => ! noPrerequisites.includes(Advance))
    .forEach((Advance) => {
      it(`should not be possible to discover ${Advance.name} without any prerequisites being discovered`, () => {
        assert(! playerResearch.available()
          .includes(Advance)
        );
      });
    })
  ;
});
