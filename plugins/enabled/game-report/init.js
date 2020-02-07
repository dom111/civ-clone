import CityRegistry from '../core-city/CityRegistry.js';
import PlayerRegistry from '../base-player/PlayerRegistry.js';
import PlayerResearchRegistry from '../base-player-science/PlayerResearchRegistry.js';
import Time from '../core-turn-based-game/Time.js';
import UnitRegistry from '../core-unit/UnitRegistry.js';

const reportTurns = parseInt(engine.option('reportTurns', -1), 10);

engine.on('turn:end', () => {
  if (((Time.turn % reportTurns) === 1) || reportTurns === 1) {
    try {
      PlayerRegistry.entries()
        .forEach((player) => {
          console.log(`${player.civilization.leader} of the ${player.civilization.people}
Completed research:
${PlayerResearchRegistry.getBy('player', player)
    .map((playerResearch) => {
      playerResearch.completedResearch()
        .map((advance) => advance.constructor.name)
        .join('');
    })
    .join('')
}

Cities:
${
  CityRegistry.getBy('player', player)
    .map((city) => `${city.name} (${city.size})
Improvements: ${
  city.improvements.map((improvement) => improvement.constructor.name)
    .join(', ')
}
Yields:
${
  city.yields()
    .map((cityYield) => `${cityYield.constructor.name}: ${cityYield.value()}`)
    .join('\n')
}
`)
    .join('\n')
}

Units:
${
  UnitRegistry.getBy('player', player)
    .map((unit) => `${unit.constructor.name} (${unit.improvements.map((improvement) => improvement.constructor.name).join(', ')})`)
    .join('\n')
}
`);
        })
      ;
    }
    catch (e) {
      console.log(e);
    }

    engine.emit('game:exit');
  }
});
