import PathFinderRegistry from './PathFinderRegistry.js';
import Tile from './Tile.js';
import Tileset from './Tileset.js';

export class Path extends Tileset {
  #movementCost;

  end() {
    return this.get(this.length - 1);
  }

  static for(unit, start, end, pathFinderRegistry = PathFinderRegistry.getInstance()) {
    // If there are lots of `PathFinder`s here, this could take aaages, so probably best to only have one registered at
    // a time, but this mechanism avoids and hard-coding
    const [path] = pathFinderRegistry.entries()
      .map((PathFinder) => new PathFinder(unit, start, end))
      .map((path) => path.generate())
      .sort((a, b) => a.totalCost - b.totalCost)
    ;

    if (! path) {
      return path;
    }

    // the first tile is the source tile, so we can remove it.
    path.shift();

    return path;
  }

  movementCost() {
    return this.#movementCost;
  }

  setMovementCost(movementCost) {
    this.#movementCost = movementCost;
  }

  push(...tiles) {
    tiles.forEach((tile) => {
      if (! (tile instanceof Tile)) {
        throw new TypeError(`Tile#push: Invalid element passed, expected 'Tile' got '${tile && tile.constructor.name}'.`);
      }

      const top = this.end();

      if (this.length > 0 && ! tile.isNeighbourOf(top)) {
        throw new TypeError(`Tile#push: Invalid element passed, ${tile.x()},${tile.y()} is not a neighbour of ${top.x()},${top.y()}.`);
      }

      super.push(tile);
    });
  }

  start() {
    return this.get(0);
  }
}

export default Path;
