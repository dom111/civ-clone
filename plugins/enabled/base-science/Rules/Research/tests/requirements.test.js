import '../../../register.js';
import '../requirements.js';
import {
  Alphabet,
  BronzeWorking,
  CeremonialBurial,
  HorsebackRiding,
  Masonry,
  Pottery,
  TheWheel,
} from '../../../Advances.js';
import AdvanceRegistry from '../../../../core-science/AdvanceRegistry.js';
import Player from '../../../../core-player/Player.js';
import PlayerResearch from '../../../PlayerResearch.js';
import PlayerResearchRegistry from '../../../PlayerResearchRegistry.js';
import assert from 'assert';

describe('Advance', () => {
  const player = new Player(),
    playerResearch = new PlayerResearch(player),
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

  PlayerResearchRegistry.register(playerResearch);

  noPrerequisites.forEach((Advance) => {
    it(`should be possible to discover ${Advance.name} without any prerequisites being discovered`, () => {
      assert(playerResearch.available()
        .includes(Advance)
      );
    });
  });

  AdvanceRegistry.entries()
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
