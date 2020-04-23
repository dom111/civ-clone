import {Move} from '../base-unit/Actions.js';
import Path from '../core-world/Path.js';
import PathFinder from '../core-world/PathFinder.js';

export class BasePathFinder extends PathFinder {
  /** @type {Path[]} */
  #candidates = [];
  /** @type {{}[]} */
  #heap = [this.createNode(this.start())];
  /** @type {Tile} */
  #seen = [this.start()];

  /**
   * @param tile {Tile}
   * @param parent {{}}
   * @param cost {number}
   * @returns {{parent: null, cost: number, tile: Tile}}
   */
  createNode(tile, parent = null, cost = 0) {
    return {
      tile,
      parent,
      cost,
    };
  }

  /**
   * @param node {{}}
   * @returns {Path}
   */
  createPath(node) {
    const tiles = [];

    let movementCost = 0;

    while (node.parent) {
      tiles.unshift(node.tile);
      movementCost += node.cost;

      node = node.parent;
    }

    tiles.unshift(node.tile);

    const path = new Path(...tiles);

    path.setMovementCost(movementCost);

    return path;
  }

  /**
   * @returns {Path}
   */
  generate() {
    while (this.#heap.length) {
      const currentNode = this.#heap.shift(),
        {tile} = currentNode
      ;

      tile.getNeighbours()
        // TODO: is this needed to make it fair?
        // .filter((tile) => tile.isVisible(this.unit().player()))
        .forEach((target) => {
          const [move] = this.unit().actions(target, tile)
            .filter((action) => action instanceof Move)
          ;

          if (move) {
            const targetNode = this.createNode(target, currentNode, move.movementCost());

            if (target === this.end()) {
              this.#candidates.push(this.createPath(targetNode));

              return;
            }

            if (
              ! this.#heap.some((node) => node.tile === target) &&
              ! this.#seen.includes(target)
            ) {
              this.#heap.push(targetNode);
              this.#seen.push(target);
            }
          }
        })
      ;
    }

    // TODO: This might get REALLY expensive...
    const [cheapest] = this.#candidates.sort((a, b) => a.movementCost() - b.movementCost());

    return cheapest;
  }
}

export default BasePathFinder;
