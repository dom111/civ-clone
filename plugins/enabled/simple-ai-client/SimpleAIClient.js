import {Attack, Defence} from '../core-unit/Yields.js';
import {Desert, Grassland, Hills, Mountains, Plains, River} from '../base-terrain/Terrains.js';
import {Food, Production} from '../base-terrain-yields/Yields.js';
import {Fortifiable, Land, Naval, Worker} from '../base-unit/Types.js';
import {Game, Oasis} from '../base-terrain-features/TerrainFeatures.js';
import {Irrigation, Mine, Road} from '../base-tile-improvements/TileImprovements.js';
import {Move, NoOrders} from '../base-unit/Actions.js';
import AIClient from '../core-ai-client/AIClient.js';
import CityBuild from '../base-city/CityBuild.js';
import CityRegistry from '../core-city/CityRegistry.js';
import {Fortified} from '../base-unit-improvements/UnitImprovements.js';
import GoodyHutRegistry from '../core-goody-huts/GoodyHutRegistry.js';
import {Monarchy as MonarchyAdvance} from '../base-science/Advances.js';
import {Monarchy as MonarchyGovernment} from '../base-governments/Governments.js';
import {NavalTransport} from '../base-unit-transport/Types.js';
import {Palace} from '../base-city-improvements-civ1/CityImprovements.js';
import Path from '../core-world/Path.js';
import PathFinderRegistry from '../core-world/PathFinderRegistry.js';
import PlayerGovernmentRegistry from '../base-player-government/PlayerGovernmentRegistry.js';
import PlayerResearch from '../base-science/PlayerResearch.js';
import PlayerResearchRegistry from '../base-science/PlayerResearchRegistry.js';
import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import {Settlers} from '../base-units-civ1/Units.js';
import TileImprovementRegistry from '../core-tile-improvements/TileImprovementRegistry.js';
import {Trade} from '../base-terrain-yield-trade/Yields.js';
import Unit from '../core-unit/Unit.js';
import UnitImprovementRegistry from '../base-unit-improvements/UnitImprovementRegistry.js';
import UnitRegistry from '../core-unit/UnitRegistry.js';

