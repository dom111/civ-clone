import {Attack, Defence} from '../core-unit/Yields.js';
import {Desert, Grassland, Hills, Mountains, Plains, River} from '../base-terrain/Terrains.js';
import {Food, Production} from '../base-terrain-yields/Yields.js';
import {FortifiableUnit, LandUnit, NavalTransport, NavalUnit} from '../base-unit/Types.js';
import {Game, Oasis} from '../base-terrain-features/TerrainFeatures.js';
import {Irrigation, Mine, Road} from '../base-tile-improvements/TileImprovements.js';
import {Land, Water} from '../core-terrain/Types.js';
import {Move, NoOrders} from '../base-unit/Actions.js';
import {Settlers, Worker} from '../base-unit/Units.js';
import AIPlayer from '../core-player/AIPlayer.js';
import CityBuild from '../base-city/CityBuild.js';
import CityRegistry from '../core-city/CityRegistry.js';
import {Fortified} from '../base-unit-improvements/UnitImprovements.js';
import {Monarchy as MonarchyAdvance} from '../base-science/Advances.js';
import {Monarchy as MonarchyGovernment} from '../base-governments/Governments.js';
import {Palace} from '../base-city-improvements/CityImprovements.js';
import Path from '../core-world/Path.js';
import PlayerGovernmentRegistry from '../base-player-government/PlayerGovernmentRegistry.js';
import PlayerResearch from '../base-science/PlayerResearch.js';
import PlayerResearchRegistry from '../base-science/PlayerResearchRegistry.js';
import TileImprovementRegistry from '../core-tile-improvements/TileImprovementRegistry.js';
import {Trade} from '../base-terrain-yield-trade/Yields.js';
import Unit from '../core-unit/Unit.js';
import UnitImprovementRegistry from '../base-unit-improvements/UnitImprovementRegistry.js';
import UnitRegistry from '../core-unit/UnitRegistry.js';

