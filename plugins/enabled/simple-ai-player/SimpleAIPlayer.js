import {Food, Production} from '../base-yields/Yields.js';
import {Hills, Mountains, Oasis, Plains, River} from '../base-terrain/Terrains.js';
import {Irrigation, Mine, Road} from '../base-terrain-improvements/Improvements.js';
import {Militia, Settlers, Worker} from '../base-unit/Units.js';
import AIPlayer from '../core-player/AIPlayer.js';
import City from '../core-city/City.js';
import FortifiableUnit from '../base-unit/Types/FortifiableUnit.js';
import Unit from '../core-unit/Unit.js';

export class SimpleAIPlayer extends AIPlayer {
  #shouldIrrigate = (tile) => {
    return [Oasis, Plains].some((TerrainType) => tile.terrain instanceof TerrainType) &&
      // TODO: doing this a lot already, need to make improvements a value object with a helper method
      ! tile.improvements.some((improvement) => improvement instanceof Irrigation) &&
      tile.getSurroundingArea().some((tile) => tile.city && tile.city.player === this) &&
      [...tile.getAdjacent(), tile]
        .some((tile) => tile.terrain instanceof River ||
          tile.isCoast() ||
          (
            tile.improvements.some((improvement) => improvement instanceof Irrigation) &&
            ! tile.city
          )
        )
    ;
  };

  #shouldMine = (tile) => {
    return [Hills, Mountains].some((TerrainType) => tile.terrain instanceof TerrainType) &&
      ! tile.improvements.some((improvement) => improvement instanceof Mine) &&
      tile.getSurroundingArea().some(
        (tile) => tile.city && tile.city.player === this
      );
  };

  #shouldRoad = (tile) => {
    return Road.availableOn(tile.terrain) &&
      ! tile.improvements.some((improvement) => improvement instanceof Road) &&
      tile.getSurroundingArea().some(
        (tile) => tile.city && tile.city.player === this
      )
    ;
  };

  #shouldBuildCity = (tile) => {
    return (tile.isLand() &&
      tile.getSurroundingArea()
        .score([
          [Food, 4],
          [Production, 2],
        ]) >= 150) &&
      ! tile.getSurroundingArea(4)
        .cities()
        .length
    ;
  };

  #unitTargetData = new Map();
  #lastUnitMoves = new Map();

  #citiesToLiberate = [];
  #playersToAttack = [];
  #goodSitesForCities = [];

  constructor() {
    super();

    engine.on('city:captured', (city, player) => {
      if (city.originalPlayer === this) {
        if (! this.#citiesToLiberate.includes(city)) {
          this.#citiesToLiberate.push(city);
        }

        if (! this.#playersToAttack.includes(player)) {
          this.#playersToAttack.push(player);
        }
      }

      if (this.#citiesToLiberate.includes(city) && player === this) {
        this.#citiesToLiberate.splice(this.#citiesToLiberate.indexOf(city), 1);
      }
    });

    engine.on('unit:destroyed', (unit, player) => {
      if (unit.player === this) {
        if (! this.#playersToAttack.includes(player)) {
          this.#playersToAttack.push(player);
        }
      }
    });

    engine.on('city:grow', (city) => {
      if (city.player === this) {
        city.autoAssignWorkers();
      }
    });

    engine.on('city:shrink', (city) => {
      if (city.player === this) {
        city.autoAssignWorkers();
      }
    });

    // whenever we build an improvement near our cities, auto-assign the workers to make sure we're using the best tiles
    engine.on('tile:improvement-built', (tile) => {
      const ourNearbyCities = tile.getSurroundingArea()
        .cities()
        .filter((city) => city.player === this)
      ;

      if (
        // if it was us that built the improvement
        tile.units.length &&
        tile.units[0].player === this &&
        ourNearbyCities.length
      ) {
        ourNearbyCities.forEach((city) => city.autoAssignWorkers());
      }
    });
  }

  moveUnit(unit) {
    while (unit.active && unit.movesLeft > 0) {
      const currentTile = unit.tile,
        scoreMove = (tile) => {
          if (! unit.validateMove(tile)) {
            return -1;
          }

          let score = 0;

          // TODO: consider appending all the positives to the score instead of returning immediately
          if (unit instanceof Worker) {
            if (unit instanceof Settlers && this.#shouldBuildCity(tile)) {
              score += 16;
            }

            if (this.#shouldMine(tile)) {
              score += 4;
            }

            if (this.#shouldIrrigate(tile)) {
              score += 8;
            }

            if (this.#shouldRoad(tile)) {
              score += 2;
            }

            this.#goodSitesForCities = this.#goodSitesForCities.filter((tile) => this.#shouldBuildCity(tile));

            if (this.#goodSitesForCities.length) {
              this.#unitTargetData.set(unit, this.#goodSitesForCities.shift());
            }
          }

          if (tile.city && tile.city.player !== this && ! tile.units.length) {
            score += 16;
          }

          const target = this.#unitTargetData.get(unit);

          if (target) {
            if (tile.distanceFrom(target) < currentTile.distanceFrom(target)) {
              score += 14;
            }
          }

          if (currentTile.city && tile.units.length && tile.units[0].player !== this && unit.attack > tile.units[0].defence) {
            score += 12;
          }

          // add some jeopardy
          if (currentTile.city && tile.units.length && tile.units[0].player !== this && unit.attack > (tile.units[0].defence - .5)) {
            score += 8;
          }

          const discoverableTiles = tile.getNeighbours()
            .filter((neighbouringTile) => unit.validateMove(neighbouringTile, tile) && ! neighbouringTile.isVisible(this))
            .length
          ;

          if (discoverableTiles) {
            score += discoverableTiles * 3;
          }

          if (unit.defence > 0 && unit instanceof FortifiableUnit) {
            const undefendedCities = this.cities
              .filter((city) => ! city.tile.units.length)
            ;

            if (undefendedCities.length > 0) {
              this.#unitTargetData.set(unit, undefendedCities[Math.floor(undefendedCities.length * Math.random())].tile);
            }
          }

          if (unit.attack > 0) {
            if (this.#citiesToLiberate.length > 0) {
              const target = this.#citiesToLiberate[Math.floor(this.#citiesToLiberate.length * Math.random())].tile;

              this.#unitTargetData.set(unit, target);

              if (tile.distanceFrom(target) < currentTile.distanceFrom(target)) {
                score += 16;
              }
            }

            const attackableCityTiles = this.seenTiles
              .cities()
              .filter((city) => this.#playersToAttack.includes(city.player))
              .map(({tile}) => tile)
            ;

            if (attackableCityTiles.length) {
              const target = attackableCityTiles[Math.floor(attackableCityTiles.length * Math.random())];

              this.#unitTargetData.set(unit, target);

              if (tile.distanceFrom(target) < currentTile.distanceFrom(target)) {
                score += 2;
              }
            }
          }

          if (tile.units.length && tile.units[0].player !== this) {
            if (unit.attack <= 0) {
              return -1;
            }

            const enemies = tile.units,
              [defender] = enemies.sort((a, b) => b.defence - a.defence)
            ;

            return unit.attack - defender.defence;
          }

          const lastMoves = this.#lastUnitMoves.get(unit) || [];

          if (lastMoves.includes(tile)) {
            return score / 4;
          }

          return score * 4;
        },
        [target] = currentTile.getNeighbours()
          .filter((tile) => scoreMove(tile) > -1)
          .sort((a, b) => ((
            scoreMove(b) - scoreMove(a)
            // if there's no difference, sort randomly
          ) || Math.floor(Math.random() * 3) - 1))
      ;

      if (target) {
        const lastMoves = this.#lastUnitMoves.get(unit) || [];

        lastMoves.push(target);

        this.#lastUnitMoves.set(unit, lastMoves);

        unit.move(target);
      }
      else {
        unit.noOrders();
      }
    }
  }

  takeTurn() {
    return promiseFactory((resolve, reject) => {
      try {
        let loopCheck = 0;

        while (this.actions.length) {
          if (loopCheck++ > 1e4) {
            // TODO: raise warning - notification?
            // reject(new Error(`SimpleAIPlayer: Couldn't pick an action to do.`));
            resolve();

            break;
          }

          const [item] = this.actions,
            {tile} = item
          ;

          if (item instanceof Unit) {
            const unit = item;

            if (unit instanceof Worker) {
              if (unit instanceof Settlers && this.#shouldBuildCity(tile)) {
                unit.buildCity();
              }
              else if (this.#shouldIrrigate(tile)) {
                unit.irrigate();
              }
              else if (this.#shouldMine(tile)) {
                unit.mine();
              }
              else if (this.#shouldRoad(tile)) {
                unit.road();
              }
              else {
                this.moveUnit(unit);
              }
            }
            else {
              // TODO: check for defense values and activate weaker for disband/upgrade/scouting
              if (
                tile.city &&
                tile.units.length <= Math.ceil(tile.city.size / 8) &&
                unit instanceof FortifiableUnit
              ) {
                unit.fortify();
              }
              else {
                this.moveUnit(unit);
              }
            }
          }
          else if (item instanceof City) {
            const city = item;

            if (! tile.units.length) {
              // TODO: a more thorough check on this
              city.build(Militia);
            }
            // Always Build Cities
            else if (! city.units.filter((unit) => unit instanceof Settlers)) {
              city.build(Settlers);
            }
            else {
              const available = city.availableBuildItems(),
                randomSelection = available[Math.floor(available.length * Math.random())]
              ;

              city.build(randomSelection);
            }
          }
          else {
            console.log(`Can't process: '${item}'`);

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