export class SimpleAIClient extends AIClient {
  #shouldBuildCity = (tile) => {
    return (
      (
        tile.terrain() instanceof Grassland ||
        tile.terrain() instanceof River ||
        tile.terrain() instanceof Plains ||
        tile.terrain().features().some((feature) => feature instanceof Oasis) ||
        tile.terrain().features().some((feature) => feature instanceof Game)
      ) &&
      tile.getSurroundingArea()
        .score({
          player: this.player(),
          values: [
            [Food, 4],
            [Production, 2],
            [Trade, 1],
          ],
        }) >= 180) &&
      ! tile.getSurroundingArea(4)
        .filter((tile) => this.#cityRegistry.getBy('tile', tile)
          .length
        )
        .length
    ;
  };

  #shouldIrrigate = (tile) => {
    return [Desert, Plains, Grassland, River].some((TerrainType) => tile.terrain() instanceof TerrainType) &&
      // TODO: doing this a lot already, need to make improvements a value object with a helper method
      ! this.#tileImprovementRegistry.getBy('tile', tile)
        .some((improvement) => improvement instanceof Irrigation) &&
      tile.getSurroundingArea()
        .some((tile) => this.#cityRegistry.getBy('tile', tile)
          .some((city) => city.player() === this.player())
        ) &&
      [...tile.getAdjacent(), tile]
        .some((tile) => tile.terrain() instanceof River ||
          tile.isCoast() ||
          (
            this.#tileImprovementRegistry.getBy('tile', tile)
              .some((improvement) => improvement instanceof Irrigation) &&
            ! this.#cityRegistry.getBy('tile', tile)
              .length
          )
        )
    ;
  };

  #shouldMine = (tile) => {
    return [Hills, Mountains].some((TerrainType) => tile.terrain() instanceof TerrainType) &&
      ! this.#tileImprovementRegistry.getBy('tile', tile)
        .some((improvement) => improvement instanceof Mine) &&
      tile.getSurroundingArea()
        .some((tile) => this.#cityRegistry.getBy('tile', tile)
          .some((city) => city.player() === this.player())
        )
    ;
  };

  #shouldRoad = (tile) => {
    return ! this.#tileImprovementRegistry.getBy('tile', tile)
      .some((improvement) => improvement instanceof Road) &&
      tile.getSurroundingArea()
        .some((tile) => this.#cityRegistry.getBy('tile', tile)
          .some((city) => city.player() === this.player())
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
  #rulesRegistry;
  #unitRegistry;
  #cityRegistry;
  #goodyHutRegistry;
  #playerGovernmentRegistry;
  #playerResearchRegistry;
  #unitImprovementRegistry;
  #tileImprovementRegistry;

  scoreUnitMove(unit, tile) {
    const actions = unit.actions(tile),
      {
        attack,
        buildIrrigation,
        buildMine,
        buildRoad,
        captureCity,
        disembark,
        embark,
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
      ! actions.length ||
      (actions.length === 1 && noOrders) ||
      (unit instanceof Fortifiable && actions.length === 2 && fortify && noOrders)
    ) {
      return -1;
    }

    let score = 0;

    const [goodyHut] = this.#goodyHutRegistry.getBy('tile', tile);

    if (goodyHut) {
      score += 60;
    }

    // TODO: consider appending all the positives to the score instead of returning immediately
    if (
      (foundCity && this.#shouldBuildCity(tile)) ||
      (buildMine && this.#shouldMine(tile)) ||
      (buildIrrigation && this.#shouldIrrigate(tile)) ||
      (buildRoad && this.#shouldRoad(tile))
    ) {
      score += 24;
    }

    const tileUnits = this.#unitRegistry.getBy('tile', tile)
        .sort((a, b) => b.defence() - a.defence())
      ,
      [defender] = tileUnits,
      ourUnitsOnTile = tileUnits.some((unit) => unit.player() === this.player())
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
      tile.isWater()
    ) {
      score += 16;
    }

    if (embark) {
      score += 16;
    }

    if (disembark/* && tile.continentId !== unit.departureContinentId*/) {
      score += 16;
    }

    if (captureCity) {
      score += 100;
    }

    // TODO: weight attacking dependent on leader's personality
    if (
      attack &&
      unit.attack() > defender.defence()
    ) {
      score += 24 * (unit.attack() - defender.defence());
    }

    if (
      attack &&
      unit.attack() >= defender.defence()
    ) {
      score += 16;
    }

    // add some jeopardy
    if (
      attack &&
      unit.attack() >= (defender.defence() * (2 / 3))
    ) {
      score += 8;
    }

    const discoverableTiles = tile.getNeighbours()
      .filter(
        (neighbouringTile) => ! neighbouringTile.isVisible(this.player())
      )
      .length
    ;

    if (discoverableTiles) {
      score += discoverableTiles * 3;
    }

    const target = this.#unitTargetData
      .get(unit)
    ;

    if (target && tile.distanceFrom(target) < unit.tile().distanceFrom(target)) {
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

    while (unit.active() && unit.moves().value() >= .1) {
      if (loopCheck++ > 1e3) {
        console.log('SimpleAIClient#moveUnit: loopCheck: aborting');

        return;
      }

      const path = this.#unitPathData
        .get(unit)
      ;

      if (path) {
        const target = path.shift(),
          [move] = unit.actions(target)
            .filter((action) => action instanceof Move)
        ;

        if (move) {
          unit.action({
            action: move,
          });

          if (path.length === 0) {
            this.#unitPathData.delete(unit);
          }

          return;
        }

        if (path.length > 0) {
          const newPath = Path.for(unit, unit.tile(), path.end());

          if (newPath) {
            this.#unitPathData.set(unit, newPath);

            // restart the loop
            continue;
          }
        }

        this.#unitPathData.delete(unit);
      }

      const [target] = unit.tile().getNeighbours()
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
        unit.action({
          action: new NoOrders({unit}),
        });

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
        unit.action({
          action: new NoOrders({unit}),
        });

        return;
      }

      if (currentTarget === target) {
        this.#unitTargetData.delete(unit);
      }

      lastMoves.push(target);

      this.#lastUnitMoves.set(unit, lastMoves.slice(-50));

      // TODO: not sure on this...
      unit.action({
        action,
        rulesRegistry: this.#rulesRegistry,
        unitRegistry: this.#unitRegistry,
        cityRegistry: this.#cityRegistry,
        playerGovernmentRegistry: this.#playerGovernmentRegistry,
        playerResearchRegistry: this.#playerResearchRegistry,
        unitImprovementRegistry: this.#unitImprovementRegistry,
        tileImprovementRegistry: this.#tileImprovementRegistry,
      });
    }

    // If we're here, we still have some moves left, lets clear them up.
    // TODO: This might not be necessary, just remove all checks for >= .1 moves left...
    if (unit.moves() > 0) {
      unit.action({
        action: new NoOrders({unit}),
      });
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

    this.player()
      .seenTiles()
      .forEach((tile) => {
        const [tileCity] = this.#cityRegistry.getBy('tile', tile),
          tileUnits = this.#unitRegistry.getBy('tile', tile),
          existingTarget = this.#undefendedCities.includes(tile) && ! [
            ...this.#unitTargetData.values(),
            ...[
              ...this.#unitPathData.values(),
            ]
              .map((path) => path.end()),
          ].includes(tile)
        ;

        if (
          tileCity &&
          tileCity.player() === this.player() &&
          ! tileUnits.length &&
          ! this.#undefendedCities.includes(tile) &&
          ! existingTarget
        ) {
          this.#undefendedCities.push(tile);
        }
        // TODO: when diplomacy exists, check diplomatic status with player
        else if (tileCity && tileCity.player() !== this.player() && tileCity.originalPlayer() === this.player()) {
          this.#citiesToLiberate.push(tile);
        }
        else if (tileCity && tileCity.player() !== this.player() && ! this.#enemyCitiesToAttack.includes(tile)) {
          this.#enemyCitiesToAttack.push(tile);
        }
        else if (
          tileUnits.length &&
          tileUnits.some((unit) => unit.player() !== this.player()) &&
          this.#enemyUnitsToAttack.includes(tile)
        ) {
          this.#enemyUnitsToAttack.push(tile);
        }
        else if (
          tile.isLand() &&
          tile.getNeighbours().some((tile) => ! tile.isVisible(this.player())) &&
          ! this.#landTilesToExplore.includes(tile)
          && ! existingTarget
        ) {
          this.#landTilesToExplore.push(tile);
        }
        else if (
          tile.isWater() &&
          tile.getNeighbours().some((tile) => ! tile.isVisible(this.player())) &&
          this.#seaTilesToExplore.includes(tile)
          && ! existingTarget
        ) {
          this.#seaTilesToExplore.push(tile);
        }

        if (this.#shouldBuildCity(tile) && this.#goodSitesForCities.includes(tile) && ! existingTarget) {
          this.#goodSitesForCities.push(tile);
        }
      })
    ;

    this.#cityRegistry.getBy('player', this.player())
      .forEach((city) => {
        const tileUnits = this.#unitRegistry.getBy('tile', city.tile());

        city.autoAssignWorkers();

        if (! tileUnits.length && ! this.#undefendedCities.includes(city.tile())) {
          this.#undefendedCities.push(city.tile());
        }
      })
    ;
  }

  takeTurn({
    rulesRegistry = RulesRegistry.getInstance(),
    unitRegistry = UnitRegistry.getInstance(),
    cityRegistry = CityRegistry.getInstance(),
    goodyHutRegistry = GoodyHutRegistry.getInstance(),
    pathFinderRegistry = PathFinderRegistry.getInstance(),
    playerGovernmentRegistry = PlayerGovernmentRegistry.getInstance(),
    playerResearchRegistry = PlayerResearchRegistry.getInstance(),
    unitImprovementRegistry = UnitImprovementRegistry.getInstance(),
    tileImprovementRegistry = TileImprovementRegistry.getInstance(),
  } = {}) {
    this.#rulesRegistry = rulesRegistry;
    this.#unitRegistry = unitRegistry;
    this.#cityRegistry = cityRegistry;
    this.#goodyHutRegistry = goodyHutRegistry;
    this.#playerGovernmentRegistry = playerGovernmentRegistry;
    this.#playerResearchRegistry = playerResearchRegistry;
    this.#unitImprovementRegistry = unitImprovementRegistry;
    this.#tileImprovementRegistry = tileImprovementRegistry;

    return new Promise((resolve, reject) => {
      try {
        let loopCheck = 0;

        this.preProcessTurn();

        const [playerGovernment] = this.#playerGovernmentRegistry.filter((playerGovernment) => playerGovernment.player() === this.player()),
          [playerResearch] = this.#playerResearchRegistry.filter((playerScience) => playerScience.player() === this.player())
        ;

        if (playerResearch.completed(MonarchyAdvance) && ! playerGovernment.is(MonarchyGovernment)) {
          playerGovernment.set(new MonarchyGovernment());
        }

        while (this.player()
          .hasMandatoryActions()
        ) {
          const item = this.player()
            .getMandatoryAction()
            .value()
          ;

          // TODO: Remove this when it's working as expected
          if (loopCheck++ > 1e3) {
            // TODO: raise warning - notification?
            console.log('');
            console.log('');
            console.log(item);

            if (item instanceof Unit) {
              console.log(item.actions());
              item.tile().getNeighbours()
                .forEach((tile) => console.log(item.actions(tile)))
              ;
              console.log(item.active());
              console.log(item.busy());
              console.log(item.moves().value());
              console.log(UnitImprovementRegistry.getInstance().getBy('unit', item));
            }
            reject(new Error('SimpleAIClient: Couldn\'t pick an action to do.'));

            break;
          }

          if (item instanceof Unit) {
            const unit = item,
              tile = unit.tile(),
              target = this.#unitTargetData.get(unit),
              actions = unit.actions(),
              {
                buildIrrigation,
                buildMine,
                buildRoad,
                fortify,
                foundCity,
                unload,
              } = actions.reduce((object, entity) => ({
                ...object,
                [entity.constructor.name.replace(/^./, (char) => char.toLowerCase())]: entity,
              }), {}),
              tileUnits = this.#unitRegistry.getBy('tile', tile),
              lastUnitMoves = this.#lastUnitMoves.get(unit)
            ;

            if (! lastUnitMoves) {
              this.#lastUnitMoves.set(unit, [unit.tile()]);
            }

            if (
              unload &&
              tile.isCoast() &&
              unit.cargo()
                .some((unit) => ! tile.getNeighbours()
                  .some((tile) => (this.#lastUnitMoves
                    .get(unit) || [])
                    .includes(tile)
                  )
                )
            ) {
              unit.action({
                action: unload,
              });

              // skip out to allow the unloaded units to be moved.
              continue;
            }

            if (unit instanceof Worker) {
              if (foundCity && this.#shouldBuildCity(tile)) {
                unit.action({
                  action: foundCity,
                });
              }
              else if (buildIrrigation && this.#shouldIrrigate(tile)) {
                unit.action({
                  action: buildIrrigation,
                });
              }
              else if (buildMine && this.#shouldMine(tile)) {
                unit.action({
                  action: buildMine,
                });
              }
              else if (buildRoad && this.#shouldRoad(tile)) {
                unit.action({
                  action: buildRoad,
                });
              }
              else if (! target && this.#goodSitesForCities.length) {
                this.#unitTargetData.set(unit, this.#goodSitesForCities.shift());
              }

              this.moveUnit(unit);

              continue;
            }

            // TODO: check for defense values and activate weaker for disband/upgrade/scouting
            const [cityUnitWithLowerDefence] = tileUnits
                .filter((tileUnit) => this.#unitImprovementRegistry.getBy('unit', tileUnit)
                  .some((improvement) => improvement instanceof Fortified) &&
                  unit.defence() > tileUnit.defence()
                ),
              [city] = this.#cityRegistry.getBy('tile', tile)
            ;

            if (
              fortify &&
              city &&
              (
                cityUnitWithLowerDefence ||
                tileUnits.length <= Math.ceil(city.size() / 5)
              )
            ) {
              unit.action({
                action: fortify,
              });

              if (cityUnitWithLowerDefence) {
                cityUnitWithLowerDefence.activate();
              }

              continue;
            }

            if (! target) {
              // TODO: all the repetition - sort this.
              if (unit instanceof Fortifiable && unit.defence() > 0 && this.#undefendedCities.length > 0) {
                const [targetTile] = this.#undefendedCities
                    .sort((a, b) => a.distanceFrom(unit.tile()) - b.distanceFrom(unit.tile())),
                  path = Path.for(unit, unit.tile(), targetTile, pathFinderRegistry)
                ;

                if (path) {
                  this.#undefendedCities.splice(this.#undefendedCities.indexOf(targetTile), 1);
                  this.#unitPathData.set(unit, path);
                }
              }

              else if (unit.attack() > 0 && this.#citiesToLiberate.length > 0) {
                const [targetTile] = this.#citiesToLiberate
                    .filter((tile) => (unit instanceof Land && tile.isLand()) ||
                    (unit instanceof Naval && tile.isWater())
                    )
                    .sort((a, b) => a.distanceFrom(unit.tile()) - b.distanceFrom(unit.tile())),
                  path = Path.for(unit, unit.tile(), targetTile, pathFinderRegistry)
                ;

                if (path) {
                  this.#citiesToLiberate.splice(this.#citiesToLiberate.indexOf(targetTile), 1);
                  this.#unitPathData.set(unit, path);
                }
              }

              else if (unit.attack() > 0 && this.#enemyUnitsToAttack.length > 0) {
                const [targetTile] = this.#enemyUnitsToAttack
                    .filter((tile) => (unit instanceof Land && tile.isLand()) ||
                    (unit instanceof Naval && tile.isWater())
                    )
                    .sort((a, b) => a.distanceFrom(unit.tile()) - b.distanceFrom(unit.tile())),
                  path = Path.for(unit, unit.tile(), targetTile, pathFinderRegistry)
                ;

                if (path) {
                  this.#enemyUnitsToAttack.splice(this.#enemyUnitsToAttack.indexOf(targetTile), 1);
                  this.#unitPathData.set(unit, path);
                }
              }

              else if (unit instanceof Land && unit.attack() > 0 && this.#enemyCitiesToAttack.length > 0) {
                const [targetTile] = this.#enemyCitiesToAttack
                    .sort((a, b) => a.distanceFrom(unit.tile()) - b.distanceFrom(unit.tile())),
                  path = Path.for(unit, unit.tile(), targetTile, pathFinderRegistry)
                ;

                if (path) {
                  this.#enemyCitiesToAttack.splice(this.#enemyCitiesToAttack.indexOf(targetTile), 1);
                  this.#unitPathData.set(unit, path);
                }
              }

              else if (unit instanceof Land && this.#landTilesToExplore.length > 0) {
                const [targetTile] = this.#landTilesToExplore
                    .sort((a, b) => a.distanceFrom(unit.tile()) - b.distanceFrom(unit.tile())),
                  path = Path.for(unit, unit.tile(), targetTile, pathFinderRegistry)
                ;

                if (path) {
                  this.#landTilesToExplore.splice(this.#landTilesToExplore.indexOf(targetTile), 1);
                  this.#unitPathData.set(unit, path);
                }
              }

              else if (unit instanceof Naval && this.#seaTilesToExplore.length > 0) {
                const [targetTile] = this.#seaTilesToExplore
                    .sort((a, b) => a.distanceFrom(unit.tile()) - b.distanceFrom(unit.tile())),
                  path = Path.for(unit, unit.tile(), targetTile, pathFinderRegistry)
                ;

                if (path) {
                  this.#seaTilesToExplore.splice(this.#seaTilesToExplore.indexOf(targetTile), 1);
                  this.#unitPathData.set(unit, path);
                }
              }
            }

            this.moveUnit(unit);

            continue;
          }

          if (item instanceof CityBuild) {
            const cityBuild = item,
              tile = cityBuild.city().tile(),
              available = cityBuild.available(),
              restrictions = [Palace, Settlers],
              availableFiltered = available.filter((entity) => ! restrictions.includes(entity)),
              availableUnits = availableFiltered.filter((entity) => Object.prototype.isPrototypeOf.call(Unit, entity)),
              randomSelection = availableFiltered[Math.floor(available.length * Math.random())],
              getUnitByYield = (Yield) => {
                const [[Unit]] = availableUnits.map((Unit) => {
                  const unitYield = new Yield();

                  this.#rulesRegistry.process('unit:yield', Unit, unitYield);

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
              ! this.#unitRegistry.getBy('tile', tile)
                .length &&
              getDefensiveUnit()
            ) {
              cityBuild.build(getDefensiveUnit());

              continue;
            }

            // Always Build Cities
            if (available.includes(Settlers) &&
              ! this.#unitRegistry.getBy('city', cityBuild.city())
                .some((unit) => unit instanceof Settlers) &&
              this.#unitRegistry.getBy('player', this.player())
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

            continue;
          }

          if (item instanceof PlayerResearch) {
            const available = item.available();

            if (available.length) {
              item.research(available[Math.floor(available.length * Math.random())]);
            }

            continue;
          }

          console.log(`Can't process: '${item.constructor.name}'`);

          break;
        }

        resolve();
      }
      catch (e) {
        reject(e);
      }
    });
  }
}

export default SimpleAIClient;
