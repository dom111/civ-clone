import CityImprovementRegistry from '../../../core-city-improvement/CityImprovementRegistry.js';
import CityRegistry from '../../../core-city/CityRegistry.js';
import PlayerGovernmentRegistry from '../../../base-player-government/PlayerGovernmentRegistry.js';
import PlayerRegistry from '../../../core-player/PlayerRegistry.js';
import PlayerResearchRegistry from '../../../base-science/PlayerResearchRegistry.js';
import PlayerTreasuryRegistry from '../../../base-currency/PlayerTreasuryRegistry.js';
import TileImprovementRegistry from '../../../core-tile-improvements/TileImprovementRegistry.js';
import Time from '../../../core-turn-based-game/Time.js';
import UnitImprovementRegistry from '../../../base-unit-improvements/UnitImprovementRegistry.js';
import UnitRegistry from '../../../core-unit/UnitRegistry.js';

engine.on('turn:end', () => {
  const reportTurns = parseInt(engine.option('reportTurns', 0), 10);

  if (! reportTurns) {
    return;
  }

  if (((Time.turn % reportTurns) === 1) || reportTurns === 1) {
    PlayerRegistry.getInstance()
      .entries()
      .forEach((player) => {
        const cities = CityRegistry.getInstance()
            .getBy('player', player),
          units = UnitRegistry.getInstance()
            .getBy('player', player)
        ;

        console.log(`${player.leader.name} of ${player.civilization.nation}
Government: ${PlayerGovernmentRegistry.getInstance()
    .getBy('player', player)
    .map((playerGovernment) => playerGovernment.get().name)}
Treasury: ${PlayerTreasuryRegistry.getBy('player', player)
    .map((playerTreasury) => playerTreasury.value())}
Completed research:
${PlayerResearchRegistry.getInstance().getBy('player', player)
    .map((playerResearch) => playerResearch.complete()
      .map((advance) => advance.constructor.name)
      .join(', ')
    )
    .join('')
}

Cities: (${cities.length})
${
  cities
    .map((city) => `${city.name} (${city.size})
Worked Tiles:
${
  city.tilesWorked
    .map((tile) => `${tile.terrain.constructor.name}${
      tile.terrain.features.length ?
        ` (${tile.terrain.features.map((feature) => feature.constructor.name).join(', ')})` :
        ''
    }${
      TileImprovementRegistry.getInstance()
        .getBy('tile', tile).length ?
        ` (${TileImprovementRegistry.getInstance()
          .getBy('tile', tile).map((improvement) => improvement.constructor.name).join(', ')})` :
        ''
    } - ${
      tile.yields({player})
        .map((tileYield) => `${tileYield.value()} ${tileYield.constructor.name}`)
        .join(', ')
    }`)
    .join('\n')
}
Supported Units: ${UnitRegistry.getInstance()
    .getBy('city', city).length} (${UnitRegistry.getInstance()
  .getBy('city', city).filter((unit) => unit.constructor.name === 'Settlers').length} settlers)
Improvements: ${
  CityImprovementRegistry.getInstance().getBy('city', city)
    .map((improvement) => improvement.constructor.name)
    .join(', ')
}
Yields (after costs): ${
  city.yields()
    .map((cityYield) => `${cityYield.value()} ${cityYield.constructor.name}`)
    .join(', ')
}
`)
    .join('\n')
}

Units: (${units.length})
${
  units
    .map((unit) => `${unit.constructor.name} (${UnitImprovementRegistry.getInstance().getBy('unit', unit).map((improvement) => improvement.constructor.name).join(', ')})`)
    .join('\n')
}
`);
      })
    ;

    if (engine.option('reportAndQuit', false)) {
      engine.emit('game:exit');
    }
  }
});
