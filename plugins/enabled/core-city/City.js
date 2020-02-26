import AvailableCityImprovementRegistry from '../core-city-improvement/AvailableCityImprovementRegistry.js';
import AvailableUnitRegistry from '../core-unit/AvailableUnitRegistry.js';
import RulesRegistry from '../core-rules/RulesRegistry.js';
import Tileset from '../core-world/Tileset.js';

export class City {
  // TODO: make these all private
  buildCost = 0;
  buildProgress = 0;
  building = false;
  destroyed = false;
  foodStorage = 0;
  name;
  player;
  size = 1;
  tile;
  tiles;
  tilesWorked = new Tileset();

  constructor({
    player,
    tile,
    name,
  }) {
    this.player = player;
    this.tile = tile;
    this.name = name;

    this.tiles = this.tile.getSurroundingArea();

    RulesRegistry.get('city:created')
      .filter((rule) => rule.validate(this))
      .forEach((rule) => rule.process(this))
    ;

    engine.emit('city:created', this);

    // setup
    this.assignUnassignedWorkers();
  }

  assignUnassignedWorkers() {
    this.tilesWorked.push(
      ...this.tiles
        .filter((tile) => ! this.tilesWorked.includes(tile))
        .filter((tile) => tile.isVisible(this.player))
        .sort((a, b) => b.score({
          player: this.player,
        }) - a.score({
          player: this.player,
        }))
        // +1 here because we also work the main city tile
        .slice(0, (this.size + 1) - this.tilesWorked.length)
    );

    if (this.tilesWorked.length !== (this.size + 1)) {
      this.autoAssignWorkers();
    }
  }

  autoAssignWorkers() {
    this.tilesWorked = Tileset.from(this.tile, ...this.tiles
      .filter((tile) => tile.isVisible(this.player))
      .sort((a, b) => b.score({
        player: this.player,
      }) - a.score({
        player: this.player,
      }))
      .slice(0, this.size)
    );
  }

  // TODO: just pass this through to the Tileset
  resource(type) {
    return this.tilesWorked.map((tile) => tile.resource(type, this.player))
      .reduce((total, value) => total + value, 0)
    ;
  }

  // TODO: look at merging the below into availableBuildItems?
  availableBuildUnits() {
    const buildRulesRegistry = RulesRegistry.get('city:build:unit');

    return AvailableUnitRegistry
      .filter((buildItem) => buildRulesRegistry.filter((rule) => rule.validate(this, buildItem))
        .every((rule) => rule.process(this, buildItem)
          .validate()
        )
      )
    ;
  }

  availableBuildImprovements() {
    const buildRulesRegistry = RulesRegistry.get('city:build:improvement');

    return AvailableCityImprovementRegistry
      .filter((buildItem) => buildRulesRegistry.filter((rule) => rule.validate(this, buildItem))
        .every((rule) => rule.process(this, buildItem)
          .validate()
        )
      )
    ;
  }

  availableBuildItems() {
    return [
      ...this.availableBuildUnits(),
      ...this.availableBuildImprovements(),
    ];
  }

  build(item) {
    this.building = item;

    [this.buildCost] = RulesRegistry.get('city:build-cost')
      .filter((rule) => rule.validate(item, this))
      .map((rule) => rule.process(item, this))
      .sort((a, b) => a - b)
    ;

    if (! this.buildCost) {
      throw new TypeError(`${this.building}`);
    }

    engine.emit('city:build', this, item);
  }

  destroy() {
    RulesRegistry.get('city:destroyed')
      .filter((rule) => rule.validate(this))
      .forEach((rule) => rule.process(this))
    ;

    engine.emit('city:destroyed');
  }

  // TODO: separate this from the core implementation
  yields() {
    const yields = this.tilesWorked
      .yields(this.player)
    ;

    // Do for...of so that as yields are added, they too are processed.
    for (const cityYield of yields) {
      RulesRegistry.get('city:yield')
        .filter((rule) => rule.validate(cityYield, this, yields))
        .forEach((rule) => rule.process(cityYield, this, yields))
      ;

      RulesRegistry.get('city:cost')
        .filter((rule) => rule.validate(cityYield, this, yields))
        .forEach((rule) => rule.process(cityYield, this, yields))
      ;
    }

    return yields;
  }
}

export default City;
