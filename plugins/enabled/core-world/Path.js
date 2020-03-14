import PathFinderRegistry from './PathFinderRegistry.js';
import Tile from './Tile.js';
import Tileset from './Tileset.js';

export class Path extends Tileset {
  #movementCost;

  end() {
    return this.get(this.length - 1);
  }

  static for(unit, start, end) {
    // If there are lots of `PathFinder`s here, this could take aaages, so probably best to only have one registered at
    // a time, but this mechanism avoids and hard-coding
    const [path] = PathFinderRegistry.getInstance()
      .entries()
      .map((PathFinder) => new PathFinder(unit, start, end))
      .sort((a, b) => a.totalCost - b.totalCost)
    ;

    return path;
  }

  get movementCost() {
    return this.#movementCost;
  }

  set movementCost(movementCost) {
    return this.#movementCost = movementCost;
  }

  push(...tiles) {
    tiles.forEach((tile) => {
      if (! (tile instanceof Tile)) {
        throw new TypeError(`Tile#push: Invalid element passed, expected 'Tile' got '${tile && tile.constructor.name}'.`);
      }

      const top = this.end();

      if (this.length > 0 && ! tile.isNeighbourOf(top)) {
        throw new TypeError(`Tile#push: Invalid element passed, ${tile.x},${tile.y} is not a neighbour of ${top.x},${top.y}.`);
      }

      super.push(tile);
    });
  }

  start() {
    return this.get(0);
  }
}

export default Path;