export class SimpleAIPlayer extends AIPlayer {
  #shouldBuildCity = (tile) => {
    return (
      (
        tile.terrain instanceof Grassland ||
        tile.terrain instanceof River ||
        tile.terrain instanceof Plains ||
        tile.features.some((feature) => feature instanceof Oasis) ||
        tile.features.some((feature) => feature instanceof Game)
      ) &&
      tile.getSurroundingArea()
        .score({
          player: this,
          values: [
            [Food, 4],
            [Production, 2],
            [Trade, 1],
          ],
        }) >= 180) &&
      ! tile.getSurroundingArea(4)
        .filter((tile) => CityRegistry.getInstance()
          .getBy('tile', tile)
          .length
        )
        .length
    ;
  };

  #shouldIrrigate = (tile) => {
    return [Desert, Plains, Grassland, River].some((TerrainType) => tile.terrain instanceof TerrainType) &&
      // TODO: doing this a lot already, need to make improvements a value object with a helper method
      ! TileImprovementRegistry.getInstance()
        .getBy('tile', tile)
        .some((improvement) => improvement instanceof Irrigation) &&
      tile.getSurroundingArea()
        .some((tile) => CityRegistry.getInstance()
          .getBy('tile', tile)
          .some((city) => city.player === this)
        ) &&
      [...tile.getAdjacent(), tile]
        .some((tile) => tile.terrain instanceof River ||
          tile.isCoast() ||
          (
            TileImprovementRegistry.getInstance()
              .getBy('tile', tile)
              .some((improvement) => improvement instanceof Irrigation) &&
            ! CityRegistry.getInstance()
              .getBy('tile', tile)
              .length
          )
        )
    ;
  };

  #shouldMine = (tile) => {
    return [Hills, Mountains].some((TerrainType) => tile.terrain instanceof TerrainType) &&
      ! TileImprovementRegistry.getInstance()
        .getBy('tile', tile)
        .some((improvement) => improvement instanceof Mine) &&
      tile.getSurroundingArea()
        .some((tile) => CityRegistry.getInstance()
          .getBy('tile', tile)
          .some((city) => city.player === this)
        )
    ;
  };

  #shouldRoad = (tile) => {
    return ! TileImprovementRegistry.getInstance()
      .getBy('tile', tile)
      .some((improvement) => improvement instanceof Road) &&
      tile.getSurroundingArea()
        .some((tile) => CityRegistry.getInstance()
          .getBy('tile', tile)
          .some((city) => city.player === this)
        )
    ;
  };

  #lastUnitMoves = new Map();
  #unitPathData = new Map();
  #unitTargetData = new Map();

  #citiesToLiberate = [];
  #enemyCitiesToAttack = [];
  #enemyUnitsToAttack = [];
  #goodSitesForCities = [];
  #landTilesToExplore = [];
  #seaTilesToExplore = [];
  #undefendedCities = [];

  scoreUnitMove(unit, tile) {
    const actions = unit.actions(tile),
      {
        attack,
        boardTransport,
        buildIrrigation,
        buildMine,
        buildRoad,
        captureCity,
        fortify,
        foundCity,
        noOrders,
      } = actions.reduce((object, entity) => ({
        ...object,
        [
        entity.constructor
          .name
          .replace(/^./, (char) => char.toLowerCase())
        ]: entity,
      }), {})
    ;

    if (
      (actions.length === 1 && noOrders) ||
      (unit instanceof FortifiableUnit && actions.length === 2 && fortify && noOrders)
    ) {
      return -1;
    }

    let score = 0;

    // TODO: consider appending all the positives to the score instead of returning immediately
    if (
      (foundCity && this.#shouldBuildCity(tile)) ||
      (buildMine && this.#shouldMine(tile)) ||
      (buildIrrigation && this.#shouldIrrigate(tile)) ||
      (buildRoad && this.#shouldRoad(tile))
    ) {
      score += 24;
    }

    const tileUnits = UnitRegistry.getInstance()
        .getBy('tile', tile)
        .sort((a, b) => b.defence - a.defence)
      ,
      [defender] = tileUnits,
      ourUnitsOnTile = tileUnits.some((unit) => unit.player === this)
    ;

    if (
      unit instanceof NavalTransport &&
      unit.hasCapacity() &&
      tileUnits.length &&
      ourUnitsOnTile
    ) {
      score += 10;
    }

    if (
      unit instanceof NavalTransport &&
      unit.hasCargo() &&
      tile.isCoast() &&
      tile.terrain instanceof Water
    ) {
      score += 10;
    }

    if (boardTransport) {
      score += 10;
    }

    if (captureCity) {
      score += 100;
    }

    // TODO: weight attacking dependent on leader's personality
    if (
      attack &&
      unit.attack > defender.defence
    ) {
      score += 24 * (unit.attack - defender.defence);
    }

    if (
      attack &&
      unit.attack >= defender.defence
    ) {
      score += 16;
    }

    // add some jeopardy
    if (
      attack &&
      unit.attack >= (defender.defence * (2 / 3))
    ) {
      score += 8;
    }

    const discoverableTiles = tile.getNeighbours()
      .filter(
        (neighbouringTile) => ! neighbouringTile.isVisible(this)
      )
      .length
    ;

    if (discoverableTiles) {
      score += discoverableTiles * 3;
    }

    const target = this.#unitTargetData
      .get(unit)
    ;

    if (target && tile.distanceFrom(target) < unit.tile.distanceFrom(target)) {
      score += 14;
    }

    const lastMoves = this.#lastUnitMoves.get(unit) || [];

    if (! lastMoves.includes(tile)) {
      score *= 4;
    }

    return score;
  }

  moveUnit(unit) {
    let loopCheck = 0;

    while (unit.active && unit.moves.value() >= .1) {
      if (loopCheck++ > 1e3) {
        console.log('SimpleAIPlayer#moveUnit: loopCheck: aborting');

        return;
      }

      const path = this.#unitPathData
        .get(unit)
      ;

      if (path) {
        const target = path.shift(),
          [move] = unit.actions(unit.tile, target)
            .filter((action) => action instanceof Move)
        ;

        if (move) {
          unit.action(move);

          if (path.length === 0) {
            this.#unitPathData.delete(unit);
          }

          return;
        }

        if (path.length > 0) {
          const newPath = Path.for(unit, unit.tile, path.end);

          if (newPath) {
            this.#unitPathData.set(unit, newPath);

            // restart the loop
            continue;
          }
        }

        this.#unitPathData.delete(unit);
      }

      const [target] = unit.tile.getNeighbours()
        .map((tile) => [tile, this.scoreUnitMove(unit, tile)])
        .filter(([, score]) => score > -1)
        .sort(([, a], [, b]) => (
          (
            b - a
            // if there's no difference, sort randomly
          ) ||
          Math.floor(Math.random() * 3) - 1
        ))
        .map(([tile]) => tile)
      ;

      if (! target) {
        // TODO: could do something a bit more intelligent here
        // const actions = unit.actions();
        //
        // console.log(actions);

        unit.action(new NoOrders({unit}));

        return;
      }

      const actions = unit.actions(target),
        [action] = actions,
        lastMoves = this.#lastUnitMoves
          .get(unit) || [],
        currentTarget = this.#unitTargetData
          .get(unit)
      ;

      if (! action) {
        unit.action(new NoOrders({unit}));

        return;
      }

      if (currentTarget === target) {
        this.#unitTargetData.delete(unit);
      }

      lastMoves.push(target);

      this.#lastUnitMoves.set(unit, lastMoves.slice(-50));

      unit.action(action);
    }
  }

  preProcessTurn() {
    this.#citiesToLiberate.splice(0);
    this.#enemyCitiesToAttack.splice(0);
    this.#enemyUnitsToAttack.splice(0);
    this.#goodSitesForCities.splice(0);
    this.#landTilesToExplore.splice(0);
    this.#seaTilesToExplore.splice(0);
    this.#undefendedCities.splice(0);

    this.seenTiles
      .filter((tile) => ! [...this.#unitTargetData.values()].includes(tile))
      .forEach((tile) => {
        const [tileCity] = CityRegistry.getInstance()
            .getBy('tile', tile),
          tileUnits = UnitRegistry.getInstance()
            .getBy('tile', tile)
        ;

        if (
          tile.terrain instanceof Land &&
          tile.getNeighbours().some((tile) => ! tile.isVisible(this)) &&
          ! this.#landTilesToExplore.includes(tile)
        ) {
          this.#landTilesToExplore.push(tile);
        }
        else if (
          tile.terrain instanceof Water &&
          tile.getNeighbours().some((tile) => ! tile.isVisible(this)) &&
          this.#seaTilesToExplore.includes(tile)
        ) {
          this.#seaTilesToExplore.push(tile);
        }
        // TODO: if diplomacy exists, check diplomatic status with player
        else if (
          tileUnits.length &&
          tileUnits.some((unit) => unit.player !== this) &&
          this.#enemyUnitsToAttack.includes(tile)
        ) {
          this.#enemyUnitsToAttack.push(tile);
        }
        else if (tileCity && tileCity.player !== this && tileCity.originalPlayer === this) {
          this.#citiesToLiberate.push(tile);
        }
        else if (tileCity && tileCity.player !== this && ! this.#enemyCitiesToAttack.includes(tile)) {
          this.#enemyCitiesToAttack.push(tile);
        }
        else if (this.#shouldBuildCity(tile) && this.#goodSitesForCities.includes(tile)) {
          this.#goodSitesForCities.push(tile);
        }
      })
    ;

    CityRegistry.getInstance()
      .getBy('player', this)
      .forEach((city) => {
        const tileUnits = UnitRegistry.getInstance()
          .getBy('tile', city.tile);

        city.autoAssignWorkers();

        if (! tileUnits.length && ! this.#undefendedCities.includes(city.tile)) {
          this.#undefendedCities.push(city.tile);
        }
      })
    ;
  }

  takeTurn() {
    return new Promise((resolve, reject) => {
      try {
        let loopCheck = 0;

        this.preProcessTurn();

        const [playerGovernment] = PlayerGovernmentRegistry.getInstance()
            .filter((playerGovernment) => playerGovernment.player === this),
          [playerResearch] = PlayerResearchRegistry.getInstance()
            .filter((playerScience) => playerScience.player === this)
        ;

        if (playerResearch.completed(MonarchyAdvance) && ! playerGovernment.is(MonarchyGovernment)) {
          playerGovernment.set(new MonarchyGovernment());
        }

        while (this.hasActions()) {
          if (loopCheck++ > 1e3) {
            // TODO: raise warning - notification?
            console.log('');
            console.log('');
            console.log(this.getAction());
            reject(new Error('SimpleAIPlayer: Couldn\'t pick an action to do.'));

            break;
          }

          const item = this.getAction(),
            {tile} = item
          ;

          if (item instanceof Unit) {
            const unit = item,
              target = this.#unitTargetData.get(unit),
              actions = unit.actions(),
              {
                buildIrrigation,
                buildMine,
                buildRoad,
                fortify,
                foundCity,
              } = actions.reduce((object, entity) => ({
                ...object,
                [
                entity.constructor.name.replace(/^./, (char) => char.toLowerCase())
                ]: entity,
              }), {}),
              tileUnits = UnitRegistry.getInstance()
                .getBy('tile', tile)
            ;

            if (
              unit instanceof NavalTransport &&
              unit.hasCargo() &&
              tile.getNeighbours()
                .some((tile) => tile.terrain instanceof Land && tile.isCoast()) &&
              unit.cargo
                .some((unit) => ! this.#lastUnitMoves
                  .get(unit)
                  .slice(-50)
                  .includes(tile)
                )
            ) {
              unit.unload();
            }

            if (unit instanceof Worker) {
              if (foundCity && this.#shouldBuildCity(tile)) {
                unit.action(foundCity);
              }
              else if (buildIrrigation && this.#shouldIrrigate(tile)) {
                unit.action(buildIrrigation);
              }
              else if (buildMine && this.#shouldMine(tile)) {
                unit.action(buildMine);
              }
              else if (buildRoad && this.#shouldRoad(tile)) {
                unit.action(buildRoad);
              }
              else if (! target && this.#goodSitesForCities.length) {
                this.#unitTargetData.set(unit, this.#goodSitesForCities.shift());
              }

              this.moveUnit(unit);
            }
            else {
              // TODO: check for defense values and activate weaker for disband/upgrade/scouting
              const [cityUnitWithLowerDefence] = tileUnits
                  .filter((tileUnit) => UnitImprovementRegistry.getInstance()
                    .getBy('unit', tileUnit)
                    .some((improvement) => improvement instanceof Fortified) &&
                  unit.defence > tileUnit.defence
                  ),
                [city] = CityRegistry.getInstance()
                  .getBy('tile', tile)
              ;

              if (
                fortify &&
                city &&
                (
                  cityUnitWithLowerDefence ||
                  tileUnits.length <= Math.ceil(city.size / 5)
                )
              ) {
                unit.action(fortify);

                if (cityUnitWithLowerDefence) {
                  cityUnitWithLowerDefence.activate();
                }
              }
              else {
                if (! target) {
                  // TODO: all the repetition - sort this.
                  if (unit instanceof FortifiableUnit && unit.defence > 0 && this.#undefendedCities.length > 0) {
                    const [targetTile] = this.#undefendedCities
                      .sort((a, b) => a.distanceFrom(unit.tile) - b.distanceFrom(unit.tile))
                    ;

                    this.#undefendedCities.splice(this.#undefendedCities.indexOf(targetTile), 1);
                    this.#unitTargetData.set(unit, targetTile);
                  }

                  else if (unit.attack > 0 && this.#citiesToLiberate.length > 0) {
                    const [targetTile] = this.#citiesToLiberate
                      .filter((tile) => (unit instanceof LandUnit && tile.terrain instanceof Land) ||
                        (unit instanceof NavalUnit && tile.terrain instanceof Water)
                      )
                      .sort((a, b) => a.distanceFrom(unit.tile) - b.distanceFrom(unit.tile))
                    ;

                    this.#citiesToLiberate.splice(this.#citiesToLiberate.indexOf(targetTile), 1);
                    this.#unitTargetData.set(unit, targetTile);
                  }

                  else if (unit.attack > 0 && this.#enemyUnitsToAttack.length > 0) {
                    const [targetTile] = this.#enemyUnitsToAttack
                      .filter((tile) => (unit instanceof LandUnit && tile.terrain instanceof Land) ||
                        (unit instanceof NavalUnit && tile.terrain instanceof Water)
                      )
                      .sort((a, b) => a.distanceFrom(unit.tile) - b.distanceFrom(unit.tile))
                    ;

                    this.#enemyUnitsToAttack.splice(this.#enemyUnitsToAttack.indexOf(targetTile), 1);
                    this.#unitTargetData.set(unit, targetTile);
                  }

                  else if (unit instanceof LandUnit && unit.attack > 0 && this.#enemyCitiesToAttack.length > 0) {
                    const [targetTile] = this.#enemyCitiesToAttack
                      .sort((a, b) => a.distanceFrom(unit.tile) - b.distanceFrom(unit.tile))
                    ;

                    this.#enemyCitiesToAttack.splice(this.#enemyCitiesToAttack.indexOf(targetTile), 1);
                    this.#unitTargetData.set(unit, targetTile);
                  }

                  else if (unit instanceof LandUnit && this.#landTilesToExplore.length > 0) {
                    const [targetTile] = this.#landTilesToExplore
                      .sort((a, b) => a.distanceFrom(unit.tile) - b.distanceFrom(unit.tile))
                    ;

                    this.#landTilesToExplore.splice(this.#landTilesToExplore.indexOf(targetTile), 1);
                    this.#unitTargetData.set(unit, targetTile);
                  }

                  else if (unit instanceof NavalUnit && this.#seaTilesToExplore.length > 0) {
                    const [targetTile] = this.#seaTilesToExplore
                      .sort((a, b) => a.distanceFrom(unit.tile) - b.distanceFrom(unit.tile))
                    ;

                    this.#seaTilesToExplore.splice(this.#seaTilesToExplore.indexOf(targetTile), 1);
                    this.#unitTargetData.set(unit, targetTile);
                  }
                }

                this.moveUnit(unit);
              }
            }
          }
          else if (item instanceof CityBuild) {
            const cityBuild = item,
              {tile} = cityBuild.city,
              available = cityBuild.available(),
              restrictions = [Palace, Settlers],
              availableFiltered = available.filter((entity) => ! restrictions.includes(entity)),
              availableUnits = availableFiltered.filter((entity) => Object.prototype.isPrototypeOf.call(Unit, entity)),
              randomSelection = availableFiltered[Math.floor(available.length * Math.random())],
              getUnitByYield = (Yield) => {
                const [[Unit]] = availableUnits.map((Unit) => {
                  const unitYield = new Yield();

                  this.rulesRegistry.process('unit:yield', Unit, unitYield);

                  return [Unit, unitYield];
                })
                  .sort(([, unitYieldA], [, unitYieldB]) => unitYieldB.value() - unitYieldA.value())
                ;

                return Unit;
              },
              getDefensiveUnit = ((unit) => () => unit || (unit = getUnitByYield(Defence)))(),
              getOffensiveUnit = ((unit) => () => unit || (unit = getUnitByYield(Attack)))()
            ;

            if (
              ! UnitRegistry.getInstance()
                .getBy('tile', tile)
                .length &&
              getDefensiveUnit()
            ) {
              cityBuild.build(getDefensiveUnit());

              continue;
            }

            // Always Build Cities
            if (available.includes(Settlers) &&
              ! UnitRegistry.getInstance()
                .getBy('city', cityBuild.city)
                .some((unit) => unit instanceof Settlers) &&
              UnitRegistry.getInstance()
                .getBy('player', this)
                .filter((unit) => unit instanceof Settlers)
                // TODO: use expansionist leader trait
                .length < 3
            ) {
              cityBuild.build(Settlers);

              continue;
            }

            if (
              this.#enemyCitiesToAttack.length > 0 ||
              this.#enemyUnitsToAttack.length > 4
            ) {
              cityBuild.build(getOffensiveUnit());

              continue;
            }

            if (this.#undefendedCities.length) {
              cityBuild.build(getDefensiveUnit());

              continue;
            }

            if (randomSelection) {
              cityBuild.build(randomSelection);
            }
          }
          else if (item instanceof PlayerResearch) {
            const available = item.available();

            if (available.length) {
              item.research(available[Math.floor(available.length * Math.random())]);
            }
          }
          else {
            console.log(`Can't process: '${item.constructor.name}'`);

            break;
          }
        }

        resolve();
      }
      catch (e) {
        reject(e);
      }
    });
  }
}

export default SimpleAIPlayer;
