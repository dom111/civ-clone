import CityImprovementRegistry from '../core-city-improvement/Registry.js';
import Rules from '../core-rules/Rules.js';
import Tileset from '../core-world/Tileset.js';
import UnitRegistry from '../core-unit/Registry.js';

export default class City {
  // TODO: make these all private
  buildCost = 0;
  buildProgress = 0;
  building = false;
  capital = false;
  destroyed = false;
  foodStorage = 0;
  improvements = [];
  name;
  player;
  size = 1;
  tile;
  tiles;
  tilesWorked = new Tileset();
  units = [];

  constructor({
    player,
    tile,
    name,
  }) {
    this.player = player;
    this.tile = tile;
    this.name = name;

    // main this tile, always worked
    tile.city = this;
    this.tiles = this.tile.getSurroundingArea();

    engine.emit('city:created', this, tile);

    // setup
    this.assignUnassignedWorkers();
  }

  assignUnassignedWorkers() {
    this.tilesWorked.push(
      ...this.tiles
        .filter((tile) => ! this.tilesWorked.includes(tile))
        .filter((tile) => tile.isVisible(this.player))
        .sort((a, b) => b.score() - a.score())
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
      .sort((a, b) => b.score() - a.score())
      .slice(0, this.size)
    );
  }

  // TODO: just pass this through to the Tileset
  resource(type) {
    return this.tilesWorked.map((tile) => tile.resource(type))
      .reduce((total, value) => total + value, 0)
    ;
  }

  // TODO: look at merging the below into availableBuildItems?
  availableBuildUnits() {
    const buildRules = Rules.get('city:build:unit');

    return UnitRegistry.entries()
      .filter((buildItem) => buildRules.filter((rule) => rule.validate(this, buildItem))
        .every((rule) => rule.process(this, buildItem).validate())
      )
    ;
  }

  availableBuildImprovements() {
    const buildRules = Rules.get('city:build:improvement');

    return CityImprovementRegistry.entries()
      .filter((buildItem) => buildRules.filter((rule) => rule.validate(this, buildItem))
        .every((rule) => rule.process(this, buildItem).validate())
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

    [this.buildCost] = Rules.get('city:build-cost')
      .filter((rule) => rule.validate(item, this))
      .map((rule) => rule.process(item, this))
      .sort((a, b) => a - b)
    ;

    if (! this.buildCost) {
      throw new TypeError(`${this.building}`);
    }

    engine.emit('city:build', this, item);
  }

  yields() {
    return this.tilesWorked
      .yields()
    ;
  }
}
